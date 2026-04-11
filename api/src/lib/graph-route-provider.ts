import { LINES, ROUTE_TYPE_LABELS } from "../../../shared/constants/index";
import type { LocationRef, RouteResult, RouteStep, RouteType, TransportMode } from "../../../shared/types/index";
import type { RouteProvider } from "./route-provider";
import type { RouteSearchInput } from "./route-provider";

type Coord = {
  lat: number;
  lng: number;
};

type StationRow = {
  id: string;
  stationCode: string;
  nameKo: string;
  nameJa: string;
  nameEn: string;
  lat: number;
  lng: number;
  complexityLevel: number;
};

type ConnectionRow = {
  fromStationId: string;
  toStationId: string;
  lineId: string;
  travelTimeSec: number;
};

type TransferRow = {
  stationId: string;
  fromLineId: string;
  toLineId: string;
  transferTimeSec: number;
  difficulty: string;
};

type LineRow = {
  id: string;
  lineNumber: number;
  nameKo: string;
  nameJa: string;
  nameEn: string;
  color: string;
  type: "subway" | "airport_rail" | "other";
};

type GraphData = {
  stations: StationRow[];
  stationsById: Map<string, StationRow>;
  linesById: Map<string, LineRow>;
  nodeIdsByStationId: Map<string, string[]>;
  adjacency: Map<string, GraphEdge[]>;
};

type GraphEdge = {
  fromNodeId: string;
  toNodeId: string;
  kind: "ride" | "transfer";
  stationId: string;
  lineId: string;
  toLineId: string;
  travelTimeSec: number;
  transferTimeSec: number;
  difficulty: number;
};

type PathState = {
  nodeId: string;
  totalTimeSec: number;
  transferCount: number;
  difficultyScore: number;
  stationCount: number;
  edges: GraphEdge[];
};

type PathVariant = {
  routeType: RouteType;
  score: number;
  state: PathState;
};

type SubwaySegment = {
  lineId: string;
  fromStationId: string;
  toStationId: string;
  stationCount: number;
  durationSec: number;
};

const FEW_TRANSFERS_PENALTY_SEC = 300;
const TOURIST_TRANSFER_PENALTY_SEC = 180;
const TOURIST_DIFFICULTY_PENALTY_SEC = 45;

function createNodeId(stationId: string, lineId: string): string {
  return `${stationId}::${lineId}`;
}

function parseNodeId(nodeId: string): { stationId: string; lineId: string } {
  const separatorIndex = nodeId.lastIndexOf("::");

  if (separatorIndex < 0) {
    return { stationId: nodeId, lineId: "" };
  }

  return {
    stationId: nodeId.slice(0, separatorIndex),
    lineId: nodeId.slice(separatorIndex + 2),
  };
}

function toDifficultyScore(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 1;
}

function haversineDistanceMeters(from: Coord, to: Coord): number {
  const earthRadiusMeters = 6371000;
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(fromLat) * Math.cos(toLat) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toMinutes(totalSeconds: number): number {
  if (totalSeconds <= 0) {
    return 0;
  }

  return Math.ceil(totalSeconds / 60);
}

function estimateFareKrw(stationCount: number): number {
  const estimatedKm = stationCount * 1.5;

  if (estimatedKm <= 10) {
    return 1250;
  }

  return 1250 + Math.ceil((estimatedKm - 10) / 5) * 100;
}

function collectTransportModes(steps: RouteStep[]): TransportMode[] {
  const modes = new Set<TransportMode>();

  for (const step of steps) {
    if (step.mode === "subway" || step.mode === "airport_rail") {
      modes.add(step.mode);
    }
  }

  return Array.from(modes);
}

function buildPathKey(edges: GraphEdge[]): string {
  return edges.map((edge) => `${edge.kind}:${edge.fromNodeId}->${edge.toNodeId}`).join("|");
}

function selectNearestStation(stations: StationRow[], coord: Coord): StationRow | null {
  let nearestStation: StationRow | null = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const station of stations) {
    const distance = haversineDistanceMeters(coord, { lat: station.lat, lng: station.lng });

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestStation = station;
    }
  }

  return nearestStation;
}

