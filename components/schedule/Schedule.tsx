"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getRelevantTerm, getTimeRange } from "@/lib/utils/schedule";
import { getEvents as getLocalEvents } from "@/lib/indexeddb";
import { AddEventButton } from "./AddEventButton";
import { TermSelector } from "./TermSelector";
import { UploadDialog } from "@/components/UploadDialog";
import WeekView from "./WeekView";
import FriendRail, { type RailFriend } from "./FriendRail";
import OverlapSettings from "./OverlapSettings";
import type { AvailabilityPerson } from "./AvailabilityLayer";
import { WallpaperDialog } from "@/components/wallpaper/WallpaperDialog";
import { AuthDialog } from "@/components/auth/AuthDialog";
import {
  GroupFilled,
  Loading3Filled,
  RefreshAnticlockwise1Filled,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Tables } from "@/types/supabase";
import type {
  EventWithCourse,
  FriendEvent,
} from "@/lib/actions/events.actions";
import type { Profile } from "@/lib/utils/profiles";
import {
  buildAvailability,
  DEFAULT_MIN_SLOT_MINUTES,
  type Participant,
} from "@/lib/utils/availability";

interface ScheduleProps {
  events: EventWithCourse[];
  terms: Tables<"terms">[];
  user: Tables<"users"> | null;
  isLoggedIn: boolean;
  friends?: Profile[];
  /** Every term's events for all accepted friends; filtered per term below. */
  friendEvents?: FriendEvent[];
}

