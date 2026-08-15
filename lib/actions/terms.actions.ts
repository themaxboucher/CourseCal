"use server";

import { createClient } from "../supabase/server";

export async function getTerms() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("terms")
    .select("*")
    .order("start_date", { ascending: false });
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  // Only get terms up to and including the next term
  const today = new Date().toISOString().split("T")[0];
  const nextTerm = data.findLast((term) => term.start_date > today);
  if (!nextTerm) return data;
  return data.filter((term) => term.start_date <= nextTerm.start_date);
}
