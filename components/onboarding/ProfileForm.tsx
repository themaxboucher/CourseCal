"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useRef } from "react";
import { TextField } from "../form-fields/TextField";
import { LoaderCircle, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadAvatar } from "@/lib/actions/avatars.actions";
import { updateUser } from "@/lib/actions/users.actions";
import {
  AVATAR_INPUT_ACCEPT,
  handleAvatarFileChange,
  profileSchema,
  type ProfileFormData,
} from "@/lib/utils/profile";
import type { Tables } from "@/types/supabase";

export default function ProfileForm({ user }: { user: Tables<"users"> }) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar || null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatar: user.avatar || undefined,
      name: user.name || "",
      major: user.major || "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAvatarFileChange(e, (file, dataUrl) => {
      setAvatarFile(file);
      setAvatarPreview(dataUrl);
      form.setValue("avatar", dataUrl);
    });
  };

  async function onSubmit(data: ProfileFormData) {
    setLoading(true);
    try {
      const avatarUrl = avatarFile
        ? await uploadAvatar(avatarFile, user.id)
        : user.avatar;

      await updateUser(user.id, {
        name: data.name,
        major: data.major,
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
              accept={AVATAR_INPUT_ACCEPT}
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
