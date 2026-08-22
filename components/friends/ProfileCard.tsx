import Link from "next/link";
import UserAvatar from "../UserAvatar";
import FriendButton from "./FriendButton";
import type { Profile, RelationshipStatus } from "@/lib/utils/profiles";

interface ProfileCardProps {
  profile: Profile;
  status: RelationshipStatus;
}

export default function ProfileCard({ profile, status }: ProfileCardProps) {
  return (
    // The link covers the card as an overlay rather than wrapping it, so the
    // friend button stays a sibling: nesting it inside the anchor would both
    // navigate and act on every click.
    <div className="relative flex items-center gap-3 rounded-xl border-[1.5px] p-3 shadow-xs hover:bg-muted/40 transition duration-200 ease-out focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <Link
        href={`/u/${profile.username}`}
        className="absolute inset-0 rounded-xl focus:outline-none"
      >
        <span className="sr-only">
          View {profile.name ?? profile.username}&apos;s profile
        </span>
      </Link>
      <UserAvatar
        userId={profile.id}
        avatarUrl={profile.avatar}
        name={profile.name}
      />
      <div className="min-w-0 flex-grow">
        <h3 className="font-medium block truncate">
          {profile.name ?? profile.username}
        </h3>
        <p className="text-sm text-muted-foreground truncate flex items-center gap-1.5">
          @{profile.username}
          {profile.major && <span>·</span>}
          {profile.major && <span>{profile.major}</span>}
        </p>
      </div>
      {/* Positioned so it paints above the overlay link and receives clicks. */}
      <FriendButton
        userId={profile.id}
        status={status}
        className="relative mr-2"
      />
    </div>
  );
}
