"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getRelevantTerm } from "@/lib/utils/schedule";
import { getEvents as getLocalEvents } from "@/lib/indexeddb";
import { AddEventButton } from "./AddEventButton";
import { TermSelector } from "./TermSelector";
import { UploadDialog } from "@/components/UploadDialog";
import WeekView from "./WeekView";
import { WallpaperDialog } from "@/components/wallpaper/WallpaperDialog";
import { Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tables } from "@/types/supabase";
import { EventWithCourse } from "@/lib/actions/events.actions";

interface ScheduleProps {
  events: EventWithCourse[];
  terms: Tables<"terms">[];
  user: Tables<"users"> | null;
  isLoggedIn: boolean;
}

export default function Schedule({
  events: serverEvents,
  terms,
  user,
  isLoggedIn,
}: ScheduleProps) {
  const router = useRouter();
  const relevantTerm = getRelevantTerm(terms);
  const [selectedTermId, setSelectedTermId] = useState<number>(relevantTerm.id);
  const [localEvents, setLocalEvents] = useState<LocalEvent[]>([]);
  const [isLoading, setIsLoading] = useState(!isLoggedIn);

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

  const selectedTermServerEvents = serverEvents.filter((event) => event.term === selectedTermId);

  const hasEvents = isLoggedIn
    ? selectedTermServerEvents.length > 0
    : localEvents.length > 0;

  // Show loading state for guest users while checking IndexedDB
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayEvents = isLoggedIn ? selectedTermServerEvents : localEvents;

  return (
    <>
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
            !isLoggedIn && "justify-between w-full"
          )}
        >
          {!hasEvents ? (
            <UploadDialog />
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
                    <RotateCcw className="size-4" />
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
                    <RotateCcw className="size-4" />
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
      />
    </>
  );
}
