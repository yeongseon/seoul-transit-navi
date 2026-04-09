import type { Metadata } from "next";
import Link from "next/link";
import {
  STATION_GUIDES,
  STATION_GUIDE_IDS,
  type StationGuideId,
} from "../../../data/station-guides";
import { getTranslation } from "../../../i18n/server";

type StationGuideDetailPageProps = {
  params: Promise<{ stationId: string }>;
};

function isStationGuideId(value: string): value is StationGuideId {
  return STATION_GUIDE_IDS.includes(value as StationGuideId);
}

export async function generateMetadata({ params }: StationGuideDetailPageProps): Promise<Metadata> {
  const { t } = await getTranslation();
  const { stationId } = await params;

  if (!isStationGuideId(stationId)) {
    return {
      title: t("stationGuides.meta.title"),
      description: t("stationGuides.meta.description"),
    };
  }

  const guide = STATION_GUIDES[stationId];
  const name = t(guide.nameKey);
  const description = guide.isWarning
    ? guide.detailKey
      ? t(guide.detailKey)
      : t("stationGuides.meta.description")
    : guide.confusionKeys?.[0]
      ? t(guide.confusionKeys[0])
      : t("stationGuides.meta.description");

  return {
    title: `${name} | ${t("stationGuides.title")}`,
    description,
    openGraph: {
      title: `${name} | ${t("stationGuides.title")}`,
      description,
      type: "article",
    },
  };
}

export default async function StationGuideDetailPage({ params }: StationGuideDetailPageProps) {
  const { t } = await getTranslation();
  const { stationId } = await params;

  if (!isStationGuideId(stationId)) {
    return (
      <main className="pb-safe min-h-screen bg-neutral-50 p-4 pb-20 pt-8 sm:p-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/station-guides"
            className="mb-4 inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>{t("stationGuides.title")}</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {t("stationGuides.title")}
          </Link>

          <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
            <h1 className="text-2xl font-bold text-slate-900">{t("routeDetail.notFound")}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{t("stationGuides.meta.description")}</p>
          </section>
        </div>
      </main>
    );
  }

  const guide = STATION_GUIDES[stationId];
  const confusionPoints = guide.confusionKeys?.map((key) => t(key)) ?? [];
  const tips = guide.tipKeys?.map((key) => t(key)) ?? [];

  return (
    <main className="pb-safe min-h-screen bg-neutral-50 p-4 pb-20 pt-8 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/station-guides"
          className="mb-4 inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>{t("stationGuides.title")}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("stationGuides.title")}
        </Link>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {guide.emoji} {t(guide.nameKey)}
          </h1>
        </section>

        {guide.isWarning ? (
          <section className="mt-4 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
            <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200">
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                {t("stationGuides.warningBadge")}
              </span>
              <p className="mt-4 text-sm leading-6 text-amber-950">{guide.warningKey ? t(guide.warningKey) : ""}</p>
              <p className="mt-3 text-sm leading-6 text-amber-800">{guide.detailKey ? t(guide.detailKey) : ""}</p>
            </div>
          </section>
        ) : (
          <div className="mt-4 space-y-4">
            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <h2 className="text-lg font-bold text-slate-900">{t("stationGuides.lines")}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t(guide.linesKey)}</p>
            </section>

            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <h2 className="text-lg font-bold text-slate-900">{t("stationGuides.confusionPoints")}</h2>
              <div className="mt-4 space-y-3">
                {confusionPoints.map((point, index) => (
                  <article key={point} className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200">
                    <div className="flex gap-3">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-6 text-slate-700">{point}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <h2 className="text-lg font-bold text-slate-900">{t("stationGuides.tips")}</h2>
              <div className="mt-4 space-y-3">
                {tips.map((tip) => (
                  <article key={tip} className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200">
                    <p className="text-sm leading-6 text-slate-700">{tip}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <h2 className="text-lg font-bold text-slate-900">{t("mapLinks.mapSection")}</h2>
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
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
