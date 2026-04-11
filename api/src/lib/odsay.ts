import { LINES, ROUTE_TYPE_LABELS } from "../../../shared/constants/index";
import type { RouteResult, RouteStep, RouteType, TransportMode } from "../../../shared/types/index";

type Coord = {
  lat: number;
  lng: number;
};

type ODsayLane = {
  name?: string;
};

type ODsaySubPath = {
  trafficType?: number;
  sectionTime?: number;
  stationCount?: number;
  startName?: string;
  endName?: string;
  lane?: ODsayLane[] | ODsayLane;
};

type ODsayPath = {
  totalTime?: number;
  payment?: number;
  subwayTransitCount?: number;
  subPath?: ODsaySubPath[];
};

type ODsayResponse = {
  error?: {
    code?: string | number;
    msg?: string;
    message?: string;
  };
  result?: {
    path?: ODsayPath[];
  };
};

export class ODsayApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 502) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const LINE_MATCHERS = [
  { patterns: ["1호선", "line1", "line 1"], lineId: "line_1" },
  { patterns: ["2호선", "line2", "line 2"], lineId: "line_2" },
  { patterns: ["3호선", "line3", "line 3"], lineId: "line_3" },
  { patterns: ["4호선", "line4", "line 4"], lineId: "line_4" },
  { patterns: ["5호선", "line5", "line 5"], lineId: "line_5" },
  { patterns: ["6호선", "line6", "line 6"], lineId: "line_6" },
  { patterns: ["7호선", "line7", "line 7"], lineId: "line_7" },
  { patterns: ["8호선", "line8", "line 8"], lineId: "line_8" },
  { patterns: ["9호선", "line9", "line 9"], lineId: "line_9" },
  { patterns: ["공항철도", "airport railroad", "airport rail"], lineId: "airport_rail" },
  { patterns: ["경의중앙", "gyeongui-jungang"], lineId: "gyeongui_jungang" },
  { patterns: ["신분당", "shinbundang"], lineId: "shinbundang" },
] as const;

