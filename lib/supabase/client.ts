"use client";

import { createBrowserClient } from "@supabase/ssr";
import { requireEnv } from "@/lib/env";

/**
 * Creates a Supabase client for use in client components.
 */
export function createClient() {
  return createBrowserClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")
  );
}
