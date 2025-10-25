"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";
import { getCourseColor } from "./courseColors.actions";
import { getRandomColor } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_EVENTS_TABLE_ID: EVENTS_TABLE_ID,
  APPWRITE_COURSES_TABLE_ID: COURSES_TABLE_ID,
  APPWRITE_COURSE_COLORS_TABLE_ID: COURSE_COLORS_TABLE_ID,
} = process.env;

export async function createEvent(event: CalendarEventDB) {
  try {
    const { database } = await createAdminClient();

    const eventDoc = await database.createDocument(
      DATABASE_ID!,
      EVENTS_TABLE_ID!,
      ID.unique(),
      event
    );
    return parseStringify(eventDoc);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateEvent(
  eventId: string,
  event: Partial<CalendarEventDB>
) {
  try {
    const { database } = await createAdminClient();
    await database.updateDocument(
      DATABASE_ID!,
      EVENTS_TABLE_ID!,
      eventId,
      event
    );
    return parseStringify(event);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getEvents(userId: string, limit: number = 5000) {
  try {
    const { database } = await createAdminClient();
    const events = await database.listDocuments(
      DATABASE_ID!,
      EVENTS_TABLE_ID!,
      [Query.equal("user", [userId]), Query.limit(limit)]
    );

    // Get all unique course IDs from events (filter out null values)
    const courseIds = [
      ...new Set(
        events.documents
          .map((event) => event.course)
          .filter((courseId) => courseId !== null)
      ),
    ];

    // Fetch all courses in one query (only if there are course IDs)
    let courses: Record<string, any> = {};
    if (courseIds.length > 0) {
      const coursesResponse = await database.listDocuments(
        DATABASE_ID!,
        COURSES_TABLE_ID!,
        [Query.equal("$id", courseIds)]
      );
      courses = coursesResponse.documents.reduce((acc, course) => {
        acc[course.$id] = course;
        return acc;
      }, {} as Record<string, any>);
    }

    // Fetch course colors for each course (only if there are courses)
    let courseColorsMap: Record<string, any> = {};
    if (courseIds.length > 0) {
      // Fetch course colors for each course
      const courseColorsPromises = courseIds.map((courseId) =>
        getCourseColor(courseId, userId)
      );
      const courseColorsResponses = await Promise.all(courseColorsPromises);

      // Process the responses to create a map
      courseColorsResponses.forEach((response, index) => {
        if (response.documents && response.documents.length > 0) {
          courseColorsMap[courseIds[index]] = response.documents[0];
        }
      });
    }

    // Populate course relationships and course colors
    const eventsWithCourses = events.documents.map((event) => ({
      ...event,
      course: event.course ? courses[event.course] || null : null,
      courseColor: event.course ? courseColorsMap[event.course] || null : null,
    }));

    return parseStringify(eventsWithCourses);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(DATABASE_ID!, EVENTS_TABLE_ID!, eventId);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createBulkEvents(
  parsedEvents: ParsedEvent[],
  userId: string,
  termId: string
) {
  try {
    const { database } = await createAdminClient();

    // Filter out invalid events (same validation as original)
    const validEvents = parsedEvents.filter(
      (event) => event.days && event.recurrence && event.exclusions
    );

    if (validEvents.length === 0) {
      return { success: true, createdEvents: [], errors: [] };
    }

    // Extract unique course titles
    const uniqueTitles = [
      ...new Set(validEvents.map((event) => event.summary)),
    ];

    // Batch query for all courses at once
    let coursesMap: Record<string, any> = {};
    if (uniqueTitles.length > 0) {
      const courseQueries = uniqueTitles.map((title) =>
        Query.equal("title", title)
      );
      const coursesResponse = await database.listDocuments(
        DATABASE_ID!,
        COURSES_TABLE_ID!,
        [Query.or(courseQueries)]
      );

      // Create a map for quick lookup
      coursesMap = coursesResponse.documents.reduce((acc, course) => {
        acc[course.title] = course;
        return acc;
      }, {} as Record<string, any>);
    }

    // Prepare events for creation
    const eventsToCreate = validEvents.map((parsedEvent) => {
      const course = coursesMap[parsedEvent.summary];
      return {
        user: userId,
        course: course ? course.$id : null,
        summary: parsedEvent.summary,
        location: parsedEvent.location || "",
        startTime: parsedEvent.startTime,
        endTime: parsedEvent.endTime,
        days: parsedEvent.days,
        recurrence: parsedEvent.recurrence,
        exclusions: parsedEvent.exclusions,
        term: termId,
      } as CalendarEventDB;
    });

    // Create all events in parallel
    const eventCreationPromises = eventsToCreate.map((event) =>
      database.createDocument(
        DATABASE_ID!,
        EVENTS_TABLE_ID!,
        ID.unique(),
        event
      )
    );

    const createdEvents = await Promise.all(eventCreationPromises);

    // Collect unique course IDs that need colors
    const uniqueCourseIds = [
      ...new Set(
        eventsToCreate
          .map((event) => event.course)
          .filter((courseId): courseId is string => courseId !== null)
      ),
    ];

    // Create course colors in parallel (with duplicate handling)
    if (uniqueCourseIds.length > 0) {
      const courseColorPromises = uniqueCourseIds.map(async (courseId) => {
        try {
          // Check if course color already exists
          const existingColor = await database.listDocuments(
            DATABASE_ID!,
            COURSE_COLORS_TABLE_ID!,
            [Query.equal("course", courseId), Query.equal("user", userId)]
          );

          if (existingColor.documents.length === 0) {
            // Only create if it doesn't exist
            return database.createDocument(
              DATABASE_ID!,
              COURSE_COLORS_TABLE_ID!,
              ID.unique(),
              {
                course: courseId,
                user: userId,
                color: getRandomColor(),
              }
            );
          }
          return null; // Already exists
        } catch (error) {
          console.error(`Error creating course color for ${courseId}:`, error);
          return null;
        }
      });

      await Promise.all(courseColorPromises);
    }

    return {
      success: true,
      createdEvents: parseStringify(createdEvents),
      errors: [],
    };
  } catch (error) {
    console.error("Error in createBulkEvents:", error);
    throw error;
  }
}
