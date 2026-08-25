import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        // Unfurlers fetch the invite card as a plain URL and several of them
        // (Facebook's among others) check robots.txt before they will. A blanket
        // `/api/` disallow would quietly kill the preview on every shared link.
        "/api/og/",
      ],
      disallow: [
        "/api/",
        "/friends",
        "/settings",
        "/u/",
        "/onboarding/",
        "/verify",
        "/check-email",
        "/auth/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
