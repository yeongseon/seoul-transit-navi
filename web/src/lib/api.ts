import type { SearchSuggestion, RouteResult } from "../../../shared/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export async function searchSuggest(query: string, lang = "ja"): Promise<SearchSuggestion[]> {
  if (!query.trim()) return [];
  const res = await fetch(`${API_BASE}/api/search/suggest?q=${encodeURIComponent(query)}&lang=${lang}`);
  if (!res.ok) throw new Error("Failed to fetch suggestions");
  const json = await res.json();
  return json.data || [];
}

export async function searchRoutes(fromStationId: string, toStationId: string): Promise<RouteResult[]> {
  const res = await fetch(`${API_BASE}/api/routes/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromStationId, toStationId }),
  });
  if (!res.ok) throw new Error("Failed to fetch routes");
  const json = await res.json();
  return json.data || [];
}
