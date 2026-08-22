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
    <Link
      href={`/u/${profile.username}`}
      className="flex items-center gap-3 rounded-xl border-[1.5px] p-3 shadow-xs hover:bg-muted/40 transition duration-200 ease-out"
    >
      <UserAvatar avatarUrl={profile.avatar} name={profile.name} />
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
      <FriendButton userId={profile.id} status={status} className="mr-2" />
    </Link>
  );
}
