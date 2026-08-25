"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState, useRef } from "react";
import { TextField } from "../form-fields/TextField";
import {
  CloseCircleFilled,
  Loading3Filled,
  UserFilled,
} from "@/components/icons";
import { useRouter } from "next/navigation";
import { uploadAvatar } from "@/lib/actions/avatars.actions";
import { updateProfile } from "@/lib/actions/users.actions";
import {
  AVATAR_INPUT_ACCEPT,
  handleAvatarFileChange,
  profileSchema,
  type ProfileFormData,
} from "@/lib/utils/profile";
import type { Tables } from "@/types/supabase";
import { getEvents } from "@/lib/actions/events.actions";
import { toast } from "sonner";

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
      // Every account already has a generated username from the signup
      // trigger, so this field starts filled rather than empty.
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

      // The friends step ranks suggestions from the user's own course list, so
      // it only has anything to show once a schedule exists. Onboarding is
      // completed there, not here.
      const events = await getEvents(user.id);
      router.push(
        events.length > 0 ? "/onboarding/friends" : "/onboarding/upload",
      );
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
        className="space-y-4 max-w-64 w-full"
      >
        <div className="space-y-2">
          <div className="flex flex-col items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <Avatar className="size-24 border border-border">
                <AvatarImage
                  className="object-cover shadow-inner"
                  src={avatarPreview || undefined}
                />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <UserFilled className="size-10" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm underline">Pick an image</div>
            </button>

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

        <Button type="submit" disabled={loading} className="mt-2 w-full">
          {loading && <Loading3Filled className="size-4 animate-spin" />}
          {!loading && "Continue"}
        </Button>
      </form>
    </Form>
  );
}
