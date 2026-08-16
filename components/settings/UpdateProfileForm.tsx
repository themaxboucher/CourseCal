"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { useState, useRef } from "react";
import { TextField } from "../form-fields/TextField";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { updateUser } from "@/lib/actions/users.actions";
import { uploadAvatar } from "@/lib/actions/avatars.actions";
import { Label } from "../ui/label";
import { toast } from "sonner";
import {
  AVATAR_INPUT_ACCEPT,
  handleAvatarFileChange,
  profileSchema,
  type ProfileFormData,
} from "@/lib/utils/profile";
import type { Tables } from "@/types/supabase";
import UserAvatar from "../UserAvatar";

export default function UpdateProfileForm({ user }: { user: Tables<"users"> }) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatar || null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // `uploadAvatar` overwrites any existing avatar at the same path,
      // so there is no need to delete the previous file ourselves.
      const avatarUrl = avatarFile
        ? await uploadAvatar(avatarFile, user.id)
        : user.avatar;

      await updateUser(user.id, {
        name: data.name,
        major: data.major,
        avatar: avatarUrl,
      });
      toast("Profile updated", {
        icon: <CircleCheck className="text-green-500 size-5" />,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      let errorMessage = "Error updating personal details";
      if (message.includes("already exists")) {
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
          <Label>Your avatar</Label>
          <div className="flex items-center gap-2">
            <UserAvatar avatarUrl={avatarPreview} name={user.name} />
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Pick an image
            </Button>
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

        <Button type="submit" disabled={loading} className="mt-2">
          {loading && <LoaderCircle className="size-4 animate-spin" />}
          {!loading && "Update"}
        </Button>
      </form>
    </Form>
  );
}
