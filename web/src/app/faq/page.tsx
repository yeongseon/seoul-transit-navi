import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT_METADATA } from "../../data/content-metadata";
import { getTranslation } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();

  return {
    title: t("faq.meta.title"),
    description: t("faq.meta.description"),
    openGraph: {
      title: t("faq.meta.title"),
      description: t("faq.meta.description"),
      type: "website",
    },
  };
}

export default async function FAQPage() {
  const { t } = await getTranslation();

  const faqs = [
    { questionKey: "faq.q1.question", answerKey: "faq.q1.answer" },
    { questionKey: "faq.q2.question", answerKey: "faq.q2.answer" },
    { questionKey: "faq.q3.question", answerKey: "faq.q3.answer" },
    { questionKey: "faq.q4.question", answerKey: "faq.q4.answer" },
    { questionKey: "faq.q5.question", answerKey: "faq.q5.answer" },
    { questionKey: "faq.q6.question", answerKey: "faq.q6.answer" },
    { questionKey: "faq.q7.question", answerKey: "faq.q7.answer" },
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
            <title>{t("faq.backIcon")}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {t("faq.backToHome")}
        </Link>

        <section className="mb-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            {t("faq.eyebrow")}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
            {t("faq.title")}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            {t("faq.description")}
          </p>
        </section>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={faq.questionKey}
              className="group rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
            >
              <summary className="flex cursor-pointer items-center justify-between p-6 text-sm font-semibold text-slate-900 sm:text-base [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  {t(faq.questionKey)}
                </span>
                <svg
                  className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>{t("faq.toggleIcon")}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-sm leading-6 text-slate-600">{t(faq.answerKey)}</p>
              </div>
            </details>
          ))}
        </div>

        <section className="mt-4 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <p className="text-xs font-medium text-slate-500">
            {t("contentMeta.lastVerified", { date: CONTENT_METADATA.faq.lastVerified })}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {CONTENT_METADATA.faq.sources.map((source) => (
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
