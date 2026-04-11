import { Hono } from "hono";
import { cors } from "hono/cors";

import placesRoutes from "./routes/places";
import searchRoutes from "./routes/search";
import stationRoutes from "./routes/stations";
import routes from "./routes/routes";

export type Bindings = {
  DB: D1Database;
  STATION_CACHE: KVNamespace;
  ODSAY_API_KEY?: string;
  ALLOWED_ORIGINS?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/*", (c, next) => {
  const raw = c.env.ALLOWED_ORIGINS?.trim();

  if (raw === "*") {
    return cors({ origin: "*" })(c, next);
  }

  const allowedOrigins = raw?.split(",").map((o: string) => o.trim()).filter(Boolean) ?? [];

  return cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : "https://localhost",
  })(c, next);
});

app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

app.route("/api/places", placesRoutes);
app.route("/api/search", searchRoutes);
app.route("/api/stations", stationRoutes);
app.route("/", routes);

export default app;
