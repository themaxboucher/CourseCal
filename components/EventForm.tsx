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
import {
  addEvent as addLocalEvent,
  updateEvent as updateLocalEvent,
  updateCourseColor as updateLocalCourseColor,
} from "@/lib/indexeddb";
import { useRouter } from "next/navigation";
import { createCourseColor } from "@/lib/actions/courseColors.actions";
import {
  findOverlappingEvents,
  isTimeInRange,
  getOverlapErrorMessage,
  getCurrentTerm,
} from "@/lib/utils";
import { getTerms } from "@/lib/actions/terms.actions";

// Schema for guest mode - simpler course field (just a string)
const createGuestEventFormSchema = () => {
  return z
    .object({
      courseCode: z.string().min(1, "Enter a course code"),
      type: z.enum(["lecture", "tutorial", "lab", "seminar"]).nullable(),
      days: z
        .array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday"]))
        .min(1, "Select at least one day for your class"),
      recurrence: z.enum(["weekly", "biweekly"]),
      startTime: z.string().min(1, "Select a start time for your class"),
      endTime: z.string().min(1, "Select an end time for your class"),
      location: z.string(),
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
      if (!data.startTime || !data.endTime) return;

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

      if (!isTimeInRange(data.startTime, false)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start time must be between 8:00 AM and 7:00 PM",
          path: ["startTime"],
        });
      }

      if (!isTimeInRange(data.endTime, true)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be between 8:00 AM and 7:00 PM",
          path: ["endTime"],
        });
      }
    });
};

