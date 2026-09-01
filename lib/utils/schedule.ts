import { format } from "date-fns";
import type { Tables } from "@/types/supabase";
import type { AnyEvent } from "@/lib/utils/events";

export function getReadableRecurrence(
  recurrence: Recurrence | undefined,
  days: WeekDay[] | undefined,
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

// Helper function to check for time overlaps
export const checkTimeOverlap = (
  startTime1: string,
  endTime1: string,
  startTime2: string,
  endTime2: string,
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
  currentEventId?: number,
): { day: string; event: AnyEvent }[] => {
  const overlaps: { day: string; event: AnyEvent }[] = [];

  if (!formData.days || !formData.startTime || !formData.endTime) {
    return overlaps;
  }
  const { days, startTime, endTime } = formData;

  events.forEach((event) => {
    // Skip the current event being edited
    if (currentEventId !== undefined && event.id === currentEventId) {
      return;
    }

    // Check if events share any days
    const sharedDays = days.filter((day) => event.days?.includes(day));

    if (sharedDays.length > 0) {
      // Check for time overlap
      if (
        checkTimeOverlap(startTime, endTime, event.start_time, event.end_time)
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
  isEndTime: boolean = false,
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
  overlaps: { day: string; event: AnyEvent }[],
): string => {
  if (overlaps.length === 0) return "";

  // Get unique overlapping events
  const uniqueEvents = overlaps
    .map((overlap) => overlap.event)
    .filter(
      (event, index, self) =>
        index === self.findIndex((e) => e.id === event.id),
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
  events: { start_time: string; end_time: string }[],
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
  short: boolean = false,
): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    slots.push(
      short ? `${displayHour} ${period}` : `${displayHour}:00 ${period}`,
    );
  }
  return slots;
};

// Helper function to get position and height for event
/**
 * The gap left between two blocks that touch — one class ending exactly when
 * the next begins.
 *
 * It cannot be a vertical margin. These blocks are absolutely positioned with
 * both `top` and `height` set, and for such a box `margin-bottom` is absorbed
 * into the solved-for `bottom`: a vertical margin only shifts a block down and
 * never separates it from its neighbour. (Horizontal margins do work, because
 * `left` and `right` are both given.) So the gap has to come out of the height.
 *
 * It rides on a custom property rather than a number because the geometry is
 * inline, where a media query cannot reach — but a variable that geometry reads
 * can be set from a class. `BLOCK_GAP_CLASS` sets it on the day column and
 * every block inside inherits it; wherever the property is never set, the
 * fallback leaves blocks flush.
 */
export const BLOCK_GAP_CLASS = "[--block-gap:1px] md:[--block-gap:2px]";

/**
 * Diagonal stripes, the one hatch every striped block in the grid is drawn
 * from: a biweekly class, a free slot that only exists on the weeks somebody's
 * biweekly class is off, and a friend's busy stretch all wear it, and
 * `ScheduleLegend` draws its swatches from it too, so a legend swatch cannot
 * drift from the block it explains.
 *
 * Stripes are `currentColor`, so the mark takes the colour of whatever it is
 * laid over. Width and strength are the caller's: a wallpaper's blocks are a
 * few pixels tall and a legend swatch smaller still, so the stripes have to
 * shrink with them to read as stripes at all.
 */
export const hatch = (stripePx: number, opacityPercent: number = 25): string =>
  `repeating-linear-gradient(45deg, transparent 0 ${stripePx}px, color-mix(in srgb, currentColor ${opacityPercent}%, transparent) ${stripePx}px ${stripePx * 2}px)`;

/**
 * Positions a block short of the time it occupies by the gap, half at either
 * end, so two touching blocks come to rest a full gap apart while each stays
 * centred on its own hour.
 */
export const withBlockGap = (
  top: number,
  height: number,
): { top: string; height: string } => ({
  top: `calc(${top}px + var(--block-gap, 0px) / 2)`,
  // Never let a short block collapse: a 15-minute slot is only a handful of
  // pixels tall to begin with, and a height of zero would drop the block back
  // to auto-sizing.
  height: `max(1px, calc(${height}px - var(--block-gap, 0px)))`,
});

export const getEventPosition = (
  event: AnyEvent,
  cellHeight: number,
  baseHour: number = 8,
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
    (term) => term.start_date <= today && term.end_date >= today,
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
