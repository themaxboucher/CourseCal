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
      // Search in subjectCode, subject, title, and description
      queries.push(
        Query.or([
          Query.contains("subjectCode", search),
          Query.contains("subject", search),
          Query.contains("title", search),
          Query.contains("description", search),
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
