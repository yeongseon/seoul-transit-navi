import { AREA_GUIDE_CONTENT } from "./area-guide-content";
import { STATION_GUIDE_CONTENT } from "./station-guide-content";
import type { AreaGuideId } from "./area-guides";
import type { StationGuideId } from "./station-guides";

export type Locale = "ja" | "ko";

export function getStationGuideText(stationId: StationGuideId, locale: Locale) {
  const content = STATION_GUIDE_CONTENT[stationId];
  if (!content) return null;
  return {
    name: content.name[locale],
    lines: content.lines[locale],
    confusionPoints: content.confusionPoints.map((confusionPoint) => confusionPoint[locale]),
    tips: content.tips.map((tip) => tip[locale]),
    exits: content.exits?.map((exit) => ({ exitNumber: exit.exitNumber, purpose: exit.purpose[locale] })),
    transfers: content.transfers?.map((transfer) => ({
      lines: transfer.lines[locale],
      minutes: transfer.minutes,
      difficulty: transfer.difficulty,
    })),
    luggage: content.luggage
      ? {
          description: content.luggage.description[locale],
          hasElevator: content.luggage.hasElevator,
          hasEscalator: content.luggage.hasEscalator,
        }
      : undefined,
    walkingDistances: content.walkingDistances?.map((walkingDistance) => ({
      destination: walkingDistance.destination[locale],
      minutes: walkingDistance.minutes,
    })),
    warning: content.warning?.[locale],
    detail: content.detail?.[locale],
  };
}

export function getAreaGuideText(areaId: AreaGuideId, locale: Locale) {
  const content = AREA_GUIDE_CONTENT[areaId];
  if (!content) return null;
  return {
    name: content.name[locale],
    tagline: content.tagline[locale],
    description: content.description[locale],
    stations: content.stations.map((station) => ({ name: station.name[locale], line: station.line })),
    spots: content.spots.map((spot) => spot[locale]),
    exitGuide: content.exitGuide[locale],
    walkingTip: content.walkingTip[locale],
    dayTrip: content.dayTrip[locale],
    bestStation: content.bestStation?.[locale],
    bestReason: content.bestReason?.[locale],
    purposeExits: content.purposeExits?.map((purposeExit) => ({
      purpose: purposeExit.purpose[locale],
      landmark: purposeExit.landmark[locale],
      exitNumber: purposeExit.exitNumber,
    })),
    flowSteps: content.flowSteps?.map((flowStep) => ({
      step: flowStep.step[locale],
      minutes: flowStep.minutes,
    })),
  };
}
