import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AREA_GUIDES, AREA_GUIDE_IDS, type AreaGuideId } from "../../../data/area-guides";
import { CONTENT_METADATA } from "../../../data/content-metadata";
import { getAreaGuideText } from "../../../data/guide-content-helper";
import { getTranslation } from "../../../i18n/server";

const AREA_ACCENTS = {
  orange: "bg-orange-50 text-orange-700 ring-orange-200",
  pink: "bg-pink-50 text-pink-700 ring-pink-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-200",
} as const;

function isAreaGuideId(areaId: string): areaId is AreaGuideId {
  return AREA_GUIDE_IDS.includes(areaId as AreaGuideId);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ areaId: string }>;
}): Promise<Metadata> {
  const { t, locale } = await getTranslation();
  const { areaId } = await params;

  if (!isAreaGuideId(areaId)) {
    return {
      title: t("areaGuides.meta.title"),
      description: t("areaGuides.meta.description"),
      openGraph: {
        title: t("areaGuides.meta.title"),
        description: t("areaGuides.meta.description"),
        type: "website",
      },
    };
  }

  const content = getAreaGuideText(areaId, locale);
  const areaName = content?.name ?? t("areaGuides.meta.title");
  const description = content?.description ?? t("areaGuides.meta.description");

  return {
    title: `${areaName} | ${t("areaGuides.title")}`,
    description,
    openGraph: {
      title: `${areaName} | ${t("areaGuides.title")}`,
      description,
      type: "website",
    },
  };
}

export default async function AreaGuideDetailPage({
  params,
}: {
  params: Promise<{ areaId: string }>;
}) {
  const { t, locale } = await getTranslation();
  const { areaId } = await params;

  if (!isAreaGuideId(areaId)) {
    notFound();
  }

  const content = getAreaGuideText(areaId, locale);

  if (!content) {
    notFound();
  }

  const accentClass = AREA_ACCENTS[AREA_GUIDES[areaId].color as keyof typeof AREA_ACCENTS];

  return (
    <main className="pb-safe min-h-screen bg-neutral-50 p-4 pb-20 pt-8 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/area-guides"
          className="mb-4 inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>{t("areaGuides.title")}</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t("areaGuides.title")}
        </Link>

        <section className="mb-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-3xl ring-1 ring-slate-200 ${accentClass}`}>
            <span aria-hidden="true">{AREA_GUIDES[areaId].emoji}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{content.name}</h1>
          <p className="mt-3 text-base font-medium text-slate-700">{content.tagline}</p>
        </section>

        <div className="space-y-4">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm leading-6 text-slate-600 sm:text-base">{content.description}</p>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.stations")}</h2>
            <ul className="mt-4 space-y-3">
              {content.stations.map((station) => (
                <li
                  key={`${station.name}-${station.line}`}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                >
                  <span className="text-sm font-medium text-slate-700 sm:text-base">{station.name}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                    {station.line}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.spots")}</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700 sm:text-base">
              {content.spots.map((spot) => (
                <li key={spot} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                  • {spot}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.exitTip")}</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200 sm:text-base">
              {content.exitGuide}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.walkingTip")}</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200 sm:text-base">
              {content.walkingTip}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.dayTrip")}</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200 sm:text-base">
              {content.dayTrip}
            </div>
          </section>

          {AREA_GUIDES[areaId].bestArrivalStation && content.bestStation && content.bestReason && (
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.bestArrival")}</h2>
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {AREA_GUIDES[areaId].bestArrivalStation?.exitNumber}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{content.bestStation}</p>
                    <p className="mt-1 text-sm text-slate-600">{content.bestReason}</p>
                  </div>
                </div>
                </div>
              </section>
            )}

          {content.purposeExits && content.purposeExits.length > 0 && (
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.purposeExits")}</h2>
              <div className="mt-4 space-y-3">
                {content.purposeExits.map((exit) => (
                  <div
                    key={`${exit.purpose}-${exit.exitNumber}`}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-900">{exit.purpose}</span>
                      <p className="mt-0.5 text-xs text-slate-500">{exit.landmark}</p>
                    </div>
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                      {exit.exitNumber}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {content.flowSteps && content.flowSteps.length > 0 && (
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.halfDayFlow")}</h2>
              <div className="mt-4 space-y-3">
                {content.flowSteps.map((step, index) => (
                  <div key={`${step.step}-${step.minutes}`} className="flex gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{step.step}</p>
                      {step.minutes > 0 && (
                        <p className="mt-1 text-xs text-slate-400">{t("areaGuides.flowMinutes", { minutes: step.minutes })}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {AREA_GUIDES[areaId].relatedStationGuideId && (
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <Link
                href={`/station-guides/${AREA_GUIDES[areaId].relatedStationGuideId}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-slate-700"
              >
                <span>{t("areaGuides.relatedStationGuide")}</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>{t("areaGuides.relatedStationGuide")}</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </section>
          )}

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{t("mapLinks.mapSection")}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`https://map.naver.com/p/search/${encodeURIComponent(AREA_GUIDES[areaId].nameKo)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
              >
                <span>🗺️</span>
                {t("mapLinks.openNaverMap")}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(AREA_GUIDES[areaId].nameKo)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
              >
                <span>📍</span>
                {t("mapLinks.openGoogleMap")}
              </a>
            </div>
          </section>

          <section className="mt-4 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-xs font-medium text-slate-500">
              {t("contentMeta.lastVerified", { date: CONTENT_METADATA.areaGuides.lastVerified })}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
              {CONTENT_METADATA.areaGuides.sources.map((source) => (
                <span key={source.name} className="text-xs text-slate-400">
                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-slate-600"
                    >
                      {source.name}
                    </a>
                  ) : (
                    source.name
                  )}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">{t("contentMeta.disclaimer")}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
