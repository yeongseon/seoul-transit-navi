import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
  STATION_CACHE: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
