"use server";

import { createClient } from "../supabase/server";

export async function uploadAvatar(file: File, userId: string) {
  const supabase = await createClient();

  const filePath = `${userId}/avatar`;

  const { data: existing } = await supabase.storage
    .from("avatars")
    .list(userId, { search: "avatar", limit: 1 });

  const fileExists = existing && existing.length > 0;

  const { error } = fileExists
    ? await supabase.storage
        .from("avatars")
        .update(filePath, file, { upsert: true })
    : await supabase.storage.from("avatars").upload(filePath, file);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  // Every upload lands on the same path, so the public URL is identical each
  // time and browsers keep showing the previous image until Storage's
  // `max-age` expires. The version stamp gives the new file its own cache key
  // without giving up caching for everyone who is only viewing avatars.
  return `${publicUrl}?v=${Date.now()}`;
}
