import type { Metadata } from "next";
import { getTranslation } from "../../../i18n/server";

interface StationResponse {
  data?: {
    nameJa?: string;
    nameKo?: string;
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
    summary?: string;
  };
}

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
}

async function fetchStationName(stationId: string, locale: string): Promise<string> {
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
    if (locale === "ko") {
      return data?.nameKo ?? data?.nameJa ?? stationId;
    }
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
  const { t, locale } = await getTranslation();
  const { routeId } = await params;
  const route = await fetchRouteData(routeId);

  if (!route) {
    return {
      title: t("routeDetailMeta.title"),
    };
  }

  const [fromName, toName] = await Promise.all([
    route.startRef?.type === "coord"
      ? Promise.resolve(t("routeDetailMeta.currentLocation"))
      : route.startRef?.id
        ? fetchStationName(route.startRef.id, locale)
        : Promise.resolve(t("routeDetailMeta.origin")),
    route.destinationRef?.type === "coord"
      ? Promise.resolve(t("routeDetailMeta.destination"))
      : route.destinationRef?.id
        ? fetchStationName(route.destinationRef.id, locale)
        : Promise.resolve(t("routeDetailMeta.arrival")),
  ]);

  const title = `${fromName} → ${toName} | ${t("routeDetailMeta.siteSuffix")}`;
  const duration = typeof route.durationMin === "number" ? t("routeDetailMeta.minutes", { count: route.durationMin }) : null;
  const fare = typeof route.fareKrw === "number" ? `₩${route.fareKrw.toLocaleString()}` : null;
  const transfers =
    typeof route.transferCount === "number" ? t("routeDetailMeta.transfers", { count: route.transferCount }) : null;
  const summary = route.summary || route.summaryJa || t("routeDetailMeta.defaultSummary");
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
