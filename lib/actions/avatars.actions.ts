"use server";

import { ID } from "node-appwrite";
import { createStorageClient } from "../appwrite/server";

const {
  NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID: AVATAR_BUCKET_ID,
  NEXT_PUBLIC_APPWRITE_ENDPOINT: APPWRITE_ENDPOINT,
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: APPWRITE_PROJECT_ID,
} = process.env;

export async function uploadAvatar(file: File): Promise<string> {
  try {
    const storage = await createStorageClient();

    const uploaded = await storage.createFile(
      AVATAR_BUCKET_ID!,
      ID.unique(),
      file
    );

    // The URL format for Appwrite file preview
    const avatarUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${AVATAR_BUCKET_ID}/files/${uploaded.$id}/preview?project=${APPWRITE_PROJECT_ID}`;

    return avatarUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error("Failed to upload avatar. Please try again.");
  }
}

export async function deleteAvatar(fileId: string): Promise<void> {
  try {
    const storage = await createStorageClient();

    await storage.deleteFile(AVATAR_BUCKET_ID!, fileId);
  } catch (error) {
    console.error("Error deleting avatar from Appwrite Storage:", error);
    throw new Error("Failed to delete avatar. Please try again.");
  }
}

export async function extractFileIdFromUrl(
  avatarUrl: string
): Promise<string | null> {
  // Extract fileId from the avatar URL
  const match = avatarUrl.match(/files\/([^/]+)\/preview/);
  return match ? match[1] : null;
}
