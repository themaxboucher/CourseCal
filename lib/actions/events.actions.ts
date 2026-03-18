"use server";

import { fromDb, toDb } from "./utils/db";
import { createClient } from "../supabase/server";

export async function getEvents(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function createEvents(events: DBEvent[]) {
  const supabase = await createClient();

  // Make sure to create course colors

  // Create course colors
  const { data, error } = await supabase.from("events").insert(toDb(events));
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return fromDb(data);
}
