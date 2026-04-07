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
  labelJa: string;
  descriptionJa: string;
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
  aliases: string[];
  category: PlaceCategory;
  lat: number;
  lng: number;
  nearestStationIds: string[];
  recommendedExitIds: string[];
  introJa: string;
  accessNoteJa: string;
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
  summaryJa: string;
  labelJa: string;
  recommended: boolean;
  recommendedExitId?: string;
  steps: RouteStep[];
  notesJa: string[];
}

export type RouteType = "easy" | "fastest" | "few_transfers" | "tourist_friendly";
export type TransportMode = "subway" | "bus" | "walk" | "airport_rail";

export interface LocationRef {
  type: "station" | "place" | "coord";
  id?: string;
  coord?: { lat: number; lng: number };
}

export interface RouteStep {
  order: number;
  mode: TransportMode | "transfer";
  instructionJa: string;
  fromRef?: LocationRef;
  toRef?: LocationRef;
  lineId?: string;
  lineNameJa?: string;
  lineColor?: string;
  stationCount?: number;
  durationMin?: number;
  notesJa: string[];
}

export interface SearchSuggestion {
  id: string;
  type: "station" | "place";
  nameJa: string;
  subtitleJa: string;
}

export interface RouteSearchRequest {
  start: LocationRef;
  destination: LocationRef;
  preferences: {
    priority: RouteType;
  };
}

export interface RouteSearchResponse {
  routes: RouteResult[];
}

export interface ApiError {
  error: {
    code: string;
    messageJa: string;
  };
}
