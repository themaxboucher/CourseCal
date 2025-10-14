"use server";

import { Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_COURSES_TABLE_ID: COURSES_TABLE_ID,
} = process.env;

export async function getCourses(limit: number = 10, search?: string) {
  try {
    const { database } = await createAdminClient();

    let queries = [Query.limit(limit)];

    if (search && search.trim()) {
      // Search in subjectCode, subject, and title
      queries.push(
        Query.or([
          Query.contains("subjectCode", search),
          Query.contains("subject", search),
        ])
      );
    }

    const courses = await database.listDocuments(
      DATABASE_ID!,
      COURSES_TABLE_ID!,
      queries
    );
    return parseStringify(courses);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCourseFromTitle(title: string) {
  try {
    const { database } = await createAdminClient();
    const course = await database.listDocuments(
      DATABASE_ID!,
      COURSES_TABLE_ID!,
      [Query.equal("title", [title])]
    );

    // Return null if no course found, otherwise parse the first document
    if (!course.documents || course.documents.length === 0) {
      return null;
    }

    return parseStringify(course.documents[0]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
