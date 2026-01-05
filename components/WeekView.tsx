"use client";

import Event from "./Event";
import { cn } from "@/lib/utils";
import EventBlock from "./EventBlock";

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

interface WeekViewProps {
  events: CalendarEvent[] | DisplayEvent[];
  user?: User;
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

const timeSlotsShort = [
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
];

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

  // Convert to pixels (assuming 64px per hour)
  const top = (startMinutes - 8 * 60) * (64 / 60); // Start from 8 AM
  const height = duration * (64 / 60);

  return { top, height };
};

export default function WeekView({ events, user }: WeekViewProps) {
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
    <div className="w-full max-w-6xl mx-auto">
      {/* Schedule grid */}
      <div
        className="grid grid-cols-6  overflow-hidden"
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
              index === weekdays.length - 1 && "border-r-2 rounded-tr-xl"
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
              className="h-16 px-2 py-1 text-xs font-medium text-muted-foreground"
            >
              {time}
            </div>
          ))}
        </div>
        <div className="md:hidden">
          {timeSlotsShort.map((time) => (
            <div
              key={time}
              className="h-16 py-0.5 pr-0.5 text-xxxs font-medium text-muted-foreground"
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
              dayIndex === weekdays.length - 1 && "border-r-2 rounded-br-xl"
            )}
          >
            {/* Time slot lines */}
            {timeSlots.map((time) => (
              <div key={time} className="h-16 border-t-2"></div>
            ))}

            {/* Events for this day */}
            {eventsByDay[dayIndex]?.map((event, eventIndex) => {
              const { top, height } = getEventPosition(event);
              const isDisplayEvent = !("$id" in event);

              return user && !isDisplayEvent ? (
                <Event
                  key={`${event.$id || eventIndex}`}
                  event={event as CalendarEvent}
                  events={events as CalendarEvent[]}
                  user={user}
                  style={{
                    position: "absolute",
                    top: `${top}px`,
                    height: `${height}px`,
                    zIndex: 10,
                  }}
                />
              ) : (
                <EventBlock
                  key={`${eventIndex}`}
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
