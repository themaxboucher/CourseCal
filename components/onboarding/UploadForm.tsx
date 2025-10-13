"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseICSFile, type ParsedEvent } from "@/lib/ics";
import { createEvent } from "@/lib/actions/events.actions";
import { getCourseFromTitle } from "@/lib/actions/courses.actions";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SelectField } from "@/components/form-fields/SelectField";
import { seasonColors, seasonIcons } from "@/constants";
import { getCurrentTerm } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface UploadFormProps {
  terms: Term[];
  user: User;
}

interface UploadFormData {
  file: FileList;
  term: string;
}

export default function UploadForm({ terms, user }: UploadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<UploadFormData>({
    defaultValues: {
      file: undefined,
      term: getCurrentTerm(terms)?.$id || "",
    },
  });

  const onSubmit = async (data: UploadFormData) => {
    const file = data.file[0];
    if (!file) {
      form.setError("file", { message: "Please select an ICS file" });
      return;
    }

    if (!data.term) {
      form.setError("term", { message: "Please select a term" });
      return;
    }

    if (!user.$id) {
      alert("User not found");
      return;
    }

    setIsLoading(true);

    try {
      const fileContent = await file.text();
      const parsedEvents: ParsedEvent[] = parseICSFile(fileContent);

      for (const parsedEvent of parsedEvents) {
        try {
          const course = await getCourseFromTitle(parsedEvent.summary);

          const calendarEvent: CalendarEvent = {
            user: user.$id,
            course: course ? course.$id : null,
            summary: parsedEvent.summary,
            location: parsedEvent.location || "",
            type: null,
            startTime: parsedEvent.startTime,
            endTime: parsedEvent.endTime,
            days: parsedEvent.days,
            recurrence: parsedEvent.recurrence,
            exclusions: parsedEvent.exclusions,
            term: data.term,
          };

          await createEvent(calendarEvent);
        } catch (error) {
          console.error("Error creating event:", error);
        }
      }
      router.push("/schedule");
    } catch (error) {
      console.error("Error parsing ICS file:", error);
      form.setError("file", {
        message: "Error parsing the ICS file. Please check the file format.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare term options for the select field
  const termOptions = terms.map((term) => ({
    value: term.$id || "",
    label: `${term.season.charAt(0).toUpperCase() + term.season.slice(1)} ${
      term.year
    }`,
    icon: seasonIcons[term.season],
    color: seasonColors[term.season],
  }));

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <SelectField
            form={form}
            name="term"
            label="Term"
            options={termOptions}
            placeholder="Select a term"
            disabled={isLoading}
          />

          <FormField
            control={form.control}
            name="file"
            rules={{
              required: "Please select an ICS file",
              validate: (value) => {
                if (!value || value.length === 0) {
                  return "Please select an ICS file";
                }
                const file = value[0];
                if (!file.name.endsWith(".ics")) {
                  return "Please select a valid .ics file";
                }
                return true;
              },
            }}
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>ICS File</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".ics"
                    onChange={(e) => onChange(e.target.files)}
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
