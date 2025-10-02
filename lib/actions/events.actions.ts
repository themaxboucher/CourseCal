"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_EVENTS_TABLE_ID: EVENTS_TABLE_ID,
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
