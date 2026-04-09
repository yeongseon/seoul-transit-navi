export type AreaGuideId = "seongsu" | "jamsil" | "yeouido" | "hannam";

export interface AreaGuideStation {
  nameKey: string;
  line: string;
}

export interface AreaGuideProfile {
  id: AreaGuideId;
  nameKey: string;
  nameKo: string;
  taglineKey: string;
  descriptionKey: string;
  stations: AreaGuideStation[];
  spotKeys: string[];
  exitGuideKey: string;
  walkingTipKey: string;
  dayTripKey: string;
  emoji: string;
  color: string;
}

export const AREA_GUIDE_IDS: AreaGuideId[] = ["seongsu", "jamsil", "yeouido", "hannam"];

export const AREA_GUIDES: Record<AreaGuideId, AreaGuideProfile> = {
  seongsu: {
    id: "seongsu",
    nameKey: "areaGuides.seongsu.name",
    nameKo: "성수",
    taglineKey: "areaGuides.seongsu.tagline",
    descriptionKey: "areaGuides.seongsu.description",
    stations: [
      { nameKey: "areaGuides.seongsu.station1", line: "2" },
      { nameKey: "areaGuides.seongsu.station2", line: "2" },
      { nameKey: "areaGuides.seongsu.station3", line: "SB" },
    ],
    spotKeys: [
      "areaGuides.seongsu.spot1",
      "areaGuides.seongsu.spot2",
      "areaGuides.seongsu.spot3",
      "areaGuides.seongsu.spot4",
      "areaGuides.seongsu.spot5",
    ],
    exitGuideKey: "areaGuides.seongsu.exitGuide",
    walkingTipKey: "areaGuides.seongsu.walkingTip",
    dayTripKey: "areaGuides.seongsu.dayTrip",
    emoji: "☕",
    color: "orange",
  },
  jamsil: {
    id: "jamsil",
    nameKey: "areaGuides.jamsil.name",
    nameKo: "잠실",
    taglineKey: "areaGuides.jamsil.tagline",
    descriptionKey: "areaGuides.jamsil.description",
    stations: [
      { nameKey: "areaGuides.jamsil.station1", line: "2" },
      { nameKey: "areaGuides.jamsil.station2", line: "8" },
    ],
    spotKeys: [
      "areaGuides.jamsil.spot1",
      "areaGuides.jamsil.spot2",
      "areaGuides.jamsil.spot3",
    ],
    exitGuideKey: "areaGuides.jamsil.exitGuide",
    walkingTipKey: "areaGuides.jamsil.walkingTip",
    dayTripKey: "areaGuides.jamsil.dayTrip",
    emoji: "🏰",
    color: "pink",
  },
  yeouido: {
    id: "yeouido",
    nameKey: "areaGuides.yeouido.name",
    nameKo: "여의도",
    taglineKey: "areaGuides.yeouido.tagline",
    descriptionKey: "areaGuides.yeouido.description",
    stations: [
      { nameKey: "areaGuides.yeouido.station1", line: "5" },
      { nameKey: "areaGuides.yeouido.station2", line: "5" },
    ],
    spotKeys: [
      "areaGuides.yeouido.spot1",
      "areaGuides.yeouido.spot2",
      "areaGuides.yeouido.spot3",
    ],
    exitGuideKey: "areaGuides.yeouido.exitGuide",
    walkingTipKey: "areaGuides.yeouido.walkingTip",
    dayTripKey: "areaGuides.yeouido.dayTrip",
    emoji: "🌆",
    color: "violet",
  },
  hannam: {
    id: "hannam",
    nameKey: "areaGuides.hannam.name",
    nameKo: "한남",
    taglineKey: "areaGuides.hannam.tagline",
    descriptionKey: "areaGuides.hannam.description",
    stations: [
      { nameKey: "areaGuides.hannam.station1", line: "6" },
      { nameKey: "areaGuides.hannam.station2", line: "6" },
    ],
    spotKeys: [
      "areaGuides.hannam.spot1",
      "areaGuides.hannam.spot2",
      "areaGuides.hannam.spot3",
      "areaGuides.hannam.spot4",
    ],
    exitGuideKey: "areaGuides.hannam.exitGuide",
    walkingTipKey: "areaGuides.hannam.walkingTip",
    dayTripKey: "areaGuides.hannam.dayTrip",
    emoji: "🎨",
    color: "teal",
  },
};
