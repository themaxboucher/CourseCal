"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseICSFile, type ParsedEvent } from "@/lib/ics";
import { createEvent } from "@/lib/actions/events.actions";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { LoaderCircle } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith(".ics")) {
      setFile(selectedFile);
    } else {
      alert("Please select a valid .ics file");
      event.target.value = "";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) {
      alert("Please select an ICS file first");
      return;
    }

    setIsLoading(true);

    try {
      const fileContent = await file.text();
      const parsedEvents: ParsedEvent[] = parseICSFile(fileContent);

      const user = await getLoggedInUser();

      for (const parsedEvent of parsedEvents) {
        try {
          const calendarEvent: CalendarEvent = {
            user: user.$id,
            course: null, // TODO: Find course from Appwrite database based on summary
            summary: parsedEvent.summary,
            location: parsedEvent.location || "",
            startTime: parsedEvent.startTime,
            endTime: parsedEvent.endTime,
            recurrence: parsedEvent.recurrence,
            exclusions: parsedEvent.exclusions,
          };

          await createEvent(calendarEvent);
        } catch (error) {
          console.error("Error creating event:", error);
        }
      }
    } catch (error) {
      console.error("Error parsing ICS file:", error);
      alert(
        "Error parsing the ICS file. Please check the console for details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            id="ics-file"
            type="file"
            accept=".ics"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={!file || isLoading}>
          {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!isLoading && "Upload"}
        </Button>
      </form>
    </div>
  );
}
