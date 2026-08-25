import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The OG cards read their fonts and the mascot off disk at request time.
  // Tracing does not always follow a `new URL(..., import.meta.url)` into a
  // binary asset, and a missing font file only shows up as a broken preview on
  // a link somebody already shared — so pin the directory explicitly.
  outputFileTracingIncludes: {
    "/api/og/invite": ["./lib/og/**"],
    "/opengraph-image": ["./lib/og/**"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Files under `public/` are served no-cache by default, so the demo video and
  // its poster get refetched on every visit. Their names are not content
  // hashed, so keep the browser copy to a day and let the CDN hold it — a
  // re-encode is picked up within a day rather than being pinned for a year.
  async headers() {
    return [
      {
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
