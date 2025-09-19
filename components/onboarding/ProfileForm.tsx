"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useRef } from "react";
import { TextField } from "../form-fields/TextField";
import { LoaderCircle, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/users.actions";
import { uploadAvatar, deleteAvatar } from "@/lib/appwrite/client";

const profileSchema = z.object({
  avatar: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  major: z.string().min(1, "Major is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm({ user }: { user: User }) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatar: undefined,
      name: "",
      major: "",
    },
  });

  const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB
  const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg"];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
        alert("Only PNG and JPG images are allowed");
        return;
      }
      if (file.size > MAX_AVATAR_SIZE) {
        alert("Avatar must be under 2 MB");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
        form.setValue("avatar", ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: ProfileFormData) {
    setLoading(true);
    try {
      let avatarUrl;
      let oldAvatarFileId: string | null = null;
      if (user.avatar) {
        // Extract fileId from the old avatar URL
        const match = user.avatar.match(/files\/([^/]+)\/preview/);
        if (match) {
          oldAvatarFileId = match[1];
        }
      }
      if (avatarFile) {
        // Upload new avatar
        avatarUrl = await uploadAvatar(avatarFile);
        // Delete old avatar if it exists
        if (oldAvatarFileId) {
          try {
            await deleteAvatar(oldAvatarFileId);
          } catch (error) {
            console.error("Failed to delete old avatar:", error);
          }
        }
      }
      await updateUser({
        id: user.$id,
        name: data.name,
        major: data.major,
        email: user.email,
        avatar: avatarUrl,
      });
      router.push("/onboarding/upload");
    } catch (error: any) {
      let errorMessage = "Error updating personal details";
      if (error?.message?.includes("already exists")) {
        errorMessage = "An account with this email already exists";
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-sm w-full"
      >
        <div className="space-y-2">
          <div className="flex flex-col items-center gap-2 mb-2">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Avatar className="size-24 border border-border">
                <AvatarImage
                  className="object-cover shadow-inner"
                  src={avatarPreview || undefined}
                />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <UserRound className="size-10" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm underline">Pick an image</div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
        <TextField
          form={form}
          name="name"
          label="Your name"
          placeholder="Name"
        />
        <TextField
          form={form}
          name="major"
          label="Your major"
          placeholder="e.g. Mechanical Engineering"
        />

        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading && <LoaderCircle className="size-4 animate-spin" />}
          {!loading && "Continue"}
        </Button>
      </form>
    </Form>
  );
}
