"use server";

import { Account, Client, ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/server";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

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

export async function getAuthUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return user;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const userAccount = await account.get();
    const userDocument = await getUser(userAccount.$id);

    return parseStringify(userDocument);
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getUser(id: string) {
  try {
    const { database } = await createAdminClient();
    const userDoc = await database.listDocuments(
      DATABASE_ID!,
      USERS_TABLE_ID!,
      [Query.equal("userId", [id])]
    );
    return parseStringify(userDoc.documents[0]);
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function createUser(user: {
  userId: string;
  email: string;
  hasCompletedOnboarding: boolean;
  hasBeenWelcomed: boolean;
}) {
  try {
    const { database, user: users } = await createAdminClient();
    const userDoc = await database.createDocument(
      DATABASE_ID!,
      USERS_TABLE_ID!,
      ID.unique(),
      user
    );
    return parseStringify(userDoc);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const updateUser = async ({
  id,
  name,
  major,
  email,
  avatar,
}: {
  id: string;
  name: string;
  major: string;
  email: string;
  avatar?: string;
}) => {
  // Check if the email is a valid UCalgary email
  if (!email.toLowerCase().endsWith("@ucalgary.ca")) {
    throw new Error("Invalid email");
  }

  try {
    const { database, user: users } = await createAdminClient();
    // Find the user document
    const userDoc = await database.listDocuments(
      DATABASE_ID!,
      USERS_TABLE_ID!,
      [Query.equal("userId", [id])]
    );
    const docId = userDoc.documents[0]?.$id;
    if (!docId) throw new Error("User document not found");

    // Get current values from the user document
    const currentEmail = userDoc.documents[0]?.email;
    const currentName = userDoc.documents[0]?.name;
    // Update the Appwrite Auth user (name and email) only if changed
    try {
      if (currentName !== name) {
        await users.updateName(id, name);
      }
      if (currentEmail !== email) {
        await users.updateEmail(id, email);
      }
    } catch (authError: any) {
      console.error("Error updating Appwrite Auth user:", authError);
      throw authError;
    }

    // Update the user document
    const updated = await database.updateDocument(
      DATABASE_ID!,
      USERS_TABLE_ID!,
      docId,
      { name, major, email, avatar }
    );
    return parseStringify(updated);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
