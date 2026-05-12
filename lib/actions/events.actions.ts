"use server";

import { QueryData } from "@supabase/supabase-js";
import { TablesInsert } from "@/types/supabase";
import { createClient } from "../supabase/server";
import { pickNextColor } from "@/lib/utils/colors";

export type CourseColor = { course: number; color: Color };

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

export async function createEvents(
  events: TablesInsert<"events">[],
  courseColors: CourseColor[] = [],
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert(events)
    .select();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  await ensureCourseColors(supabase, data, courseColors);
  return data;
}

export async function createEvent(
  event: TablesInsert<"events">,
  courseColor?: Color,
) {
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
  const colors: CourseColor[] =
    courseColor != null && data.course != null
      ? [{ course: data.course, color: courseColor }]
      : [];
  await ensureCourseColors(supabase, [data], colors);
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

// Ensures every freshly inserted event has a corresponding `course_colors` row.
// Caller-supplied colors are authoritative and overwrite any existing color.
// For events whose course has no supplied color, a default palette color is
// inserted only when no row already exists for that (user, course) pair.
async function ensureCourseColors(
  supabase: Awaited<ReturnType<typeof createClient>>,
  insertedEvents: { user: string; course: number | null }[],
  courseColors: CourseColor[],
): Promise<void> {
  try {
    const pairs = new Map<string, { user: string; course: number }>();
    for (const event of insertedEvents) {
      if (event.course == null) continue;
      const key = `${event.user}:${event.course}`;
      if (!pairs.has(key)) {
        pairs.set(key, { user: event.user, course: event.course });
      }
    }
    if (pairs.size === 0) return;

    const colorByCourseId = new Map<number, Color>();
    for (const cc of courseColors) colorByCourseId.set(cc.course, cc.color);

    const authoritativeRows: TablesInsert<"course_colors">[] = [];
    const defaultsPending: { user: string; course: number }[] = [];

    for (const pair of pairs.values()) {
      const supplied = colorByCourseId.get(pair.course);
      if (supplied != null) {
        authoritativeRows.push({
          user: pair.user,
          course: pair.course,
          color: supplied,
        });
      } else {
        defaultsPending.push(pair);
      }
    }

    if (authoritativeRows.length > 0) {
      const { error: upsertError } = await supabase
        .from("course_colors")
        .upsert(authoritativeRows, { onConflict: "user,course" });
      if (upsertError) {
        console.error(
          "ensureCourseColors authoritative upsert failed:",
          upsertError,
        );
      }
    }

    if (defaultsPending.length === 0) return;

    const userIds = [...new Set(defaultsPending.map((p) => p.user))];
    const courseIds = [...new Set(defaultsPending.map((p) => p.course))];

    const { data: existing, error: existingError } = await supabase
      .from("course_colors")
      .select("user, course, color")
      .in("user", userIds)
      .in("course", courseIds);
    if (existingError) {
      console.error(
        "ensureCourseColors existing lookup failed:",
        existingError,
      );
      return;
    }

    const usedByUser = new Map<string, Set<Color>>();
    const existingPairKeys = new Set<string>();
    const trackUsed = (user: string, color: Color) => {
      let set = usedByUser.get(user);
      if (!set) {
        set = new Set<Color>();
        usedByUser.set(user, set);
      }
      set.add(color);
    };

    for (const row of existing ?? []) {
      trackUsed(row.user, row.color);
      existingPairKeys.add(`${row.user}:${row.course}`);
    }
    for (const row of authoritativeRows) {
      trackUsed(row.user, row.color);
    }

    const defaultRows: TablesInsert<"course_colors">[] = [];
    for (const pair of defaultsPending) {
      const key = `${pair.user}:${pair.course}`;
      if (existingPairKeys.has(key)) continue;
      const used = usedByUser.get(pair.user) ?? new Set<Color>();
      const picked = pickNextColor(used);
      trackUsed(pair.user, picked);
      defaultRows.push({
        user: pair.user,
        course: pair.course,
        color: picked,
      });
    }

    if (defaultRows.length === 0) return;

    const { error: defaultsError } = await supabase
      .from("course_colors")
      .upsert(defaultRows, {
        onConflict: "user,course",
        ignoreDuplicates: true,
      });
    if (defaultsError) {
      console.error(
        "ensureCourseColors defaults upsert failed:",
        defaultsError,
      );
    }
  } catch (err) {
    console.error("ensureCourseColors failed:", err);
  }
}
