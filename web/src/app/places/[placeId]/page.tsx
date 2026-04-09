import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlaceCategoryLabels } from "../../../../../shared/constants/index";
import { getTranslation } from "../../../i18n/server";

interface PlaceDetailResponse {
  data: {
    id: string;
    slug: string;
    nameJa: string;
    nameKo: string;
    nameEn: string;
    descriptionJa: string;
    descriptionKo?: string;
    category: string;
    nearestStationId: string;
    nearestExitNumber: string;
    imageUrl: string;
    lat: number;
    lng: number;
    nearestStation: {
      id: string;
      stationCode: string;
      nameKo: string;
      nameJa: string;
      nameEn: string;
      lat: number;
      lng: number;
      complexityLevel: number;
    } | null;
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ placeId: string }>;
}): Promise<Metadata> {
  const { t, locale } = await getTranslation();
  const resolvedParams = await params;
  const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/places/${resolvedParams.placeId}`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return {
        title: t("placeDetail.notFoundMeta"),
      };
    }
    const { data: place } = (await res.json()) as PlaceDetailResponse;
    const displayName = locale === "ko" ? place.nameKo : place.nameJa;
    const description = locale === "ko" ? (place.descriptionKo || place.descriptionJa) : place.descriptionJa;
    
    return {
      title: `${displayName} | ${t("placeDetail.siteSuffix")}`,
      description,
      openGraph: {
        title: `${displayName} | ${t("placeDetail.siteSuffix")}`,
        description,
        type: "website",
      },
    };
  } catch {
    return {
      title: t("placeDetail.notFoundMeta"),
    };
  }
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const { t, locale } = await getTranslation();
  const categoryLabels = getPlaceCategoryLabels(locale);

  const resolvedParams = await params;
  const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/places/${resolvedParams.placeId}`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  
  if (!res.ok) {
    if (res.status === 404) {
      notFound();
    }
    throw new Error("Failed to fetch place detail");
  }
  
  const { data: place } = (await res.json()) as PlaceDetailResponse;
  const placeName = locale === "ko" ? place.nameKo : place.nameJa;
  const description = locale === "ko" ? (place.descriptionKo || place.descriptionJa) : place.descriptionJa;
  const altNames = locale === "ko"
    ? [place.nameJa, place.nameEn]
    : [place.nameKo, place.nameEn];
  
  const quickOrigins = [
    { id: "station_seoul-station", name: t("placeDetail.seoulStation") },
    { id: "station_hongik-univ", name: t("placeDetail.hongdae") },
    { id: "station_gangnam", name: t("placeDetail.gangnam") },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": placeName,
    "description": description,
    "image": place.imageUrl,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": place.lat,
      "longitude": place.lng
    },
    "url": `https://seoul-transit-navi.pages.dev/places/${place.id}`
  };

  return (
    <main className="pb-safe min-h-screen bg-neutral-50 pb-20 sm:pb-8">
      <script
        type="application/ld+json"
      >
        {JSON.stringify(jsonLd)}
      </script>
      <div className="mx-auto max-w-2xl bg-white shadow-sm sm:mt-8 sm:rounded-2xl sm:overflow-hidden">
        <div className="p-6 pb-0">
          <Link
            href="/places"
            className="mb-4 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>{t("placeDetail.backIcon")}</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("placeDetail.backToList")}
          </Link>
          
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-neutral-900">{placeName}</h1>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
              {categoryLabels[place.category] || place.category}
            </span>
          </div>
          
          <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
            <span>{altNames[0]}</span>
            <span className="text-neutral-300">•</span>
            <span>{altNames[1]}</span>
          </div>
        </div>

        <div className="border-t border-neutral-100 p-6">
          <p className="text-base leading-relaxed text-neutral-700">
            {description}
          </p>
        </div>

        {place.nearestStation && (
          <div className="bg-neutral-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-neutral-900">{t("placeDetail.nearestStation")}</h2>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-neutral-900">
                      {t("placeDetail.station", { name: locale === "ko" ? place.nearestStation.nameKo : place.nearestStation.nameJa })}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {locale === "ko" ? place.nearestStation.nameJa : place.nearestStation.nameKo}
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-neutral-600">
                    {t("placeDetail.exitNumber", { exit: place.nearestExitNumber })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-neutral-900">{t("placeDetail.goHere")}</h3>
              <div className="flex flex-wrap gap-2">
                {quickOrigins.map((origin) => (
                  <Link
                    key={origin.id}
                    href={`/routes?from=${origin.id}&to=${place.nearestStationId}&fromName=${encodeURIComponent(origin.name)}&toName=${encodeURIComponent(locale === "ko" ? (place.nearestStation?.nameKo ?? place.nameKo) : (place.nearestStation?.nameJa ?? place.nameJa))}`}
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
                  >
                    <span>{t("placeDetail.fromOrigin", { origin: origin.name })}</span>
                    <svg
                      className="h-4 w-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>{t("placeDetail.routeSearch")}</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-neutral-900">{t("mapLinks.mapSection")}</h3>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(place.nameKo)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
                >
                  <span>🗺️</span>
                  {t("mapLinks.openNaverMap")}
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
                >
                  <span>📍</span>
                  {t("mapLinks.openGoogleMap")}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
