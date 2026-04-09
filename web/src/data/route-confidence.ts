export const CONFUSING_STATION_IDS = new Set([
  "station_seoul-station",
  "station_hongik-univ",
  "station_dongdaemun-history-and-culture-park",
  "station_jongno-3-ga",
  "station_express-bus-terminal",
]);

export const STATION_GUIDE_MAP: Record<string, string> = {
  "station_seoul-station": "seoulStation",
  "station_hongik-univ": "hongdae",
  "station_dongdaemun-history-and-culture-park": "dongdaemunHistoryCulture",
  "station_jongno-3-ga": "jongno3ga",
  "station_express-bus-terminal": "expressBusTerminal",
};

export function routeHasAREX(
  steps: Array<{ lineId?: string; mode: string }>
): boolean {
  return steps.some(
    (step) => step.lineId === "airport_rail" || step.mode === "airport_rail"
  );
}

export function getConfusingStationsInRoute(
  steps: Array<{ fromRef?: { id?: string }; toRef?: { id?: string }; mode: string }>
): string[] {
  const stationIds = new Set<string>();

  for (const step of steps) {
    if (step.fromRef?.id && CONFUSING_STATION_IDS.has(step.fromRef.id)) {
      stationIds.add(step.fromRef.id);
    }

    if (step.toRef?.id && CONFUSING_STATION_IDS.has(step.toRef.id)) {
      stationIds.add(step.toRef.id);
    }

    if (step.mode === "transfer" && step.toRef?.id && CONFUSING_STATION_IDS.has(step.toRef.id)) {
      stationIds.add(step.toRef.id);
    }
  }

  return Array.from(stationIds);
}

export type ServiceStatus = "normal" | "lastTrainSoon" | "serviceEnded" | "earlyMorning";

export function getServiceStatus(now?: Date): ServiceStatus {
  const date = now || new Date();
  const kstOffset = 9 * 60;
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  const kstMinutes = (utcMinutes + kstOffset) % (24 * 60);
  const kstHour = Math.floor(kstMinutes / 60);
  const kstMin = kstMinutes % 60;

  // Last trains run until ~0:30 KST on most lines
  if (kstHour >= 1 && kstHour < 5) return "serviceEnded";
  if (kstHour === 0 && kstMin >= 30) return "serviceEnded";
  if (kstHour === 5 && kstMin < 30) return "earlyMorning";
  if (kstHour === 0 && kstMin < 30) return "lastTrainSoon";
  if (kstHour >= 23) return "lastTrainSoon";
  if (kstHour >= 22 && kstMin >= 30) return "lastTrainSoon";

  return "normal";
}
