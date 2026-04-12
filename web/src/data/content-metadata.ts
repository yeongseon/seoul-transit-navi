export interface ContentMetadata {
  lastVerified: string;
  sources: { name: string; url?: string }[];
}

export const CONTENT_METADATA: Record<string, ContentMetadata> = {
  tips: {
    lastVerified: "2025-06-28",
    sources: [
      { name: "ソウル交通公社 (Seoul Metro)", url: "https://www.seoulmetro.co.kr" },
      { name: "T-money公式サイト", url: "https://www.t-money.co.kr" },
      { name: "ソウル市気候同行カード案内", url: "https://climatecardseoul.kr" },
    ],
  },
  airport: {
    lastVerified: "2025-06-28",
    sources: [
      { name: "仁川国際空港公式サイト", url: "https://www.airport.kr" },
      { name: "AREX空港鉄道", url: "https://www.arex.or.kr" },
      { name: "ソウル市深夜バス案内" },
    ],
  },
  stationGuides: {
    lastVerified: "2025-06-28",
    sources: [{ name: "ソウル交通公社 (Seoul Metro)" }],
  },
  areaGuides: {
    lastVerified: "2025-06-28",
    sources: [{ name: "ソウル観光財団 (Visit Seoul)" }],
  },
};
