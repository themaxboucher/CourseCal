import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { colors } from "@/constants";
import type { Tables } from "@/types/supabase";
import type { AnyEvent } from "@/lib/utils/events";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export function getReadableRecurrence(
  recurrence: Recurrence | undefined,
  days: WeekDay[] | undefined
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
  formData: { days?: WeekDay[]; startTime?: string; endTime?: string },
  events: AnyEvent[],
  currentEventId?: number
): { day: string; event: AnyEvent }[] => {
  const overlaps: { day: string; event: AnyEvent }[] = [];

  if (!formData.days || !formData.startTime || !formData.endTime) {
    return overlaps;
  }

  events.forEach((event) => {
    // Skip the current event being edited
    if (currentEventId !== undefined && event.id === currentEventId) {
      return;
    }

    // Check if events share any days
    const sharedDays = formData.days!.filter((day) =>
      event.days?.includes(day)
    );

    if (sharedDays.length > 0) {
      // Check for time overlap
      if (
        checkTimeOverlap(
          formData.startTime!,
          formData.endTime!,
          event.start_time,
          event.end_time
        )
      ) {
        sharedDays.forEach((day) => {
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
  overlaps: { day: string; event: AnyEvent }[]
): string => {
  if (overlaps.length === 0) return "";

  // Get unique overlapping events
  const uniqueEvents = overlaps
    .map((overlap) => overlap.event)
    .filter(
      (event, index, self) =>
        index === self.findIndex((e) => e.id === event.id)
    );

  const firstEvent = uniqueEvents[0];
  const firstEventName = firstEvent.course_code || "Unknown event";

  const hasMultipleEvents = uniqueEvents.length > 1;
  return hasMultipleEvents ? `${firstEventName} and others` : firstEventName;
};

// Schedule utils (for WeekView and WallpaperImage) //

// Helper function to convert day name to weekday index
export const getWeekdayIndex = (dayName: string): number => {
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
export const timeToMinutes = (timeString: string): number => {
  // Handle time strings like "16:00:00" or "16:00"
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + (minutes || 0);
};

// Get the time range needed to display all events
// Default: 8 AM to 4 PM, expands to accommodate events outside this range
export const getTimeRange = (
  events: AnyEvent[]
): { startHour: number; endHour: number } => {
  const DEFAULT_START = 9; // 9 AM
  const DEFAULT_END = 15; // 3 PM

  if (!events || events.length === 0) {
    return { startHour: DEFAULT_START, endHour: DEFAULT_END };
  }

  let earliestStart = DEFAULT_START;
  let latestEnd = DEFAULT_END;

  events.forEach((event) => {
    const startMinutes = timeToMinutes(event.start_time);
    const endMinutes = timeToMinutes(event.end_time);

    const startHour = Math.floor(startMinutes / 60);
    const endHour = Math.floor(endMinutes / 60);

    if (startHour < earliestStart) {
      earliestStart = startHour;
    }
    if (endHour > latestEnd) {
      latestEnd = endHour;
    }
  });

  return { startHour: earliestStart, endHour: latestEnd };
};

// Generate time slots array from startHour to endHour
export const generateTimeSlots = (
  startHour: number,
  endHour: number,
  short: boolean = false
): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    slots.push(short ? `${displayHour} ${period}` : `${displayHour}:00 ${period}`);
  }
  return slots;
};

// Helper function to get position and height for event
export const getEventPosition = (
  event: AnyEvent,
  cellHeight: number,
  baseHour: number = 8
) => {
  const startMinutes = timeToMinutes(event.start_time);
  const endMinutes = timeToMinutes(event.end_time);
  const duration = endMinutes - startMinutes;

  // Convert to pixels
  const top = (startMinutes - baseHour * 60) * (cellHeight / 60);
  const height = duration * (cellHeight / 60);

  return { top, height };
};


export function getRelevantTerm(terms: Tables<"terms">[]): Tables<"terms"> {
  if (terms.length === 0) {
    throw new Error("No terms found");
  }

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  const currentTerm = terms.find(
    (term) => term.start_date <= today && term.end_date >= today
  );
  if (currentTerm) {
    return currentTerm;
  }

  const upcomingTerms = terms.filter((term) => term.start_date > today);
  if (upcomingTerms.length > 0) {
    upcomingTerms.sort((a, b) => a.start_date.localeCompare(b.start_date));
    return upcomingTerms[0];
  }

  const previousTerms = terms.filter((term) => term.end_date < today);
  if (previousTerms.length > 0) {
    previousTerms.sort((a, b) => b.end_date.localeCompare(a.end_date));
    return previousTerms[0];
  }

  throw new Error("Unable to determine relevant term");
}