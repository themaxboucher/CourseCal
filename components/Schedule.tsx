"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentTerm } from "@/lib/utils";
import { getEvents, getCourseColors } from "@/lib/indexeddb";
import { AddEventButton } from "./AddEventButton";
import { TermSelector } from "./TermSelector";
import { UploadDialog } from "./UploadDialog";
import WeekView from "./WeekView";
import { WallpaperDialog } from "./wallpaper/WallpaperDialog";
import { Loader2 } from "lucide-react";

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

  // Check IndexedDB for guest users
  useEffect(() => {
    if (isLoggedIn) return;

    const checkLocalData = async () => {
      try {
        const [events, courseColors] = await Promise.all([
          getEvents(),
          getCourseColors(),
        ]);

        // Redirect if no local data
        if (events.length === 0 || courseColors.length === 0) {
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

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <TermSelector
          terms={terms}
          selectedTermId={selectedTermId}
          onTermChange={setSelectedTermId}
        />
        <div className="flex items-center gap-2">
          {!hasEvents ? (
            <UploadDialog />
          ) : isLoggedIn ? (
            <WallpaperDialog events={filteredServerEvents} />
          ) : null}
          {user && (
            <AddEventButton
              term={selectedTermId}
              events={filteredServerEvents}
              user={user}
            />
          )}
        </div>
      </div>
      {isLoggedIn && user !== null ? (
        <WeekView events={filteredServerEvents} user={user} />
      ) : (
        <WeekView events={filteredLocalEvents} />
      )}
    </>
  );
}
