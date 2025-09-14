"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USERS_TABLE_ID: USERS_TABLE_ID,
} = process.env;

export async function sendMagicLink(email: string) {
  // Check if the email is a valid UCalgary email
  if (!email.toLowerCase().endsWith("@ucalgary.ca")) {
    throw new Error("Invalid email");
  }

  try {
    const { account } = await createAdminClient();

    const result = await account.createMagicURLToken(
      ID.unique(),
      email,
      `${process.env.NEXT_PUBLIC_SITE_URL!}/verify`
    );

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
