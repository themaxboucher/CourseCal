import posthog from "posthog-js";
import type { Tables } from "@/types/supabase";

/** The subset of a user row that PostHog stores on the person profile. */
export type IdentifiedUser = Pick<
  Tables<"users">,
  "id" | "email" | "name" | "username" | "major"
>;

/**
 * Every custom event the app sends.
 *
 * Spelled out here rather than left as a bare string at the call sites because
 * a misspelled name fails silently: PostHog accepts the event and files it
 * under a name no insight is watching.
 */
export type AnalyticsEvent =
  | "schedule_uploaded"
  | "schedule_upload_failed"
  | "user_signed_up"
  | "friend_request_sent"
  | "friend_request_accepted";

function isLoaded() {
  return posthog.__loaded;
}

/**
 * Properties have to stay free of PII — no addresses, no names, nothing the
 * user typed. That belongs on the person profile, which `identifyUser` sets.
 */
export function captureEvent(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean | null>,
) {
  if (!isLoaded()) return;

  posthog.capture(event, properties);
}

export function identifyUser({ id, ...properties }: IdentifiedUser) {
  if (!isLoaded()) return;

  posthog.identify(id, properties);
}

export function resetUser() {
  if (!isLoaded()) return;

  posthog.reset();
}
