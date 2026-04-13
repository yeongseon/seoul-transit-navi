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
  line: string;
}

export interface AreaGuideProfile {
  id: AreaGuideId;
  nameKo: string;
  stations: AreaGuideStation[];
  relatedStationGuideId?: string;
  emoji: string;
  color: string;
}

type AreaGuidePageMeta = {
  bestArrivalStation?: { exitNumber: string };
};

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

export const AREA_GUIDES: Record<AreaGuideId, AreaGuideProfile & AreaGuidePageMeta> = {
  myeongdong: {
    id: "myeongdong",
    nameKo: "명동",
    stations: [{ line: "4" }, { line: "2" }],
    bestArrivalStation: { exitNumber: "4" },
    relatedStationGuideId: "myeongdong",
    emoji: "🛍️",
    color: "pink",
  },
  hongdae: {
    id: "hongdae",
    nameKo: "홍대",
    stations: [{ line: "2" }, { line: "A" }],
    bestArrivalStation: { exitNumber: "9" },
    relatedStationGuideId: "hongdae",
    emoji: "🎸",
    color: "violet",
  },
  gangnam: {
    id: "gangnam",
    nameKo: "강남",
    stations: [{ line: "2" }, { line: "SBD" }],
    bestArrivalStation: { exitNumber: "10" },
    relatedStationGuideId: "gangnam",
    emoji: "🏙️",
    color: "teal",
  },
  gyeongbokgung: {
    id: "gyeongbokgung",
    nameKo: "경복궁",
    stations: [{ line: "3" }, { line: "3" }],
    bestArrivalStation: { exitNumber: "5" },
    relatedStationGuideId: "gyeongbokgung",
    emoji: "🏯",
    color: "orange",
  },
  seoulStation: {
    id: "seoulStation",
    nameKo: "서울역",
    stations: [{ line: "1" }, { line: "4" }],
    bestArrivalStation: { exitNumber: "1" },
    relatedStationGuideId: "seoulStation",
    emoji: "🚉",
    color: "teal",
  },
  seongsu: {
    id: "seongsu",
    nameKo: "성수",
    stations: [{ line: "2" }, { line: "2" }, { line: "SB" }],
    bestArrivalStation: { exitNumber: "2" },
    emoji: "☕",
    color: "orange",
  },
  jamsil: {
    id: "jamsil",
    nameKo: "잠실",
    stations: [{ line: "2" }, { line: "8" }],
    bestArrivalStation: { exitNumber: "10" },
    emoji: "🏰",
    color: "pink",
  },
  yeouido: {
    id: "yeouido",
    nameKo: "여의도",
    stations: [{ line: "5" }, { line: "5" }],
    bestArrivalStation: { exitNumber: "3" },
    emoji: "🌆",
    color: "violet",
  },
  hannam: {
    id: "hannam",
    nameKo: "한남",
    stations: [{ line: "6" }, { line: "6" }],
    bestArrivalStation: { exitNumber: "1" },
    emoji: "🎨",
    color: "teal",
  },
};
