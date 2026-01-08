"use client";

import { cn } from "@/lib/utils";
import EventBlock from "../EventBlock";
import { ThemeType } from "./WallpaperForm";
import { weekdays, timeSlots, timeSlotsShort } from "@/constants";

interface DisplayEvent {
  course: {
    subjectCode: string;
    catalogNumber: number;
    title: string;
  };
  type: string;
  days: string[];
  startTime: string;
  endTime: string;
  location: string;
  courseColor: { color: string };
}

interface WallpaperImageProps {
  events: CalendarEvent[] | DisplayEvent[];
  user?: User;
  theme?: ThemeType;
}

// Helper function to convert day name to weekday index
const getWeekdayIndex = (dayName: string): number => {
  const dayMap: Record<string, number> = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
  };
  return dayMap[dayName] ?? 0;
};

// Helper function to convert time to minutes from midnight
const timeToMinutes = (timeString: string): number => {
  // Handle time strings like "16:00:00" or "16:00"
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + (minutes || 0);
};

// Helper function to get position and height for event
const getEventPosition = (event: CalendarEvent | DisplayEvent) => {
  const startMinutes = timeToMinutes(event.startTime);
  const endMinutes = timeToMinutes(event.endTime);
  const duration = endMinutes - startMinutes;

  // Convert to pixels
  const CELL_HEIGHT = 26;
  const top = (startMinutes - 8 * 60) * (CELL_HEIGHT / 60); // Start from 8 AM
  const height = duration * (CELL_HEIGHT / 60);

  return { top, height };
};

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

export default function WallpaperImage({ events, theme = "light" }: WallpaperImageProps) {
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
  }, {} as Record<number, (CalendarEvent | DisplayEvent)[]>);

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
                className="h-6.5 py-0.5 pr-1 text-[6px] font-medium text-muted-foreground text-right text-nowrap tracking-tight"
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
                <div key={time} className="h-6.5 border-t"></div>
              ))}

              {/* Events for this day */}
              {eventsByDay[dayIndex]?.map((event, eventIndex) => {
                const { top, height } = getEventPosition(event);

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