/** `?with=alice,bob` — keeps a comparison shareable and survives a refresh. */
function parseSelection(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export default function Schedule({
  events: serverEvents,
  terms,
  user,
  isLoggedIn,
  friends = [],
  friendEvents = [],
}: ScheduleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const relevantTerm = getRelevantTerm(terms);
  const [selectedTermId, setSelectedTermId] = useState<number>(relevantTerm.id);
  const [localEvents, setLocalEvents] = useState<LocalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(!isLoggedIn);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const [selectedUsernames, setSelectedUsernames] = useState<string[]>(() =>
    parseSelection(searchParams.get("with")),
  );
  const [minDurationMin, setMinDurationMin] = useState(
    DEFAULT_MIN_SLOT_MINUTES,
  );
  const [betweenClassesOnly, setBetweenClassesOnly] = useState(false);

  // Refresh local events from IndexedDB
  const refreshLocalEvents = useCallback(async () => {
    if (isLoggedIn) return;
    try {
      const events = await getLocalEvents();
      setLocalEvents(events);
    } catch (error) {
      console.error("Error refreshing local events:", error);
    }
  }, [isLoggedIn]);

  // Check IndexedDB for guest users
  useEffect(() => {
    if (isLoggedIn) return;

    const checkLocalData = async () => {
      try {
        const events = await getLocalEvents();

        // Redirect if no local data
        if (events.length === 0) {
          router.replace("/");
          return;
        }

        setLocalEvents(events);
      } catch (error) {
        console.error("Error checking IndexedDB:", error);
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkLocalData();
  }, [isLoggedIn, router]);

  /**
   * Selection is client state mirrored into the URL rather than routed state.
   * Every friend's events are already on the client, so a toggle needs no
   * server round trip — `replaceState` keeps the address bar shareable without
   * re-rendering the page or filling the history stack.
   */
  const toggleFriend = useCallback((username: string) => {
    setSelectedUsernames((current) => {
      const next = current.includes(username)
        ? current.filter((entry) => entry !== username)
        : [...current, username];

      const params = new URLSearchParams(window.location.search);
      if (next.length > 0) params.set("with", next.join(","));
      else params.delete("with");
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        query ? `?${query}` : window.location.pathname,
      );

      return next;
    });
  }, []);

  const selectedTerm =
    terms.find((term) => term.id === selectedTermId) ?? relevantTerm;
  const selectedTermServerEvents = useMemo(
    () => serverEvents.filter((event) => event.term === selectedTermId),
    [serverEvents, selectedTermId],
  );
  const termFriendEvents = useMemo(
    () => friendEvents.filter((event) => event.term === selectedTermId),
    [friendEvents, selectedTermId],
  );

  const selectedFriends = useMemo(
    () =>
      friends.filter((friend) => selectedUsernames.includes(friend.username)),
    [friends, selectedUsernames],
  );

  const railFriends: RailFriend[] = useMemo(
    () =>
      friends.map((friend) => ({
        profile: friend,
        selected: selectedUsernames.includes(friend.username),
        hasSchedule: termFriendEvents.some((event) => event.user === friend.id),
      })),
    [friends, selectedUsernames, termFriendEvents],
  );

  const availability = useMemo(() => {
    if (!user || selectedFriends.length === 0) return null;

    const participants: Participant[] = [
      {
        id: user.id,
        events: selectedTermServerEvents,
        hasSchedule: selectedTermServerEvents.length > 0,
      },
      ...selectedFriends.map((friend) => {
        const events = termFriendEvents.filter(
          (event) => event.user === friend.id,
        );
        return { id: friend.id, events, hasSchedule: events.length > 0 };
      }),
    ];

    // The grid must already be tall enough for everyone's classes, or bands
    // computed against a wider range would render outside it.
    const rangeEvents = [
      ...selectedTermServerEvents,
      ...termFriendEvents.filter((event) =>
        selectedFriends.some((friend) => friend.id === event.user),
      ),
    ];
    const { startHour, endHour } = getTimeRange(rangeEvents);

    return {
      ...buildAvailability(participants, {
        minDurationMin,
        betweenClassesOnly,
        dayStartMin: startHour * 60,
        // `endHour` is the hour label of the last row, which covers the hour
        // after it — so the grid ends at endHour + 1.
        dayEndMin: (endHour + 1) * 60,
        viewerId: user.id,
      }),
      rangeEvents,
    };
  }, [
    user,
    selectedFriends,
    selectedTermServerEvents,
    termFriendEvents,
    minDurationMin,
    betweenClassesOnly,
  ]);

  const participantPeople = useMemo(() => {
    const people: Record<string, AvailabilityPerson> = {};
    if (user) {
      people[user.id] = { name: "You" };
    }
    for (const friend of friends) {
      people[friend.id] = { name: friend.name ?? friend.username };
    }
    return people;
  }, [user, friends]);

  const hasEvents = isLoggedIn
    ? selectedTermServerEvents.length > 0
    : localEvents.length > 0;

  // Show loading state for guest users while checking IndexedDB
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loading3Filled className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayEvents = isLoggedIn ? selectedTermServerEvents : localEvents;
  const excludedNames = availability
    ? availability.excludedIds
        .filter((id) => id !== user?.id)
        .map((id) => participantPeople[id]?.name)
        .filter(Boolean)
    : [];

  return (
    <>
      {isLoggedIn && hasEvents && (
        <div className="flex items-center gap-2 pb-4">
          <div className="min-w-0 flex-grow">
            <FriendRail
              friends={railFriends}
              onToggle={toggleFriend}
              termLabel={`${selectedTerm.season} ${selectedTerm.year}`}
            />
          </div>
          {selectedFriends.length > 0 && (
            <OverlapSettings
              minDurationMin={minDurationMin}
              onMinDurationChange={setMinDurationMin}
              betweenClassesOnly={betweenClassesOnly}
              onBetweenClassesOnlyChange={setBetweenClassesOnly}
            />
          )}
        </div>
      )}

      {!isLoggedIn && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-dashed px-4 py-3 mb-4">
          <p className="text-sm text-muted-foreground">
            <GroupFilled className="mr-2 inline size-4 align-text-bottom" />
            Sign up to see when you and your friends are free.
          </p>
          <Button size="sm" onClick={() => setAuthDialogOpen(true)}>
            Sign up
          </Button>
        </div>
      )}

      {excludedNames.length > 0 && (
        <p className="pb-2 text-xs text-muted-foreground">
          {excludedNames.join(", ")}{" "}
          {excludedNames.length === 1 ? "has" : "have"} no schedule for{" "}
          <span className="capitalize">{selectedTerm.season}</span>{" "}
          {selectedTerm.year}, so they are not counted below.
        </p>
      )}

      {availability && availability.slots.length === 0 && (
        <p className="pb-2 text-xs text-muted-foreground">
          No shared free time. Try a shorter minimum gap, or fewer people.
        </p>
      )}

      <div className="flex items-center justify-between pb-4">
        {isLoggedIn && (
          <TermSelector
            terms={terms}
            selectedTermId={selectedTermId}
            setSelectedTermId={setSelectedTermId}
          />
        )}
        <div
          className={cn(
            "flex items-center gap-2",
            !isLoggedIn && "justify-between w-full",
          )}
        >
          {!hasEvents ? (
            <UploadDialog term={selectedTerm} />
          ) : (
            <WallpaperDialog events={displayEvents} />
          )}
          <div className="flex items-center gap-2">
            {!isLoggedIn && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex"
                  asChild
                >
                  <Link href="/">
                    <RefreshAnticlockwise1Filled className="size-4" />
                    Retry upload
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  asChild
                >
                  <Link href="/">
                    <RefreshAnticlockwise1Filled className="size-4" />
                  </Link>
                </Button>
              </>
            )}
            <AddEventButton
              term={selectedTermId}
              events={displayEvents}
              user={user}
              isGuest={!isLoggedIn}
              onEventSaved={refreshLocalEvents}
            />
          </div>
        </div>
      </div>

      <WeekView
        events={displayEvents}
        user={user ?? undefined}
        isGuest={!isLoggedIn}
        onEventsChange={refreshLocalEvents}
        busyBlocks={availability?.busyBlocks}
        freeSlots={availability?.slots}
        people={participantPeople}
        rangeEvents={availability?.rangeEvents}
      />

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        type="signup"
      />
    </>
  );
}
