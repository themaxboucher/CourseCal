import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Only the two routes worth an organic visit. */
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
