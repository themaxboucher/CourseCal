import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeftFilled,
  GroupFilled,
  UserSearchFilled,
} from "@/components/icons";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import DirectorySearch from "@/components/friends/DirectorySearch";
import ProfileCard from "@/components/friends/ProfileCard";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import {
  getFriends,
  getIncomingRequests,
  getOutgoingRequests,
  getPendingRequestCount,
  getRelationshipMap,
} from "@/lib/actions/friends.actions";
import { browseProfiles, searchProfiles } from "@/lib/actions/profiles.actions";
import type { ProfilePage } from "@/lib/utils/profiles";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "friends", label: "Friends" },
  { key: "requests", label: "Requests" },
  { key: "discover", label: "Discover" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface FriendsPageProps {
  searchParams: Promise<{ tab?: string; q?: string; page?: string }>;
}

export default async function FriendsPage({ searchParams }: FriendsPageProps) {
  const { tab, q, page } = await searchParams;
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/");
  }

  const activeTab: TabKey = TABS.some((entry) => entry.key === tab)
    ? (tab as TabKey)
    : "friends";
  const query = q?.trim() ?? "";
  const pageIndex = Math.max(0, Number.parseInt(page ?? "0", 10) || 0);

  const pendingCount = await getPendingRequestCount();

  return (
    <>
      <Navbar
        isLoggedIn={true}
        user={user}
        pendingRequestCount={pendingCount}
      />
      <section className="flex flex-col gap-2 max-w-[45rem] mx-auto px-4 md:px-8 py-4 md:py-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/schedule">
                <ArrowLeftFilled className="size-6" />
              </Link>
            </Button>
            <h1 className="heading-3">Friends</h1>
          </div>

          <nav className="flex items-center gap-1 border-b-[1.5px]">
            {TABS.map((entry) => {
              const isActive = entry.key === activeTab;
              return (
                <Link
                  key={entry.key}
                  href={`/friends?tab=${entry.key}`}
                  className={cn(
                    "relative -mb-px px-3 py-2 text-sm font-medium border-b-2 transition-colors",
                    isActive
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {entry.label}
                  {entry.key === "requests" && pendingCount > 0 && (
                    <span className="ml-1.5 inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {activeTab === "friends" && <FriendsTab />}
          {activeTab === "requests" && <RequestsTab />}
          {activeTab === "discover" && (
            <DiscoverTab query={query} pageIndex={pageIndex} />
          )}
        </div>
      </section>
    </>
  );
}

async function FriendsTab() {
  const friends = await getFriends();

  if (friends.length === 0) {
    return (
      <EmptyState
        icon={<GroupFilled className="size-8 text-muted-foreground" />}
        title="No friends yet"
        body="Find classmates in Discover, then overlay their schedule on yours to see when you're both free."
        action={
          <Button asChild size="sm">
            <Link href="/friends?tab=discover">Find people</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-2">
      {friends.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} status="friends" />
      ))}
    </div>
  );
}

async function RequestsTab() {
  const [incoming, outgoing] = await Promise.all([
    getIncomingRequests(),
    getOutgoingRequests(),
  ]);

  if (incoming.length === 0 && outgoing.length === 0) {
    return (
      <EmptyState
        icon={<UserSearchFilled className="size-8 text-muted-foreground" />}
        title="Nothing waiting"
        body="Friend requests you send and receive will show up here."
      />
    );
  }

  return (
    <div className="space-y-8">
      {incoming.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-medium">Waiting on you</h2>
          {incoming.map((request) => (
            <ProfileCard
              key={request.friendshipId}
              profile={request.profile}
              status="incoming_pending"
            />
          ))}
        </div>
      )}
      {outgoing.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-medium">Sent</h2>
          {outgoing.map((request) => (
            <ProfileCard
              key={request.friendshipId}
              profile={request.profile}
              status="outgoing_pending"
            />
          ))}
        </div>
      )}
    </div>
  );
}

async function DiscoverTab({
  query,
  pageIndex,
}: {
  query: string;
  pageIndex: number;
}) {
  const result: ProfilePage = query
    ? await searchProfiles(query, pageIndex)
    : await browseProfiles(pageIndex);
  const relationships = await getRelationshipMap();

  const pageHref = (index: number) =>
    `/friends?tab=discover${query ? `&q=${encodeURIComponent(query)}` : ""}&page=${index}`;

  return (
    <div className="space-y-4">
      <DirectorySearch initialQuery={query} />

      {result.profiles.length === 0 ? (
        <EmptyState
          icon={<UserSearchFilled className="size-8 text-muted-foreground" />}
          title={query ? "No matches" : "Nobody here yet"}
          body={
            query
              ? `Nothing found for "${query}". Try a different name or username.`
              : "You're early. Invite a classmate and they'll show up here."
          }
        />
      ) : (
        <div className="space-y-2">
          {result.profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              status={relationships[profile.id] ?? "none"}
            />
          ))}
        </div>
      )}

      {(pageIndex > 0 || result.hasMore) && (
        <div className="flex items-center justify-between pt-2">
          {pageIndex > 0 ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={pageHref(pageIndex - 1)}>Previous</Link>
            </Button>
          ) : (
            <span />
          )}
          {result.hasMore && (
            <Button variant="outline" size="sm" asChild>
              <Link href={pageHref(pageIndex + 1)}>Next</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border-[1.5px] border-dashed py-12 px-6 text-center">
      {icon}
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground max-w-sm">{body}</p>
      </div>
      {action}
    </div>
  );
}