function createLocationRef(stationId: string): LocationRef {
  return {
    type: "station",
    id: stationId,
  };
}

function createLineMap(rows: LineRow[]): Map<string, LineRow> {
  const linesById = new Map<string, LineRow>();

  for (const row of rows) {
    linesById.set(row.id, row);
  }

  for (const fallbackLine of Object.values(LINES)) {
    if (!linesById.has(fallbackLine.id)) {
      linesById.set(fallbackLine.id, {
        id: fallbackLine.id,
        lineNumber: fallbackLine.lineNumber,
        nameKo: fallbackLine.nameKo,
        nameJa: fallbackLine.nameJa,
        nameEn: fallbackLine.nameEn,
        color: fallbackLine.color,
        type: fallbackLine.type,
      });
    }
  }

  return linesById;
}

function addNode(nodeIdsByStationId: Map<string, string[]>, stationId: string, lineId: string): string {
  const nodeId = createNodeId(stationId, lineId);
  const existing = nodeIdsByStationId.get(stationId);

  if (!existing) {
    nodeIdsByStationId.set(stationId, [nodeId]);
    return nodeId;
  }

  if (!existing.includes(nodeId)) {
    existing.push(nodeId);
  }

  return nodeId;
}

function addEdge(adjacency: Map<string, GraphEdge[]>, edge: GraphEdge): void {
  const existing = adjacency.get(edge.fromNodeId);

  if (existing) {
    existing.push(edge);
    return;
  }

  adjacency.set(edge.fromNodeId, [edge]);
}

function buildGraphData(
  stations: StationRow[],
  connections: ConnectionRow[],
  transfers: TransferRow[],
  lines: LineRow[],
): GraphData {
  const stationsById = new Map(stations.map((station) => [station.id, station]));
  const linesById = createLineMap(lines);
  const nodeIdsByStationId = new Map<string, string[]>();
  const adjacency = new Map<string, GraphEdge[]>();

  for (const connection of connections) {
    if (!stationsById.has(connection.fromStationId) || !stationsById.has(connection.toStationId)) {
      continue;
    }

    const fromNodeId = addNode(nodeIdsByStationId, connection.fromStationId, connection.lineId);
    const toNodeId = addNode(nodeIdsByStationId, connection.toStationId, connection.lineId);

    addEdge(adjacency, {
      fromNodeId,
      toNodeId,
      kind: "ride",
      stationId: connection.fromStationId,
      lineId: connection.lineId,
      toLineId: connection.lineId,
      travelTimeSec: connection.travelTimeSec,
      transferTimeSec: 0,
      difficulty: 0,
    });
  }

  for (const transfer of transfers) {
    if (!stationsById.has(transfer.stationId)) {
      continue;
    }

    const fromNodeId = addNode(nodeIdsByStationId, transfer.stationId, transfer.fromLineId);
    const toNodeId = addNode(nodeIdsByStationId, transfer.stationId, transfer.toLineId);

    addEdge(adjacency, {
      fromNodeId,
      toNodeId,
      kind: "transfer",
      stationId: transfer.stationId,
      lineId: transfer.fromLineId,
      toLineId: transfer.toLineId,
      travelTimeSec: 0,
      transferTimeSec: transfer.transferTimeSec,
      difficulty: toDifficultyScore(transfer.difficulty),
    });
  }

  return {
    stations,
    stationsById,
    linesById,
    nodeIdsByStationId,
    adjacency,
  };
}

