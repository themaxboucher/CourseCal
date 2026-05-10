"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { TextField } from "./form-fields/TextField";
import { SelectField } from "./form-fields/SelectField";
import { CheckboxesField } from "./form-fields/CheckboxesField";
import { ColorField } from "./form-fields/ColorField";
import { CourseField } from "./form-fields/CourseField";
import TimeField from "./form-fields/TimeField";
import { RadioGroupField } from "./form-fields/RadioGroupField";

import { classTypeIcons } from "@/constants";
import { findOverlappingEvents, getOverlapErrorMessage } from "@/lib/utils";
import {
  type AnyEvent,
  getEventColor,
  isLocalEvent,
} from "@/lib/utils/events";
import {
  addEvent as addLocalEvent,
  updateEvent as updateLocalEvent,
} from "@/lib/indexeddb";
import {
  createEvent,
  updateEvent,
} from "@/lib/actions/events.actions";
import { upsertCourseColor } from "@/lib/actions/courseColors.actions";
import type { Tables, TablesInsert } from "@/types/supabase";

// --- Constants ---

const COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
] as const;

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

const CLASS_TYPES = ["lecture", "tutorial", "lab", "seminar"] as const;
const RECURRENCES = ["weekly", "biweekly"] as const;

const DAY_OPTIONS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
];

const RECURRENCE_OPTIONS = [
  { value: "weekly", label: "Every week" },
  { value: "biweekly", label: "Every other week" },
];

const CLASS_TYPE_OPTIONS = [
  { value: "lecture", label: "Lecture", icon: classTypeIcons.lecture },
  { value: "tutorial", label: "Tutorial", icon: classTypeIcons.tutorial },
  { value: "lab", label: "Lab", icon: classTypeIcons.lab },
  { value: "seminar", label: "Seminar", icon: classTypeIcons.seminar },
];

// --- Types ---

type SelectedCourse = {
  id: number;
  code: string;
  title?: string;
};

// --- Schema ---

function buildSchema(
  events: AnyEvent[],
  isGuest: boolean,
  currentEventId?: number
) {
  return z
    .object({
      courseCode: z.string(),
      course: z
        .object({
          id: z.number(),
          code: z.string(),
          title: z.string().optional(),
        })
        .nullable(),
      type: z.enum(CLASS_TYPES).nullable(),
      days: z
        .array(z.enum(DAYS))
        .min(1, "Select at least one day for your class"),
      recurrence: z.enum(RECURRENCES),
      startTime: z.string().min(1, "Select a start time for your class"),
      endTime: z.string().min(1, "Select an end time for your class"),
      location: z.string(),
      color: z
        .enum(COLORS)
        .nullable()
        .refine((val) => val !== null, "Select a color for your class"),
    })
    .superRefine((data, ctx) => {
      // Course is required, but the source field differs by mode.
      if (isGuest) {
        if (!data.courseCode.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter a course code",
            path: ["courseCode"],
          });
        }
      } else if (!data.course) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select a course",
          path: ["course"],
        });
      }

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

      if (data.days.length === 0) return;

      const overlaps = findOverlappingEvents(
        { days: data.days, startTime: data.startTime, endTime: data.endTime },
        events,
        currentEventId
      );
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
    });
}

type EventFormData = z.infer<ReturnType<typeof buildSchema>>;

// --- Component ---

interface EventFormProps {
  eventToEdit?: AnyEvent | null;
  onCancel?: () => void;
  // Required when creating a new event. When editing, the term is read from
  // the event being edited.
  term?: number;
  events?: AnyEvent[];
  user?: Tables<"users">;
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
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const eventId = eventToEdit?.id;

  // For Supabase-backed events, the joined `course` is an object containing
  // its primary key alongside the rest of its fields. Locally-stored events
  // only carry the foreign-key id.
  const initialCourse = useMemo<SelectedCourse | null>(() => {
    if (isGuest || !eventToEdit) return null;
    if (isLocalEvent(eventToEdit)) {
      return eventToEdit.course != null
        ? { id: eventToEdit.course, code: eventToEdit.course_code }
        : null;
    }
    if (!eventToEdit.course) return null;
    return {
      id: eventToEdit.course.id,
      code: eventToEdit.course.code,
      title: eventToEdit.course.title,
    };
  }, [isGuest, eventToEdit]);

  const form = useForm<EventFormData>({
    resolver: zodResolver(buildSchema(events, isGuest, eventId)),
    defaultValues: {
      courseCode: eventToEdit?.course_code ?? "",
      course: initialCourse,
      type: eventToEdit?.type ?? null,
      days: eventToEdit?.days ?? [],
      recurrence: eventToEdit?.recurrence ?? "weekly",
      startTime: eventToEdit?.start_time ?? "",
      endTime: eventToEdit?.end_time ?? "",
      location: eventToEdit?.location ?? "",
      color: eventToEdit ? getEventColor(eventToEdit) : null,
    },
  });

  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");
  const days = form.watch("days");

