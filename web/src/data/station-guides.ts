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
  nameKey: string;
  nameKo: string;
  linesKey: string;
  isWarning: boolean;
  confusionKeys?: string[];
  tipKeys?: string[];
  warningKey?: string;
  detailKey?: string;
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
    nameKey: "stationGuides.seoulStation.name",
    nameKo: "서울역",
    linesKey: "stationGuides.seoulStation.lines",
    isWarning: false,
    confusionKeys: [
      "stationGuides.seoulStation.confusion1",
      "stationGuides.seoulStation.confusion2",
      "stationGuides.seoulStation.confusion3",
    ],
    tipKeys: ["stationGuides.seoulStation.tip1", "stationGuides.seoulStation.tip2"],
    emoji: "🚉",
  },
  hongdae: {
    id: "hongdae",
    nameKey: "stationGuides.hongdae.name",
    nameKo: "홍대입구역",
    linesKey: "stationGuides.hongdae.lines",
    isWarning: false,
    confusionKeys: ["stationGuides.hongdae.confusion1", "stationGuides.hongdae.confusion2"],
    tipKeys: ["stationGuides.hongdae.tip1", "stationGuides.hongdae.tip2"],
    emoji: "🎸",
  },
  dongdaemunHistoryCulture: {
    id: "dongdaemunHistoryCulture",
    nameKey: "stationGuides.dongdaemunHistoryCulture.name",
    nameKo: "동대문역사문화공원역",
    linesKey: "stationGuides.dongdaemunHistoryCulture.lines",
    isWarning: false,
    confusionKeys: [
      "stationGuides.dongdaemunHistoryCulture.confusion1",
      "stationGuides.dongdaemunHistoryCulture.confusion2",
    ],
    tipKeys: [
      "stationGuides.dongdaemunHistoryCulture.tip1",
      "stationGuides.dongdaemunHistoryCulture.tip2",
    ],
    emoji: "🏛️",
  },
  jongno3ga: {
    id: "jongno3ga",
    nameKey: "stationGuides.jongno3ga.name",
    nameKo: "종로3가역",
    linesKey: "stationGuides.jongno3ga.lines",
    isWarning: false,
    confusionKeys: ["stationGuides.jongno3ga.confusion1", "stationGuides.jongno3ga.confusion2"],
    tipKeys: ["stationGuides.jongno3ga.tip1", "stationGuides.jongno3ga.tip2"],
    emoji: "🏘️",
  },
  expressBusTerminal: {
    id: "expressBusTerminal",
    nameKey: "stationGuides.expressBusTerminal.name",
    nameKo: "고속터미널역",
    linesKey: "stationGuides.expressBusTerminal.lines",
    isWarning: false,
    confusionKeys: [
      "stationGuides.expressBusTerminal.confusion1",
      "stationGuides.expressBusTerminal.confusion2",
    ],
    tipKeys: ["stationGuides.expressBusTerminal.tip1", "stationGuides.expressBusTerminal.tip2"],
    emoji: "🚌",
  },
  myeongdong: {
    id: "myeongdong",
    nameKey: "stationGuides.myeongdong.name",
    nameKo: "명동역",
    linesKey: "stationGuides.myeongdong.lines",
    isWarning: false,
    confusionKeys: [
      "stationGuides.myeongdong.confusion1",
      "stationGuides.myeongdong.confusion2",
    ],
    tipKeys: ["stationGuides.myeongdong.tip1", "stationGuides.myeongdong.tip2"],
    emoji: "🛍️",
  },
  gangnam: {
    id: "gangnam",
    nameKey: "stationGuides.gangnam.name",
    nameKo: "강남역",
    linesKey: "stationGuides.gangnam.lines",
    isWarning: false,
    confusionKeys: [
      "stationGuides.gangnam.confusion1",
      "stationGuides.gangnam.confusion2",
    ],
    tipKeys: ["stationGuides.gangnam.tip1", "stationGuides.gangnam.tip2"],
    emoji: "🏙️",
  },
  jamsil: {
    id: "jamsil",
    nameKey: "stationGuides.jamsil.name",
    nameKo: "잠실역",
    linesKey: "stationGuides.jamsil.lines",
    isWarning: false,
    confusionKeys: [
      "stationGuides.jamsil.confusion1",
      "stationGuides.jamsil.confusion2",
    ],
    tipKeys: ["stationGuides.jamsil.tip1", "stationGuides.jamsil.tip2"],
    emoji: "🏰",
  },
  gyeongbokgung: {
    id: "gyeongbokgung",
    nameKey: "stationGuides.gyeongbokgung.name",
    nameKo: "경복궁역",
    linesKey: "stationGuides.gyeongbokgung.lines",
    isWarning: false,
    confusionKeys: [
      "stationGuides.gyeongbokgung.confusion1",
      "stationGuides.gyeongbokgung.confusion2",
    ],
    tipKeys: ["stationGuides.gyeongbokgung.tip1", "stationGuides.gyeongbokgung.tip2"],
    emoji: "🏯",
  },
  euljiro3ga: {
    id: "euljiro3ga",
    nameKey: "stationGuides.euljiro3ga.name",
    nameKo: "을지로3가역",
    linesKey: "stationGuides.euljiro3ga.lines",
    isWarning: false,
    confusionKeys: [
      "stationGuides.euljiro3ga.confusion1",
      "stationGuides.euljiro3ga.confusion2",
    ],
    tipKeys: ["stationGuides.euljiro3ga.tip1", "stationGuides.euljiro3ga.tip2"],
    emoji: "☕",
  },
  seongsu: {
    id: "seongsu",
    nameKey: "stationGuides.seongsu.name",
    nameKo: "성수역",
    linesKey: "stationGuides.seongsu.lines",
    isWarning: false,
    confusionKeys: [
      "stationGuides.seongsu.confusion1",
      "stationGuides.seongsu.confusion2",
    ],
    tipKeys: ["stationGuides.seongsu.tip1", "stationGuides.seongsu.tip2"],
    emoji: "☕",
  },
  apgujeongWarning: {
    id: "apgujeongWarning",
    nameKey: "stationGuides.apgujeongWarning.name",
    nameKo: "압구정",
    linesKey: "",
    isWarning: true,
    warningKey: "stationGuides.apgujeongWarning.warning",
    detailKey: "stationGuides.apgujeongWarning.detail",
    emoji: "⚠️",
  },
  euljiroWarning: {
    id: "euljiroWarning",
    nameKey: "stationGuides.euljiroWarning.name",
    nameKo: "을지로",
    linesKey: "",
    isWarning: true,
    warningKey: "stationGuides.euljiroWarning.warning",
    detailKey: "stationGuides.euljiroWarning.detail",
    emoji: "⚠️",
  },
};
