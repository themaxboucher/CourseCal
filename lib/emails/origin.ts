import { requireEnv } from "@/lib/env";

/**
 * The origin every link in an email points at.
 *
 * `NEXT_PUBLIC_SITE_URL` rather than `SITE_URL`: the constant in `lib/site.ts`
 * is pinned to production because it only ever feeds `metadataBase`, whereas a
 * link in a message has to resolve for the person who received it — which means
 * pointing at whichever deployment actually sent it.
 */
export function emailOrigin(): string {
  return requireEnv("NEXT_PUBLIC_SITE_URL").replace(/\/$/, "");
}
