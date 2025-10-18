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

export function formatTime(timeString: string) {
  // Handle time strings like "16:00:00" or "16:00"
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes || 0, 0, 0);
  return format(date, "h:mm a");
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
