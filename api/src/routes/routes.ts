import type { Context } from "hono";
import { Hono } from "hono";

import { LINES } from "../../../shared/constants/index";
import type { RouteResult } from "../../../shared/types/index";
import type { Bindings } from "../index";
import { ODsayApiError } from "../lib/odsay";
import { generateRouteExplanation } from "../lib/route-explainer";
import { ODsayRouteProvider } from "../lib/route-provider";

type SearchBody = {
  fromStationId?: string;
  toStationId?: string;
};

type StationRecord = {
  id: string;
  lat: number;
  lng: number;
};

type ErrorStatus = 400 | 404 | 502 | 503;

const routes = new Hono<{ Bindings: Bindings }>();

function errorResponse(c: Context<{ Bindings: Bindings }>, code: string, messageJa: string, status: ErrorStatus) {
  return c.json(
    {
      error: {
        code,
        messageJa,
      },
    },
    { status },
  );
}

function stringifyStable(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((entry) => stringifyStable(entry)).join(",")}]`;
  }

  const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right));
  return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${stringifyStable(entry)}`).join(",")}}`;
}

function createHash(value: string): string {
  let hash = 5381;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return (hash >>> 0).toString(36);
}

function createRouteId(route: RouteResult, fromStationId: string, toStationId: string): string {
  const routePayload = Object.fromEntries(Object.entries(route).filter(([key]) => key !== "id"));
  return createHash(`${fromStationId}:${toStationId}:${stringifyStable(routePayload)}`);
}

function toErrorStatus(status: number): ErrorStatus {
  switch (status) {
    case 400:
    case 404:
    case 502:
    case 503:
      return status;
    default:
      return 502;
  }
}

async function findStationById(db: D1Database, stationId: string): Promise<StationRecord | null> {
  const station = await db
    .prepare("SELECT id, lat, lng FROM stations WHERE id = ? LIMIT 1")
    .bind(stationId)
    .first<StationRecord>();

  return station ?? null;
}

routes.post("/api/routes/search", async (c) => {
  let body: SearchBody;

  try {
    body = (await c.req.json()) as SearchBody;
  } catch {
    return errorResponse(c, "INVALID_JSON", "リクエスト形式が正しくありません", 400);
  }

  const fromStationId = body.fromStationId?.trim();
  const toStationId = body.toStationId?.trim();

  if (!fromStationId || !toStationId) {
    return errorResponse(c, "INVALID_ROUTE_SEARCH", "出発駅と到着駅を指定してください", 400);
  }

  const [fromStation, toStation] = await Promise.all([
    findStationById(c.env.DB, fromStationId),
    findStationById(c.env.DB, toStationId),
  ]);

  if (!fromStation || !toStation) {
    return errorResponse(c, "STATION_NOT_FOUND", "駅情報が見つかりません", 404);
  }

  if (!c.env.ODSAY_API_KEY) {
    return errorResponse(c, "ODSAY_API_KEY_MISSING", "経路検索サービスが未設定です", 503);
  }

  try {
    const provider = new ODsayRouteProvider(c.env.ODSAY_API_KEY);
    const routeResults = await provider.search(fromStation, toStation);
    const lineMap = new Map(Object.entries(LINES));
    const data = await Promise.all(
      routeResults.map(async (route) => {
        const explanations = generateRouteExplanation(route.steps, lineMap);
        const routeId = createRouteId(route, fromStationId, toStationId);
        const sharedRoute: RouteResult = {
          ...route,
          id: routeId,
          startRef: { type: "station", id: fromStationId },
          destinationRef: { type: "station", id: toStationId },
          summaryJa: explanations.length > 0 ? explanations.join(" → ") : route.summaryJa,
        };

        await c.env.STATION_CACHE.put(`route:${routeId}`, JSON.stringify(sharedRoute), {
          expirationTtl: 86400,
        });

        return sharedRoute;
      }),
    );

    return c.json({ data });
  } catch (error) {
    if (error instanceof ODsayApiError) {
      return errorResponse(c, error.code, error.message, toErrorStatus(error.status));
    }

    return errorResponse(c, "ROUTE_SEARCH_FAILED", "経路検索に失敗しました", 502);
  }
});

routes.get("/api/routes/:routeId", async (c) => {
  const routeId = c.req.param("routeId").trim();

  if (!routeId) {
    return errorResponse(c, "INVALID_ROUTE_ID", "ルートIDが正しくありません", 400);
  }

  const cachedRoute = await c.env.STATION_CACHE.get(`route:${routeId}`);

  if (!cachedRoute) {
    return errorResponse(c, "ROUTE_NOT_FOUND", "共有ルートが見つかりません", 404);
  }

  return c.json({ data: JSON.parse(cachedRoute) as RouteResult });
});

export default routes;
