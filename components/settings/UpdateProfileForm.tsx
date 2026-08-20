"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { useState, useRef } from "react";
import { TextField } from "../form-fields/TextField";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  Loading3Filled,
} from "@mingcute/react/core-filled";
import { updateProfile } from "@/lib/actions/users.actions";
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
      username: user.username,
      name: user.name || "",
      major: user.major || "",
    },
  });

  const usernamePreview = form.watch("username")?.trim().toLowerCase() || "…";

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

      const result = await updateProfile(user.id, {
        username: data.username,
        name: data.name,
        major: data.major,
        avatar: avatarUrl,
      });

      if (!result.ok) {
        if (result.reason === "username_taken") {
          form.setError("username", {
            message: "That username is already taken",
          });
        } else {
          toast("Couldn't save your profile", {
            icon: <CloseCircleFilled className="text-destructive size-5" />,
          });
        }
        return;
      }

      toast("Profile updated", {
        icon: <CheckCircleFilled className="text-green-500 size-5" />,
      });
    } catch (error) {
      console.error(error);
      toast("Couldn't save your profile", {
        icon: <CloseCircleFilled className="text-destructive size-5" />,
      });
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
          name="username"
          label="Username"
          placeholder="username"
          description={
            <>
              Friends find you at{" "}
              <span className="text-foreground">
                coursecal.com/u/{usernamePreview}
              </span>
            </>
          }
        />
        <TextField
          form={form}
          name="major"
          label="Your major"
          placeholder="e.g. Mechanical Engineering"
        />

        <Button type="submit" disabled={loading} className="mt-2">
          {loading && <Loading3Filled className="size-4 animate-spin" />}
          {!loading && "Update"}
        </Button>
      </form>
    </Form>
  );
}
