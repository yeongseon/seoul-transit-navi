export type AreaGuideId =
  | "myeongdong"
  | "hongdae"
  | "gangnam"
  | "gyeongbokgung"
  | "seoulStation"
  | "seongsu"
  | "jamsil"
  | "yeouido"
  | "hannam";

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

export const AREA_GUIDE_IDS: AreaGuideId[] = [
  "myeongdong",
  "hongdae",
  "gangnam",
  "gyeongbokgung",
  "seoulStation",
  "seongsu",
  "jamsil",
  "yeouido",
  "hannam",
];

export const AREA_GUIDES: Record<AreaGuideId, AreaGuideProfile> = {
  myeongdong: {
    id: "myeongdong",
    nameKey: "areaGuides.myeongdong.name",
    nameKo: "명동",
    taglineKey: "areaGuides.myeongdong.tagline",
    descriptionKey: "areaGuides.myeongdong.description",
    stations: [
      { nameKey: "areaGuides.myeongdong.station1", line: "4" },
      { nameKey: "areaGuides.myeongdong.station2", line: "2" },
    ],
    spotKeys: [
      "areaGuides.myeongdong.spot1",
      "areaGuides.myeongdong.spot2",
      "areaGuides.myeongdong.spot3",
      "areaGuides.myeongdong.spot4",
    ],
    exitGuideKey: "areaGuides.myeongdong.exitGuide",
    walkingTipKey: "areaGuides.myeongdong.walkingTip",
    dayTripKey: "areaGuides.myeongdong.dayTrip",
    emoji: "🛍️",
    color: "pink",
  },
  hongdae: {
    id: "hongdae",
    nameKey: "areaGuides.hongdae.name",
    nameKo: "홍대",
    taglineKey: "areaGuides.hongdae.tagline",
    descriptionKey: "areaGuides.hongdae.description",
    stations: [
      { nameKey: "areaGuides.hongdae.station1", line: "2" },
      { nameKey: "areaGuides.hongdae.station2", line: "A" },
    ],
    spotKeys: [
      "areaGuides.hongdae.spot1",
      "areaGuides.hongdae.spot2",
      "areaGuides.hongdae.spot3",
      "areaGuides.hongdae.spot4",
    ],
    exitGuideKey: "areaGuides.hongdae.exitGuide",
    walkingTipKey: "areaGuides.hongdae.walkingTip",
    dayTripKey: "areaGuides.hongdae.dayTrip",
    emoji: "🎸",
    color: "violet",
  },
  gangnam: {
    id: "gangnam",
    nameKey: "areaGuides.gangnam.name",
    nameKo: "강남",
    taglineKey: "areaGuides.gangnam.tagline",
    descriptionKey: "areaGuides.gangnam.description",
    stations: [
      { nameKey: "areaGuides.gangnam.station1", line: "2" },
      { nameKey: "areaGuides.gangnam.station2", line: "SB" },
    ],
    spotKeys: [
      "areaGuides.gangnam.spot1",
      "areaGuides.gangnam.spot2",
      "areaGuides.gangnam.spot3",
      "areaGuides.gangnam.spot4",
    ],
    exitGuideKey: "areaGuides.gangnam.exitGuide",
    walkingTipKey: "areaGuides.gangnam.walkingTip",
    dayTripKey: "areaGuides.gangnam.dayTrip",
    emoji: "🏙️",
    color: "teal",
  },
  gyeongbokgung: {
    id: "gyeongbokgung",
    nameKey: "areaGuides.gyeongbokgung.name",
    nameKo: "경복궁",
    taglineKey: "areaGuides.gyeongbokgung.tagline",
    descriptionKey: "areaGuides.gyeongbokgung.description",
    stations: [
      { nameKey: "areaGuides.gyeongbokgung.station1", line: "3" },
      { nameKey: "areaGuides.gyeongbokgung.station2", line: "3" },
    ],
    spotKeys: [
      "areaGuides.gyeongbokgung.spot1",
      "areaGuides.gyeongbokgung.spot2",
      "areaGuides.gyeongbokgung.spot3",
      "areaGuides.gyeongbokgung.spot4",
    ],
    exitGuideKey: "areaGuides.gyeongbokgung.exitGuide",
    walkingTipKey: "areaGuides.gyeongbokgung.walkingTip",
    dayTripKey: "areaGuides.gyeongbokgung.dayTrip",
    emoji: "🏯",
    color: "orange",
  },
  seoulStation: {
    id: "seoulStation",
    nameKey: "areaGuides.seoulStation.name",
    nameKo: "서울역",
    taglineKey: "areaGuides.seoulStation.tagline",
    descriptionKey: "areaGuides.seoulStation.description",
    stations: [
      { nameKey: "areaGuides.seoulStation.station1", line: "1" },
      { nameKey: "areaGuides.seoulStation.station2", line: "4" },
    ],
    spotKeys: [
      "areaGuides.seoulStation.spot1",
      "areaGuides.seoulStation.spot2",
      "areaGuides.seoulStation.spot3",
    ],
    exitGuideKey: "areaGuides.seoulStation.exitGuide",
    walkingTipKey: "areaGuides.seoulStation.walkingTip",
    dayTripKey: "areaGuides.seoulStation.dayTrip",
    emoji: "🚉",
    color: "teal",
  },
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
