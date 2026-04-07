import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PLACE_CATEGORY_LABELS } from "../../../../../shared/constants/index";

interface PlaceDetailResponse {
  data: {
    id: string;
    slug: string;
    nameJa: string;
    nameKo: string;
    nameEn: string;
    descriptionJa: string;
    category: keyof typeof PLACE_CATEGORY_LABELS;
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
  const resolvedParams = await params;
  const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/places/${resolvedParams.placeId}`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return {
        title: "目的地が見つかりません | ソウル交通ナビ",
      };
    }
    const { data: place } = (await res.json()) as PlaceDetailResponse;
    
    return {
      title: `${place.nameJa} | ソウル交通ナビ`,
      description: place.descriptionJa,
      openGraph: {
        title: `${place.nameJa} | ソウル交通ナビ`,
        description: place.descriptionJa,
        type: "website",
      },
    };
  } catch {
    return {
      title: "目的地が見つかりません | ソウル交通ナビ",
    };
  }
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
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
  
  const quickOrigins = [
    { id: "station_seoul-station", name: "ソウル駅" },
    { id: "station_hongik-univ", name: "弘大入口" },
    { id: "station_gangnam", name: "江南" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": place.nameJa,
    "description": place.descriptionJa,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              <title>戻る</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            目的地一覧に戻る
          </Link>
          
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-neutral-900">{place.nameJa}</h1>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
              {PLACE_CATEGORY_LABELS[place.category]}
            </span>
          </div>
          
          <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
            <span>{place.nameKo}</span>
            <span className="text-neutral-300">•</span>
            <span>{place.nameEn}</span>
          </div>
        </div>

        <div className="border-t border-neutral-100 p-6">
          <p className="text-base leading-relaxed text-neutral-700">
            {place.descriptionJa}
          </p>
        </div>

        {place.nearestStation && (
          <div className="bg-neutral-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-neutral-900">最寄り駅</h2>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-neutral-900">
                      {place.nearestStation.nameJa}駅
                    </span>
                    <span className="text-sm text-neutral-500">
                      {place.nearestStation.nameKo}
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-medium text-neutral-600">
                    {place.nearestExitNumber}番出口
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold text-neutral-900">ここへ行く</h3>
              <div className="flex flex-wrap gap-2">
                {quickOrigins.map((origin) => (
                  <Link
                    key={origin.id}
                    href={`/routes?from=${origin.id}&to=${place.nearestStationId}`}
                    className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
                  >
                    <span>{origin.name}から</span>
                    <svg
                      className="h-4 w-4 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <title>ルート検索</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}