import { z } from "zod";
import { usernameSchema } from "./username";

const MEGABYTE = 1024 * 1024;
export const MAX_AVATAR_SIZE = 5 * MEGABYTE;
export const ALLOWED_AVATAR_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;
export const AVATAR_INPUT_ACCEPT = ALLOWED_AVATAR_TYPES.join(", ");

export const profileSchema = z.object({
  avatar: z.string().optional(),
  username: usernameSchema,
  name: z.string().min(1, "Name is required"),
  major: z.string().min(1, "Major is required"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function validateAvatarFile(file: File): string | null {
  if (
    !ALLOWED_AVATAR_TYPES.includes(
      file.type as (typeof ALLOWED_AVATAR_TYPES)[number],
    )
  ) {
    return "Only PNG, JPG, and WebP images are allowed";
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return "Avatar must be under 5 MB";
  }
  return null;
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target?.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function handleAvatarFileChange(
  e: React.ChangeEvent<HTMLInputElement>,
  onSelect: (file: File, dataUrl: string) => void,
): Promise<void> {
  const file = e.target.files?.[0];
  if (!file) return;

  const error = validateAvatarFile(file);
  if (error) {
    alert(error);
    return;
  }

  try {
    const dataUrl = await readFileAsDataURL(file);
    onSelect(file, dataUrl);
  } catch {
    alert("Failed to read image");
  }
}
