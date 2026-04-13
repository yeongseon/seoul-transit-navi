import type { MetadataRoute } from "next";
import { AREA_GUIDE_IDS } from "../data/area-guides";
import { CONTENT_METADATA } from "../data/content-metadata";
import { STATION_GUIDE_IDS } from "../data/station-guides";
import { PLACE_IDS } from "../../../shared/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://seoul-transit-navi-web.yeongseon-choe.workers.dev";
  const faqLastVerified = CONTENT_METADATA["faq"]?.lastVerified ?? "2025-06-28";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date("2025-06-28"),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/places`,
      lastModified: new Date("2025-06-28"),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/airport`,
      lastModified: new Date(CONTENT_METADATA.airport.lastVerified),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tips`,
      lastModified: new Date(CONTENT_METADATA.tips.lastVerified),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/subway-map`,
      lastModified: new Date("2025-06-28"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/area-guides`,
      lastModified: new Date(CONTENT_METADATA.areaGuides.lastVerified),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/station-guides`,
      lastModified: new Date(CONTENT_METADATA.stationGuides.lastVerified),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(faqLastVerified),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const placePages: MetadataRoute.Sitemap = PLACE_IDS.map((id) => ({
    url: `${baseUrl}/places/${id}`,
    lastModified: new Date("2025-06-28"),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const areaGuidePages: MetadataRoute.Sitemap = AREA_GUIDE_IDS.map((id) => ({
    url: `${baseUrl}/area-guides/${id}`,
    lastModified: new Date(CONTENT_METADATA.areaGuides.lastVerified),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const stationGuidePages: MetadataRoute.Sitemap = STATION_GUIDE_IDS.map((id) => ({
    url: `${baseUrl}/station-guides/${id}`,
    lastModified: new Date(CONTENT_METADATA.stationGuides.lastVerified),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...placePages, ...areaGuidePages, ...stationGuidePages];
}