function insertSorted(queue: PathState[], nextState: PathState, transferPenaltySec: number, difficultyPenaltySec: number): void {
  const nextScore = nextState.totalTimeSec + nextState.transferCount * transferPenaltySec + nextState.difficultyScore * difficultyPenaltySec;
  let insertIndex = queue.length;

  for (let index = 0; index < queue.length; index += 1) {
    const state = queue[index];
    const score = state.totalTimeSec + state.transferCount * transferPenaltySec + state.difficultyScore * difficultyPenaltySec;

    if (nextScore < score) {
      insertIndex = index;
      break;
    }
  }

  queue.splice(insertIndex, 0, nextState);
}

function runDijkstra(
  graphData: GraphData,
  startStationId: string,
  destinationStationId: string,
  transferPenaltySec: number,
  difficultyPenaltySec = 0,
): PathState | null {
  const startNodeIds = graphData.nodeIdsByStationId.get(startStationId) ?? [];

  if (startNodeIds.length === 0) {
    return null;
  }

  const queue: PathState[] = [];
  const bestScoreByNodeId = new Map<string, number>();

  for (const nodeId of startNodeIds) {
    const initialState: PathState = {
      nodeId,
      totalTimeSec: 0,
      transferCount: 0,
      difficultyScore: 0,
      stationCount: 0,
      edges: [],
    };

    queue.push(initialState);
    bestScoreByNodeId.set(nodeId, 0);
  }

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      break;
    }

    const { stationId } = parseNodeId(current.nodeId);

    if (stationId === destinationStationId && current.edges.length > 0) {
      return current;
    }

    const currentScore = current.totalTimeSec
      + current.transferCount * transferPenaltySec
      + current.difficultyScore * difficultyPenaltySec;
    const knownScore = bestScoreByNodeId.get(current.nodeId);

    if (knownScore !== undefined && currentScore > knownScore) {
      continue;
    }

    for (const edge of graphData.adjacency.get(current.nodeId) ?? []) {
      const nextState: PathState = {
        nodeId: edge.toNodeId,
        totalTimeSec: current.totalTimeSec + (edge.kind === "ride" ? edge.travelTimeSec : edge.transferTimeSec),
        transferCount: current.transferCount + (edge.kind === "transfer" ? 1 : 0),
        difficultyScore: current.difficultyScore + (edge.kind === "transfer" ? edge.difficulty : 0),
        stationCount: current.stationCount + (edge.kind === "ride" ? 1 : 0),
        edges: [...current.edges, edge],
      };
      const nextScore = nextState.totalTimeSec
        + nextState.transferCount * transferPenaltySec
        + nextState.difficultyScore * difficultyPenaltySec;
      const bestNextScore = bestScoreByNodeId.get(nextState.nodeId);

      if (bestNextScore !== undefined && bestNextScore <= nextScore) {
        continue;
      }

      bestScoreByNodeId.set(nextState.nodeId, nextScore);
      insertSorted(queue, nextState, transferPenaltySec, difficultyPenaltySec);
    }
  }

  return null;
}

function groupSubwaySegments(edges: GraphEdge[]): SubwaySegment[] {
  const rideEdges = edges.filter((edge) => edge.kind === "ride");

  if (rideEdges.length === 0) {
    return [];
  }

  const segments: SubwaySegment[] = [];
  let currentSegment: SubwaySegment | null = null;

  for (const edge of rideEdges) {
    const fromNode = parseNodeId(edge.fromNodeId);
    const toNode = parseNodeId(edge.toNodeId);

    if (!currentSegment || currentSegment.lineId !== edge.lineId || currentSegment.toStationId !== fromNode.stationId) {
      if (currentSegment) {
        segments.push(currentSegment);
      }

      currentSegment = {
        lineId: edge.lineId,
        fromStationId: fromNode.stationId,
        toStationId: toNode.stationId,
        stationCount: 1,
        durationSec: edge.travelTimeSec,
      };
      continue;
    }

    currentSegment.toStationId = toNode.stationId;
    currentSegment.stationCount += 1;
    currentSegment.durationSec += edge.travelTimeSec;
  }

  if (currentSegment) {
    segments.push(currentSegment);
  }

  return segments;
}

