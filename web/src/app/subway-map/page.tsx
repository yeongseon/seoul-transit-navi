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
    <main className="pb-safe min-h-screen bg-slate-50 px-4 py-4 pb-20 text-slate-900 sm:px-6 sm:py-5">
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200 sm:px-5">
          <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900">
            <span aria-hidden="true">←</span>
            {t("subwayMap.backToHome")}
          </Link>

          <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{t("subwayMap.title")}</h1>
        </section>

        <SubwayMap />
      </div>
    </main>
  );
}
