import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://seoul-transit-navi.pages.dev";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

  let places: { id: string }[] = [];
  try {
    const res = await fetch(`${apiUrl}/api/places`);
    if (res.ok) {
      const json = await res.json();
      places = json.data ?? [];
    }
  } catch {
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
