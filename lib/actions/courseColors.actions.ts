"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_COURSE_COLORS_TABLE_ID: COURSE_COLORS_TABLE_ID,
} = process.env;

export async function getCourseColor(courseId: string, userId: string) {
  try {
    const { database } = await createAdminClient();
    const courseColorDoc = await database.listDocuments(
      DATABASE_ID!,
      COURSE_COLORS_TABLE_ID!,
      [Query.equal("course", [courseId]), Query.equal("user", [userId])]
    );
    return parseStringify(courseColorDoc);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createCourseColor(
  courseColor: Omit<UserCourseColor, keyof AppwriteDoc>
) {
  try {
    const { database } = await createAdminClient();
    const courseColorDoc = await database.createDocument(
      DATABASE_ID!,
      COURSE_COLORS_TABLE_ID!,
      ID.unique(),
      courseColor
    );
    return parseStringify(courseColorDoc);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateCourseColor(courseColor: CourseColorDB) {
  try {
    const { database } = await createAdminClient();
    const courseColorDoc = await database.updateDocument(
      DATABASE_ID!,
      COURSE_COLORS_TABLE_ID!,
      courseColor.$id,
      courseColor
    );
    return parseStringify(courseColorDoc);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
