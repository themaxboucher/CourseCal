"use server";

import { cookies } from "next/headers";
import type { TablesUpdate } from "@/types/supabase";
import { createClient } from "../supabase/server";
import { REFERRAL_COOKIE, sanitizeReferral } from "../utils/referral";

/**
 * Finishes onboarding and settles any referral in the same write.
 *
 * Called whether the user added anybody or skipped, so the referral is
 * recorded either way and the cookie never outlives the flow that set it.
 */
export async function completeOnboarding(): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const cookieStore = await cookies();
  const referral = sanitizeReferral(cookieStore.get(REFERRAL_COOKIE)?.value);

  const patch: TablesUpdate<"users"> = { has_completed_onboarding: true };

  if (referral) {
    const { data: referrer } = await supabase
      .from("users")
      .select("id")
      .eq("username", referral)
      .maybeSingle();

    // Opening your own invite link should not record you as your own referrer.
    if (referrer && referrer.id !== user.id) {
      patch.referred_by = referrer.id;
    }
    cookieStore.delete(REFERRAL_COOKIE);
  }

  const { error } = await supabase
    .from("users")
    .update(patch)
    .eq("id", user.id);

  if (error) {
    console.error(error);
    return { ok: false };
  }
  return { ok: true };
}
