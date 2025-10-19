"use server";

import { Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";
import { getCourseColor } from "./courseColors.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_COURSES_TABLE_ID: COURSES_TABLE_ID,
} = process.env;

export async function getCourses(
  limit: number = 10,
  search?: string,
  userId?: string
) {
  try {
    const { database } = await createAdminClient();

    let queries = [Query.limit(limit)];

    if (search && search.trim()) {
      const hasNumbers = /\d+/.test(search);

      if (hasNumbers) {
        // Search by both subjectCode and catalog number when numbers are present
        const numberMatch = search.match(/\d+/);
        if (numberMatch) {
          const catalogNum = parseInt(numberMatch[0]);
          queries.push(
            Query.or([
              Query.contains("subjectCode", search),
              Query.equal("catalogNumber", catalogNum),
            ])
          );
        } else {
          // Fallback to subjectCode only if no valid number found
          queries.push(Query.contains("subjectCode", search));
        }
      } else {
        // Search by subjectCode only when no numbers are present
        queries.push(Query.contains("subjectCode", search));
      }
    }

    const courses = await database.listDocuments(
      DATABASE_ID!,
      COURSES_TABLE_ID!,
      queries
    );

    // Fetch course colors for each course (if there are any)
    let coursesWithColors = courses.documents;

    if (userId && courses.documents.length > 0) {
      // Get all course IDs
      const courseIds = courses.documents.map((course) => course.$id);

      // Fetch course colors for each course
      const courseColorsPromises = courseIds.map((courseId) =>
        getCourseColor(courseId, userId)
      );
      const courseColorsResponses = await Promise.all(courseColorsPromises);

      // Create a map of course colors
      const courseColorsMap: Record<string, any> = {};
      courseColorsResponses.forEach((response, index) => {
        if (response.documents && response.documents.length > 0) {
          courseColorsMap[courseIds[index]] = response.documents[0];
        }
      });

      // Attach course colors to courses
      coursesWithColors = courses.documents.map((course) => ({
        ...course,
        color: courseColorsMap[course.$id] || null,
      }));
    }

    return parseStringify(coursesWithColors);
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
