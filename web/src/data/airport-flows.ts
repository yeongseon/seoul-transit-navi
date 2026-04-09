export type Terminal = "t1" | "t2";
export type AreaId = "myeongdong" | "hongdae" | "gangnam" | "seoulStation" | "dongdaemun";
export type TimeOfDay = "day" | "evening" | "lateNight";
export type TransportMode = "arexExpress" | "arexLocal" | "taxi";
export type FlowSegmentId =
  | "arrival"
  | "immigration"
  | "baggage"
  | "tmoney"
  | "ticket"
  | "platform"
  | "transport"
  | "transfer"
  | "exit";

type Translate = (key: string, params?: Record<string, string | number>) => string;

export interface FlowSegmentDefinition {
  id: FlowSegmentId;
  icon: string;
  titleKey: string;
}

export interface AreaProfile {
  id: AreaId;
  nameJaKey: string;
  nameKoKey: string;
  summaryKey: string;
  stationKey: string;
  recommendedModeKey: string;
  taxiFareRange: string;
  driverText: string;
  exitGuideKey: string;
  transferGuideKey?: string;
  routeNoteKeys: Record<TransportMode, string>;
  stepMinutes: Record<TransportMode, number>;
}

export interface FlowRule {
  terminal: Terminal;
  timeOfDay: TimeOfDay;
  hasLargeLuggage: boolean;
  preferredModeByArea: Record<AreaId, TransportMode>;
  recommendationKey: string;
}

export interface GeneratedFlowStep {
  id: FlowSegmentId;
  icon: string;
  title: string;
  description: string;
  minutes: number;
}

export interface GeneratedFlow {
  mode: TransportMode;
  area: AreaProfile;
  rule: FlowRule;
  steps: GeneratedFlowStep[];
  totalMinutes: number;
}

export const TERMINALS: Terminal[] = ["t1", "t2"];
export const AREA_IDS: AreaId[] = ["myeongdong", "hongdae", "gangnam", "seoulStation", "dongdaemun"];
export const TIME_OPTIONS: TimeOfDay[] = ["day", "evening", "lateNight"];

export const FLOW_SEGMENTS: Record<FlowSegmentId, FlowSegmentDefinition> = {
  arrival: { id: "arrival", icon: "🛬", titleKey: "airport.flowSegments.arrival.title" },
  immigration: { id: "immigration", icon: "🛂", titleKey: "airport.flowSegments.immigration.title" },
  baggage: { id: "baggage", icon: "🧳", titleKey: "airport.flowSegments.baggage.title" },
  tmoney: { id: "tmoney", icon: "💳", titleKey: "airport.flowSegments.tmoney.title" },
  ticket: { id: "ticket", icon: "🎫", titleKey: "airport.flowSegments.ticket.title" },
  platform: { id: "platform", icon: "🚉", titleKey: "airport.flowSegments.platform.title" },
  transport: { id: "transport", icon: "🚆", titleKey: "airport.flowSegments.transport.title" },
  transfer: { id: "transfer", icon: "🔄", titleKey: "airport.flowSegments.transfer.title" },
  exit: { id: "exit", icon: "🚪", titleKey: "airport.flowSegments.exit.title" },
};

export const TERMINAL_WALKING_MINUTES: Record<Terminal, number> = {
  t1: 8,
  t2: 12,
};

