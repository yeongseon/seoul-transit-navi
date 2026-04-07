import { Hono } from "hono";
import { cors } from "hono/cors";

import placesRoutes from "./routes/places";
import searchRoutes from "./routes/search";
import routes from "./routes/routes";

export type Bindings = {
  DB: D1Database;
  STATION_CACHE: KVNamespace;
  ODSAY_API_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/*", cors());

app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

app.route("/api/places", placesRoutes);
app.route("/api/search", searchRoutes);
app.route("/", routes);

export default app;
