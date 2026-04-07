import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";

import { stations } from "../db/schema";
import type { Bindings } from "../index";

const stationRoutes = new Hono<{ Bindings: Bindings }>();

stationRoutes.get("/:stationId", async (c) => {
  const { stationId } = c.req.param();
  const db = drizzle(c.env.DB);

  const rows = await db
    .select({
      id: stations.id,
      nameJa: stations.nameJa,
      nameKo: stations.nameKo,
      nameEn: stations.nameEn,
    })
    .from(stations)
    .where(eq(stations.id, stationId))
    .limit(1);

  if (rows.length === 0) {
    return c.json({ error: { code: "STATION_NOT_FOUND", messageJa: "駅が見つかりません。" } }, 404);
  }

  return c.json({ data: rows[0] });
});

export default stationRoutes;
