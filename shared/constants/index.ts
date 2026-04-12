export const LINES = {
  line_1: {
    id: "line_1",
    lineNumber: 1,
    nameKo: "1호선",
    nameJa: "1号線",
    nameEn: "Line 1",
    color: "#0052A4",
    type: "subway" as const,
  },
  line_2: {
    id: "line_2",
    lineNumber: 2,
    nameKo: "2호선",
    nameJa: "2号線",
    nameEn: "Line 2",
    color: "#00A84D",
    type: "subway" as const,
  },
  line_3: {
    id: "line_3",
    lineNumber: 3,
    nameKo: "3호선",
    nameJa: "3号線",
    nameEn: "Line 3",
    color: "#EF7C1C",
    type: "subway" as const,
  },
  line_4: {
    id: "line_4",
    lineNumber: 4,
    nameKo: "4호선",
    nameJa: "4号線",
    nameEn: "Line 4",
    color: "#00A5DE",
    type: "subway" as const,
  },
  line_5: {
    id: "line_5",
    lineNumber: 5,
    nameKo: "5호선",
    nameJa: "5号線",
    nameEn: "Line 5",
    color: "#996CAC",
    type: "subway" as const,
  },
  line_6: {
    id: "line_6",
    lineNumber: 6,
    nameKo: "6호선",
    nameJa: "6号線",
    nameEn: "Line 6",
    color: "#CD7C2F",
    type: "subway" as const,
  },
  line_7: {
    id: "line_7",
    lineNumber: 7,
    nameKo: "7호선",
    nameJa: "7号線",
    nameEn: "Line 7",
    color: "#747F00",
    type: "subway" as const,
  },
  line_8: {
    id: "line_8",
    lineNumber: 8,
    nameKo: "8호선",
    nameJa: "8号線",
    nameEn: "Line 8",
    color: "#E6186C",
    type: "subway" as const,
  },
  line_9: {
    id: "line_9",
    lineNumber: 9,
    nameKo: "9호선",
    nameJa: "9号線",
    nameEn: "Line 9",
    color: "#BDB092",
    type: "subway" as const,
  },
  airport_rail: {
    id: "airport_rail",
    lineNumber: 0,
    nameKo: "공항철도",
    nameJa: "空港鉄道",
    nameEn: "Airport Railroad",
    color: "#0090D2",
    type: "airport_rail" as const,
  },
  gyeongui_jungang: {
    id: "gyeongui_jungang",
    lineNumber: 0,
    nameKo: "경의중앙선",
    nameJa: "京義中央線",
    nameEn: "Gyeongui-Jungang Line",
    color: "#77C4A3",
    type: "subway" as const,
  },
  shinbundang: {
    id: "shinbundang",
    lineNumber: 0,
    nameKo: "신분당선",
    nameJa: "新盆唐線",
    nameEn: "Shinbundang Line",
    color: "#D4003B",
    type: "subway" as const,
  },
} as const;

export type LineId = keyof typeof LINES;

export const ROUTE_TYPE_LABELS = {
  easy: "わかりやすいルート",
  fastest: "最速ルート",
  few_transfers: "乗り換えが少ないルート",
  tourist_friendly: "おすすめルート",
} as const;

const ROUTE_TYPE_LABELS_KO = {
  easy: "알기 쉬운 경로",
  fastest: "최단 경로",
  few_transfers: "환승이 적은 경로",
  tourist_friendly: "추천 경로",
} as const;

export function getRouteTypeLabels(locale: "ja" | "ko"): Record<string, string> {
  return locale === "ko" ? { ...ROUTE_TYPE_LABELS_KO } : { ...ROUTE_TYPE_LABELS };
}

export const PLACE_CATEGORY_LABELS = {
  shopping: "ショッピング",
  culture: "文化・歴史",
  food: "グルメ",
  landmark: "ランドマーク",
  entertainment: "エンタメ",
  transport: "交通",
  nature: "自然",
  other: "その他",
} as const;

const PLACE_CATEGORY_LABELS_KO = {
  shopping: "쇼핑",
  culture: "문화·역사",
  food: "맛집",
  landmark: "랜드마크",
  entertainment: "엔터테인먼트",
  transport: "교통",
  nature: "자연",
  other: "기타",
} as const;

export function getPlaceCategoryLabels(locale: "ja" | "ko"): Record<string, string> {
  return locale === "ko" ? { ...PLACE_CATEGORY_LABELS_KO } : { ...PLACE_CATEGORY_LABELS };
}

export const PLACE_IDS = [
  "myeongdong",
  "hongdae",
  "gyeongbokgung",
  "bukchon-hanok-village",
  "n-seoul-tower",
  "dongdaemun-market",
  "itaewon",
  "gangnam",
  "coex",
  "yeouido-park",
  "insadong",
  "samcheongdong",
  "apgujeong-rodeo",
  "jamsil-lotte-world",
  "war-memorial-of-korea",
] as const;
