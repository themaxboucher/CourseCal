import posthog from "posthog-js";
import type { Tables } from "@/types/supabase";

/** The subset of a user row that PostHog stores on the person profile. */
export type IdentifiedUser = Pick<
  Tables<"users">,
  "id" | "email" | "name" | "username" | "major"
>;

function isLoaded() {
  return posthog.__loaded;
}

export function identifyUser({ id, ...properties }: IdentifiedUser) {
  if (!isLoaded()) return;

  posthog.identify(id, properties);
}

export function resetUser() {
  if (!isLoaded()) return;

  posthog.reset();
}
