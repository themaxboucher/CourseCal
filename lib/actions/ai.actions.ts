"use server";

import { OpenRouter } from "@openrouter/sdk";
import { headers } from "next/headers";
import { ratelimit } from "../ratelimit";
import { buildings } from "@/constants/buildings";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const AI_MODEL = "google/gemini-2.0-flash-001";

// Generate the building abbreviations mapping for the AI prompt
const buildingAbbreviations = buildings
  .map((b) => `"${b.name}" → ${b.code}`)
  .join("\n");

const SYSTEM_PROMPT = `You are an assistant that extracts university course schedule information from screenshots.

Your task:
1. First, determine if the image is a university/college course schedule (like from a student portal, registration system, or calendar).
2. If it's NOT a schedule, set isSchedule to false and events to an empty array.
3. If it IS a schedule, set isSchedule to true and extract all events.

Rules:
- Course codes should be in the format "SUBJECT CODE NUMBER" and include nothing else, e.g. "CPSC 231"
- Use lowercase for days: "monday", "tuesday", "wednesday", "thursday", "friday"
- Times must be in 24-hour format with leading zeros (e.g. "09:00", "14:30")
- Extract ALL events/classes visible in the schedule
- If a class appears on multiple days at the same time, include all days in the "days" array

IMPORTANT - Location Abbreviation:
When extracting location/room information, convert full building names to their abbreviated codes.
Use the format "CODE ROOM_NUMBER" (e.g., "ICT 101" instead of "Information & Communication Technologies 101").

Building abbreviations:
${buildingAbbreviations}
"OFF-SITE WEB-BASED" → Online

If a building name matches (or closely matches) one in the list, use the abbreviation code.
If you cannot match the building name, use the original text as-is.`;

const RESPONSE_SCHEMA = {
  name: "schedule_analysis",
  strict: true,
  schema: {
    type: "object",
    properties: {
      isSchedule: {
        type: "boolean",
        description: "Whether the image is a university course schedule",
      },
      events: {
        type: "array",
        description: "Array of course events extracted from the schedule",
        items: {
          type: "object",
          properties: {
            courseCode: {
              type: "string",
              description: "Course code, e.g. 'CPSC 231'",
            },
            location: {
              type: "string",
              description: "Room/building if visible, otherwise empty string",
            },
            type: {
              type: ["string", "null"],
              enum: ["lecture", "tutorial", "lab", "seminar", null],
              description:
                "Type of class: 'lecture', 'tutorial', 'lab', or 'seminar'. Null if not visible.",
            },
            startTime: {
              type: "string",
              description: "Start time in 24-hour format HH:MM, e.g. '09:00'",
            },
            endTime: {
              type: "string",
              description: "End time in 24-hour format HH:MM, e.g. '10:30'",
            },
            days: {
              type: "array",
              description: "Days the class meets",
              items: {
                type: "string",
                enum: ["monday", "tuesday", "wednesday", "thursday", "friday"],
              },
            },
          },
          required: [
            "courseCode",
            "location",
            "startTime",
            "endTime",
            "days",
            "type",
          ],
          additionalProperties: false,
        },
      },
    },
    required: ["isSchedule", "events"],
    additionalProperties: false,
  },
} as const;

/**
 * Merges events that have identical properties except for days.
 * Events with the same courseCode, location, type, startTime, and endTime
 * are combined into a single event with all days merged.
 */
function mergeEvents(events: ParsedEvent[]): ParsedEvent[] {
  const eventMap = new Map<string, ParsedEvent>();

  for (const event of events) {
    const key = `${event.courseCode}|${event.location}|${event.type}|${event.startTime}|${event.endTime}`;
    const existing = eventMap.get(key);

    if (existing) {
      // Merge days, avoiding duplicates
      existing.days = [...new Set([...existing.days, ...event.days])];
    } else {
      eventMap.set(key, { ...event, days: [...event.days] });
    }
  }

  return Array.from(eventMap.values());
}

export type ScheduleAnalysisResult =
  | { success: true; isSchedule: true; events: ScheduleEvent[] }
  | { success: true; isSchedule: false }
  | { success: false; error: string };

export async function analyzeScheduleImage(
  imageBase64: string
): Promise<ScheduleAnalysisResult> {
  try {
    // Rate limiting: Get the user's IP address and check their limit
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";

    const { success: withinLimit } = await ratelimit.limit(ip);

    if (!withinLimit) {
      return {
        success: false,
        error:
          "You've reached the limit for schedule analysis. Please try again in an hour.",
      };
    }

    const response = await openrouter.chat.send({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract the schedule events from this image.",
            },
            {
              type: "image_url",
              imageUrl: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      responseFormat: {
        type: "json_schema",
        jsonSchema: RESPONSE_SCHEMA,
      },
    });

    const messageContent = response.choices[0]?.message?.content;
    if (!messageContent || typeof messageContent !== "string") {
      return { success: false, error: "No response from AI" };
    }

    const parsed = JSON.parse(messageContent);

    if (!parsed.isSchedule) {
      return { success: true, isSchedule: false };
    }

    // Create course colors - assign a unique color to each course
    const colors: Color[] = [
      "red",
      "orange",
      "yellow",
      "green",
      "cyan",
      "blue",
      "purple",
      "pink",
    ];
    const uniqueCourses = [
      ...new Set(parsed.events.map((e: ParsedEvent) => e.courseCode)),
    ] as string[];
    const courseColorMap = new Map<string, Color>(
      uniqueCourses.map((course, index) => [
        course,
        colors[index % colors.length],
      ])
    );

    // Merge events that have identical properties except for days
    const mergedEvents = mergeEvents(parsed.events);

    // Validate and return events
    const events: ScheduleEvent[] = mergedEvents.map((event: ParsedEvent) => ({
      course: {
        courseCode: event.courseCode,
      },
      location: event.location,
      type: event.type ?? undefined,
      startTime: event.startTime,
      endTime: event.endTime,
      days: event.days,
      courseColor: { color: courseColorMap.get(event.courseCode)! },
      recurrence: "weekly",
      exclusions: [],
    }));

    return { success: true, isSchedule: true, events };
  } catch (error) {
    console.error("OpenRouter error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to analyze schedule",
    };
  }
}
