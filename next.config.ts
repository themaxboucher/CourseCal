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
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
