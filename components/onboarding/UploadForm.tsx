"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseICSFile, type ParsedEvent } from "@/lib/ics";

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
      const events: ParsedEvent[] = parseICSFile(fileContent);

      console.log(`Found ${events.length} events in the calendar file`);
      console.log(events);

      alert(
        `Successfully parsed ${events.length} events! Check the console for details.`
      );
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
          <Label htmlFor="ics-file">.ics Calendar File</Label>
          <Input
            id="ics-file"
            type="file"
            accept=".ics"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={!file || isLoading}>
          {isLoading ? "Parsing..." : "Upload and Parse"}
        </Button>
      </form>
    </div>
  );
}
