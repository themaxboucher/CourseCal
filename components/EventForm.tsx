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

// Form validation schema
const eventFormSchema = z
  .object({
    courseId: z
      .string()
      .min(1, "Select a course")
      .refine((val) => val !== "none", "Select a course"),
    type: z
      .enum(["lecture", "tutorial", "lab", "seminar"])
      .refine((val) => val !== undefined, "Select a class type"),
    days: z
      .array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday"]))
      .min(1, "Select at least one day for your class"),
    recurrence: z.string().min(1, "Select how often this class repeats"),
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
}

export default function EventForm({ eventToEdit, onCancel }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      courseId: eventToEdit?.course?.$id || "none",
      type: eventToEdit?.type || undefined,
      days: eventToEdit?.days || [],
      recurrence: eventToEdit?.recurrence || "none",
      startTime: eventToEdit?.startTime || "",
      endTime: eventToEdit?.endTime || "",
      location: eventToEdit?.location || "",
      color: eventColors[0],
    },
  });

  async function onSubmit(data: EventFormData) {
    console.log("Event form data:", data);
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
        <div className="flex items-center gap-2">
          <ColorField form={form} name="color" />
          <CourseField form={form} name="courseId" className="flex-grow" />
        </div>
        <SelectField
          form={form}
          name="type"
          label="Class Type"
          placeholder="Select class type"
          options={classTypeOptions}
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
        />

        <RadioGroupField
          form={form}
          name="recurrence"
          label="Recurrence"
          options={[
            { value: "weekly", label: "Every week" },
            { value: "biweekly", label: "Every other week" },
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <TimeField form={form} name="startTime" label="Start Time" />
          <TimeField form={form} name="endTime" label="End Time" />
        </div>
        <TextField
          form={form}
          name="location"
          label="Location"
          placeholder="e.g., Room 101, Online"
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
