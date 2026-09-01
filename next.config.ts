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
  // Invites used to point at a bespoke `/join` page. They are now just the
  // landing page, but the old links are already sitting in group chats, so
  // send them on with their `?ref=` intact (Next forwards the query when the
  // destination has none of its own). Unfurlers follow the redirect, so those
  // links keep their invite card too.
  async redirects() {
    return [{ source: "/join", destination: "/", permanent: true }];
  },
  // PostHog is served from our own origin so that content blockers, which key
  // off the vendor's hostname, do not quietly drop every event. The two asset
  // paths must stay above the catch-all: Next matches these in order, and a
  // catch-all first would send the script bundles to the event endpoint.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // PostHog's ingestion API wants the trailing slash that Next would otherwise
  // redirect away.
  skipTrailingSlashRedirect: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
