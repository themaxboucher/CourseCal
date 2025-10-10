"use client";

import { useState, useEffect } from "react";
import Event from "./Event";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { seasonColors, seasonIcons } from "@/constants";
import { getCurrentTerm } from "@/lib/utils";

interface ScheduleProps {
  events: CalendarEvent[];
  terms: Term[];
  onEventClick?: (event: CalendarEvent) => void;
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

// Helper function to get day of week from recurrence rule
const getDayOfWeek = (recurrence: string): number => {
  // Extract day from recurrence rule (e.g., "BYDAY=MO" -> Monday = 1)
  const dayMap: Record<string, number> = {
    MO: 1,
    TU: 2,
    WE: 3,
    TH: 4,
    FR: 5,
    SA: 6,
    SU: 0,
  };

  const byDayMatch = recurrence.match(/BYDAY=([A-Z,]+)/);
  if (byDayMatch) {
    const days = byDayMatch[1].split(",");
    // Return the first day found (for simplicity, we'll use the first day)
    return dayMap[days[0]] || 1;
  }

  return 1; // Default to Monday if no day found
};

// Helper function to convert time to minutes from midnight
const timeToMinutes = (timeString: string): number => {
  // Handle time strings like "16:00:00" or "16:00"
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + (minutes || 0);
};

// Helper function to get position and height for event
const getEventPosition = (event: CalendarEvent) => {
  const startMinutes = timeToMinutes(event.startTime);
  const endMinutes = timeToMinutes(event.endTime);
  const duration = endMinutes - startMinutes;

  // Convert to pixels (assuming 60px per hour)
  const top = (startMinutes - 8 * 60) * (60 / 60); // Start from 8 AM
  const height = duration * (60 / 60);

  return { top, height };
};

export default function Schedule({
  events,
  terms,
  onEventClick,
}: ScheduleProps) {
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

  // Group events by day of week (1 = Monday, 2 = Tuesday, etc.)
  const eventsByDay = filteredEvents.reduce((acc, event) => {
    const dayOfWeek = getDayOfWeek(event.recurrence || "");
    // Convert Sunday=0 to Monday=1, Tuesday=2, etc.
    const weekdayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    if (weekdayIndex >= 0 && weekdayIndex < 5) {
      // Only Monday-Friday
      if (!acc[weekdayIndex]) {
        acc[weekdayIndex] = [];
      }
      acc[weekdayIndex].push(event);
    }

    return acc;
  }, {} as Record<number, CalendarEvent[]>);

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
      </div>
      <div className="w-full max-w-6xl mx-auto">
        {/* Schedule grid */}
        <div
          className="grid grid-cols-6  overflow-hidden"
          style={{ gridTemplateColumns: "auto 1fr 1fr 1fr 1fr 1fr" }}
        >
          <div className="text-sm font-medium text-muted-foreground p-2"></div>{" "}
          {/* Time column header */}
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-sm text-muted-foreground font-medium p-4 bg-muted text-center uppercase border-l border-t relative z-20"
            >
              {day.slice(0, 3)}
            </div>
          ))}
          {/* Time column */}
          <div>
            {timeSlots.map((time) => (
              <div
                key={time}
                className="h-15 p-2 text-xs font-medium text-muted-foreground"
              >
                {time}
              </div>
            ))}
          </div>
          {/* Day columns */}
          {weekdays.map((day, dayIndex) => (
            <div key={day} className=" relative">
              {/* Time slot lines */}
              {timeSlots.map((time) => (
                <div key={time} className="h-15 border-t border-l"></div>
              ))}

              {/* Events for this day */}
              {eventsByDay[dayIndex]?.map((event, eventIndex) => {
                const { top, height } = getEventPosition(event);
                return (
                  <Event
                    key={`${event.$id || eventIndex}`}
                    event={event}
                    onClick={onEventClick}
                    style={{
                      position: "absolute",
                      top: `${top}px`,
                      height: `${height}px`,
                      zIndex: 10,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
