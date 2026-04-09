import { asc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

import { LINES } from "../../../shared/constants/index";
import type { SearchSuggestion } from "../../../shared/types/index";
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
  const whereClause = or(...prefixes.map((prefix) => like(sql`lower(${stationAliases.alias})`, `${prefix}%`)));
  const exactMatchClause = or(...prefixes.map((prefix) => sql`lower(${stationAliases.alias}) = ${prefix}`));
  const matchedAlias = sql<string>`min(${stationAliases.alias})`;
  const exactRank = sql<number>`min(case when ${exactMatchClause} then 0 else 1 end)`;
  const lineIds = sql<string>`group_concat(distinct ${stationLines.lineId})`;

  const rows = await db
    .select({
      id: stations.id,
      name: stations.nameJa,
      matchedAlias: matchedAlias.as("matchedAlias"),
      exactRank: exactRank.as("exactRank"),
      lineIds: lineIds.as("lineIds"),
    })
    .from(stationAliases)
    .innerJoin(stations, eq(stationAliases.stationId, stations.id))
    .innerJoin(stationLines, eq(stationLines.stationId, stations.id))
    .where(whereClause)
    .groupBy(stations.id, stations.nameJa)
    .orderBy(asc(exactRank), asc(matchedAlias), asc(stations.nameJa))
    .limit(10);

  const data: SearchSuggestion[] = rows.map((row) => {
    const subtitle = Array.from(new Set(row.lineIds.split(",").filter(isLineId)))
      .sort((left, right) => {
        const lineNumberDiff = LINES[left].lineNumber - LINES[right].lineNumber;
        return lineNumberDiff !== 0 ? lineNumberDiff : LINES[left].nameJa.localeCompare(LINES[right].nameJa, "ja");
      })
      .map((lineId) => LINES[lineId].nameJa)
      .join(" / ");

    return {
      id: row.id,
      type: "station",
      name: row.name,
      subtitle,
    };
  });

  return c.json({ data });
});

export default searchRoutes;
