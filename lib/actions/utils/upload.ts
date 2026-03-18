import { colors } from "@/constants";
import { getRandomColor } from "@/lib/utils";
import { findCourseByCode } from "../courses.actions";

async function buildCourseCodeToIdMap(
  courseCodes: readonly string[],
): Promise<Map<string, number | null>> {
  const uniqueCodes = [...new Set(courseCodes)];
  const courseIds = await Promise.all(
    uniqueCodes.map((code) => findCourseByCode(code)),
  );
  return new Map(
    uniqueCodes.map((code, index) => [code, courseIds[index]]),
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
    courseCode: event.courseCode,
    course: courseCodeToId.get(event.courseCode) ?? null,
    location: event.location,
    type: event.type ?? null,
    startTime: event.startTime,
    endTime: event.endTime,
    days: event.days,
    term: termId,
    courseColor: courseColorMap.get(event.courseCode) ?? getRandomColor(),
    recurrence: "weekly",
  }));
}

export async function parsedToDBEvents(
  parsedEvents: ParsedEvent[],
  userId: string,
  termId: number,
): Promise<DBEvent[]> {
  const courseCodeToId = await buildCourseCodeToIdMap(
    parsedEvents.map((e) => e.courseCode),
  );

  return parsedEvents.map((event) => ({
    user: userId,
    courseCode: event.courseCode,
    course: courseCodeToId.get(event.courseCode) ?? null,
    startTime: event.startTime,
    endTime: event.endTime,
    days: event.days,
    type: event.type ?? null,
    location: event.location,
    recurrence: "weekly",
    term: termId,
  }));
}

export async function localToDBEvents(
  localEvents: LocalEvent[],
  userId: string,
): Promise<DBEvent[]> {
  const courseCodeToId = await buildCourseCodeToIdMap(
    localEvents.map((e) => e.courseCode),
  );

  return localEvents.map((event) => ({
    user: userId,
    courseCode: event.courseCode,
    course: event.course ?? courseCodeToId.get(event.courseCode) ?? null,
    type: event.type,
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime,
    days: event.days,
    term: event.term,
    recurrence: event.recurrence,
  }));
}