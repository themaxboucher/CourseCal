"use client";

import { useState, useEffect } from "react";
import { getCurrentTerm } from "@/lib/utils";
import { AddEventButton } from "./AddEventButton";
import { TermSelector } from "./TermSelector";
import { UploadDialog } from "./UploadDialog";
import WeekView from "./WeekView";
import { WallpaperDialog } from "./wallpaper/WallpaperDialog";

interface ScheduleProps {
  events: CalendarEvent[];
  terms: Term[];
  user: User;
}

export default function Schedule({ events, terms, user }: ScheduleProps) {
  const [selectedTermId, setSelectedTermId] = useState<string>("");

  // Set default term based on current date
  useEffect(() => {
    if (terms.length > 0 && !selectedTermId) {
      const currentTerm = getCurrentTerm(terms);
      if (currentTerm) {
        setSelectedTermId(currentTerm.$id || "");
      }
    }
  }, [terms, selectedTermId]);

  // Filter events by selected term
  const filteredEvents = events.filter(
    (event) => event.term === selectedTermId
  );

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <TermSelector
          terms={terms}
          selectedTermId={selectedTermId}
          onTermChange={setSelectedTermId}
        />
        <div className="flex items-center gap-2">
          {filteredEvents.length === 0 ? (
            <UploadDialog />
          ) : (
            <WallpaperDialog events={filteredEvents} />
          )}
          <AddEventButton
            term={selectedTermId}
            events={filteredEvents}
            user={user}
          />
        </div>
      </div>
      <WeekView events={filteredEvents} user={user} />
    </>
  );
}
