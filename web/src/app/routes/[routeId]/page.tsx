"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RouteResult } from "../../../../../shared/types";
import { LINES, LineId } from "../../../../../shared/constants";
import { RouteStepItem } from "../../../components/route-step";
import { useTranslation } from "../../../i18n/client";
import { trackEvent } from "../../../lib/analytics";
import { fetchRoute, fetchStation, ApiError } from "../../../lib/api";
import {
  getConfusingStationsInRoute,
  routeHasAREX,
  getServiceStatus,
  STATION_GUIDE_MAP,
} from "../../../data/route-confidence";

interface StationLookupResult {
  name: string;
  nameKo: string;
  lat?: number;
  lng?: number;
}

export default function RouteDetailPage({
  params,
}: {
  params: Promise<{ routeId: string }>;
}) {
  const router = useRouter();
  const { routeId } = use(params);
  const { t, locale } = useTranslation();

  const getLineName = (lineId?: string, fallbackName?: string) => {
    if (lineId) {
      const line = LINES[lineId as LineId];
      if (line) {
        return locale === "ko" ? line.nameKo : line.nameJa;
      }
    }
    return fallbackName || "";
  };

  const [route, setRoute] = useState<RouteResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [koreanCopied, setKoreanCopied] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<ReturnType<typeof getServiceStatus>>("normal");
  const [currentKstTime, setCurrentKstTime] = useState("");
  const [stationLookup, setStationLookup] = useState<Record<string, StationLookupResult>>({});

  useEffect(() => {
    const loadRoute = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchRoute(routeId);
        setRoute(data);
        trackEvent({ type: "route_detail_view", routeId });
      } catch (err) {
        setError(err instanceof ApiError ? err.message : t("routeDetail.errorOccurred"));
      } finally {
        setIsLoading(false);
      }
    };
    loadRoute();
  }, [routeId, t]);

  useEffect(() => {
    const now = new Date();
    setServiceStatus(getServiceStatus(now));
    setCurrentKstTime(
      new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "ja-JP", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now)
    );
  }, [locale]);

  useEffect(() => {
    if (!route) {
      setStationLookup({});
      return;
    }

    const confusingStationIds = getConfusingStationsInRoute(route.steps);
    const destinationStationId = route.destinationRef.id ?? route.steps[route.steps.length - 1]?.toRef?.id;
    const stationIds = Array.from(new Set([...confusingStationIds, ...(destinationStationId ? [destinationStationId] : [])]));

    if (stationIds.length === 0) {
      setStationLookup({});
      return;
    }

    const fetchStationData = async () => {
      try {
        const entries = await Promise.all(
          stationIds.map(async (stationId) => {
            try {
              const data = await fetchStation(stationId);
              return [
                stationId,
                {
                  name: locale === "ko" ? data?.nameKo ?? data?.nameJa ?? stationId : data?.nameJa ?? stationId,
                  nameKo: data?.nameKo ?? stationId,
                  lat: data?.lat,
                  lng: data?.lng,
                },
              ] as const;
            } catch (error) {
              console.warn("Failed to fetch station data:", error);
              return [stationId, { name: stationId, nameKo: stationId }] as const;
            }
          })
        );

        setStationLookup(Object.fromEntries(entries));
      } catch (error) {
        console.warn("Failed to fetch station lookup data:", error);
        setStationLookup(
          Object.fromEntries(
            stationIds.map((stationId) => [
              stationId,
              {
                name: stationId,
                nameKo: stationId,
              },
            ])
          )
        );
      }
    };

    fetchStationData();
  }, [locale, route]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy:", err);
    }
  };

  const handleCopyKorean = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setKoreanCopied(true);
      setTimeout(() => setKoreanCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy:", err);
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "tourist_friendly":
        return "bg-amber-100 text-amber-800 ring-amber-200";
      case "fastest":
        return "bg-rose-100 text-rose-800 ring-rose-200";
      case "easy":
        return "bg-emerald-100 text-emerald-800 ring-emerald-200";
      case "few_transfers":
        return "bg-sky-100 text-sky-800 ring-sky-200";
      default:
        return "bg-slate-100 text-slate-800 ring-slate-200";
    }
  };

  if (isLoading) {
    return (
      <main className="pb-safe min-h-screen bg-slate-50 px-6 py-10 sm:py-16 text-slate-900">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200/50" />
          <div className="h-48 animate-pulse rounded-3xl bg-slate-200/50" />
          <div className="h-96 animate-pulse rounded-3xl bg-slate-200/50" />
        </div>
      </main>
    );
  }

  if (error || !route) {
    return (
      <main className="pb-safe min-h-screen bg-slate-50 px-6 py-10 sm:py-16 text-slate-900">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-3xl bg-white p-12 shadow-sm ring-1 ring-slate-200">
          <span className="text-4xl mb-4">⚠️</span>
          <p className="text-lg font-bold text-slate-800">
            {error || t("routeDetail.notFound")}
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 rounded-2xl bg-slate-100 px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          >
            {t("routeDetail.back")}
          </button>
        </div>
      </main>
    );
  }

  const transfers = route.steps.filter((s) => s.mode === "transfer");
  const lastStep = route.steps[route.steps.length - 1];
  const exitSteps = route.steps.filter(
    (s) => s.mode === "walk" && s.instruction.includes("出口")
  );
  const confusingStationIds = getConfusingStationsInRoute(route.steps);
  const hasAREX = routeHasAREX(route.steps);
  const destinationStationId = route.destinationRef.id ?? lastStep?.toRef?.id;
  const destinationStation = destinationStationId ? stationLookup[destinationStationId] : undefined;
  const hasDestinationCoords = Boolean(destinationStation && destinationStation.lat && destinationStation.lng);
  const mapHref = destinationStation?.nameKo
    ? `https://map.naver.com/p/search/${encodeURIComponent(destinationStation.nameKo)}`
    : null;

  const serviceStatusCardClass =
    serviceStatus === "serviceEnded"
      ? "bg-rose-50 ring-rose-200"
      : serviceStatus === "lastTrainSoon"
        ? "bg-amber-50 ring-amber-200"
        : serviceStatus === "earlyMorning"
          ? "bg-sky-50 ring-sky-200"
          : "bg-emerald-50 ring-emerald-200";

  const serviceStatusTextClass =
    serviceStatus === "serviceEnded"
      ? "text-rose-900"
      : serviceStatus === "lastTrainSoon"
        ? "text-amber-900"
        : serviceStatus === "earlyMorning"
          ? "text-sky-900"
          : "text-emerald-900";

  return (
    <main className="pb-safe min-h-screen bg-slate-50 px-6 py-10 sm:py-16 text-slate-900">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
          >
            <span className="text-lg">←</span>
            {t("routeDetail.backToResults")}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="relative flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
          >
            <span>🔗</span>
            {t("routeDetail.share")}
            {copied && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-md after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-800">
                {t("routeDetail.copied")}
              </span>
            )}
          </button>
        </header>

        <section className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ring-1 ring-inset ${getBadgeStyle(
                route.routeType
              )}`}
            >
              {t(`routeTypes.${route.routeType}`)}
            </span>
          </div>

          <div className="mb-4 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              {route.durationMin}
              <span className="text-2xl font-semibold text-slate-500">{t("routeDetail.minutes")}</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-base font-semibold text-slate-600">
            <span className="flex items-center gap-1.5">
              <span>₩</span>
              {route.fareKrw.toLocaleString()}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{t("routeDetail.transfers", { count: route.transferCount })}</span>
          </div>
          
          {route.notes && route.notes.length > 0 && (
            <div className="mt-6 flex flex-col gap-2">
              {route.notes.map((note) => (
                <div
                  key={`route-note-${note}`}
                  className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 ring-1 ring-inset ring-slate-200"
                >
                  💡 {note}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 className="mb-8 text-xl font-bold tracking-tight text-slate-900">
            {t("routeDetail.routeDetails")}
          </h2>
          <div className="flex flex-col">
            {route.steps.map((step, index) => (
              <RouteStepItem
                key={`step-${step.order}`}
                step={step}
                isLast={index === route.steps.length - 1}
              />
            ))}
          </div>
        </section>

        {transfers.length > 0 && (
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">
              {t("routeDetail.transferGuide")}
            </h2>
            <div className="flex flex-col gap-4">
              {transfers.map((transfer) => (
                <div key={`transfer-${transfer.order}`} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{t("routeDetail.transferTo", { line: getLineName(transfer.lineId, transfer.lineName) })}</span>
                    {transfer.durationMin && (
                      <span className="text-sm text-slate-500">{t("routeDetail.walkMinutes", { count: transfer.durationMin || 0 })}</span>
                    )}
                  </div>
                  {transfer.notes.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {transfer.notes.map((note, ni) => (
                        <p key={`tn-${transfer.order}-${ni}`} className="text-sm text-amber-700">⚠️ {note}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">
            {t("routeDetail.exitGuide")}
          </h2>
          <div className="flex flex-col gap-3">
            {exitSteps.length > 0 ? (
              exitSteps.map((step) => (
                <div key={`exit-${step.order}`} className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200">
                  <p className="font-bold text-emerald-900">{step.instruction}</p>
                  {step.durationMin && (
                    <p className="mt-1 text-sm text-emerald-700">{t("routeDetail.walkMinutes", { count: step.durationMin || 0 })}</p>
                  )}
                  {step.notes.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {step.notes.map((note, i) => (
                        <p key={`en-${step.order}-${i}`} className="text-sm text-slate-600">💡 {note}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-inset ring-emerald-200">
                <p className="font-bold text-emerald-900">
                  {lastStep?.instruction ?? t("routeDetail.arriveAndExit")}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">
            {t("timeWarning.sectionTitle")}
          </h2>
          <div className={`rounded-2xl p-4 ring-1 ring-inset ${serviceStatusCardClass}`}>
            <p className={`font-bold ${serviceStatusTextClass}`}>{t(`timeWarning.${serviceStatus}`)}</p>
            <div className="mt-3 flex flex-col gap-1 text-sm text-slate-600">
              <p>
                {t("timeWarning.currentTime")}: {currentKstTime || "--:--"} (KST)
              </p>
              <p>{t("timeWarning.lastTrainApprox")}</p>
              <p>{t("timeWarning.firstTrainApprox")}</p>
            </div>
          </div>
          {serviceStatus === "serviceEnded" && (
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
              <p className="font-bold text-slate-900">{t("timeWarning.taxiFallback")}</p>
              <p className="mt-2 text-sm text-slate-600">{t("timeWarning.taxiFallbackDescription")}</p>
            </div>
          )}
        </section>

        {confusingStationIds.length > 0 && (
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">
              {t("routeConfidence.sectionTitle")}
            </h2>
            <div className="flex flex-col gap-4">
              {confusingStationIds.map((stationId) => {
                const stationName = stationLookup[stationId]?.name ?? stationId;
                const guideId = STATION_GUIDE_MAP[stationId];

                return (
                  <div key={stationId} className="rounded-2xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-200">
                    <p className="font-bold text-amber-900">{t("routeConfidence.stationWarning")}</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{stationName}</p>
                    <p className="mt-2 text-sm text-slate-700">{t("routeConfidence.confusingStation")}</p>
                    {guideId && (
                      <Link
                        href={`/station-guides/${guideId}`}
                        className="mt-3 inline-flex text-sm font-semibold text-sky-600 transition hover:text-sky-700"
                      >
                        {t("routeConfidence.viewStationGuide")}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {hasAREX && (
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">
              {t("routeConfidence.arexCaution")}
            </h2>
            <div className="flex flex-col gap-3">
              <div className="rounded-2xl bg-sky-50 p-4 ring-1 ring-inset ring-sky-200">
                <p className="text-sm text-sky-900">
                  {t("routeConfidence.arexExpressNote")}
                </p>
              </div>
              <div className="rounded-2xl bg-sky-50 p-4 ring-1 ring-inset ring-sky-200">
                <p className="text-sm text-sky-900">
                  {t("routeConfidence.arexLocalNote")}
                </p>
              </div>
            </div>
          </section>
        )}

        {destinationStation?.nameKo && (
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <h2 className="mb-6 text-xl font-bold tracking-tight text-slate-900">
              {t("routeConfidence.sectionTitle")}
            </h2>
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-inset ring-slate-200">
              <p className="text-sm font-medium text-slate-500">{t("routeConfidence.koreanStationName")}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{destinationStation.nameKo}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyKorean(destinationStation.nameKo)}
                  className="relative flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                  <span>📋</span>
                  {t("routeConfidence.copyKorean")}
                  {koreanCopied && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-md after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-slate-800">
                      {t("routeConfidence.copiedKorean")}
                    </span>
                  )}
                </button>

                {hasDestinationCoords && mapHref && (
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                  >
                    <span>🗺️</span>
                    {t("routeConfidence.showOnMap")}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
