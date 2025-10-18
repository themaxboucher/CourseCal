"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField } from "./form-fields/TextField";
import { SelectField } from "./form-fields/SelectField";
import { LoaderCircle } from "lucide-react";
import { classTypeIcons, eventColors } from "@/constants";
import { CheckboxesField } from "./form-fields/CheckboxesField";
import { ColorField } from "./form-fields/ColorField";
import { CourseField } from "./form-fields/CourseField";
import TimeField from "./form-fields/TimeField";
import { RadioGroupField } from "./form-fields/RadioGroupField";
import { createEvent, updateEvent } from "@/lib/actions/events.actions";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { useRouter } from "next/navigation";

// Form validation schema
const eventFormSchema = z
  .object({
    course: z
      .object({
        $id: z.string(),
        subjectCode: z.string(),
        catalogNumber: z.number(),
        title: z.string(),
      })
      .nullable()
      .refine((val) => val !== null, "Select a course"),
    type: z.enum(["lecture", "tutorial", "lab", "seminar"]),
    days: z
      .array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday"]))
      .min(1, "Select at least one day for your class"),
    recurrence: z.enum(["weekly", "biweekly"]),
    startTime: z.string().min(1, "Select a start time for your class"),
    endTime: z.string().min(1, "Select an end time for your class"),
    location: z
      .string()
      .min(1, "Enter a location for your class")
      .min(2, "Location must be at least 2 characters long"),
    color: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        const start = new Date(`2000-01-01T${data.startTime}`);
        const end = new Date(`2000-01-01T${data.endTime}`);
        return end > start;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  eventToEdit?: CalendarEvent | null;
  onCancel?: () => void;
  term?: string;
}

export default function EventForm({
  eventToEdit,
  onCancel,
  term,
}: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      course: eventToEdit?.course
        ? {
            $id: eventToEdit.course.$id!,
            subjectCode: eventToEdit.course.subjectCode,
            catalogNumber: eventToEdit.course.catalogNumber,
            title: eventToEdit.course.title,
          }
        : null,
      type: eventToEdit?.type || undefined,
      days: eventToEdit?.days || [],
      recurrence: eventToEdit?.recurrence || "weekly",
      startTime: eventToEdit?.startTime || "",
      endTime: eventToEdit?.endTime || "",
      location: eventToEdit?.location || "",
      color: eventColors[0],
    },
  });

  // Watch form values to update warnings dynamically
  const formValues = form.watch();

  // Function to check for missing fields based on current form values
  const getMissingFields = () => {
    if (!eventToEdit) return {};

    const missing: Record<string, string> = {};

    // Only show warnings for fields that were originally missing AND are still empty
    if (!eventToEdit.course && !formValues.course) {
      missing.course = "Course information is missing";
    }
    if (!eventToEdit.type && !formValues.type) {
      missing.type = "Class type is not specified";
    }
    if (
      (!eventToEdit.days || eventToEdit.days.length === 0) &&
      (!formValues.days || formValues.days.length === 0)
    ) {
      missing.days = "No days selected for this class";
    }
    if (!eventToEdit.recurrence && !formValues.recurrence) {
      missing.recurrence = "Recurrence pattern is not set";
    }
    if (!eventToEdit.startTime && !formValues.startTime) {
      missing.startTime = "Start time is not specified";
    }
    if (!eventToEdit.endTime && !formValues.endTime) {
      missing.endTime = "End time is not specified";
    }
    if (
      (!eventToEdit.location || eventToEdit.location.trim() === "") &&
      (!formValues.location || formValues.location.trim() === "")
    ) {
      missing.location = "Location is not provided";
    }

    return missing;
  };

  const missingFields = getMissingFields();

  async function onSubmit(data: EventFormData) {
    setIsSubmitting(true);
    try {
      // Get the user
      const user = await getLoggedInUser();
      if (!user) {
        throw new Error("User not found");
      }

      if (!data.course) {
        throw new Error("Course ID not found");
      }

      if (eventToEdit) {
        if (!eventToEdit.$id) {
          throw new Error("Event ID not found");
        }
        const newEvent: Partial<CalendarEventDB> = {
          user: user.$id,
          course: data.course.$id,
          type: data.type,
          location: data.location,
          startTime: data.startTime,
          endTime: data.endTime,
          days: data.days,
          recurrence: data.recurrence,
          exclusions: [],
        };
        await updateEvent(eventToEdit.$id, newEvent);
        // Update course color (if changed)
      } else {
        if (!term) {
          throw new Error("Term not found");
        }
        const newEvent: CalendarEventDB = {
          user: user.$id,
          course: data.course.$id,
          type: data.type,
          location: data.location,
          startTime: data.startTime,
          endTime: data.endTime,
          days: data.days,
          recurrence: data.recurrence,
          exclusions: [],
          term: term,
        };
        await createEvent(newEvent);
        // Create course color
      }
      router.refresh();
      onCancel?.();
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const classTypeOptions = [
    { value: "lecture", label: "Lecture", icon: classTypeIcons.lecture },
    { value: "tutorial", label: "Tutorial", icon: classTypeIcons.tutorial },
    { value: "lab", label: "Lab", icon: classTypeIcons.lab },
    { value: "seminar", label: "Seminar", icon: classTypeIcons.seminar },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-2">
          <ColorField form={form} name="color" />
          <CourseField
            form={form}
            name="course"
            className="flex-grow"
            warning={missingFields.course}
          />
        </div>
        <SelectField
          form={form}
          name="type"
          label="Class Type"
          placeholder="Select class type"
          options={classTypeOptions}
          warning={missingFields.type}
        />

        <CheckboxesField
          form={form}
          name="days"
          label="Days"
          options={[
            { value: "monday", label: "Monday" },
            { value: "tuesday", label: "Tuesday" },
            { value: "wednesday", label: "Wednesday" },
            { value: "thursday", label: "Thursday" },
            { value: "friday", label: "Friday" },
          ]}
          warning={missingFields.days}
        />

        <RadioGroupField
          form={form}
          name="recurrence"
          label="Recurrence"
          options={[
            { value: "weekly", label: "Every week" },
            { value: "biweekly", label: "Every other week" },
          ]}
          warning={missingFields.recurrence}
        />

        <div className="grid grid-cols-2 gap-4">
          <TimeField
            form={form}
            name="startTime"
            label="Start Time"
            warning={missingFields.startTime}
          />
          <TimeField
            form={form}
            name="endTime"
            label="End Time"
            warning={missingFields.endTime}
          />
        </div>
        <TextField
          form={form}
          name="location"
          label="Location"
          placeholder="e.g., Room 101, Online"
          warning={missingFields.location}
        />
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {!isSubmitting && "Save"}
            {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
          </Button>
        </div>
      </form>
    </Form>
  );
}
