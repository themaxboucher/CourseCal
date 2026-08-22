import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeftFilled,
  CalendarXFilled,
  LockFilled,
} from "@/components/icons";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import FriendButton from "@/components/friends/FriendButton";
import WeekView from "@/components/schedule/WeekView";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import {
  getPendingRequestCount,
  getRelationship,
} from "@/lib/actions/friends.actions";
import { getProfileByUsername } from "@/lib/actions/profiles.actions";
import { getEvents } from "@/lib/actions/events.actions";
import { getTerms } from "@/lib/actions/terms.actions";
import { getRelevantTerm } from "@/lib/utils/schedule";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/");
  }

  const profile = await getProfileByUsername(username);
  if (!profile) {
    notFound();
  }

  const [status, pendingCount] = await Promise.all([
    getRelationship(profile.id),
    getPendingRequestCount(),
  ]);
  const isSelf = status === "self";
  const isFriend = status === "friends";

  return (
    <>
      <Navbar
        isLoggedIn={true}
        user={user}
        pendingRequestCount={pendingCount}
      />
      <section className="flex flex-col gap-2 max-w-[70rem] mx-auto px-4 md:px-8 py-12">
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/friends">
                <ArrowLeftFilled className="size-6" />
              </Link>
            </Button>
            <h1 className="heading-3">Profile</h1>
          </div>

          <div className="flex items-start gap-4">
            <UserAvatar
              avatarUrl={profile.avatar}
              name={profile.name}
              size="lg"
            />
            <div className="min-w-0 flex-grow space-y-1">
              <p className="text-xl font-medium truncate">
                {profile.name ?? profile.username}
              </p>
              <p className="text-muted-foreground truncate">
                @{profile.username}
              </p>
              {profile.major && (
                <p className="text-muted-foreground truncate">
                  {profile.major}
                </p>
              )}
            </div>
            {isSelf ? (
              <Button variant="outline" size="sm" asChild>
                <Link href="/settings">Edit profile</Link>
              </Button>
            ) : (
              <FriendButton userId={profile.id} status={status} />
            )}
          </div>

          {isSelf || isFriend ? (
            <FriendSchedule
              userId={profile.id}
              name={profile.name ?? profile.username}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 px-6 text-center">
              <LockFilled className="size-8 text-muted-foreground" />
              <div className="space-y-1">
                <p className="font-medium">Schedule is private</p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {status === "outgoing_pending"
                    ? `Once ${profile.name ?? profile.username} accepts, you'll see their week here.`
                    : `You'll see ${profile.name ?? profile.username}'s week once you're friends.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/**
 * Read-only week. `WeekView` only renders editable events when it is handed a
 * user or told it is a guest, so passing neither is what makes this view safe
 * to show for somebody else's schedule.
 */
async function FriendSchedule({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  const [terms, events] = await Promise.all([getTerms(), getEvents(userId)]);
  const term = getRelevantTerm(terms);
  const termEvents = events.filter((event) => event.term === term.id);

  if (termEvents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-12 px-6 text-center">
        <CalendarXFilled className="size-8 text-muted-foreground" />
        <div className="space-y-1">
          <p className="font-medium">No schedule for this term</p>
          <p className="text-sm text-muted-foreground max-w-sm">
            {name} hasn&apos;t uploaded a schedule for{" "}
            <span className="capitalize">{term.season}</span> {term.year} yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="font-medium">
        <span className="capitalize">{term.season}</span> {term.year}
      </h2>
      <WeekView events={termEvents} />
    </div>
  );
}
