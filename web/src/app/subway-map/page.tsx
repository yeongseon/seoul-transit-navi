import type { Metadata } from "next";
import Link from "next/link";
import { SubwayMap } from "../../components/subway-map";
import { getTranslation } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();

  return {
    title: t("subwayMap.meta.title"),
    description: t("subwayMap.meta.description"),
    openGraph: {
      title: t("subwayMap.meta.title"),
      description: t("subwayMap.meta.description"),
      type: "website",
    },
  };
}

export default async function SubwayMapPage() {
  const { t } = await getTranslation();

  return (
    <main className="pb-safe min-h-screen bg-slate-50 px-4 py-8 pb-20 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
            <span aria-hidden="true">←</span>
            {t("subwayMap.backToHome")}
          </Link>

          <div className="mt-4 space-y-3">
            <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
              {t("subwayMap.badge")}
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{t("subwayMap.title")}</h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{t("subwayMap.description")}</p>
          </div>
        </section>

        <SubwayMap />
      </div>
    </main>
  );
}
