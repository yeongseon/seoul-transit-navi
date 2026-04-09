import type { Metadata } from "next";
import Link from "next/link";
import { AREA_GUIDE_IDS, AREA_GUIDES } from "../../data/area-guides";
import { getTranslation } from "../../i18n/server";

const AREA_CARD_ACCENTS = {
  orange: "bg-orange-50 text-orange-700 ring-orange-200",
  pink: "bg-pink-50 text-pink-700 ring-pink-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-200",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();

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

export default async function AreaGuidesPage() {
  const { t } = await getTranslation();

  return (
    <main className="pb-safe min-h-screen bg-neutral-50 p-4 pb-20 pt-8 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-4 inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <title>{t("areaGuides.backToHome")}</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t("areaGuides.backToHome")}
        </Link>

        <section className="mb-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            {t("areaGuides.eyebrow")}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{t("areaGuides.title")}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{t("areaGuides.description")}</p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          {AREA_GUIDE_IDS.map((areaId) => {
            const guide = AREA_GUIDES[areaId];
            const accentClass = AREA_CARD_ACCENTS[guide.color as keyof typeof AREA_CARD_ACCENTS];

            return (
              <section
                key={guide.id}
                className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-2xl ring-1 ring-slate-200 ${accentClass}`}>
                  <span aria-hidden="true">{guide.emoji}</span>
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-900 sm:text-xl">{t(guide.nameKey)}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{t(guide.taglineKey)}</p>
                <Link
                  href={`/area-guides/${guide.id}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-slate-700"
                >
                  <span>{t("areaGuides.viewGuide")}</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>{t("areaGuides.viewGuide")}</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
