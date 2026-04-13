import type { Metadata } from "next";
import Link from "next/link";
import { getStationGuideText } from "../../data/guide-content-helper";
import { STATION_GUIDES, STATION_GUIDE_IDS } from "../../data/station-guides";
import { getTranslation } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();

  return {
    title: t("stationGuides.meta.title"),
    description: t("stationGuides.meta.description"),
    openGraph: {
      title: t("stationGuides.meta.title"),
      description: t("stationGuides.meta.description"),
      type: "website",
    },
  };
}

export default async function StationGuidesPage() {
  const { t, locale } = await getTranslation();
  const stationGuides = STATION_GUIDE_IDS.map((id) => STATION_GUIDES[id]);

  return (
    <main className="pb-safe min-h-screen bg-neutral-50 p-4 pb-20 pt-8 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-4 inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>{t("stationGuides.backToHome")}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("stationGuides.backToHome")}
        </Link>

        <section className="mb-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            {t("stationGuides.eyebrow")}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{t("stationGuides.title")}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{t("stationGuides.description")}</p>
        </section>

        <div className="space-y-4">
          {stationGuides.map((guide) => {
            const content = getStationGuideText(guide.id, locale);

            if (!content) {
              return null;
            }

            const name = content.name;

            if (guide.isWarning) {
              return (
                <section
                  key={guide.id}
                  className="rounded-3xl bg-amber-50 p-6 shadow-sm ring-1 ring-amber-200"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                        {t("stationGuides.warningBadge")}
                      </span>
                      <h2 className="mt-3 text-xl font-bold text-slate-900">
                        {guide.emoji} {name}
                      </h2>
                    </div>
                    <Link
                      href={`/station-guides/${guide.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                      <span>{t("stationGuides.viewGuide")}</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <title>{t("stationGuides.viewGuide")}</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-amber-950">{content.warning ?? ""}</p>
                  <p className="mt-2 text-sm leading-6 text-amber-800">{content.detail ?? ""}</p>
                </section>
              );
            }

            return (
              <section key={guide.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-slate-900">
                      {guide.emoji} {name}
                    </h2>
                    <div className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                      <span>{t("stationGuides.lines")}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      <span>{content.lines}</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {content.confusionPoints[0] ?? ""}
                    </p>
                  </div>

                  <Link
                    href={`/station-guides/${guide.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    <span>{t("stationGuides.viewGuide")}</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <title>{t("stationGuides.viewGuide")}</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