function buildRouteSteps(graphData: GraphData, edges: GraphEdge[]): RouteStep[] {
  const steps: RouteStep[] = [];
  const subwaySegments = groupSubwaySegments(edges);
  let segmentIndex = 0;
  let order = 1;

  for (const edge of edges) {
    if (edge.kind === "transfer") {
      const transferLine = graphData.linesById.get(edge.toLineId);

      steps.push({
        order,
        mode: "transfer",
        instruction: `${transferLine?.nameJa ?? "次の路線"}に乗り換え`,
        fromRef: createLocationRef(edge.stationId),
        toRef: createLocationRef(edge.stationId),
        lineId: edge.toLineId,
        lineName: transferLine?.nameJa,
        lineColor: transferLine?.color,
        durationMin: toMinutes(edge.transferTimeSec),
        notes: [],
      });
      order += 1;
      continue;
    }

    const previousEdge = edges[edges.indexOf(edge) - 1];

    if (previousEdge?.kind === "ride" && previousEdge.lineId === edge.lineId) {
      continue;
    }

    const segment = subwaySegments[segmentIndex];

    if (!segment) {
      continue;
    }

    const fromStation = graphData.stationsById.get(segment.fromStationId);
    const toStation = graphData.stationsById.get(segment.toStationId);
    const line = graphData.linesById.get(segment.lineId);
    const mode: TransportMode = line?.type === "airport_rail" ? "airport_rail" : "subway";
    const continuation = `${segment.stationCount}駅進み、${toStation?.nameJa ?? "到着"}駅で下車します`;
    const instruction = segmentIndex === 0
      ? `${fromStation?.nameJa ?? "出発"}駅から${line?.nameJa ?? "地下鉄"}に乗車します。${continuation}`
      : continuation;

    steps.push({
      order,
      mode,
      instruction,
      fromRef: createLocationRef(segment.fromStationId),
      toRef: createLocationRef(segment.toStationId),
      lineId: segment.lineId,
      lineName: line?.nameJa,
      lineColor: line?.color,
      stationCount: segment.stationCount,
      durationMin: toMinutes(segment.durationSec),
      notes: [],
    });
    order += 1;
    segmentIndex += 1;
  }

  return steps;
}

function createRouteResult(
  graphData: GraphData,
  startStationId: string,
  destinationStationId: string,
  routeType: RouteType,
  state: PathState,
  index: number,
): RouteResult | null {
  const steps = buildRouteSteps(graphData, state.edges);

  if (steps.length === 0) {
    return null;
  }

  const durationMin = toMinutes(state.totalTimeSec);

  return {
    id: `graph_route_${index + 1}`,
    startRef: createLocationRef(startStationId),
    destinationRef: createLocationRef(destinationStationId),
    durationMin,
    fareKrw: estimateFareKrw(state.stationCount),
    transferCount: state.transferCount,
    routeType,
    transportModes: collectTransportModes(steps),
    summary: `${durationMin}分・乗換${state.transferCount}回`,
    label: ROUTE_TYPE_LABELS[routeType],
    recommended: routeType === "tourist_friendly",
    steps,
    notes: [],
  };
}

async function loadGraphData(db: D1Database): Promise<GraphData> {
  try {
    const results = await db.batch([
      db.prepare("SELECT id, station_code AS stationCode, name_ko AS nameKo, name_ja AS nameJa, name_en AS nameEn, lat, lng, complexity_level AS complexityLevel FROM stations"),
      db.prepare("SELECT from_station_id AS fromStationId, to_station_id AS toStationId, line_id AS lineId, travel_time_sec AS travelTimeSec FROM connections"),
      db.prepare("SELECT station_id AS stationId, from_line_id AS fromLineId, to_line_id AS toLineId, transfer_time_sec AS transferTimeSec, difficulty FROM transfers"),
      db.prepare("SELECT id, line_number AS lineNumber, name_ko AS nameKo, name_ja AS nameJa, name_en AS nameEn, color, type FROM lines"),
    ]);

    const stations = (results[0].results ?? []) as StationRow[];
    const connections = (results[1].results ?? []) as ConnectionRow[];
    const transfers = (results[2].results ?? []) as TransferRow[];
    const lines = (results[3].results ?? []) as LineRow[];

    return buildGraphData(stations, connections, transfers, lines);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    throw new Error(`Failed to load route graph data from D1: ${message}`);
  }
}