// Schema for logged-in users - full course object
const createEventFormSchema = (
  events: (UserEvent | ScheduleEvent)[],
  currentEventId?: string
) => {
  return z
    .object({
      course: z
        .object({
          $id: z.string(),
          courseCode: z.string(),
          title: z.string().optional(),
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
      if (!data.startTime || !data.endTime) return;

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

      if (!isTimeInRange(data.startTime, false)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start time must be between 8:00 AM and 7:00 PM",
          path: ["startTime"],
        });
      }

      if (!isTimeInRange(data.endTime, true)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End time must be between 8:00 AM and 7:00 PM",
          path: ["endTime"],
        });
      }

      if (data.days && data.days.length > 0) {
        const overlaps = findOverlappingEvents(data, events as UserEvent[], currentEventId);
        if (overlaps.length > 0) {
          const eventNames = getOverlapErrorMessage(overlaps);
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
type GuestEventFormData = z.infer<ReturnType<typeof createGuestEventFormSchema>>;

interface EventFormProps {
  eventToEdit?: UserEvent | ScheduleEvent | null;
  onCancel?: () => void;
  term?: string;
  events?: (UserEvent | ScheduleEvent)[];
  user?: User;
  isGuest?: boolean;
  onEventSaved?: () => void;
}

export default function EventForm({
  eventToEdit,
  onCancel,
  term,
  events = [],
  user,
  isGuest = false,
  onEventSaved,
}: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Get event ID based on mode
  const eventId = isGuest
    ? (eventToEdit as ScheduleEvent & { id: number })?.id
    : (eventToEdit as UserEvent)?.$id;

  // Guest form
  const guestForm = useForm<GuestEventFormData>({
    resolver: zodResolver(createGuestEventFormSchema()),
    defaultValues: {
      courseCode: eventToEdit?.course?.courseCode || "",
      type: eventToEdit?.type || null,
      days: eventToEdit?.days || [],
      recurrence: eventToEdit?.recurrence || "weekly",
      startTime: eventToEdit?.startTime || "",
      endTime: eventToEdit?.endTime || "",
      location: eventToEdit?.location || "",
      color: (eventToEdit?.courseColor?.color as Color) || null,
    },
  });

  // Logged-in user form
  const userForm = useForm<EventFormData>({
    resolver: zodResolver(createEventFormSchema(events, eventId as string)),
    defaultValues: {
      course: (eventToEdit as UserEvent)?.course
        ? {
            $id: (eventToEdit as UserEvent).course.$id!,
            courseCode: (eventToEdit as UserEvent).course.courseCode,
            title: (eventToEdit as UserEvent).course.title,
          }
        : null,
      type: eventToEdit?.type || undefined,
      days: eventToEdit?.days || [],
      recurrence: eventToEdit?.recurrence || "weekly",
      startTime: eventToEdit?.startTime || "",
      endTime: eventToEdit?.endTime || "",
      location: eventToEdit?.location || "",
      color: (eventToEdit?.courseColor?.color as Color) || null,
    },
  });

  // Use separate watch for each form to avoid type union issues
  const guestFormValues = guestForm.watch();
  const userFormValues = userForm.watch();
  const formValues = isGuest ? guestFormValues : userFormValues;

  // Watch time fields to trigger validation on both when either changes
  const startTime = isGuest ? guestForm.watch("startTime") : userForm.watch("startTime");
  const endTime = isGuest ? guestForm.watch("endTime") : userForm.watch("endTime");
  const days = isGuest ? guestForm.watch("days") : userForm.watch("days");

  // Handle course selection to update color field (only for logged-in users)
  const handleCourseSelect = (course: any) => {
    if (course.color && course.color.color) {
      // If the course has a saved color, update the color field
      userForm.setValue("color", course.color.color);
    } else {
      // If no saved color, reset to null to show fallback color
      userForm.setValue("color", null);
    }
  };

  // Trigger validation on both time fields when either changes
  useEffect(() => {
    if (startTime && endTime) {
      if (isGuest) {
        guestForm.trigger(["startTime", "endTime"]);
      } else {
        userForm.trigger(["startTime", "endTime"]);
      }
    }
  }, [startTime, endTime, days, isGuest, guestForm, userForm]);

  // Function to check for missing fields based on current form values
  const getMissingFields = () => {
    if (!eventToEdit) return {};

    const missing: Record<string, string> = {};

    // Only show warnings for fields that were originally missing AND are still empty
    if (isGuest) {
      if (!eventToEdit.course?.courseCode && !guestFormValues.courseCode) {
        missing.course = "Course information is missing";
      }
    } else {
      if (!eventToEdit.course && !userFormValues.course) {
        missing.course = "Course information is missing";
      }
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

  // Guest submit handler
  async function onGuestSubmit(data: GuestEventFormData) {
    setIsSubmitting(true);
    try {
      if (!data.color) {
        throw new Error("Color is required");
      }

      // Get the current term for new events
      let eventTerm: Term | null = (eventToEdit as ScheduleEvent)?.term || null;
      if (!eventTerm && !eventToEdit) {
        const terms = await getTerms();
        eventTerm = getCurrentTerm(terms);
      }
      if (!eventTerm) {
        throw new Error("No term available");
      }

      const scheduleEvent: ScheduleEvent = {
        course: { courseCode: data.courseCode } as Course,
        type: data.type || undefined,
        location: data.location,
        startTime: data.startTime,
        endTime: data.endTime,
        days: data.days,
        term: eventTerm!,
        courseColor: { color: data.color },
        recurrence: data.recurrence,
      };

      if (eventToEdit && eventId !== undefined) {
        // Update existing event
        await updateLocalEvent(eventId as number, scheduleEvent);
      } else {
        // Add new event
        await addLocalEvent(scheduleEvent);
      }

      // Update course color in IndexedDB
      await updateLocalCourseColor(data.courseCode, data.color);

      onEventSaved?.();
      onCancel?.();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Logged-in user submit handler
  async function onUserSubmit(data: EventFormData) {
    setIsSubmitting(true);
    try {
      if (!data.course) {
        throw new Error("Course ID not found");
      }
      if (!data.color) {
        throw new Error("Color is required");
      }
      if (!user) {
        throw new Error("User not found");
      }

      if (eventToEdit) {
        if (!eventId) {
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
        await updateEvent(eventId as string, newEvent);
        // Update course color (if changed)
        const userEvent = eventToEdit as UserEvent;
        if (
          userEvent.courseColor &&
          data.color !== userEvent.courseColor.color
        ) {
          // Create new course color (server will handle upsert)
          await createCourseColor({
            course: data.course.$id,
            user: user.$id,
            color: data.color,
          });
        } else if (!userEvent.courseColor) {
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

  if (isGuest) {
    return (
      <Form {...guestForm}>
        <form onSubmit={guestForm.handleSubmit(onGuestSubmit)} className="space-y-4">
          <div className="flex gap-2">
            <ColorField form={guestForm} name="color" />
            <TextField
              form={guestForm}
              name="courseCode"
              placeholder="e.g., ENGG 200"
              className="flex-grow w-full"
              warning={missingFields.course}
            />
          </div>
          <SelectField
            form={guestForm}
            name="type"
            label="Class Type"
            placeholder="Select class type"
            options={classTypeOptions}
            warning={missingFields.type}
          />

          <TextField
            form={guestForm}
            name="location"
            label="Location"
            placeholder="e.g., Room 101, Online"
            warning={missingFields.location}
          />

          <div className="grid grid-cols-2 gap-4">
            <TimeField
              form={guestForm}
              name="startTime"
              label="Start Time"
              warning={missingFields.startTime}
            />
            <TimeField
              form={guestForm}
              name="endTime"
              label="End Time"
              warning={missingFields.endTime}
            />
          </div>

          <CheckboxesField
            form={guestForm}
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
            form={guestForm}
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

  return (
    <Form {...userForm}>
      <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
        <div className="flex gap-2">
          <ColorField form={userForm} name="color" />
          <CourseField
            form={userForm}
            name="course"
            className="flex-grow"
            warning={missingFields.course}
            onCourseSelect={handleCourseSelect}
            userId={user!.$id}
          />
        </div>
        <SelectField
          form={userForm}
          name="type"
          label="Class Type"
          placeholder="Select class type"
          options={classTypeOptions}
          warning={missingFields.type}
        />

        <TextField
          form={userForm}
          name="location"
          label="Location"
          placeholder="e.g., Room 101, Online"
          warning={missingFields.location}
        />

        <div className="grid grid-cols-2 gap-4">
          <TimeField
            form={userForm}
            name="startTime"
            label="Start Time"
            warning={missingFields.startTime}
          />
          <TimeField
            form={userForm}
            name="endTime"
            label="End Time"
            warning={missingFields.endTime}
          />
        </div>

        <CheckboxesField
          form={userForm}
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
          form={userForm}
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
