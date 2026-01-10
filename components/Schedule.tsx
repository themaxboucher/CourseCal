"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentTerm } from "@/lib/utils";
import { getEvents } from "@/lib/indexeddb";
import { AddEventButton } from "./AddEventButton";
import { TermSelector } from "./TermSelector";
import { UploadDialog } from "./UploadDialog";
import WeekView from "./WeekView";
import { WallpaperDialog } from "./wallpaper/WallpaperDialog";
import { Loader2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";

interface ScheduleProps {
  events: UserEvent[];
  terms: Term[];
  user: User | null;
  isLoggedIn: boolean;
}

export default function Schedule({
  events: serverEvents,
  terms,
  user,
  isLoggedIn,
}: ScheduleProps) {
  const router = useRouter();
  const [selectedTermId, setSelectedTermId] = useState<string>("");
  const [localEvents, setLocalEvents] = useState<ScheduleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(!isLoggedIn);

  // Refresh local events from IndexedDB
  const refreshLocalEvents = useCallback(async () => {
    if (isLoggedIn) return;
    try {
      const events = await getEvents();
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
        const events = await getEvents();

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

  // Set default term based on current date
  useEffect(() => {
    if (terms.length > 0 && !selectedTermId) {
      const currentTerm = getCurrentTerm(terms);
      if (currentTerm) {
        setSelectedTermId(currentTerm.$id || "");
      }
    }
  }, [terms, selectedTermId]);

  // Filter events by selected term (term can be string ID or Term object)
  const filteredServerEvents = serverEvents.filter((event) => {
    const termId =
      typeof event.term === "string" ? event.term : (event.term as Term)?.$id;
    return termId === selectedTermId;
  });

  const filteredLocalEvents = localEvents.filter((event) => {
    const term = event.term as Term | null;
    return term?.$id === selectedTermId;
  });

  const hasEvents = isLoggedIn
    ? filteredServerEvents.length > 0
    : filteredLocalEvents.length > 0;

  // Show loading state for guest users while checking IndexedDB
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const displayEvents = isLoggedIn ? filteredServerEvents : filteredLocalEvents;

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        {isLoggedIn && (
          <TermSelector
            terms={terms}
            selectedTermId={selectedTermId}
            onTermChange={setSelectedTermId}
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
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <RotateCcw className="size-4" />
                  Retry upload
                </Link>
              </Button>
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
