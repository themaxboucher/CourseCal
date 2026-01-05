import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { eventColors } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export function getCurrentTerm(terms: Term[]): Term | null {
  if (!terms || terms.length === 0) return null;

  const now = new Date();

  // Find term containing current date
  const currentTerm = terms.find((term) => {
    const startDate = new Date(term.startDate);
    const endDate = new Date(term.endDate);
    return now >= startDate && now <= endDate;
  });

  if (currentTerm) return currentTerm;

  // Find next upcoming term
  const upcomingTerms = terms
    .filter((term) => new Date(term.startDate) > now)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  return upcomingTerms[0] || terms[0] || null;
}

export function getReadableRecurrence(
  recurrence: "weekly" | "biweekly" | undefined,
  days:
    | ("monday" | "tuesday" | "wednesday" | "thursday" | "friday")[]
    | undefined
): string {
  if (!recurrence || !days || days.length === 0) {
    return "No recurrence";
  }

  // Convert day names to readable format
  const dayNames = days.map((day) => {
    switch (day) {
      case "monday":
        return "Monday";
      case "tuesday":
        return "Tuesday";
      case "wednesday":
        return "Wednesday";
      case "thursday":
        return "Thursday";
      case "friday":
        return "Friday";
      default:
        return day;
    }
  });

  // Create readable day string
  let dayString: string;
  if (dayNames.length === 1) {
    dayString = dayNames[0];
  } else if (dayNames.length === 2) {
    dayString = `${dayNames[0]} and ${dayNames[1]}`;
  } else {
    const lastDay = dayNames.pop();
    dayString = `${dayNames.join(", ")}, and ${lastDay}`;
  }

  // Create recurrence string
  if (recurrence === "biweekly") {
    return `Every other ${dayString}`;
  } else {
    return `Every ${dayString}`;
  }
}

export function formatTime(timeString: string, includeAmPm: boolean = true) {
  // Handle time strings like "16:00:00" or "16:00"
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes || 0, 0, 0);
  return format(date, includeAmPm ? "h:mm a" : "h:mm");
}

export function getRandomColor(): Color {
  const colors: Color[] = [
    "red",
    "orange",
    "yellow",
    "green",
    "cyan",
    "blue",
    "purple",
    "pink",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Helper function to check for time overlaps
export const checkTimeOverlap = (
  startTime1: string,
  endTime1: string,
  startTime2: string,
  endTime2: string
): boolean => {
  const start1 = new Date(`2000-01-01T${startTime1}`);
  const end1 = new Date(`2000-01-01T${endTime1}`);
  const start2 = new Date(`2000-01-01T${startTime2}`);
  const end2 = new Date(`2000-01-01T${endTime2}`);

  return start1 < end2 && end1 > start2;
};

// Helper function to find overlapping events
export const findOverlappingEvents = (
  formData: any,
  events: CalendarEvent[],
  currentEventId?: string
): { day: string; event: CalendarEvent }[] => {
  const overlaps: { day: string; event: CalendarEvent }[] = [];

  if (!formData.days || !formData.startTime || !formData.endTime) {
    return overlaps;
  }

  events.forEach((event) => {
    // Skip the current event being edited
    if (currentEventId && event.$id === currentEventId) {
      return;
    }

    // Check if events share any days
    const sharedDays = formData.days.filter(
      (day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday") =>
        event.days?.includes(day)
    );

    if (sharedDays.length > 0) {
      // Check for time overlap
      if (
        checkTimeOverlap(
          formData.startTime,
          formData.endTime,
          event.startTime,
          event.endTime
        )
      ) {
        sharedDays.forEach((day: string) => {
          overlaps.push({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            event,
          });
        });
      }
    }
  });

  return overlaps;
};

// Check if time is within allowed range (8 AM - 7 PM)
export const isTimeInRange = (
  timeString: string,
  isEndTime: boolean = false
): boolean => {
  const time = new Date(`2000-01-01T${timeString}`);
  const hour = time.getHours();

  if (isEndTime) {
    return hour >= 8 && hour <= 19; // 8 AM to 7 PM (inclusive)
  } else {
    return hour >= 8 && hour < 19; // 8 AM to 7 PM (exclusive)
  }
};

// Get formatted overlap error message
export const getOverlapErrorMessage = (
  overlaps: { day: string; event: CalendarEvent }[]
): string => {
  if (overlaps.length === 0) return "";

  // Get unique overlapping events
  const uniqueEvents = overlaps
    .map((overlap) => overlap.event)
    .filter(
      (event, index, self) =>
        index === self.findIndex((e) => e.$id === event.$id)
    );

  const firstEvent = uniqueEvents[0];
  const firstEventName = firstEvent.course
    ? `${firstEvent.course.subjectCode} ${firstEvent.course.catalogNumber}`
    : firstEvent.summary || "Unknown event";

  const hasMultipleEvents = uniqueEvents.length > 1;
  return hasMultipleEvents ? `${firstEventName} and others` : firstEventName;
};
