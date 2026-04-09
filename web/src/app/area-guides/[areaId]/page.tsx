import type { Metadata } from "next";
import Link from "next/link";
import { AREA_GUIDES, AREA_GUIDE_IDS, type AreaGuideId } from "../../../data/area-guides";
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
  const { t } = await getTranslation();
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

  const guide = AREA_GUIDES[areaId];
  const areaName = t(guide.nameKey);
  const description = t(guide.descriptionKey);

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
  const { t } = await getTranslation();
  const { areaId } = await params;

  if (!isAreaGuideId(areaId)) {
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

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t("areaGuides.title")}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{t("areaGuides.description")}</p>
          </section>
        </div>
      </main>
    );
  }

  const guide = AREA_GUIDES[areaId];
  const accentClass = AREA_ACCENTS[guide.color as keyof typeof AREA_ACCENTS];

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
            <span aria-hidden="true">{guide.emoji}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{t(guide.nameKey)}</h1>
          <p className="mt-3 text-base font-medium text-slate-700">{t(guide.taglineKey)}</p>
        </section>

        <div className="space-y-4">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm leading-6 text-slate-600 sm:text-base">{t(guide.descriptionKey)}</p>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.stations")}</h2>
            <ul className="mt-4 space-y-3">
              {guide.stations.map((station) => (
                <li
                  key={station.nameKey}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                >
                  <span className="text-sm font-medium text-slate-700 sm:text-base">{t(station.nameKey)}</span>
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
              {guide.spotKeys.map((spotKey) => (
                <li key={spotKey} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                  • {t(spotKey)}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.exitTip")}</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200 sm:text-base">
              {t(guide.exitGuideKey)}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.walkingTip")}</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200 sm:text-base">
              {t(guide.walkingTipKey)}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{t("areaGuides.dayTrip")}</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700 ring-1 ring-slate-200 sm:text-base">
              {t(guide.dayTripKey)}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-slate-900">{t("mapLinks.mapSection")}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`https://map.naver.com/p/search/${encodeURIComponent(guide.nameKo)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
              >
                <span>🗺️</span>
                {t("mapLinks.openNaverMap")}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(guide.nameKo)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
              >
                <span>📍</span>
                {t("mapLinks.openGoogleMap")}
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
