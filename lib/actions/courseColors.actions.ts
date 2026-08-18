"use server";

import type { TablesInsert } from "@/types/supabase";
import { createClient } from "../supabase/server";

export async function createCourseColors(courseColors: TablesInsert<"course_colors">[]) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_colors")
    .insert(courseColors)
    .select();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function upsertCourseColor(courseColor: TablesInsert<"course_colors">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_colors")
    .upsert(courseColor, { onConflict: "user,course" })
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}