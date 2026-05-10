import type { EventWithCourse } from "@/lib/actions/events.actions";

/**
 * Union of every event shape the UI may render. Authenticated users get
 * Supabase rows joined with their course (and color) metadata, while guests
 * only have the raw IndexedDB shape.
 */
export type AnyEvent = EventWithCourse | LocalEvent;

export function isLocalEvent(event: AnyEvent): event is LocalEvent {
  return "course_color" in event;
}

/**
 * Resolve the color associated with an event regardless of whether it lives
 * in IndexedDB (color is stored on the event itself) or Supabase (color is
 * pulled in via the joined `course_colors` relation).
 */
export function getEventColor(event: AnyEvent): Color | null {
  if (isLocalEvent(event)) {
    return event.course_color ?? null;
  }
  return event.course?.course_color?.[0]?.color ?? null;
}

/**
 * The course title only exists on Supabase events because we join the
 * `courses` table. Guest (IndexedDB) events only carry a free-form course
 * code, so we return null for them.
 */
export function getCourseTitle(event: AnyEvent): string | null {
  if (isLocalEvent(event)) {
    return null;
  }
  return event.course?.title ?? null;
}
