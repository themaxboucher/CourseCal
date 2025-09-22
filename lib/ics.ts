// Only the properties that are needed for the app are included
export interface ParsedEvent {
  summary: string;
  location?: string;
  startTime: string;
  endTime: string;
  recurrence?: string;
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
          currentEvent.startTime = value;
          break;
        case "DTEND":
          currentEvent.endTime = value;
          break;
        case "RRULE":
          currentEvent.recurrence = value;
          break;
        case "EXDATE":
          if (!currentEvent.exclusions) {
            currentEvent.exclusions = [];
          }
          currentEvent.exclusions.push(value);
          break;
      }
    }
  }

  return events;
}

export function formatDateTime(icsDateTime: string): Date {
  // Handle ICS datetime format: YYYYMMDDTHHMMSS or YYYYMMDDTHHMMSSZ
  const dateStr = icsDateTime.replace(/[TZ]/g, "");
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
  const day = parseInt(dateStr.substring(6, 8));
  const hour = parseInt(dateStr.substring(8, 10)) || 0;
  const minute = parseInt(dateStr.substring(10, 12)) || 0;
  const second = parseInt(dateStr.substring(12, 14)) || 0;

  return new Date(year, month, day, hour, minute, second);
}
