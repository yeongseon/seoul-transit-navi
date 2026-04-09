import type { Metadata } from "next";
import Link from "next/link";
import { getPlaceCategoryLabels } from "../../../../shared/constants/index";
import { getTranslation } from "../../i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return {
    title: t("placesMeta.title"),
    description: t("placesMeta.description"),
  };
}

interface PlaceListResponse {
  data: Array<{
    id: string;
    slug: string;
    nameJa: string;
    nameKo: string;
    category: string;
    nearestStationId: string;
    nearestExitNumber: string;
    nearestStation?: {
      nameJa: string;
      nameKo: string;
    };
  }>;
}

export default async function PlacesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { t, locale } = await getTranslation();
  const categoryLabels = getPlaceCategoryLabels(locale);

  const resolvedParams = await searchParams;
  const currentCategory =
    typeof resolvedParams.category === "string" ? resolvedParams.category : null;

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/places`);
  if (currentCategory) {
    url.searchParams.set("category", currentCategory);
  }

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error("Failed to fetch places");
  }

  const { data: places } = (await res.json()) as PlaceListResponse;

  return (
    <main className="pb-safe min-h-screen bg-neutral-50 p-4 pb-20 pt-8 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">{t("places.title")}</h1>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href="/places"
            className={`rounded-full px-4 py-3 text-sm font-medium transition-colors ${
              !currentCategory
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-600 shadow-sm hover:bg-neutral-100"
            }`}
          >
            {t("places.all")}
          </Link>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Link
              key={key}
              href={`/places?category=${key}`}
              className={`rounded-full px-4 py-3 text-sm font-medium transition-colors ${
                currentCategory === key
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 shadow-sm hover:bg-neutral-100"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {places.map((place) => (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="group block rounded-2xl bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <h2 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">
                  {locale === "ko" ? place.nameKo : place.nameJa}
                </h2>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                  {categoryLabels[place.category] || place.category}
                </span>
              </div>

              <div className="mt-auto flex items-center text-sm text-neutral-500">
                <svg
                  className="mr-1.5 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>{t("places.svgTitle")}</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {place.nearestStation ? (
                  <span>
                    {t("places.stationExit", { station: locale === "ko" ? place.nearestStation.nameKo : place.nearestStation.nameJa, exit: place.nearestExitNumber })}
                  </span>
                ) : (
                  <span>{t("places.noStationInfo")}</span>
                )}
              </div>
            </Link>
          ))}
          {places.length === 0 && (
            <div className="col-span-full rounded-2xl bg-white p-8 text-center text-neutral-500">
              {t("places.noPlaces")}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
