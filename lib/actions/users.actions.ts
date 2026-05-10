"use server";

import { TablesUpdate } from "@/types/supabase";
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

export async function updateUser(userId: string, user: Partial<TablesUpdate<"users">>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("users").update(user).eq("id", userId);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function markUserWelcomed(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ has_been_welcomed: true })
    .eq("id", userId);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function deleteAccount(userId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("users").delete().eq("id", userId);
  // TODO: make sure to delete the auth user table also
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
}