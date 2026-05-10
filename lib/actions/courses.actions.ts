"use server";

import { Tables } from "@/types/supabase";
import { createClient } from "../supabase/server";

export async function findCourseByCode(
  courseCode: string,
): Promise<Tables<"courses"> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("code", courseCode)
    .single();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function getCourses(limit: number, query: string = ""): Promise<Tables<"courses">[]> {
  const supabase = await createClient();
  let request = supabase.from("courses").select("*").limit(limit);

  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    const escaped = trimmedQuery.replace(/([%,()])/g, "\\$1");
    request = request.or(`code.ilike.%${escaped}%,title.ilike.%${escaped}%`);
  }

  const { data, error } = await request;
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}
