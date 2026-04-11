import { asc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

import { LINES, PLACE_CATEGORY_LABELS, getPlaceCategoryLabels } from "../../../shared/constants/index";
import type { SearchSuggestion } from "../../../shared/types/index";
import { PLACES } from "../data/places";
import { stationAliases, stationLines, stations } from "../db/schema";
import type { Bindings } from "../index";
import { buildSearchPrefixes } from "../lib/normalize";

const searchRoutes = new Hono<{ Bindings: Bindings }>();

function isLineId(value: string): value is keyof typeof LINES {
  return Object.hasOwn(LINES, value);
}

searchRoutes.get("/suggest", async (c) => {
  const query = c.req.query("q") ?? "";
  const lang = c.req.query("lang") ?? "ja";
  const prefixes = buildSearchPrefixes(query, lang);

  if (prefixes.length === 0) {
    return c.json({ data: [] satisfies SearchSuggestion[] });
  }

  const db = drizzle(c.env.DB);
  const stationName = lang === "ko" ? stations.nameKo : stations.nameJa;
  const whereClause = or(...prefixes.map((prefix) => like(sql`lower(${stationAliases.alias})`, `${prefix}%`)));
  const exactMatchClause = or(...prefixes.map((prefix) => sql`lower(${stationAliases.alias}) = ${prefix}`));
  const matchedAlias = sql<string>`min(${stationAliases.alias})`;
  const exactRank = sql<number>`min(case when ${exactMatchClause} then 0 else 1 end)`;
  const lineIds = sql<string>`group_concat(distinct ${stationLines.lineId})`;

  const rows = await db
    .select({
      id: stations.id,
      name: stationName,
      matchedAlias: matchedAlias.as("matchedAlias"),
      exactRank: exactRank.as("exactRank"),
      lineIds: lineIds.as("lineIds"),
    })
    .from(stationAliases)
    .innerJoin(stations, eq(stationAliases.stationId, stations.id))
    .innerJoin(stationLines, eq(stationLines.stationId, stations.id))
    .where(whereClause)
    .groupBy(stations.id, stationName)
    .orderBy(asc(exactRank), asc(matchedAlias), asc(stationName))
    .limit(10);

  const data: SearchSuggestion[] = rows.map((row) => {
    const subtitle = Array.from(new Set(row.lineIds.split(",").filter(isLineId)))
      .sort((left, right) => {
        const lineNumberDiff = LINES[left].lineNumber - LINES[right].lineNumber;
        return lineNumberDiff !== 0 ? lineNumberDiff : LINES[left].nameJa.localeCompare(LINES[right].nameJa, "ja");
      })
      .map((lineId) => lang === "ko" ? LINES[lineId].nameKo : LINES[lineId].nameJa)
      .join(" / ");

    return {
      id: row.id,
      type: "station",
      name: row.name,
      subtitle,
    };
  });

  const normalizedQuery = query.trim().toLowerCase();
  const categoryLabels = lang === "ko" ? getPlaceCategoryLabels("ko") : PLACE_CATEGORY_LABELS;
  const placeResults: SearchSuggestion[] = PLACES.filter((place) => {
    const names = [place.nameJa, place.nameKo, place.nameEn].map((name) => name.toLowerCase());
    return names.some((name) => name.includes(normalizedQuery));
  })
    .slice(0, 5)
    .map((place) => ({
      id: `place:${place.slug}:${place.nearestStationId}`,
      type: "place" as const,
      name: lang === "ko" ? place.nameKo : place.nameJa,
      subtitle: categoryLabels[place.category as keyof typeof PLACE_CATEGORY_LABELS] ?? place.category,
    }));

  const combined = [...data.slice(0, 7), ...placeResults.slice(0, 3)].slice(0, 10);

  return c.json({ data: combined });
});

export default searchRoutes;
