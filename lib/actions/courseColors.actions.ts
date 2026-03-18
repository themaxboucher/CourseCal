"use server";

import { createClient } from "../supabase/server";
import { fromDb, toDb } from "./utils/db";

export async function createCourseColors(courseColors: CourseColor[]) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("course_colors").insert(toDb(courseColors));
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return fromDb(data);
}