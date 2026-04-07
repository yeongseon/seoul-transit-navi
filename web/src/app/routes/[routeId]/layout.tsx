import type { Metadata } from "next";

interface StationResponse {
  data?: {
    nameJa?: string;
  };
}

interface RouteMetadataResponse {
  data?: {
    startRef?: {
      type?: string;
      id?: string;
    };
    destinationRef?: {
      type?: string;
      id?: string;
    };
    durationMin?: number;
    fareKrw?: number;
    transferCount?: number;
    summaryJa?: string;
  };
}

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
}

async function fetchStationName(stationId: string): Promise<string> {
  try {
    const res = await fetch(
      `${getApiUrl()}/api/stations/${encodeURIComponent(stationId)}`,
      {
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      return stationId;
    }

    const { data }: StationResponse = await res.json();
    return data?.nameJa ?? stationId;
  } catch {
    return stationId;
  }
}

async function fetchRouteData(routeId: string) {
  try {
    const res = await fetch(`${getApiUrl()}/api/routes/${routeId}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return null;
    }

    const { data }: RouteMetadataResponse = await res.json();
    return data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ routeId: string }>;
}): Promise<Metadata> {
  const { routeId } = await params;
  const route = await fetchRouteData(routeId);

  if (!route) {
    return {
      title: "ルート詳細 | ソウル交通ナビ",
    };
  }

  const [fromName, toName] = await Promise.all([
    route.startRef?.type === "coord"
      ? Promise.resolve("現在地")
      : route.startRef?.id
        ? fetchStationName(route.startRef.id)
        : Promise.resolve("出発地"),
    route.destinationRef?.type === "coord"
      ? Promise.resolve("目的地")
      : route.destinationRef?.id
        ? fetchStationName(route.destinationRef.id)
        : Promise.resolve("到着地"),
  ]);

  const title = `${fromName} → ${toName} | ソウル交通ナビ`;
  const duration = typeof route.durationMin === "number" ? `${route.durationMin}分` : null;
  const fare = typeof route.fareKrw === "number" ? `₩${route.fareKrw.toLocaleString()}` : null;
  const transfers =
    typeof route.transferCount === "number" ? `乗換${route.transferCount}回` : null;
  const summary = route.summaryJa || "ソウル地下鉄ルート";
  const description = [duration, fare, transfers, summary].filter(Boolean).join(" | ");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function RouteDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
