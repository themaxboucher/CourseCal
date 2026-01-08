"use server";

import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const AI_MODEL = "openai/gpt-4o-mini";

const SYSTEM_PROMPT = `You are an assistant that extracts university course schedule information from screenshots.

Your task:
1. First, determine if the image is a university/college course schedule (like from a student portal, registration system, or calendar).
2. If it's NOT a schedule, respond with: {"isSchedule": false}
3. If it IS a schedule, extract all events and respond with: {"isSchedule": true, "events": [...]}

Each event in the "events" array must have this exact structure:
{
  "summary": "Course code, e.g. 'CPSC 231'",
  "location": "Room/building if visible, otherwise empty string",
  "startTime": "24-hour format HH:MM, e.g. '09:00'",
  "endTime": "24-hour format HH:MM, e.g. '10:30'",
  "days": ["monday", "tuesday", "wednesday", "thursday", "friday"] // only include days the class meets
}

Rules:
- Use lowercase for days: "monday", "tuesday", "wednesday", "thursday", "friday"
- Times must be in 24-hour format with leading zeros
- Extract ALL events/classes visible in the schedule
- If a class appears on multiple days at the same time, include all days in the "days" array
- Respond ONLY with valid JSON, no markdown or explanation`;

export type ScheduleAnalysisResult =
  | { success: true; isSchedule: true; events: ParsedEvent[] }
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
              text: "Extract the schedule events from this image. Respond with JSON only.",
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
    });

    const messageContent = response.choices[0]?.message?.content;
    let text = "";

    if (typeof messageContent === "string") {
      text = messageContent;
    } else if (Array.isArray(messageContent)) {
      text = messageContent
        .filter((item) => item.type === "text")
        .map((item) => item.text)
        .join("");
    }

    // Clean up potential markdown code blocks
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    // Parse the JSON response
    const parsed = JSON.parse(text);

    if (!parsed.isSchedule) {
      return { success: true, isSchedule: false };
    }

    // Validate and return events
    const events: ParsedEvent[] = parsed.events.map((event: any) => ({
      summary: String(event.summary || ""),
      location: event.location ? String(event.location) : undefined,
      startTime: String(event.startTime || ""),
      endTime: String(event.endTime || ""),
      days: Array.isArray(event.days) ? event.days : undefined,
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
