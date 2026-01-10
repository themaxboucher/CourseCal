"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import EventBlock from "../EventBlock";
import { weekdays } from "@/constants";
import {
  getWeekdayIndex,
  getEventPosition,
  getTimeRange,
  generateTimeSlots,
} from "@/lib/utils";

interface WallpaperImageProps {
  events: ScheduleEvent[];
  user?: User;
  theme?: ThemeType;
  cellHeight?: number;
}

// Cell height constants
const MIN_CELL_HEIGHT = 24;
const TARGET_MAX_TOTAL_HEIGHT = 352; // Target max total height for the schedule grid

// Light theme CSS variables from globals.css
const lightThemeStyles: React.CSSProperties = {
  "--background": "oklch(1 0 0)",
  "--foreground": "oklch(0.141 0.005 285.823)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.141 0.005 285.823)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.141 0.005 285.823)",
  "--primary": "oklch(63.7% 0.237 25.331)",
  "--primary-foreground": "oklch(0.985 0 0)",
  "--secondary": "oklch(0.967 0.001 286.375)",
  "--secondary-foreground": "oklch(0.21 0.006 285.885)",
  "--muted": "oklch(0.967 0.001 286.375)",
  "--muted-foreground": "oklch(0.552 0.016 285.938)",
  "--accent": "oklch(0.967 0.001 286.375)",
  "--accent-foreground": "oklch(0.21 0.006 285.885)",
  "--destructive": "oklch(0.577 0.245 27.325)",
  "--border": "oklch(0.92 0.004 286.32)",
  "--input": "oklch(0.92 0.004 286.32)",
  "--ring": "oklch(68.5% 0.169 237.323)",
  "--chart-1": "oklch(0.646 0.222 41.116)",
  "--chart-2": "oklch(0.6 0.118 184.704)",
  "--chart-3": "oklch(0.398 0.07 227.392)",
  "--chart-4": "oklch(0.828 0.189 84.429)",
  "--chart-5": "oklch(0.769 0.188 70.08)",
  "--sidebar": "oklch(0.985 0 0)",
  "--sidebar-foreground": "oklch(0.141 0.005 285.823)",
  "--sidebar-primary": "oklch(0.21 0.006 285.885)",
  "--sidebar-primary-foreground": "oklch(0.985 0 0)",
  "--sidebar-accent": "oklch(0.967 0.001 286.375)",
  "--sidebar-accent-foreground": "oklch(0.21 0.006 285.885)",
  "--sidebar-border": "oklch(0.92 0.004 286.32)",
  "--sidebar-ring": "oklch(0.705 0.015 286.067)",
} as React.CSSProperties;

export default function WallpaperImage({
  events,
  theme = "light",
  cellHeight = 0,
}: WallpaperImageProps) {
  // Calculate dynamic time range based on events
  const { startHour, endHour } = useMemo(() => getTimeRange(events), [events]);
  const timeSlots = useMemo(
    () => generateTimeSlots(startHour, endHour, false),
    [startHour, endHour]
  );
  const timeSlotsShort = useMemo(
    () => generateTimeSlots(startHour, endHour, true),
    [startHour, endHour]
  );

  // Calculate max cell height based on number of time slots
  const maxCellHeight = Math.max(MIN_CELL_HEIGHT, TARGET_MAX_TOTAL_HEIGHT / timeSlots.length);
  
  // Calculate the actual pixel height from percentage (0% = min, 100% = max based on time slots)
  const cellHeightPx = MIN_CELL_HEIGHT + (cellHeight / 100) * (maxCellHeight - MIN_CELL_HEIGHT);

  // Group events by day of week using the days array
  const eventsByDay = events.reduce((acc, event) => {
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
  }, {} as Record<number, ScheduleEvent[]>);

  return (
    <div
      className="w-full mx-auto"
      style={theme === "light" ? lightThemeStyles : undefined}
    >
      {/* Schedule grid */}
      <div
        className="grid grid-cols-6 overflow-hidden"
        style={{ gridTemplateColumns: "auto 1fr 1fr 1fr 1fr 1fr" }}
      >
        <div />
        {/* Time column header */}
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={cn(
              "text-[6px] text-muted-foreground font-medium p-2 bg-muted/30 text-center uppercase border-l border-t relative z-20",
              index === 0 && "rounded-tl-lg",
              index === weekdays.length - 1 && "border-r rounded-tr-lg"
            )}
          >
            {day.slice(0, 3)}
          </div>
        ))}
        {/* Time column */}
        <div>
          {timeSlotsShort.map((time) => (
            <div
              key={time}
              className="py-0.5 pr-1 text-[6px] font-medium text-muted-foreground text-right text-nowrap tracking-tight"
              style={{ height: `${cellHeightPx}px` }}
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
              "relative border-l border-b",
              dayIndex === 0 && "rounded-bl-lg",
              dayIndex === weekdays.length - 1 && "border-r rounded-br-lg"
            )}
          >
            {/* Time slot lines */}
            {timeSlots.map((time) => (
              <div key={time} className="border-t" style={{ height: `${cellHeightPx}px` }}></div>
            ))}

            {/* Events for this day */}
            {eventsByDay[dayIndex]?.map((event, eventIndex) => {
              const { top, height } = getEventPosition(event, cellHeightPx, startHour);

              return (
                <EventBlock
                  key={`${eventIndex}`}
                  event={event}
                  isWallpaper={true}
                  wallpaperTheme={theme}
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
