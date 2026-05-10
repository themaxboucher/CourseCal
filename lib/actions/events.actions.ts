"use server";

import { QueryData } from "@supabase/supabase-js";
import { TablesInsert } from "@/types/supabase";
import { createClient } from "../supabase/server";

const eventsWithCourseQuery = (
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) =>
  supabase
    .from("events")
    .select("*, course:courses(*, course_color:course_colors(color))")
    .eq("user", userId)
    .eq("course.course_color.user", userId);

export type EventWithCourse = QueryData<
  ReturnType<typeof eventsWithCourseQuery>
>[number];

export async function getEvents(userId: string): Promise<EventWithCourse[]> {
  const supabase = await createClient();
  const { data, error } = await eventsWithCourseQuery(supabase, userId);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function createEvents(events: TablesInsert<"events">[]) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert(events)
    .select();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function createEvent(event: TablesInsert<"events">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert(event)
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function updateEvent(id: number, event: Partial<TablesInsert<"events">>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .update(event)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}

export async function deleteEvent(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
}