function normalizeLineName(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function toLaneArray(lane: ODsayLane[] | ODsayLane | undefined): ODsayLane[] {
  if (!lane) {
    return [];
  }

  return Array.isArray(lane) ? lane : [lane];
}

function resolveLineMetadata(rawLineName: string): { lineId?: keyof typeof LINES; lineName: string; lineColor?: string } {
  const normalized = normalizeLineName(rawLineName);

  for (const matcher of LINE_MATCHERS) {
    if (matcher.patterns.some((pattern) => normalized.includes(pattern))) {
      const line = LINES[matcher.lineId];

      return {
        lineId: matcher.lineId,
        lineName: line.nameJa,
        lineColor: line.color,
      };
    }
  }

  return { lineName: rawLineName };
}

function createRouteStep(subPath: ODsaySubPath, order: number): RouteStep | null {
  if (subPath.trafficType === 3) {
    const durationMin = subPath.sectionTime ?? 0;

    return {
      order,
      mode: "walk",
      instruction: durationMin > 0 ? `${durationMin}分歩きます` : "徒歩で移動します",
      durationMin,
      notes: [],
    };
  }

  if (subPath.trafficType !== 1) {
    return null;
  }

  const lane = toLaneArray(subPath.lane)[0];
  const rawLineName = lane?.name?.trim() ?? "地下鉄";
  const lineMetadata = resolveLineMetadata(rawLineName);

  return {
    order,
    mode: "subway",
    instruction: `${subPath.startName ?? "出発駅"}から${subPath.endName ?? "到着駅"}まで${lineMetadata.lineName}に乗車します`,
    fromRef: { type: "station", name: subPath.startName },
    toRef: { type: "station", name: subPath.endName },
    lineId: lineMetadata.lineId,
    lineName: lineMetadata.lineName,
    lineColor: lineMetadata.lineColor,
    stationCount: subPath.stationCount ?? 0,
    durationMin: subPath.sectionTime ?? 0,
    notes: [],
  };
}

function selectRouteType(durationMin: number, transferCount: number, minDuration: number, minTransferCount: number): RouteType {
  if (durationMin === minDuration && transferCount === minTransferCount) {
    return "tourist_friendly";
  }

  if (durationMin === minDuration) {
    return "fastest";
  }

  if (transferCount === minTransferCount) {
    return "few_transfers";
  }

  return "easy";
}

function collectTransportModes(steps: RouteStep[]): TransportMode[] {
  const modes = new Set<TransportMode>();

  for (const step of steps) {
    if (step.mode === "subway" || step.mode === "walk") {
      modes.add(step.mode);
    }
  }

  return Array.from(modes);
}

function transformPath(path: ODsayPath, index: number, minDuration: number, minTransferCount: number): RouteResult | null {
  const subPaths = path.subPath ?? [];

  if (subPaths.length === 0) {
    return null;
  }

  if (subPaths.some((subPath) => subPath.trafficType !== 1 && subPath.trafficType !== 3)) {
    return null;
  }

  const steps = subPaths
    .map((subPath, stepIndex) => createRouteStep(subPath, stepIndex + 1))
    .filter((step): step is RouteStep => step !== null);
  const stepsWithTransfers: RouteStep[] = [];
  let orderCounter = 1;

  let lastSubwayLineId: string | undefined;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if (
      step.mode === "subway" &&
      lastSubwayLineId !== undefined &&
      step.lineId !== lastSubwayLineId
    ) {
      const previousStep = stepsWithTransfers[stepsWithTransfers.length - 1];

      if (previousStep?.mode === "walk") {
        previousStep.mode = "transfer";
        previousStep.instruction = `${step.lineName ?? "次の路線"}に乗り換え`;
        previousStep.lineId = step.lineId;
        previousStep.lineName = step.lineName;
        previousStep.lineColor = step.lineColor;
      } else {
        stepsWithTransfers.push({
          order: orderCounter++,
          mode: "transfer",
          instruction: `${step.lineName ?? "次の路線"}に乗り換え`,
          lineId: step.lineId,
          lineName: step.lineName,
          lineColor: step.lineColor,
          notes: [],
        });
      }
    }

    stepsWithTransfers.push({ ...step, order: orderCounter++ });

    if (step.mode === "subway") {
      lastSubwayLineId = step.lineId;
    }
  }

  const firstStep = stepsWithTransfers[0];

  if (firstStep && firstStep.mode === "walk") {
    firstStep.instruction = `最寄り駅まで徒歩約${firstStep.durationMin ?? 0}分`;
  }

  const lastStep = stepsWithTransfers[stepsWithTransfers.length - 1];

  if (lastStep && lastStep.mode === "walk") {
    const prevSubway = [...stepsWithTransfers].reverse().find((step) => step.mode === "subway");

    if (prevSubway) {
      const arrivalMatch = prevSubway.instruction.match(/から(.+?)まで/);
      const arrivalName = arrivalMatch?.[1] ?? "到着駅";
      lastStep.instruction = `${arrivalName}で下車後、出口へ向かいます（徒歩約${lastStep.durationMin ?? 0}分）`;
    }
  }

  const subwaySteps = stepsWithTransfers.filter((step) => step.mode === "subway");

  if (subwaySteps.length === 0) {
    return null;
  }

  const durationMin = path.totalTime ?? 0;
  const transferCount = path.subwayTransitCount ?? Math.max(subwaySteps.length - 1, 0);
  const routeType = selectRouteType(durationMin, transferCount, minDuration, minTransferCount);

  return {
    id: `route_${index + 1}`,
    startRef: { type: "coord" },
    destinationRef: { type: "coord" },
    durationMin,
    fareKrw: path.payment ?? 0,
    transferCount,
    routeType,
    transportModes: collectTransportModes(stepsWithTransfers),
    summary: `${durationMin}分・乗換${transferCount}回`,
    label: ROUTE_TYPE_LABELS[routeType],
    recommended: routeType === "tourist_friendly",
    steps: stepsWithTransfers,
    notes: [],
  };
}

function transformResponse(payload: ODsayResponse): RouteResult[] {
  const paths = payload.result?.path ?? [];
  const minDuration = paths.length > 0 ? Math.min(...paths.map((path) => path.totalTime ?? Number.MAX_SAFE_INTEGER)) : 0;
  const minTransferCount = paths.length > 0
    ? Math.min(...paths.map((path) => path.subwayTransitCount ?? Number.MAX_SAFE_INTEGER))
    : 0;

  return paths
    .map((path, index) => transformPath(path, index, minDuration, minTransferCount))
    .filter((route): route is RouteResult => route !== null);
}

export async function searchPubTransPathT(apiKey: string, from: Coord, to: Coord): Promise<RouteResult[]> {
  if (!apiKey) {
    throw new ODsayApiError("ODSAY_API_KEY_MISSING", "ODSAY APIキーが設定されていません", 503);
  }

  const url = new URL("https://api.odsay.com/v1/api/searchPubTransPathT");
  url.searchParams.set("SX", String(from.lng));
  url.searchParams.set("SY", String(from.lat));
  url.searchParams.set("EX", String(to.lng));
  url.searchParams.set("EY", String(to.lat));
  url.searchParams.set("apiKey", apiKey);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new ODsayApiError("ODSAY_REQUEST_FAILED", `ODsay API request failed with status ${response.status}`, 502);
    }

    const payload = (await response.json()) as ODsayResponse;
    const errorMessage = payload.error?.msg ?? payload.error?.message;

    if (errorMessage) {
      throw new ODsayApiError(String(payload.error?.code ?? "ODSAY_API_ERROR"), errorMessage, 502);
    }

    return transformResponse(payload);
  } catch (error) {
    if (error instanceof ODsayApiError) {
      throw error;
    }

    throw new ODsayApiError("ODSAY_REQUEST_FAILED", "ODsay APIへの接続に失敗しました", 502);
  }
}
