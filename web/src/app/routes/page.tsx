"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { RouteResult } from "../../../../shared/types";
import { RouteCard } from "../../components/route-card";
import { useTranslation } from "../../i18n/client";
import { trackEvent } from "../../lib/analytics";
import { searchRoutes, fetchStation, ApiError } from "../../lib/api";

async function resolveStationName(stationId: string, locale: string): Promise<string> {
  try {
    const data = await fetchStation(stationId);
    if (locale === "ko") {
      return data?.nameKo ?? data?.nameJa ?? stationId;
    }
    return data?.nameJa ?? stationId;
  } catch (error) {
    console.warn("Failed to resolve station name:", error);
    return stationId;
  }
}

function RoutesSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const fromNameParam = searchParams.get("fromName");
  const toNameParam = searchParams.get("toName");

  const [routes, setRoutes] = useState<RouteResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fromName, setFromName] = useState(fromNameParam || "");
  const [toName, setToName] = useState(toNameParam || "");

  useEffect(() => {
    if (fromNameParam) {
      setFromName(fromNameParam);
      return;
    }
    if (from && !from.startsWith("coord_")) {
      resolveStationName(from, locale).then(setFromName);
    } else {
      setFromName("");
    }
  }, [from, fromNameParam, locale]);

  useEffect(() => {
    if (toNameParam) {
      setToName(toNameParam);
      return;
    }
    if (to && !to.startsWith("coord_")) {
      resolveStationName(to, locale).then(setToName);
    } else {
      setToName("");
    }
  }, [to, toNameParam, locale]);

  const fetchRoutes = useCallback(async () => {
    if (!from || !to) {
      setError(t("routes.specifyStations"));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await searchRoutes(from, to);
      setRoutes(data);
      trackEvent({ type: "route_search", from: from || "", to: to || "" });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t("routes.errorOccurred"));
      }
    } finally {
      setIsLoading(false);
    }
  }, [from, to, t]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex w-fit items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
        >
          <span className="text-lg">←</span>
          {t("routes.back")}
        </button>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          {t("routes.searchResults")}
        </h1>
        {fromName && toName && (
          <p className="mt-1 text-sm font-medium text-slate-600">
            {fromName} <span className="mx-2 text-slate-400">→</span> {toName}
          </p>
        )}
      </header>

      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500 ring-1 ring-slate-200">
        {t("routes.coverageNote")}
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-3xl bg-slate-200/50"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <span className="mb-4 text-4xl">⚠️</span>
          <p className="text-lg font-bold text-slate-800">{error}</p>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            {t("routes.errorSubtext")}
          </p>
          <button
            type="button"
            onClick={() => fetchRoutes()}
            className="mt-6 rounded-2xl bg-slate-100 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          >
            {t("routes.retry")}
          </button>
        </div>
      ) : routes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <span className="mb-4 text-4xl">🔍</span>
          <p className="text-lg font-bold text-slate-800">
            {t("routes.noRoutesFound")}
          </p>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            {t("routes.noRoutesSubtext")}
          </p>
          <p className="mt-3 max-w-sm text-xs text-slate-400">
            {t("routes.searchTip")}
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-2xl bg-sky-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-sky-700"
          >
            {t("routes.backToTop")}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RoutesSearchPage() {
  return (
    <main className="pb-safe min-h-screen bg-slate-50 px-6 py-10 sm:py-16 text-slate-900">
      <Suspense fallback={<div className="animate-pulse h-screen w-full bg-slate-100" />}>
        <RoutesSearchContent />
      </Suspense>
    </main>
  );
}