export const AREA_PROFILES: Record<AreaId, AreaProfile> = {
  myeongdong: {
    id: "myeongdong",
    nameJaKey: "airport.areas.myeongdong.nameJa",
    nameKoKey: "airport.areas.myeongdong.nameKo",
    summaryKey: "airport.areas.myeongdong.summary",
    stationKey: "airport.areas.myeongdong.station",
    recommendedModeKey: "airport.areas.myeongdong.recommended",
    taxiFareRange: "₩65,000-80,000",
    driverText: "명동역 4번 출구 근처 호텔 앞으로 가 주세요.",
    exitGuideKey: "airport.areas.myeongdong.exitGuide",
    transferGuideKey: "airport.areas.myeongdong.transferGuide",
    routeNoteKeys: {
      arexExpress: "airport.areas.myeongdong.routeNotes.arexExpress",
      arexLocal: "airport.areas.myeongdong.routeNotes.arexLocal",
      taxi: "airport.areas.myeongdong.routeNotes.taxi",
    },
    stepMinutes: {
      arexExpress: 58,
      arexLocal: 64,
      taxi: 68,
    },
  },
  hongdae: {
    id: "hongdae",
    nameJaKey: "airport.areas.hongdae.nameJa",
    nameKoKey: "airport.areas.hongdae.nameKo",
    summaryKey: "airport.areas.hongdae.summary",
    stationKey: "airport.areas.hongdae.station",
    recommendedModeKey: "airport.areas.hongdae.recommended",
    taxiFareRange: "₩60,000-75,000",
    driverText: "홍대입구역 9번 출구 근처 호텔 앞으로 가 주세요.",
    exitGuideKey: "airport.areas.hongdae.exitGuide",
    routeNoteKeys: {
      arexExpress: "airport.areas.hongdae.routeNotes.arexExpress",
      arexLocal: "airport.areas.hongdae.routeNotes.arexLocal",
      taxi: "airport.areas.hongdae.routeNotes.taxi",
    },
    stepMinutes: {
      arexExpress: 55,
      arexLocal: 46,
      taxi: 62,
    },
  },
  gangnam: {
    id: "gangnam",
    nameJaKey: "airport.areas.gangnam.nameJa",
    nameKoKey: "airport.areas.gangnam.nameKo",
    summaryKey: "airport.areas.gangnam.summary",
    stationKey: "airport.areas.gangnam.station",
    recommendedModeKey: "airport.areas.gangnam.recommended",
    taxiFareRange: "₩75,000-95,000",
    driverText: "강남역 10번 출구 근처 호텔 앞으로 가 주세요.",
    exitGuideKey: "airport.areas.gangnam.exitGuide",
    transferGuideKey: "airport.areas.gangnam.transferGuide",
    routeNoteKeys: {
      arexExpress: "airport.areas.gangnam.routeNotes.arexExpress",
      arexLocal: "airport.areas.gangnam.routeNotes.arexLocal",
      taxi: "airport.areas.gangnam.routeNotes.taxi",
    },
    stepMinutes: {
      arexExpress: 74,
      arexLocal: 86,
      taxi: 78,
    },
  },
  seoulStation: {
    id: "seoulStation",
    nameJaKey: "airport.areas.seoulStation.nameJa",
    nameKoKey: "airport.areas.seoulStation.nameKo",
    summaryKey: "airport.areas.seoulStation.summary",
    stationKey: "airport.areas.seoulStation.station",
    recommendedModeKey: "airport.areas.seoulStation.recommended",
    taxiFareRange: "₩55,000-70,000",
    driverText: "서울역 앞 호텔 앞으로 가 주세요.",
    exitGuideKey: "airport.areas.seoulStation.exitGuide",
    routeNoteKeys: {
      arexExpress: "airport.areas.seoulStation.routeNotes.arexExpress",
      arexLocal: "airport.areas.seoulStation.routeNotes.arexLocal",
      taxi: "airport.areas.seoulStation.routeNotes.taxi",
    },
    stepMinutes: {
      arexExpress: 43,
      arexLocal: 56,
      taxi: 58,
    },
  },
  dongdaemun: {
    id: "dongdaemun",
    nameJaKey: "airport.areas.dongdaemun.nameJa",
    nameKoKey: "airport.areas.dongdaemun.nameKo",
    summaryKey: "airport.areas.dongdaemun.summary",
    stationKey: "airport.areas.dongdaemun.station",
    recommendedModeKey: "airport.areas.dongdaemun.recommended",
    taxiFareRange: "₩65,000-80,000",
    driverText: "동대문역사문화공원역 1번 출구 근처 호텔 앞으로 가 주세요.",
    exitGuideKey: "airport.areas.dongdaemun.exitGuide",
    transferGuideKey: "airport.areas.dongdaemun.transferGuide",
    routeNoteKeys: {
      arexExpress: "airport.areas.dongdaemun.routeNotes.arexExpress",
      arexLocal: "airport.areas.dongdaemun.routeNotes.arexLocal",
      taxi: "airport.areas.dongdaemun.routeNotes.taxi",
    },
    stepMinutes: {
      arexExpress: 62,
      arexLocal: 70,
      taxi: 72,
    },
  },
};

