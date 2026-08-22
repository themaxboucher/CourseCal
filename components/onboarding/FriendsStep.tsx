"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loading3Filled } from "@/components/icons";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/friends/ProfileCard";
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
  /** Shown only when neither signal produced a suggestion. */
  fallback: Profile[];
  relationships: Record<string, RelationshipStatus>;
  termLabel: string;
}

// Why this person is being suggested, in the reader's words.
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
  fallback,
  relationships,
  termLabel,
}: FriendsStepProps) {
  const router = useRouter();
  const [finishing, setFinishing] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  // A suggestion can qualify on both signals; the mutual-friends section runs
  // first, so it claims those. Nobody is listed twice.
  const mutuals = suggestions
    .filter((suggestion) => suggestion.mutualFriends > 0)
    .sort((a, b) => b.mutualFriends - a.mutualFriends);
  const classmates = suggestions.filter(
    (suggestion) => suggestion.mutualFriends === 0,
  );

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

  return (
    <div className="mx-auto w-full max-w-md space-y-8">
      {referrer && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Invited you</p>
          <ProfileCard
            profile={referrer}
            status={referrerStatus}
            linkToProfile={false}
            onActionComplete={() => setAddedCount((count) => count + 1)}
          />
        </div>
      )}

      {mutuals.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Mutual friends</p>
          <div className="space-y-2">
            {mutuals.map((suggestion) => (
              <ProfileCard
                key={suggestion.id}
                profile={suggestion}
                status={relationships[suggestion.id] ?? "none"}
                subtitle={reasonFor(suggestion, termLabel) || undefined}
                linkToProfile={false}
                onActionComplete={() => setAddedCount((count) => count + 1)}
              />
            ))}
          </div>
        </div>
      )}

      {classmates.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">People in your classes</p>
          <div className="space-y-2">
            {classmates.map((suggestion) => (
              <ProfileCard
                key={suggestion.id}
                profile={suggestion}
                status={relationships[suggestion.id] ?? "none"}
                // Falls back to the card's own "@username · major" line when
                // there is no shared course or mutual friend to point at.
                subtitle={reasonFor(suggestion, termLabel) || undefined}
                linkToProfile={false}
                onActionComplete={() => setAddedCount((count) => count + 1)}
              />
            ))}
          </div>
        </div>
      )}

      {fallback.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">People on CourseCal</p>
          <div className="space-y-2">
            {fallback.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                status={relationships[profile.id] ?? "none"}
                linkToProfile={false}
                onActionComplete={() => setAddedCount((count) => count + 1)}
              />
            ))}
          </div>
        </div>
      )}

      <InviteLink username={username} />

      {addedCount > 0 ? (
        <Button className="w-full" onClick={finish} disabled={finishing}>
          {finishing && <Loading3Filled className="size-4 animate-spin" />}
          {!finishing && "Continue"}
        </Button>
      ) : (
        <Button
          className="w-full"
          variant="outline"
          onClick={finish}
          disabled={finishing}
        >
          {finishing && <Loading3Filled className="size-4 animate-spin" />}
          {!finishing && "Skip for now"}
        </Button>
      )}
    </div>
  );
}