  // Re-validate time fields together so the time-order/overlap errors update
  // when any of the time-related fields change.
  useEffect(() => {
    if (startTime && endTime) {
      form.trigger(["startTime", "endTime"]);
    }
  }, [startTime, endTime, days, form]);

  // When a course is picked from the CourseField, mirror its data into the
  // form's flat fields so submission has everything it needs.
  function handleCourseSelect(course: SelectedCourse & { color?: Color }) {
    form.setValue("courseCode", course.code, { shouldValidate: true });
    if (course.color) {
      form.setValue("color", course.color);
    }
  }

  // Surface warnings for fields that were originally empty (e.g. from an
  // imported/AI-parsed event) and remain empty as the user edits.
  const missingFields = useMemo<Record<string, string>>(() => {
    if (!eventToEdit) return {};
    const v = form.getValues();
    const m: Record<string, string> = {};

    if (!eventToEdit.course_code && !v.courseCode) {
      m.course = "Course information is missing";
    }
    if (!eventToEdit.type && !v.type) {
      m.type = "Class type is not specified";
    }
    if (!eventToEdit.days?.length && !v.days?.length) {
      m.days = "No days selected for this class";
    }
    if (!eventToEdit.recurrence && !v.recurrence) {
      m.recurrence = "Recurrence pattern is not set";
    }
    if (!eventToEdit.start_time && !v.startTime) {
      m.startTime = "Start time is not specified";
    }
    if (!eventToEdit.end_time && !v.endTime) {
      m.endTime = "End time is not specified";
    }
    if (!eventToEdit.location?.trim() && !v.location?.trim()) {
      m.location = "Location is not provided";
    }
    return m;
    // We intentionally read live form values here without subscribing to each
    // one; warnings recompute when the fields above are watched elsewhere.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventToEdit, form.watch()]);

  async function onSubmit(data: EventFormData) {
    if (!data.color) return;
    setIsSubmitting(true);
    try {
      if (isGuest) {
        await saveGuestEvent(data, eventId);
      } else {
        if (!user) throw new Error("User not found");
        if (!data.course) throw new Error("Course not selected");
        // When editing an existing event we keep its existing term; only
        // creation requires the caller to specify the term up front.
        const eventTerm =
          eventId !== undefined ? eventToEdit?.term ?? null : term ?? null;
        if (eventId === undefined && eventTerm === null) {
          throw new Error("Term not found");
        }
        await saveUserEvent(data, user.id, eventTerm, eventId);
        router.refresh();
      }
      onEventSaved?.();
      onCancel?.();
    } catch (error) {
      console.error("Error saving event:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isGuest ? (
          <div className="flex flex-col gap-2 w-full">
            <Label>Course</Label>
            <div className="flex gap-2 w-full">
              <ColorField form={form} name="color" />
              <TextField
                form={form}
                name="courseCode"
                placeholder="e.g., ENGG 200"
                warning={missingFields.course}
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <ColorField form={form} name="color" />
            <CourseField
              form={form}
              name="course"
              className="flex-grow"
              warning={missingFields.course}
              onCourseSelect={handleCourseSelect}
              userId={user!.id}
            />
          </div>
        )}

        <SelectField
          form={form}
          name="type"
          label="Class Type"
          placeholder="Select class type"
          options={CLASS_TYPE_OPTIONS}
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
          options={DAY_OPTIONS}
          warning={missingFields.days}
        />

        <RadioGroupField
          form={form}
          name="recurrence"
          label="Recurrence"
          options={RECURRENCE_OPTIONS}
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
            {isSubmitting ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// --- Save helpers ---

async function saveGuestEvent(data: EventFormData, eventId?: number) {
  const localEvent: LocalEvent = {
    course_code: data.courseCode.trim(),
    course: null,
    course_color: data.color!,
    type: data.type,
    location: data.location,
    start_time: data.startTime,
    end_time: data.endTime,
    days: data.days,
    term: null,
    recurrence: data.recurrence,
  };

  if (eventId !== undefined) {
    await updateLocalEvent(eventId, localEvent);
  } else {
    await addLocalEvent(localEvent);
  }
}

async function saveUserEvent(
  data: EventFormData,
  userId: string,
  term: number | null,
  eventId?: number
) {
  if (!data.course) throw new Error("Course not selected");

  const dbEvent: TablesInsert<"events"> = {
    user: userId,
    course_code: data.course.code,
    course: data.course.id,
    type: data.type,
    location: data.location,
    start_time: data.startTime,
    end_time: data.endTime,
    days: data.days,
    term,
    recurrence: data.recurrence,
  };

  if (eventId !== undefined) {
    await updateEvent(eventId, dbEvent);
    if (data.color) {
      await upsertCourseColor({
        user: userId,
        course: data.course.id,
        color: data.color,
      });
    }
  } else {
    // Creation goes through createEvent, which ensures the course_colors row
    // exists (and overwrites it with the chosen color when provided).
    await createEvent(dbEvent, data.color ?? undefined);
  }
}
