import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { api } from "@/app/api/api";
import type { LocationsHttpResponse } from "@/types/location";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL.toString(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/locations", SITE_URL).toString(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  if (!process.env.BACKEND_ORIGIN) return pages;

  try {
    let page = 1;
    let totalPages = 1;
    do {
      const { data } = await api.get<LocationsHttpResponse>("/locations", {
        params: { page, limit: 100 },
        timeout: 10000,
      });
      for (const location of data.locations) {
        pages.push({
          url: new URL(`/locations/${location._id}`, SITE_URL).toString(),
          ...(location.updatedAt ? { lastModified: location.updatedAt } : {}),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
      totalPages = data.totalPages;
      page += 1;
    } while (page <= totalPages);
  } catch (error) {
    console.error("Не вдалося завантажити локації для sitemap", error instanceof Error ? error.message : error);
  }

  return pages;
}
