export type StationGuideId =
  | "seoulStation"
  | "hongdae"
  | "dongdaemunHistoryCulture"
  | "jongno3ga"
  | "expressBusTerminal"
  | "myeongdong"
  | "gangnam"
  | "jamsil"
  | "gyeongbokgung"
  | "euljiro3ga"
  | "seongsu"
  | "apgujeongWarning"
  | "euljiroWarning";

export interface StationGuideProfile {
  id: StationGuideId;
  nameKo: string;
  isWarning: boolean;
  relatedAreaGuideId?: string;
  emoji: string;
}

export const STATION_GUIDE_IDS: StationGuideId[] = [
  "seoulStation",
  "hongdae",
  "dongdaemunHistoryCulture",
  "jongno3ga",
  "expressBusTerminal",
  "myeongdong",
  "gangnam",
  "jamsil",
  "gyeongbokgung",
  "euljiro3ga",
  "seongsu",
  "apgujeongWarning",
  "euljiroWarning",
];

export const STATION_GUIDES: Record<StationGuideId, StationGuideProfile> = {
  seoulStation: {
    id: "seoulStation",
    nameKo: "서울역",
    isWarning: false,
    relatedAreaGuideId: "seoulStation",
    emoji: "🚉",
  },
  hongdae: {
    id: "hongdae",
    nameKo: "홍대입구역",
    isWarning: false,
    relatedAreaGuideId: "hongdae",
    emoji: "🎸",
  },
  dongdaemunHistoryCulture: {
    id: "dongdaemunHistoryCulture",
    nameKo: "동대문역사문화공원역",
    isWarning: false,
    emoji: "🏛️",
  },
  jongno3ga: {
    id: "jongno3ga",
    nameKo: "종로3가역",
    isWarning: false,
    emoji: "🏘️",
  },
  expressBusTerminal: {
    id: "expressBusTerminal",
    nameKo: "고속터미널역",
    isWarning: false,
    emoji: "🚌",
  },
  myeongdong: {
    id: "myeongdong",
    nameKo: "명동역",
    isWarning: false,
    relatedAreaGuideId: "myeongdong",
    emoji: "🛍️",
  },
  gangnam: {
    id: "gangnam",
    nameKo: "강남역",
    isWarning: false,
    relatedAreaGuideId: "gangnam",
    emoji: "🏙️",
  },
  jamsil: {
    id: "jamsil",
    nameKo: "잠실역",
    isWarning: false,
    relatedAreaGuideId: "jamsil",
    emoji: "🏰",
  },
  gyeongbokgung: {
    id: "gyeongbokgung",
    nameKo: "경복궁역",
    isWarning: false,
    relatedAreaGuideId: "gyeongbokgung",
    emoji: "🏯",
  },
  euljiro3ga: {
    id: "euljiro3ga",
    nameKo: "을지로3가역",
    isWarning: false,
    emoji: "☕",
  },
  seongsu: {
    id: "seongsu",
    nameKo: "성수역",
    isWarning: false,
    relatedAreaGuideId: "seongsu",
    emoji: "☕",
  },
  apgujeongWarning: {
    id: "apgujeongWarning",
    nameKo: "압구정",
    isWarning: true,
    emoji: "⚠️",
  },
  euljiroWarning: {
    id: "euljiroWarning",
    nameKo: "을지로",
    isWarning: true,
    emoji: "⚠️",
  },
};
