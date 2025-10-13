import { parseISO, format } from "date-fns";

// Only the properties that are needed for the app are included
export interface ParsedEvent {
  summary: string;
  location?: string;
  startTime: string;
  endTime: string;
  days?: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday")[];
  recurrence?: "weekly" | "biweekly";
  exclusions?: string[];
}

export function parseICSFile(icsContent: string): ParsedEvent[] {
  const events: ParsedEvent[] = [];
  const lines = icsContent.split(/\r?\n/);

  let currentEvent: Partial<ParsedEvent> | null = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Handle line continuation (lines starting with space or tab)
    while (
      i + 1 < lines.length &&
      (lines[i + 1].startsWith(" ") || lines[i + 1].startsWith("\t"))
    ) {
      i++;
      line += lines[i].trim();
    }

    if (line === "BEGIN:VEVENT") {
      currentEvent = {};
    } else if (line === "END:VEVENT" && currentEvent) {
      if (
        currentEvent.summary &&
        currentEvent.startTime &&
        currentEvent.endTime
      ) {
        events.push(currentEvent as ParsedEvent);
      }
      currentEvent = null;
    } else if (currentEvent && line.includes(":")) {
      const colonIndex = line.indexOf(":");
      const property = line.substring(0, colonIndex);
      const value = line.substring(colonIndex + 1);

      // Handle properties with parameters (e.g., DTSTART;TZID=MST:20250902T093000)
      const [propertyName] = property.split(";");

      switch (propertyName.toUpperCase()) {
        case "SUMMARY":
          currentEvent.summary = value;
          break;
        case "LOCATION":
          currentEvent.location = value;
          break;
        case "DTSTART":
          currentEvent.startTime = formatTime(value);
          break;
        case "DTEND":
          currentEvent.endTime = formatTime(value);
          break;
        case "RRULE":
          // Parse RRULE to extract days and recurrence
          const { days, recurrence } = parseRecurrenceRule(value);
          currentEvent.days = days;
          currentEvent.recurrence = recurrence;
          break;
        case "EXDATE":
          if (!currentEvent.exclusions) {
            currentEvent.exclusions = [];
          }
          currentEvent.exclusions.push(formatDate(value));
          break;
      }
    }
  }

  return events;
}

export function formatDateTime(icsDateTime: string): Date {
  // Convert ICS datetime format to ISO format for date-fns parsing
  // ICS format: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
  // Convert to: YYYY-MM-DDTHH:MM:SS
  const dateStr = icsDateTime.replace(/[TZ]/g, "");
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const hour = dateStr.substring(8, 10) || "00";
  const minute = dateStr.substring(10, 12) || "00";
  const second = dateStr.substring(12, 14) || "00";

  const isoString = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  return parseISO(isoString);
}

export function formatTime(icsDateTime: string): string {
  // Extract time portion from ICS datetime format using date-fns
  const date = formatDateTime(icsDateTime);
  return format(date, "HH:mm:ss");
}

export function formatDate(icsDateTime: string): string {
  // Extract date portion from ICS datetime format using date-fns
  const date = formatDateTime(icsDateTime);
  return format(date, "yyyy-MM-dd");
}

export function parseRecurrenceRule(rrule: string): {
  days: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday")[];
  recurrence: "weekly" | "biweekly";
} {
  // Parse RRULE to extract days and recurrence type
  // RRULE format: FREQ=WEEKLY;BYDAY=MO,WE,FR;UNTIL=20251231T235959Z
  const parts = rrule.split(";");

  let days: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday")[] = [];
  let recurrence: "weekly" | "biweekly" = "weekly";

  for (const part of parts) {
    if (part.startsWith("BYDAY=")) {
      const dayValues = part.substring(6).split(",");
      days = dayValues
        .map((day) => {
          switch (day) {
            case "MO":
              return "monday";
            case "TU":
              return "tuesday";
            case "WE":
              return "wednesday";
            case "TH":
              return "thursday";
            case "FR":
              return "friday";
            default:
              return null;
          }
        })
        .filter(
          (
            day
          ): day is
            | "monday"
            | "tuesday"
            | "wednesday"
            | "thursday"
            | "friday" => day !== null
        );
    } else if (part.startsWith("FREQ=")) {
      const freq = part.substring(5);
      if (freq === "WEEKLY") {
        recurrence = "weekly";
      } else if (freq === "BIWEEKLY") {
        recurrence = "biweekly";
      }
    }
  }

  return { days, recurrence };
}