export class GraphRouteProvider implements RouteProvider {
  private readonly db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async search(from: RouteSearchInput, to: RouteSearchInput): Promise<RouteResult[]> {
    const graphData = await loadGraphData(this.db);

    let startStation: StationRow | null = null;
    let destinationStation: StationRow | null = null;

    if (from.stationId) {
      startStation = graphData.stationsById.get(from.stationId) ?? null;
    }
    if (!startStation) {
      startStation = selectNearestStation(graphData.stations, from);
    }

    if (to.stationId) {
      destinationStation = graphData.stationsById.get(to.stationId) ?? null;
    }
    if (!destinationStation) {
      destinationStation = selectNearestStation(graphData.stations, to);
    }

    if (!startStation || !destinationStation) {
      return [];
    }

    if (startStation.id === destinationStation.id) {
      return [];
    }

    const variants: PathVariant[] = [];
    const fastest = runDijkstra(graphData, startStation.id, destinationStation.id, 0);

    if (fastest) {
      variants.push({
        routeType: "fastest",
        score: fastest.totalTimeSec,
        state: fastest,
      });
    }

    const fewTransfers = runDijkstra(graphData, startStation.id, destinationStation.id, FEW_TRANSFERS_PENALTY_SEC);

    if (fewTransfers) {
      variants.push({
        routeType: "few_transfers",
        score: fewTransfers.totalTimeSec + fewTransfers.transferCount * FEW_TRANSFERS_PENALTY_SEC,
        state: fewTransfers,
      });
    }

    const touristCandidate = runDijkstra(
      graphData,
      startStation.id,
      destinationStation.id,
      TOURIST_TRANSFER_PENALTY_SEC,
      TOURIST_DIFFICULTY_PENALTY_SEC,
    );

    if (touristCandidate) {
      variants.push({
        routeType: "tourist_friendly",
        score: touristCandidate.totalTimeSec
          + touristCandidate.transferCount * TOURIST_TRANSFER_PENALTY_SEC
          + touristCandidate.difficultyScore * TOURIST_DIFFICULTY_PENALTY_SEC,
        state: touristCandidate,
      });
    }

    if (variants.length === 0) {
      return [];
    }

    const fastestKey = fastest ? buildPathKey(fastest.edges) : "";
    const fewTransfersKey = fewTransfers ? buildPathKey(fewTransfers.edges) : "";

    if (fastestKey && fastestKey === fewTransfersKey) {
      variants[0] = {
        routeType: "tourist_friendly",
        score: variants[0]?.score ?? 0,
        state: fastest ?? fewTransfers ?? variants[0].state,
      };
    }

    const bestVariantByPath = new Map<string, PathVariant>();

    for (const variant of variants) {
      const pathKey = buildPathKey(variant.state.edges);
      const existing = bestVariantByPath.get(pathKey);

      if (!existing) {
        bestVariantByPath.set(pathKey, variant);
        continue;
      }

      const existingPriority = existing.routeType === "tourist_friendly" ? 3 : existing.routeType === "fastest" ? 2 : 1;
      const nextPriority = variant.routeType === "tourist_friendly" ? 3 : variant.routeType === "fastest" ? 2 : 1;

      if (nextPriority > existingPriority) {
        bestVariantByPath.set(pathKey, variant);
      }
    }

    return Array.from(bestVariantByPath.values())
      .sort((left, right) => left.score - right.score)
      .slice(0, 3)
      .map((variant, index) => createRouteResult(graphData, startStation.id, destinationStation.id, variant.routeType, variant.state, index))
      .filter((route): route is RouteResult => route !== null);
  }
}
