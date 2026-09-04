import type { ReactNode } from "react";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import FriendButton, { type FriendSurface } from "./FriendButton";
import { cn } from "@/lib/utils";
import type { Profile, RelationshipStatus } from "@/lib/utils/profiles";

interface ProfileCardProps {
  profile: Profile;
  status: RelationshipStatus;
  /** Passed straight to the card's `FriendButton`. */
  surface: FriendSurface;
  subtitle?: ReactNode;
  linkToProfile?: boolean;
  onActionComplete?: (status: RelationshipStatus) => void;
}

export default function ProfileCard({
  profile,
  status,
  surface,
  subtitle,
  linkToProfile = true,
  onActionComplete,
}: ProfileCardProps) {
  // Built as a string rather than flex-gapped spans: `text-overflow: ellipsis`
  // is ignored on a flex container, so a flex subtitle would clip mid-word
  // instead of truncating once the card gets narrow.
  const defaultSubtitle = profile.major
    ? `@${profile.username} · ${profile.major}`
    : `@${profile.username}`;

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-xl border-[1.5px] p-3 shadow-xs transition duration-200 ease-out",
        // Only a card that goes somewhere gets the affordances of one.
        linkToProfile &&
          "hover:bg-muted/40 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      )}
    >
      {/* The link covers the card as an overlay rather than wrapping it, so the
          friend button stays a sibling: nesting it inside the anchor would both
          navigate and act on every click. */}
      {linkToProfile && (
        <Link
          href={`/u/${profile.username}`}
          className="absolute inset-0 rounded-xl focus:outline-none"
        >
          <span className="sr-only">
            View {profile.name ?? profile.username}&apos;s profile
          </span>
        </Link>
      )}
      <UserAvatar
        userId={profile.id}
        avatarUrl={profile.avatar}
        name={profile.name}
      />
      <div className="min-w-0 flex-grow">
        <h3 className="font-medium block truncate">
          {profile.name ?? profile.username}
        </h3>
        <p className="text-sm text-muted-foreground truncate">
          {subtitle ?? defaultSubtitle}
        </p>
      </div>
      {/* Positioned so it paints above the overlay link and receives clicks. */}
      <FriendButton
        userId={profile.id}
        status={status}
        surface={surface}
        className="relative mr-2"
        onActionComplete={onActionComplete}
      />
    </div>
  );
}
