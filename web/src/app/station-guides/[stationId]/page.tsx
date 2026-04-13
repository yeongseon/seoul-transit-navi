import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  STATION_GUIDES,
  STATION_GUIDE_IDS,
  type StationGuideId,
} from "../../../data/station-guides";
import { CONTENT_METADATA } from "../../../data/content-metadata";
import { getStationGuideText } from "../../../data/guide-content-helper";
import { getTranslation } from "../../../i18n/server";

type StationGuideDetailPageProps = {
  params: Promise<{ stationId: string }>;
};

function isStationGuideId(value: string): value is StationGuideId {
  return STATION_GUIDE_IDS.includes(value as StationGuideId);
}

export async function generateMetadata({ params }: StationGuideDetailPageProps): Promise<Metadata> {
  const { t, locale } = await getTranslation();
  const { stationId } = await params;

  if (!isStationGuideId(stationId)) {
    return {
      title: t("stationGuides.meta.title"),
      description: t("stationGuides.meta.description"),
    };
  }

  const guide = STATION_GUIDES[stationId];
  const content = getStationGuideText(stationId, locale);
  const name = content?.name ?? t("stationGuides.meta.title");
  const description = guide.isWarning
    ? content?.detail
      ? content.detail
      : t("stationGuides.meta.description")
    : content?.confusionPoints[0]
      ? content.confusionPoints[0]
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
  const { t, locale } = await getTranslation();
  const { stationId } = await params;

  if (!isStationGuideId(stationId)) {
    notFound();
  }

  const guide = STATION_GUIDES[stationId];
  const content = getStationGuideText(stationId, locale);

  if (!content) {
    notFound();
  }

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
            {guide.emoji} {content.name}
          </h1>
        </section>

        {guide.isWarning ? (
          <section className="mt-4 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
            <div className="rounded-3xl bg-amber-50 p-5 ring-1 ring-amber-200">
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                {t("stationGuides.warningBadge")}
              </span>
              <p className="mt-4 text-sm leading-6 text-amber-950">{content.warning ?? ""}</p>
              <p className="mt-3 text-sm leading-6 text-amber-800">{content.detail ?? ""}</p>
            </div>
          </section>
        ) : (
          <div className="mt-4 space-y-4">
            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <h2 className="text-lg font-bold text-slate-900">{t("stationGuides.lines")}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{content.lines}</p>
            </section>

            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <h2 className="text-lg font-bold text-slate-900">{t("stationGuides.confusionPoints")}</h2>
              <div className="mt-4 space-y-3">
                {content.confusionPoints.map((point, index) => (
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

            {content.exits && content.exits.length > 0 && (
              <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                <h2 className="text-lg font-bold text-slate-900">{t("stationGuides.recommendedExits")}</h2>
                <div className="mt-4 space-y-3">
                  {content.exits.map((exit) => (
                    <div
                      key={exit.exitNumber}
                      className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                    >
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                        {exit.exitNumber}
                      </span>
                      <span className="text-sm text-slate-700">{exit.purpose}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
              <h2 className="text-lg font-bold text-slate-900">{t("stationGuides.tips")}</h2>
              <div className="mt-4 space-y-3">
                {content.tips.map((tip) => (
                  <article key={tip} className="rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200">
                    <p className="text-sm leading-6 text-slate-700">{tip}</p>
                  </article>
                ))}
              </div>
            </section>

            {content.transfers && content.transfers.length > 0 && (
              <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                <h2 className="text-lg font-bold text-slate-900">{t("stationGuides.transferTime")}</h2>
                <div className="mt-4 space-y-3">
                  {content.transfers.map((transfer) => (
                    <div
                      key={transfer.lines}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                    >
                      <span className="text-sm font-medium text-slate-700">{transfer.lines}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {t("stationGuides.transferMinutes", { minutes: transfer.minutes })}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            transfer.difficulty === "easy"
                              ? "bg-green-100 text-green-700"
                              : transfer.difficulty === "moderate"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t(
                            `stationGuides.difficulty${transfer.difficulty.charAt(0).toUpperCase() + transfer.difficulty.slice(1)}`,
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {content.luggage && (
              <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                <h2 className="text-lg font-bold text-slate-900">{t("stationGuides.luggageDifficulty")}</h2>
                <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 ring-1 ring-slate-200">
                  <p className="text-sm leading-6 text-slate-700">{content.luggage.description}</p>
                  <div className="mt-3 flex gap-2">
                    {content.luggage.hasElevator && (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                        {t("stationGuides.elevatorAvailable")}
                      </span>
                    )}
                    {content.luggage.hasEscalator && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                        {t("stationGuides.escalatorAvailable")}
                      </span>
                    )}
                  </div>
                </div>
              </section>
            )}

            {content.walkingDistances && content.walkingDistances.length > 0 && (
              <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                <h2 className="text-lg font-bold text-slate-900">{t("stationGuides.walkingDistances")}</h2>
                <div className="mt-4 space-y-3">
                  {content.walkingDistances.map((walk) => (
                    <div
                      key={walk.destination}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                    >
                      <span className="text-sm text-slate-700">{walk.destination}</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {t("stationGuides.walkMinutes", { minutes: walk.minutes })}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {guide.relatedAreaGuideId && (
              <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                <Link
                  href={`/area-guides/${guide.relatedAreaGuideId}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-slate-700"
                >
                  <span>{t("stationGuides.relatedAreaGuide")}</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>{t("stationGuides.relatedAreaGuide")}</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </section>
            )}

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
        )}

        <section className="mt-4 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <p className="text-xs font-medium text-slate-500">
            {t("contentMeta.lastVerified", { date: CONTENT_METADATA.stationGuides.lastVerified })}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {CONTENT_METADATA.stationGuides.sources.map((source) => (
              <span key={source.name} className="text-xs text-slate-400">
                {source.url ? (
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">
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
    </main>
  );
}
