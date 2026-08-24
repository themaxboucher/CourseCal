import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Only the two routes worth an organic visit. `/join` is intentionally absent:
 * it is crawlable so unfurlers can read it, but it reads as an invitation
 * rather than a landing page and has nothing to offer a search result.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/schedule`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
