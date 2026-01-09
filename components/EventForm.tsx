"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField } from "./form-fields/TextField";
import { SelectField } from "./form-fields/SelectField";
import { LoaderCircle } from "lucide-react";
import { classTypeIcons } from "@/constants";
import { CheckboxesField } from "./form-fields/CheckboxesField";
import { ColorField } from "./form-fields/ColorField";
import { CourseField } from "./form-fields/CourseField";
import TimeField from "./form-fields/TimeField";
import { RadioGroupField } from "./form-fields/RadioGroupField";
import { createEvent, updateEvent } from "@/lib/actions/events.actions";
import { useRouter } from "next/navigation";
import {
  createCourseColor,
  updateCourseColor,
} from "@/lib/actions/courseColors.actions";
import {
  findOverlappingEvents,
  isTimeInRange,
  getOverlapErrorMessage,
} from "@/lib/utils";
import { Label } from "./ui/label";

// Create dynamic schema with events context
const createEventFormSchema = (
  events: UserEvent[],
  currentEventId?: string
) => {
  return z
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
      color: z
        .enum([
          "red",
          "orange",
          "yellow",
          "green",
          "cyan",
          "blue",
          "purple",
          "pink",
        ])
        .nullable()
        .refine((val) => val !== null, "Select a color for your class"),
    })
    .superRefine((data, ctx) => {
      // Early return if required fields are missing
      if (!data.startTime || !data.endTime) {
        return;
      }

      // Validate end time is after start time
      const start = new Date(`2000-01-01T${data.startTime}`);
      const end = new Date(`2000-01-01T${data.endTime}`);
      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be after start time",
          path: ["endTime"],
        });
        return;
      }

      // Validate start time is within allowed range
      if (!isTimeInRange(data.startTime, false)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start time must be between 8:00 AM and 7:00 PM",
          path: ["startTime"],
        });
      }

      // Validate end time is within allowed range
      if (!isTimeInRange(data.endTime, true)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be between 8:00 AM and 7:00 PM",
          path: ["endTime"],
        });
      }

      // Validate overlaps only if we have days selected
      if (data.days && data.days.length > 0) {
        const overlaps = findOverlappingEvents(data, events, currentEventId);

        if (overlaps.length > 0) {
          const eventNames = getOverlapErrorMessage(overlaps);

          // Add errors to both time fields
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Overlaps with ${eventNames}`,
            path: ["startTime"],
          });

          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Overlaps with ${eventNames}`,
            path: ["endTime"],
          });
        }
      }
    });
};

type EventFormData = z.infer<ReturnType<typeof createEventFormSchema>>;

interface EventFormProps {
  eventToEdit?: UserEvent | null;
  onCancel?: () => void;
  term?: string;
  events?: UserEvent[];
  user: User;
}

export default function EventForm({
  eventToEdit,
  onCancel,
  term,
  events = [],
  user,
}: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<EventFormData>({
    resolver: zodResolver(createEventFormSchema(events, eventToEdit?.$id)),
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
      color: eventToEdit?.courseColor?.color || null,
    },
  });

  // Watch form values to update warnings dynamically
  const formValues = form.watch();

  // Watch time fields to trigger validation on both when either changes
  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");
  const days = form.watch("days");

  // Handle course selection to update color field
  const handleCourseSelect = (course: any) => {
    if (course.color && course.color.color) {
      // If the course has a saved color, update the color field
      form.setValue("color", course.color.color);
    } else {
      // If no saved color, reset to null to show fallback color
      form.setValue("color", null);
    }
  };

  // Trigger validation on both time fields when either changes
  useEffect(() => {
    if (startTime && endTime) {
      form.trigger(["startTime", "endTime"]);
    }
  }, [startTime, endTime, days, form]);

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
      if (!data.course) {
        throw new Error("Course ID not found");
      }

      // Ensure color is provided before submission
      if (!data.color) {
        throw new Error("Color is required");
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
        if (
          eventToEdit.courseColor &&
          data.color !== eventToEdit.courseColor.color
        ) {
          await updateCourseColor({
            course: data.course.$id,
            user: user.$id,
            color: data.color,
            $id: eventToEdit.courseColor.$id,
          });
        } else {
          await createCourseColor({
            course: data.course.$id,
            user: user.$id,
            color: data.color,
          });
        }
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
        if (data.color) {
          await createCourseColor({
            course: data.course.$id,
            user: user.$id,
            color: data.color,
          });
        }
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
            onCourseSelect={handleCourseSelect}
            userId={user.$id}
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

        <TextField
          form={form}
          name="location"
          label="Location"
          placeholder="e.g., Room 101, Online"
          warning={missingFields.location}
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

        <CheckboxesField
          form={form}
          name="days"
          label="Days"
          options={[
            { value: "monday", label: "Mon" },
            { value: "tuesday", label: "Tue" },
            { value: "wednesday", label: "Wed" },
            { value: "thursday", label: "Thu" },
            { value: "friday", label: "Fri" },
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

        <div className="flex justify-between gap-2 pt-4">
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
