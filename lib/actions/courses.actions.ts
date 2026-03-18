"use server";

import { createClient } from "../supabase/server";

export async function findCourseByCode(
  courseCode: string,
): Promise<number | null> {
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
  return data.id;
}
