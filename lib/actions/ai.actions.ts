"use server";

import { OpenRouter } from "@openrouter/sdk";
import { getCurrentTerm } from "../utils";
import { getTerms } from "./terms.actions";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const AI_MODEL = "openai/gpt-4o-mini";

const SYSTEM_PROMPT = `You are an assistant that extracts university course schedule information from screenshots.

Your task:
1. First, determine if the image is a university/college course schedule (like from a student portal, registration system, or calendar).
2. If it's NOT a schedule, set isSchedule to false and events to an empty array.
3. If it IS a schedule, set isSchedule to true and extract all events.

Rules:
- Course codes should be in the format "SUBJECT CODE NUMBER", e.g. "CPSC 231"
- Use lowercase for days: "monday", "tuesday", "wednesday", "thursday", "friday"
- Times must be in 24-hour format with leading zeros (e.g. "09:00", "14:30")
- Extract ALL events/classes visible in the schedule
- If a class appears on multiple days at the same time, include all days in the "days" array`;

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
              description:
                "Type of class if visible: 'lecture', 'tutorial', 'lab', or 'seminar'. Null if not visible.",
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
          required: ["courseCode", "location", "startTime", "endTime", "days", "type"],
          additionalProperties: false,
        },
      },
    },
    required: ["isSchedule", "events"],
    additionalProperties: false,
  },
} as const;

export type ScheduleAnalysisResult =
  | { success: true; isSchedule: true; events: ScheduleEvent[] }
  | { success: true; isSchedule: false }
  | { success: false; error: string };

export async function analyzeScheduleImage(
  imageBase64: string
): Promise<ScheduleAnalysisResult> {
  try {
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

    let term: Term | null = null;
    try {
      const terms = await getTerms();
      term = getCurrentTerm(terms);
    } catch (error) {
      console.error("Error getting terms:", error);
      return { success: false, error: "Failed to get terms" };
    }

    // Create course colors - assign a unique color to each course
    const colors: Color[] = ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"];
    const uniqueCourses = [...new Set(parsed.events.map((e: ParsedEvent) => e.courseCode))] as string[];
    const courseColorMap = new Map<string, Color>(
      uniqueCourses.map((course, index) => [course, colors[index % colors.length]])
    );

    // Validate and return events
    const events: ScheduleEvent[] = parsed.events.map((event: ParsedEvent) => ({
      course: {
        courseCode: event.courseCode,
      },
      location: event.location,
      type: event.type,
      startTime: event.startTime,
      endTime: event.endTime,
      days: event.days,
      term: term,
      courseColor: { color: courseColorMap.get(event.courseCode)! },
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
