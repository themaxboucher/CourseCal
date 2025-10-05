"use server";

import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TERMS_TABLE_ID: TERMS_TABLE_ID,
} = process.env;

export async function getTerms() {
  try {
    const { database } = await createAdminClient();
    const terms = await database.listDocuments(DATABASE_ID!, TERMS_TABLE_ID!);
    return parseStringify(terms.documents);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
