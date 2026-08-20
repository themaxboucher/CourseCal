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
    <div className="flex items-center gap-3 rounded-lg border p-3 shadow-xs">
      <Link href={`/u/${profile.username}`} className="shrink-0">
        <UserAvatar avatarUrl={profile.avatar} name={profile.name} />
      </Link>
      <div className="min-w-0 flex-grow">
        <Link
          href={`/u/${profile.username}`}
          className="font-medium hover:underline block truncate"
        >
          {profile.name ?? profile.username}
        </Link>
        <p className="text-sm text-muted-foreground truncate">
          @{profile.username}
          {profile.major ? ` · ${profile.major}` : ""}
        </p>
      </div>
      <FriendButton userId={profile.id} status={status} />
    </div>
  );
}
