"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_EVENTS_TABLE_ID: EVENTS_TABLE_ID,
  APPWRITE_COURSES_TABLE_ID: COURSES_TABLE_ID,
} = process.env;

export async function createEvent(event: CalendarEvent) {
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

export async function getEvents(userId: string) {
  try {
    const { database } = await createAdminClient();
    const events = await database.listDocuments(
      DATABASE_ID!,
      EVENTS_TABLE_ID!,
      [Query.equal("user", [userId])]
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

    // Populate course relationships
    const eventsWithCourses = events.documents.map((event) => ({
      ...event,
      course: event.course ? courses[event.course] || null : null,
    }));

    return parseStringify(eventsWithCourses);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
