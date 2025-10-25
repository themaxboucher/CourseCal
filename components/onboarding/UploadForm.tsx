"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseICSFile } from "@/lib/ics";
import { createBulkEvents } from "@/lib/actions/events.actions";
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
import { markOnboardingCompleted } from "@/lib/actions/users.actions";

interface UploadFormProps {
  terms: Term[];
  user: User;
  selectedTermId?: string;
}

interface UploadFormData {
  file: FileList;
  term: string;
}

export default function UploadForm({
  terms,
  user,
  selectedTermId,
}: UploadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<UploadFormData>({
    defaultValues: {
      file: undefined,
      term: selectedTermId || getCurrentTerm(terms)?.$id || "",
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

      // Use bulk creation instead of sequential loop
      const result = await createBulkEvents(parsedEvents, user.$id, data.term);

      if (result.success) {
        await markOnboardingCompleted(user.$id);
        router.push("/schedule");
      } else {
        form.setError("file", {
          message: "Error creating events. Please try again.",
        });
      }
    } catch (error) {
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
          {!selectedTermId && (
            <SelectField
              form={form}
              name="term"
              label="Term"
              options={termOptions}
              placeholder="Select a term"
              disabled={isLoading}
            />
          )}

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
