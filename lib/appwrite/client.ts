"use client";

import { Client, ID, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const storage = new Storage(client);

export async function uploadAvatar(file: File): Promise<string> {
  try {
    const uploaded = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID!,
      ID.unique(),
      file
    );
    return storage
      .getFilePreview(
        process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID!,
        uploaded.$id
      )
      .toString();
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error("Failed to upload avatar. Please try again.");
  }
}

export async function deleteAvatar(fileId: string): Promise<void> {
  const storage = new Storage(client);
  try {
    await storage.deleteFile(
      process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID!,
      fileId
    );
  } catch (error) {
    console.error("Error deleting avatar from Appwrite Storage:", error);
    throw new Error("Failed to delete avatar. Please try again.");
  }
}