export const FLOW_RULES: FlowRule[] = [
  {
    terminal: "t1",
    timeOfDay: "day",
    hasLargeLuggage: false,
    preferredModeByArea: {
      myeongdong: "arexLocal",
      hongdae: "arexLocal",
      gangnam: "arexExpress",
      seoulStation: "arexExpress",
      dongdaemun: "arexExpress",
    },
    recommendationKey: "airport.recommendations.lightRail",
  },
  {
    terminal: "t1",
    timeOfDay: "day",
    hasLargeLuggage: true,
    preferredModeByArea: {
      myeongdong: "arexExpress",
      hongdae: "arexLocal",
      gangnam: "taxi",
      seoulStation: "arexExpress",
      dongdaemun: "arexExpress",
    },
    recommendationKey: "airport.recommendations.dayLuggage",
  },
  {
    terminal: "t1",
    timeOfDay: "evening",
    hasLargeLuggage: false,
    preferredModeByArea: {
      myeongdong: "arexLocal",
      hongdae: "arexLocal",
      gangnam: "arexExpress",
      seoulStation: "arexExpress",
      dongdaemun: "arexExpress",
    },
    recommendationKey: "airport.recommendations.eveningRail",
  },
  {
    terminal: "t1",
    timeOfDay: "evening",
    hasLargeLuggage: true,
    preferredModeByArea: {
      myeongdong: "taxi",
      hongdae: "arexLocal",
      gangnam: "taxi",
      seoulStation: "arexExpress",
      dongdaemun: "taxi",
    },
    recommendationKey: "airport.recommendations.eveningLuggage",
  },
  {
    terminal: "t1",
    timeOfDay: "lateNight",
    hasLargeLuggage: false,
    preferredModeByArea: {
      myeongdong: "taxi",
      hongdae: "taxi",
      gangnam: "taxi",
      seoulStation: "taxi",
      dongdaemun: "taxi",
    },
    recommendationKey: "airport.recommendations.lateNightTaxi",
  },
  {
    terminal: "t1",
    timeOfDay: "lateNight",
    hasLargeLuggage: true,
    preferredModeByArea: {
      myeongdong: "taxi",
      hongdae: "taxi",
      gangnam: "taxi",
      seoulStation: "taxi",
      dongdaemun: "taxi",
    },
    recommendationKey: "airport.recommendations.lateNightTaxi",
  },
  {
    terminal: "t2",
    timeOfDay: "day",
    hasLargeLuggage: false,
    preferredModeByArea: {
      myeongdong: "arexLocal",
      hongdae: "arexLocal",
      gangnam: "arexExpress",
      seoulStation: "arexExpress",
      dongdaemun: "arexExpress",
    },
    recommendationKey: "airport.recommendations.lightRail",
  },
  {
    terminal: "t2",
    timeOfDay: "day",
    hasLargeLuggage: true,
    preferredModeByArea: {
      myeongdong: "arexExpress",
      hongdae: "arexLocal",
      gangnam: "taxi",
      seoulStation: "arexExpress",
      dongdaemun: "taxi",
    },
    recommendationKey: "airport.recommendations.t2Luggage",
  },
  {
    terminal: "t2",
    timeOfDay: "evening",
    hasLargeLuggage: false,
    preferredModeByArea: {
      myeongdong: "arexLocal",
      hongdae: "arexLocal",
      gangnam: "arexExpress",
      seoulStation: "arexExpress",
      dongdaemun: "arexExpress",
    },
    recommendationKey: "airport.recommendations.eveningRail",
  },
  {
    terminal: "t2",
    timeOfDay: "evening",
    hasLargeLuggage: true,
    preferredModeByArea: {
      myeongdong: "taxi",
      hongdae: "taxi",
      gangnam: "taxi",
      seoulStation: "arexExpress",
      dongdaemun: "taxi",
    },
    recommendationKey: "airport.recommendations.eveningLuggage",
  },
  {
    terminal: "t2",
    timeOfDay: "lateNight",
    hasLargeLuggage: false,
    preferredModeByArea: {
      myeongdong: "taxi",
      hongdae: "taxi",
      gangnam: "taxi",
      seoulStation: "taxi",
      dongdaemun: "taxi",
    },
    recommendationKey: "airport.recommendations.lateNightTaxi",
  },
  {
    terminal: "t2",
    timeOfDay: "lateNight",
    hasLargeLuggage: true,
    preferredModeByArea: {
      myeongdong: "taxi",
      hongdae: "taxi",
      gangnam: "taxi",
      seoulStation: "taxi",
      dongdaemun: "taxi",
    },
    recommendationKey: "airport.recommendations.lateNightTaxi",
  },
];

function findRule(terminal: Terminal, timeOfDay: TimeOfDay, hasLargeLuggage: boolean): FlowRule {
  const rule = FLOW_RULES.find(
    (candidate) =>
      candidate.terminal === terminal &&
      candidate.timeOfDay === timeOfDay &&
      candidate.hasLargeLuggage === hasLargeLuggage
  );

  if (!rule) {
    throw new Error("Missing airport flow rule");
  }

  return rule;
}

