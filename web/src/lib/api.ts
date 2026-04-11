import type { Place, RouteResult, SearchSuggestion, Station } from "../../../shared/types";

function getApiBase(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) return envUrl;
  // Server-side requires an absolute URL; fall back to the local API dev server.
  if (typeof window === "undefined") return "http://localhost:8787";
  // Client-side can use relative URLs (same origin).
  return "";
}

const API_BASE = getApiBase();

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function mergeRequestInit(base?: RequestInit, options?: RequestInit): RequestInit | undefined {
  if (!base && !options) {
    return undefined;
  }

  const headers = new Headers(base?.headers);
  const optionHeaders = new Headers(options?.headers);

  optionHeaders.forEach((value, key) => {
    headers.set(key, value);
  });

  return {
    ...base,
    ...options,
    headers,
  };
}

async function fetchApi<T>(path: string, init?: RequestInit, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, mergeRequestInit(init, options));
  if (!res.ok) {
    let code = "UNKNOWN_ERROR";
    let message = res.statusText || "Error";

    try {
      const body = await res.json();
      if (body?.error?.code) code = body.error.code;
      if (body?.error?.message) message = body.error.message;
    } catch (parseError) {
      console.warn("Failed to parse API error response:", parseError);
    }

    throw new ApiError(code, message, res.status);
  }

  const json = await res.json();
  return json.data;
}

type PlaceListItem = Pick<
  Place,
  "id" | "slug" | "nameJa" | "nameKo" | "category" | "nearestStationId" | "nearestExitNumber"
> & {
  nearestStation: Pick<Station, "nameJa" | "nameKo"> | null;
};

type PlaceDetail = Place & {
  nearestStation: Pick<
    Station,
    "id" | "stationCode" | "nameKo" | "nameJa" | "nameEn" | "lat" | "lng" | "complexityLevel"
  > | null;
};

export async function searchSuggest(query: string, lang = "ja"): Promise<SearchSuggestion[]> {
  if (!query.trim()) return [];
  return fetchApi<SearchSuggestion[]>(`/api/search/suggest?q=${encodeURIComponent(query)}&lang=${lang}`);
}

export async function searchRoutes(fromStationId: string, toStationId: string): Promise<RouteResult[]> {
  return fetchApi<RouteResult[]>("/api/routes/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromStationId, toStationId }),
  });
}

export async function fetchRoute(routeId: string, options?: RequestInit): Promise<RouteResult> {
  return fetchApi<RouteResult>(`/api/routes/${encodeURIComponent(routeId)}`, undefined, options);
}

export async function fetchStation(stationId: string, options?: RequestInit): Promise<{
  id: string;
  nameJa: string;
  nameKo: string;
  nameEn: string;
  lat: number;
  lng: number;
}> {
  return fetchApi(`/api/stations/${encodeURIComponent(stationId)}`, undefined, options);
}

export async function fetchPlaces(category?: string, options?: RequestInit): Promise<PlaceListItem[]> {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  const query = params.toString();
  return fetchApi<PlaceListItem[]>(`/api/places${query ? `?${query}` : ""}`, undefined, options);
}

export async function fetchPlace(placeId: string, options?: RequestInit): Promise<PlaceDetail> {
  return fetchApi<PlaceDetail>(`/api/places/${encodeURIComponent(placeId)}`, undefined, options);
}
