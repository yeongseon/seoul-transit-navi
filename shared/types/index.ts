export interface Station {
  id: string;
  stationCode: string;
  nameKo: string;
  nameJa: string;
  nameEn: string;
  nameCn?: string;
  nameHanja?: string;
  aliases: string[];
  lineIds: string[];
  lat: number;
  lng: number;
  complexityLevel: 1 | 2 | 3;
  exitIds: string[];
}

export interface Exit {
  id: string;
  stationId: string;
  exitNumber: string;
  label: string;
  description: string;
  walkingTimeMin?: number;
  landmarkRefs: string[];
}

export interface Line {
  id: string;
  lineNumber: number;
  nameKo: string;
  nameJa: string;
  nameEn: string;
  color: string;
  type: "subway" | "airport_rail" | "other";
}

export interface Place {
  id: string;
  slug: string;
  nameKo: string;
  nameJa: string;
  nameEn: string;
  descriptionJa: string;
  descriptionKo: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  nearestStationId: string;
  nearestExitNumber: string;
  imageUrl: string;
}

export type PlaceCategory =
  | "shopping"
  | "culture"
  | "food"
  | "landmark"
  | "entertainment"
  | "transport"
  | "nature"
  | "other";

export interface RouteResult {
  id: string;
  startRef: LocationRef;
  destinationRef: LocationRef;
  durationMin: number;
  fareKrw: number;
  transferCount: number;
  routeType: RouteType;
  transportModes: TransportMode[];
  summary: string;
  label: string;
  recommended: boolean;
  recommendedExitId?: string;
  steps: RouteStep[];
  notes: string[];
}

export type RouteType = "easy" | "fastest" | "few_transfers" | "tourist_friendly";
export type TransportMode = "subway" | "bus" | "walk" | "airport_rail";

export interface LocationRef {
  type: "station" | "place" | "coord";
  id?: string;
  name?: string;
  coord?: { lat: number; lng: number };
}

export interface RouteStep {
  order: number;
  mode: TransportMode | "transfer";
  instruction: string;
  fromRef?: LocationRef;
  toRef?: LocationRef;
  lineId?: string;
  lineName?: string;
  lineColor?: string;
  stationCount?: number;
  durationMin?: number;
  notes: string[];
}

export interface SearchSuggestion {
  id: string;
  type: "station" | "place";
  name: string;
  subtitle: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
