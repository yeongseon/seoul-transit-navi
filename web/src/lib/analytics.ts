export type AnalyticsEvent =
  | { type: "route_search"; from: string; to: string }
  | { type: "route_detail_view"; routeId: string }
  | { type: "route_preset_click"; preset: string }
  | { type: "airport_flow_start"; terminal: string }
  | { type: "airport_flow_complete"; terminal: string; area: string }
  | { type: "station_guide_view"; stationId: string }
  | { type: "area_guide_view"; areaId: string }
  | { type: "map_link_click"; destination: string; provider: "naver" | "google" }
  | { type: "locale_switch"; from: string; to: string }
  | { type: "korean_copy"; text: string };

const IS_DEV = typeof window !== "undefined" && window.location.hostname === "localhost";

export function trackEvent(event: AnalyticsEvent): void {
  if (IS_DEV) {
    console.log("[analytics]", event.type, event);
  }
}
