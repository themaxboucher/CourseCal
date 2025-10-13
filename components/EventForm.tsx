"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldWrapper } from "./form-fields/FormFieldWrapper";
import { TextField } from "./form-fields/TextField";
import { SelectField } from "./form-fields/SelectField";
import { LoaderCircle } from "lucide-react";
import { Input } from "./ui/input";
import { classTypeIcons } from "@/constants";
import { CheckboxesField } from "./form-fields/CheckboxesField";
import { ColorField } from "./form-fields/ColorField";
import { CourseSelect } from "./CourseSelect";
import { SwitchField } from "./form-fields/SwitchField";
import TimeField from "./form-fields/TimeField";

// Form validation schema
const eventFormSchema = z.object({
  courseId: z.string().optional(),
  type: z.enum(["lecture", "tutorial", "lab", "seminar"]).optional(),
  days: z
    .array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday"]))
    .optional(),
  recurrence: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().optional(),
});

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
      recurrence: eventToEdit?.recurrence || "none",
      startTime: eventToEdit?.startTime || "",
      endTime: eventToEdit?.endTime || "",
      location: eventToEdit?.location || "",
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
        <div className="flex items-center gap-4">
          <ColorField />
          <CourseSelect className="w-full" />
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
        <SwitchField
          form={form}
          name="recurrence"
          label={
            form.watch("recurrence") === "every other week"
              ? "Every other week"
              : "Every week"
          }
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
