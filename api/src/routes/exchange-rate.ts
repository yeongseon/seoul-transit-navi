import { Hono } from "hono";

import type { Bindings } from "../index";

type ExchangeRateResponse = {
  krwPerJpy: number;
  updatedAt: string;
};

type OpenExchangeRateResponse = {
  result?: string;
  rates?: {
    JPY?: number;
  };
  time_last_update_unix?: number;
  time_last_update_utc?: string;
};

const EXCHANGE_RATE_URL = "https://open.er-api.com/v6/latest/KRW";
const EXCHANGE_RATE_TTL_SECONDS = 60 * 60 * 24;

const exchangeRateRoutes = new Hono<{ Bindings: Bindings }>();

function getTodayCacheKey(now = new Date()): string {
  return `exchange-rate:krw-jpy:${now.toISOString().slice(0, 10)}`;
}

function toExchangeRate(data: OpenExchangeRateResponse): ExchangeRateResponse | null {
  if (data.result !== "success") {
    return null;
  }

  const jpyRate = data.rates?.JPY;

  if (typeof jpyRate !== "number" || !Number.isFinite(jpyRate) || jpyRate <= 0) {
    return null;
  }

  const updatedAt = typeof data.time_last_update_utc === "string"
    ? new Date(data.time_last_update_utc).toISOString()
    : typeof data.time_last_update_unix === "number"
      ? new Date(data.time_last_update_unix * 1000).toISOString()
      : new Date().toISOString();

  return {
    krwPerJpy: 1 / jpyRate,
    updatedAt,
  };
}

exchangeRateRoutes.get("/", async (c) => {
  const cacheKey = getTodayCacheKey();
  const cached = await c.env.STATION_CACHE.get(cacheKey);

  if (cached) {
    try {
      return c.json(JSON.parse(cached) as ExchangeRateResponse);
    } catch {
      console.warn("corrupted_exchange_rate_cache", { cacheKey, error: "JSON.parse_failed" });
      await c.env.STATION_CACHE.delete(cacheKey);
    }
  }

  try {
    const response = await fetch(EXCHANGE_RATE_URL);

    if (!response.ok) {
      console.warn("exchange_rate_fetch_failed", { status: response.status, statusText: response.statusText });
      return c.json(
        {
          error: {
            code: "EXCHANGE_RATE_UNAVAILABLE",
            message: "為替レートを取得できませんでした。",
          },
        },
        502,
      );
    }

    const payload = toExchangeRate((await response.json()) as OpenExchangeRateResponse);

    if (!payload) {
      console.warn("invalid_exchange_rate_response");
      return c.json(
        {
          error: {
            code: "EXCHANGE_RATE_UNAVAILABLE",
            message: "為替レートを取得できませんでした。",
          },
        },
        502,
      );
    }

    await c.env.STATION_CACHE.put(cacheKey, JSON.stringify(payload), {
      expirationTtl: EXCHANGE_RATE_TTL_SECONDS,
    });

    return c.json(payload);
  } catch (error) {
    console.warn("exchange_rate_request_failed", { error: String(error) });
    return c.json(
      {
        error: {
          code: "EXCHANGE_RATE_UNAVAILABLE",
          message: "為替レートを取得できませんでした。",
        },
      },
      502,
    );
  }
});

export default exchangeRateRoutes;
