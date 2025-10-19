"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/server";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { deleteAvatar, extractFileIdFromUrl } from "./avatars.actions";

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

export async function loginWithMagicLink(userId: string, secret: string) {
  try {
    const { account } = await createAdminClient();
    const session = await account.updateMagicURLSession(userId, secret);

    // Set the session cookie
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getAuthUser();
    return user;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession({ sessionId: "current" });
    (await cookies()).delete("appwrite-session");
    return true;
  } catch (error) {
    console.error(error);
    return false;
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

    return userDocument;
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
    const { database, user } = await createAdminClient();
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
        await user.updateName(id, name);
      }
      if (currentEmail !== email) {
        await user.updateEmail(id, email);
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

export async function deleteAccount(
  authUserId: string,
  docUserId: string,
  avatarUrl?: string
) {
  try {
    const { database, user } = await createAdminClient();

    // Delete the user's avatar if it exists
    try {
      if (avatarUrl) {
        const avatarId = await extractFileIdFromUrl(avatarUrl);
        if (avatarId) {
          await deleteAvatar(avatarId);
        }
      }
    } catch (avatarError) {
      console.error("Failed to delete user avatar:", avatarError);
      // Continue with account deletion even if avatar deletion fails
    }

    // Delete the user document
    await database.deleteDocument(DATABASE_ID!, USERS_TABLE_ID!, docUserId);
    // Delete the user from the auth users table
    await user.delete(authUserId);

    // Clear the session cookie since the account no longer exists
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Update boolean flags on the user document by document ID
export const setUserFlags = async (
  docUserId: string,
  flags: Partial<Pick<User, "hasCompletedOnboarding" | "hasBeenWelcomed">>
) => {
  try {
    const { database } = await createAdminClient();
    const updated = await database.updateDocument(
      DATABASE_ID!,
      USERS_TABLE_ID!,
      docUserId,
      flags
    );
    return parseStringify(updated);
  } catch (error) {
    console.error("Error updating user flags:", error);
    throw error;
  }
};

export const markOnboardingCompleted = async (docUserId: string) => {
  return setUserFlags(docUserId, { hasCompletedOnboarding: true });
};

export const markUserWelcomed = async (docUserId: string) => {
  return setUserFlags(docUserId, { hasBeenWelcomed: true });
};
