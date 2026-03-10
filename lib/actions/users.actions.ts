"use server";

import { createClient } from "../supabase/server";

export async function getLoggedInUser() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return false;
  }
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}
