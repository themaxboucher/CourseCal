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
};

export default nextConfig;