export function buildAirportFlow(
  t: Translate,
  params: {
    terminal: Terminal;
    areaId: AreaId;
    timeOfDay: TimeOfDay;
    hasLargeLuggage: boolean;
  }
): GeneratedFlow {
  const { terminal, areaId, timeOfDay, hasLargeLuggage } = params;
  const area = AREA_PROFILES[areaId];
  const rule = findRule(terminal, timeOfDay, hasLargeLuggage);
  const mode = rule.preferredModeByArea[areaId];
  const steps: GeneratedFlowStep[] = [];

  const commonSteps: FlowSegmentId[] = mode === "taxi"
    ? ["arrival", "immigration", "baggage", "transport", "exit"]
    : mode === "arexExpress"
      ? ["arrival", "immigration", "baggage", "ticket", "platform", "transport"]
      : ["arrival", "immigration", "baggage", "tmoney", "platform", "transport"];

  if (commonSteps.includes("arrival")) {
    steps.push({
      id: "arrival",
      icon: FLOW_SEGMENTS.arrival.icon,
      title: t(FLOW_SEGMENTS.arrival.titleKey),
      description: t("airport.flowSegments.arrival.description", {
        terminal: t(`airport.terminals.${terminal}.name`),
      }),
      minutes: 7,
    });
  }

  if (commonSteps.includes("immigration")) {
    steps.push({
      id: "immigration",
      icon: FLOW_SEGMENTS.immigration.icon,
      title: t(FLOW_SEGMENTS.immigration.titleKey),
      description: t("airport.flowSegments.immigration.description"),
      minutes: 18,
    });
  }

  if (commonSteps.includes("baggage")) {
    steps.push({
      id: "baggage",
      icon: FLOW_SEGMENTS.baggage.icon,
      title: t(FLOW_SEGMENTS.baggage.titleKey),
      description: t("airport.flowSegments.baggage.description"),
      minutes: 15,
    });
  }

  if (commonSteps.includes("tmoney")) {
    steps.push({
      id: "tmoney",
      icon: FLOW_SEGMENTS.tmoney.icon,
      title: t(FLOW_SEGMENTS.tmoney.titleKey),
      description: t("airport.flowSegments.tmoney.description", {
        location: t(`airport.locations.${terminal}.tmoney`),
      }),
      minutes: 4,
    });
  }

  if (commonSteps.includes("ticket")) {
    steps.push({
      id: "ticket",
      icon: FLOW_SEGMENTS.ticket.icon,
      title: t(FLOW_SEGMENTS.ticket.titleKey),
      description: t("airport.flowSegments.ticket.description", {
        location: t(`airport.locations.${terminal}.ticketCounter`),
      }),
      minutes: 6,
    });
  }

  if (commonSteps.includes("platform")) {
    steps.push({
      id: "platform",
      icon: FLOW_SEGMENTS.platform.icon,
      title: t(FLOW_SEGMENTS.platform.titleKey),
      description: t("airport.flowSegments.platform.description", {
        location: t(`airport.locations.${terminal}.platform`),
      }),
      minutes: TERMINAL_WALKING_MINUTES[terminal],
    });
  }

  if (commonSteps.includes("transport")) {
    const transportTitleKey = mode === "taxi"
      ? "airport.flowSegments.transport.taxiTitle"
      : "airport.flowSegments.transport.trainTitle";
    const transportDescriptionKey = mode === "taxi"
      ? "airport.flowSegments.transport.taxiDescription"
      : "airport.flowSegments.transport.trainDescription";

    steps.push({
      id: "transport",
      icon: mode === "taxi" ? "🚕" : FLOW_SEGMENTS.transport.icon,
      title: t(transportTitleKey),
      description: t(transportDescriptionKey, {
        mode: t(`airport.transportModes.${mode}.label`),
        route: t(area.routeNoteKeys[mode]),
        stand: t(`airport.locations.${terminal}.taxiStand`),
        fare: area.taxiFareRange,
      }),
      minutes: area.stepMinutes[mode],
    });
  }

  if (mode !== "taxi" && area.transferGuideKey) {
    const transferDescKey = mode === "arexExpress"
      ? "airport.flowSegments.transfer.expressDescription"
      : "airport.flowSegments.transfer.description";
    steps.push({
      id: "transfer",
      icon: FLOW_SEGMENTS.transfer.icon,
      title: t(FLOW_SEGMENTS.transfer.titleKey),
      description: t(transferDescKey, {
        guide: t(area.transferGuideKey),
      }),
      minutes: areaId === "gangnam" ? 14 : 8,
    });
  }

  steps.push({
    id: "exit",
    icon: FLOW_SEGMENTS.exit.icon,
    title: t(FLOW_SEGMENTS.exit.titleKey),
    description: t("airport.flowSegments.exit.description", {
      guide: t(area.exitGuideKey),
    }),
    minutes: 5,
  });

  return {
    mode,
    area,
    rule,
    steps,
    totalMinutes: steps.reduce((sum, step) => sum + step.minutes, 0),
  };
}
