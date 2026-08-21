"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GroupFilled,
  Loading3Filled,
  UserSearchFilled,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import FriendButton from "@/components/friends/FriendButton";
import InviteLink from "./InviteLink";
import { completeOnboarding } from "@/lib/actions/onboarding.actions";
import type {
  Profile,
  RelationshipStatus,
  SuggestedFriend,
} from "@/lib/utils/profiles";

interface FriendsStepProps {
  username: string;
  /** Whoever shared the invite link this account arrived through. */
  referrer: Profile | null;
  referrerStatus: RelationshipStatus;
  suggestions: SuggestedFriend[];
  relationships: Record<string, RelationshipStatus>;
  termLabel: string;
}

/** Why this person is being suggested, in the reader's words. */
function reasonFor(suggestion: SuggestedFriend, termLabel: string): string {
  const parts: string[] = [];
  if (suggestion.sharedCourses > 0) {
    parts.push(
      `${suggestion.sharedCourses} shared ${suggestion.sharedCourses === 1 ? "course" : "courses"} in ${termLabel}`,
    );
  }
  if (suggestion.mutualFriends > 0) {
    parts.push(
      `${suggestion.mutualFriends} mutual ${suggestion.mutualFriends === 1 ? "friend" : "friends"}`,
    );
  }
  return parts.join(" · ");
}

export default function FriendsStep({
  username,
  referrer,
  referrerStatus,
  suggestions,
  relationships,
  termLabel,
}: FriendsStepProps) {
  const router = useRouter();
  const [finishing, setFinishing] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  async function finish() {
    setFinishing(true);
    try {
      await completeOnboarding();
      router.push("/schedule");
    } catch (error) {
      console.error(error);
      // Onboarding must never be a dead end — send them on regardless. The
      // proxy will route them back here if the flag genuinely did not save.
      router.push("/schedule");
    }
  }

  const hasAnything = referrer !== null || suggestions.length > 0;

  return (
    <div className="w-full max-w-md space-y-8">
      {referrer && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Invited you</p>
          <div className="flex items-center gap-3 rounded-lg border p-3 shadow-xs">
            <Link href={`/u/${referrer.username}`} className="shrink-0">
              <UserAvatar avatarUrl={referrer.avatar} name={referrer.name} />
            </Link>
            <div className="min-w-0 flex-grow">
              <p className="truncate font-medium">
                {referrer.name ?? referrer.username}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                @{referrer.username}
              </p>
            </div>
            <FriendButton
              userId={referrer.id}
              status={referrerStatus}
              onActionComplete={() => setAddedCount((count) => count + 1)}
            />
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">People in your classes</p>
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-center gap-3 rounded-lg border p-3 shadow-xs"
              >
                <Link href={`/u/${suggestion.username}`} className="shrink-0">
                  <UserAvatar
                    avatarUrl={suggestion.avatar}
                    name={suggestion.name}
                  />
                </Link>
                <div className="min-w-0 flex-grow">
                  <p className="truncate font-medium">
                    {suggestion.name ?? suggestion.username}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {reasonFor(suggestion, termLabel) ||
                      `@${suggestion.username}`}
                  </p>
                </div>
                <FriendButton
                  userId={suggestion.id}
                  status={relationships[suggestion.id] ?? "none"}
                  onActionComplete={() => setAddedCount((count) => count + 1)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasAnything && (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-10 text-center">
          <GroupFilled className="size-8 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-medium">Nobody to suggest yet</p>
            <p className="text-sm text-muted-foreground">
              Once classmates join, they&apos;ll show up here. Send them your
              link below to get started.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/friends?tab=discover">
              <UserSearchFilled className="size-4" />
              Browse everyone
            </Link>
          </Button>
        </div>
      )}

      <InviteLink username={username} />

      <Button className="w-full" onClick={finish} disabled={finishing}>
        {finishing && <Loading3Filled className="size-4 animate-spin" />}
        {!finishing && (addedCount > 0 ? "Continue" : "Skip for now")}
      </Button>
    </div>
  );
}
