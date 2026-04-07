import { Hono } from "hono";

import { PLACE_CATEGORY_LABELS } from "../../../shared/constants/index";
import { PLACES, type PlaceCategory, type PlaceRecord } from "../data/places";
import type { Bindings } from "../index";

type StationRow = {
  id: string;
  stationCode: string;
  nameKo: string;
  nameJa: string;
  nameEn: string;
  lat: number;
  lng: number;
  complexityLevel: number;
};

type PlaceResponse = PlaceRecord & {
  nearestStation: StationRow | null;
};

const placesRoutes = new Hono<{ Bindings: Bindings }>();

function isPlaceCategory(value: string): value is PlaceCategory {
  return Object.hasOwn(PLACE_CATEGORY_LABELS, value);
}

async function fetchStationsByIds(db: D1Database, stationIds: string[]): Promise<Map<string, StationRow>> {
  if (stationIds.length === 0) {
    return new Map();
  }

  const placeholders = stationIds.map(() => "?").join(", ");
  const query = `SELECT id, station_code AS stationCode, name_ko AS nameKo, name_ja AS nameJa, name_en AS nameEn, lat, lng, complexity_level AS complexityLevel FROM stations WHERE id IN (${placeholders})`;
  const result = await db.prepare(query).bind(...stationIds).all<StationRow>();
  const rows = result.results ?? [];

  return new Map(rows.map((row) => [row.id, row]));
}

function attachStations(places: PlaceRecord[], stationsById: Map<string, StationRow>): PlaceResponse[] {
  return places.map((place) => ({
    ...place,
    nearestStation: stationsById.get(place.nearestStationId) ?? null,
  }));
}

placesRoutes.get("/", async (c) => {
  const category = c.req.query("category");

  if (category && !isPlaceCategory(category)) {
    return c.json(
      {
        error: {
          code: "INVALID_CATEGORY",
          messageJa: "無効なカテゴリです。",
        },
      },
      400,
    );
  }

  const filteredPlaces = category ? PLACES.filter((place) => place.category === category) : PLACES;
  const stationIds = Array.from(new Set(filteredPlaces.map((place) => place.nearestStationId)));
  const stationsById = await fetchStationsByIds(c.env.DB, stationIds);

  return c.json({ data: attachStations(filteredPlaces, stationsById) });
});

placesRoutes.get("/:placeId", async (c) => {
  const place = PLACES.find((entry) => entry.id === c.req.param("placeId"));

  if (!place) {
    return c.json(
      {
        error: {
          code: "PLACE_NOT_FOUND",
          messageJa: "目的地が見つかりません。",
        },
      },
      404,
    );
  }

  const stationsById = await fetchStationsByIds(c.env.DB, [place.nearestStationId]);

  return c.json({ data: attachStations([place], stationsById)[0] });
});

export default placesRoutes;
