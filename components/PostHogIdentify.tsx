"use client";

import { useEffect } from "react";
import { identifyUser } from "@/lib/posthog-client";
import type { Tables } from "@/types/supabase";

/**
 * Identifies the signed-in user to PostHog.
 *
 * Mounted in the layouts of the signed-in route groups rather than at the login
 * callback, because identity has to be re-asserted on every full page load —
 * not only on the one that created the session.
 */
export function PostHogIdentify({ user }: { user: Tables<"users"> }) {
  const { id, email, name, username, major } = user;

  useEffect(() => {
    identifyUser({ id, email, name, username, major });
  }, [id, email, name, username, major]);

  return null;
}
