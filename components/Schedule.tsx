"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { seasonColors, seasonIcons } from "@/constants";
import { getCurrentTerm } from "@/lib/utils";
import { AddEventButton } from "./AddEventButton";
import { UploadDialog } from "./UploadDialog";
import WeekView from "./WeekView";

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
        <Select value={selectedTermId} onValueChange={setSelectedTermId}>
          <SelectTrigger className="capitalize">
            <SelectValue placeholder="Select a term">
              {selectedTermId &&
                (() => {
                  const selectedTerm = terms.find(
                    (term) => term.$id === selectedTermId
                  );
                  if (selectedTerm) {
                    const IconComponent = seasonIcons[selectedTerm.season];
                    const colorClass = seasonColors[selectedTerm.season];
                    return (
                      <div className="flex items-center gap-2">
                        <IconComponent className={`h-4 w-4 ${colorClass}`} />
                        {selectedTerm.season} {selectedTerm.year}
                      </div>
                    );
                  }
                  return null;
                })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {terms.map((term: Term) => {
              const IconComponent = seasonIcons[term.season];
              const colorClass = seasonColors[term.season];

              return (
                <SelectItem
                  key={term.$id}
                  value={term.$id || ""}
                  className="capitalize"
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-4 w-4 ${colorClass}`} />
                    {term.season} {term.year}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <AddEventButton
            term={selectedTermId}
            events={filteredEvents}
            user={user}
          />
          {filteredEvents.length === 0 && (
            <UploadDialog
              terms={terms}
              user={user}
              selectedTermId={selectedTermId}
            />
          )}
        </div>
      </div>
      <WeekView events={filteredEvents} user={user} />
    </>
  );
}
