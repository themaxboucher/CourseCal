import { colors } from "@/constants";
import { getRandomColor } from "@/lib/utils";
import type { TablesInsert } from "@/types/supabase";
import { findCourseByCode } from "../actions/courses.actions";
import type { CourseColor } from "../actions/events.actions";

type EventInsert = TablesInsert<"events">;

async function buildCourseCodeToIdMap(
  courseCodes: readonly string[],
): Promise<Map<string, number | null>> {
  const uniqueCodes = [...new Set(courseCodes)];
  const courses = await Promise.all(
    uniqueCodes.map((code) => findCourseByCode(code)),
  );
  return new Map(
    uniqueCodes.map((code, index) => [code, courses[index]?.id ?? null]),
  );
}

function getCourseColorMap(parsedEvents: ParsedEvent[]): Map<string, Color> {
  const uniqueCourses = [
    ...new Set(parsedEvents.map((event: ParsedEvent) => event.courseCode)),
  ] as string[];
  return new Map<string, Color>(
    uniqueCourses.map((courseCode, index) => [
      courseCode,
      colors[index % colors.length],
    ]),
  );
}

export async function parsedToLocalEvents(
  parsedEvents: ParsedEvent[],
  termId: number,
): Promise<LocalEvent[]> {
  const courseCodeToId = await buildCourseCodeToIdMap(
    parsedEvents.map((e) => e.courseCode),
  );
  const courseColorMap = getCourseColorMap(parsedEvents);
  return parsedEvents.map((event) => ({
    course_code: event.courseCode,
    course: courseCodeToId.get(event.courseCode) ?? null,
    location: event.location,
    type: event.type ?? null,
    start_time: event.startTime,
    end_time: event.endTime,
    days: event.days,
    term: termId,
    course_color: courseColorMap.get(event.courseCode) ?? getRandomColor(),
    recurrence: "weekly",
  }));
}

export async function parsedToDBEvents(
  parsedEvents: ParsedEvent[],
  userId: string,
  termId: number,
): Promise<{ events: EventInsert[]; courseColors: CourseColor[] }> {
  const courseCodeToId = await buildCourseCodeToIdMap(
    parsedEvents.map((e) => e.courseCode),
  );
  const courseColorMap = getCourseColorMap(parsedEvents);

  const events: EventInsert[] = parsedEvents.map((event) => ({
    user: userId,
    course_code: event.courseCode,
    course: courseCodeToId.get(event.courseCode) ?? null,
    start_time: event.startTime,
    end_time: event.endTime,
    days: event.days,
    type: event.type ?? null,
    location: event.location,
    recurrence: "weekly",
    term: termId,
  }));

  const courseColors: CourseColor[] = [];
  const seenCourseIds = new Set<number>();
  for (const event of parsedEvents) {
    const courseId = courseCodeToId.get(event.courseCode);
    if (courseId == null || seenCourseIds.has(courseId)) continue;
    const color = courseColorMap.get(event.courseCode);
    if (!color) continue;
    seenCourseIds.add(courseId);
    courseColors.push({ course: courseId, color });
  }

  return { events, courseColors };
}

export async function localToDBEvents(
  localEvents: LocalEvent[],
  userId: string,
): Promise<{ events: EventInsert[]; courseColors: CourseColor[] }> {
  const courseCodeToId = await buildCourseCodeToIdMap(
    localEvents.map((e) => e.course_code),
  );

  const events: EventInsert[] = localEvents.map((event) => ({
    user: userId,
    course_code: event.course_code,
    course: event.course ?? courseCodeToId.get(event.course_code) ?? null,
    type: event.type,
    location: event.location,
    start_time: event.start_time,
    end_time: event.end_time,
    days: event.days,
    term: event.term,
    recurrence: event.recurrence,
  }));

  const courseColors: CourseColor[] = [];
  const seenCourseIds = new Set<number>();
  for (const event of localEvents) {
    const courseId =
      event.course ?? courseCodeToId.get(event.course_code) ?? null;
    if (courseId == null || seenCourseIds.has(courseId)) continue;
    seenCourseIds.add(courseId);
    courseColors.push({ course: courseId, color: event.course_color });
  }

  return { events, courseColors };
}
