import type { MetadataRoute } from "next";
import { fetchPlaces } from "../lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://seoul-transit-navi.pages.dev";
  let places: { id: string }[] = [];

  try {
    const placesResult = await fetchPlaces(undefined, { next: { revalidate: 3600 } });
    places = placesResult.map((place) => ({ id: place.id }));
  } catch (error) {
    console.warn("Failed to fetch places for sitemap:", error);
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/places`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const placePages: MetadataRoute.Sitemap = places.map((place) => ({
    url: `${baseUrl}/places/${place.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...placePages];
}
