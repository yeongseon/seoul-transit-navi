import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT_METADATA } from "../../data/content-metadata";
import { getTranslation } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();

  return {
    title: t("tips.meta.title"),
    description: t("tips.meta.description"),
    openGraph: {
      title: t("tips.meta.title"),
      description: t("tips.meta.description"),
      type: "website",
    },
  };
}

export default async function TipsPage() {
  const { t } = await getTranslation();

  const sections = [
    {
      key: "tMoney",
      emoji: "💳",
      items: [
        t("tips.tMoney.item1"),
        t("tips.tMoney.item2"),
        t("tips.tMoney.item3"),
        t("tips.tMoney.item4"),
        t("tips.tMoney.item5"),
      ],
    },
    {
      key: "climateCard",
      emoji: "🌏",
      items: [
        t("tips.climateCard.comparisonTitle"),
        t("tips.climateCard.tmoneySummary"),
        t("tips.climateCard.singleTicketSummary"),
        t("tips.climateCard.climateCardSummary"),
        t("tips.climateCard.climateCardPurchase"),
        t("tips.climateCard.climateCardArexNote"),
        t("tips.climateCard.recommendation1"),
        t("tips.climateCard.recommendation2"),
        t("tips.climateCard.recommendation3"),
      ],
    },
    {
      key: "riding",
      emoji: "🚇",
      items: [
        t("tips.riding.item1"),
        t("tips.riding.item2"),
        t("tips.riding.item3"),
        t("tips.riding.item4"),
        t("tips.riding.item5"),
      ],
    },
    {
      key: "transfer",
      emoji: "🔄",
      items: [
        t("tips.transfer.item1"),
        t("tips.transfer.item2"),
        t("tips.transfer.item3"),
        t("tips.transfer.item4"),
      ],
    },
    {
      key: "luggage",
      emoji: "🧳",
      items: [
        t("tips.luggage.item1"),
        t("tips.luggage.item2"),
        t("tips.luggage.item3"),
        t("tips.luggage.item4"),
      ],
    },
    {
      key: "phrases",
      emoji: "💬",
      phrases: [
        {
          korean: t("tips.phrases.item1.korean"),
          meaning: t("tips.phrases.item1.meaning"),
        },
        {
          korean: t("tips.phrases.item2.korean"),
          meaning: t("tips.phrases.item2.meaning"),
        },
        {
          korean: t("tips.phrases.item3.korean"),
          meaning: t("tips.phrases.item3.meaning"),
        },
        {
          korean: t("tips.phrases.item4.korean"),
          meaning: t("tips.phrases.item4.meaning"),
        },
        {
          korean: t("tips.phrases.item5.korean"),
          meaning: t("tips.phrases.item5.meaning"),
        },
        {
          korean: t("tips.phrases.item6.korean"),
          meaning: t("tips.phrases.item6.meaning"),
        },
      ],
    },
    {
      key: "etiquette",
      emoji: "🙇",
      items: [
        t("tips.etiquette.item1"),
        t("tips.etiquette.item2"),
        t("tips.etiquette.item3"),
        t("tips.etiquette.item4"),
        t("tips.etiquette.item5"),
      ],
    },
  ] as const;

  return (
    <main className="pb-safe min-h-screen bg-neutral-50 p-4 pb-20 pt-8 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-4 inline-flex items-center text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <svg
            className="mr-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>{t("tips.backIcon")}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("tips.backToHome")}
        </Link>

        <section className="mb-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            {t("tips.eyebrow")}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            {t("tips.title")}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            {t("tips.description")}
          </p>
        </section>

        <div className="space-y-4">
          {sections.map((section) => (
            <section
              key={section.key}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <h2 className="text-xl font-bold text-slate-900">
                {section.emoji} {t(`tips.${section.key}.title`)}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {t(`tips.${section.key}.description`)}
              </p>

              {"items" in section ? (
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  {section.items.map((item) => (
                    <li key={item} className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  {section.phrases.map((phrase) => (
                    <li
                      key={phrase.korean}
                      className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200"
                    >
                      <p className="font-semibold text-slate-900">{phrase.korean}</p>
                      <p className="mt-1 text-slate-600">{phrase.meaning}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm leading-6 text-slate-600">{t("tips.airportGuideDescription")}</p>
          <Link
            href="/airport"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <span>{t("tips.airportGuideLink")}</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>{t("tips.airportGuideLink")}</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>

        <section className="mt-4 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <p className="text-xs font-medium text-slate-500">
            {t("contentMeta.lastVerified", { date: CONTENT_METADATA.tips.lastVerified })}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {CONTENT_METADATA.tips.sources.map((source) => (
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
