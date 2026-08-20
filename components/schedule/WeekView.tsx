"use client";

import { useMemo } from "react";
import Event from "./Event";
import { cn } from "@/lib/utils";
import EventBlock from "./EventBlock";
import { weekdays } from "@/constants";
import {
  generateTimeSlots,
  getEventPosition,
  getTimeRange,
  getWeekdayIndex,
} from "@/lib/utils/schedule";
import type { Tables } from "@/types/supabase";
import type { AnyEvent } from "@/lib/utils/events";
import { WEEK_DAYS, type Band } from "@/lib/utils/availability";
import AvailabilityLayer from "./AvailabilityLayer";

interface WeekViewProps {
  events: AnyEvent[];
  user?: Tables<"users"> | null;
  isGuest?: boolean;
  onEventsChange?: () => void;
  /** Shared availability overlay. Omitted when no friends are selected. */
  bands?: Band[];
  /** Participant id to display name, for band hover text. */
  bandNames?: Record<string, string>;
  /**
   * Events the visible hour range must accommodate. Defaults to `events`, but
   * the overlay needs the range widened to cover friends' classes too —
   * otherwise a friend's 8am lab lands above the top of the grid.
   */
  rangeEvents?: { start_time: string; end_time: string }[];
}

export default function WeekView({
  events,
  user,
  isGuest = false,
  onEventsChange,
  bands,
  bandNames = {},
  rangeEvents,
}: WeekViewProps) {
  // Calculate dynamic time range based on events
  const { startHour, endHour } = useMemo(
    () => getTimeRange(rangeEvents ?? events),
    [rangeEvents, events],
  );
  const timeSlots = useMemo(
    () => generateTimeSlots(startHour, endHour, false),
    [startHour, endHour],
  );
  const timeSlotsShort = useMemo(
    () => generateTimeSlots(startHour, endHour, true),
    [startHour, endHour],
  );

  // Group events by day of week using the days array
  const eventsByDay = events.reduce(
    (acc, event) => {
      if (event.days && event.days.length > 0) {
        // For each day the event occurs on
        event.days.forEach((dayName) => {
          const weekdayIndex = getWeekdayIndex(dayName);

          if (weekdayIndex >= 0 && weekdayIndex < 5) {
            // Only Monday-Friday
            if (!acc[weekdayIndex]) {
              acc[weekdayIndex] = [];
            }
            acc[weekdayIndex].push(event);
          }
        });
      }

      return acc;
    },
    {} as Record<number, AnyEvent[]>,
  );

  return (
    <div className="w-full max-w-[75rem] mx-auto">
      {/* Schedule grid */}
      <div
        className="grid grid-cols-6"
        style={{ gridTemplateColumns: "auto 1fr 1fr 1fr 1fr 1fr" }}
      >
        <div />
        {/* Time column header */}
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "md:text-sm text-xs text-muted-foreground font-medium px-4 py-2 sm:py-4 bg-muted/50 text-center uppercase border-l-2 border-t-2 relative z-20",
              index === 0 && "rounded-tl-xl",
              index === weekdays.length - 1 && "border-r-2 rounded-tr-xl",
            )}
          >
            {day.slice(0, 3)}
          </div>
        ))}
        {/* Time column */}
        <div className="hidden md:block">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="h-16 px-2 py-1 text-xs font-medium text-muted-foreground text-right text-nowrap tracking-tight"
            >
              {time}
            </div>
          ))}
        </div>
        <div className="md:hidden">
          {timeSlotsShort.map((time) => (
            <div
              key={time}
              className="h-16 py-0.5 pr-0.5 text-xxxs font-medium text-muted-foreground text-right text-nowrap tracking-tight"
            >
              {time}
            </div>
          ))}
        </div>
        {/* Day columns */}
        {weekdays.map((day, dayIndex) => (
          <div
            key={day}
            className={cn(
              "relative border-l-2 border-b-2",
              dayIndex === 0 && "rounded-bl-xl",
              dayIndex === weekdays.length - 1 && "border-r-2 rounded-br-xl",
            )}
          >
            {/* Time slot lines */}
            {timeSlots.map((time) => (
              <div key={time} className="h-16 border-t-2"></div>
            ))}

            {/* Shared availability, beneath the event blocks */}
            {bands && (
              <AvailabilityLayer
                bands={bands.filter((band) => band.day === WEEK_DAYS[dayIndex])}
                startHour={startHour}
                pxPerHour={64}
                names={bandNames}
              />
            )}

            {/* Events for this day */}
            {eventsByDay[dayIndex]?.map((event) => {
              const PX_PER_HOUR = 64;
              const { top, height } = getEventPosition(
                event,
                PX_PER_HOUR,
                startHour,
              );
              const isInteractive = user || isGuest;

              return isInteractive ? (
                <Event
                  key={event.id}
                  event={event}
                  events={events}
                  user={user}
                  isGuest={isGuest}
                  onEventsChange={onEventsChange}
                  style={{
                    position: "absolute",
                    top: `${top}px`,
                    height: `${height}px`,
                    zIndex: 10,
                  }}
                />
              ) : (
                <EventBlock
                  key={event.id}
                  event={event}
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
  );
}
