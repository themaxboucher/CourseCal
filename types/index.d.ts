// === Utility Types ===
declare type Override<T, R> = Omit<T, keyof R> & R;

// Appwrite document fields - used for all stored documents
declare type AppwriteDoc = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
};

// === Primitive Types ===
declare type Color =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "purple"
  | "pink";

declare type Day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
declare type EventType = "lecture" | "tutorial" | "lab" | "seminar";
declare type Recurrence = "weekly" | "biweekly";
declare type Season = "winter" | "spring" | "summer" | "fall";

// === Domain Types ===
declare interface User extends AppwriteDoc {
  userId: string;
  email: string;
  name: string;
  major: string;
  avatar: string;
  hasCompletedOnboarding: boolean;
  hasBeenWelcomed: boolean;
}

declare interface Course extends AppwriteDoc {
  courseCode: string;
  subject?: string;
  title?: string;
  description?: string;
  units?: number;
  instructionalComponents?: "lecture" | "tutorial" | "laboratory" | "seminar";
  color?: CourseColor;
}

declare interface Term extends AppwriteDoc {
  year: number;
  season: Season;
  startDate: string;
  endDate: string;
}

declare interface CourseColor {
  course: string;
  color: Color;
}

declare interface UserCourseColor extends CourseColor, AppwriteDoc {
  user: string;
}

declare interface CourseColorDB extends UserCourseColor {
  $id: string;
}

// For creating/updating course colors (no Appwrite metadata)
declare type CourseColorInput = Pick<
  CourseColor,
  "course" | "user" | "color"
> & { $id?: string };

// === Event Types ===

// Event format from AI parsing
declare interface ParsedEvent {
  courseCode: string;
  location: string;
  type: EventType | null;
  startTime: string;
  endTime: string;
  days: Day[];
}

declare interface ScheduleEvent {
  course: Course;
  location?: string;
  type?: EventType;
  startTime: string;
  endTime: string;
  days: Day[];
  term: Term;
  courseColor: { color: Color };
  recurrence?: Recurrence;
  exclusions?: string[];
}

// Full stored event with all relationships
declare interface UserEvent extends ScheduleEvent, AppwriteDoc {
  user: string;
}

// For creating events in the database
declare type CalendarEventInput = Omit<
  UserEvent,
  keyof AppwriteDoc | "course" | "courseColor"
> & {
  course?: string;
  days: Day[];
  recurrence: Recurrence;
  exclusions: string[];
};

declare type CalendarEventDB = {
  user: string;
  course: string;
  type: EventType;
  location: string;
  startTime: string;
  endTime: string;
  days: Day[];
  recurrence: Recurrence;
  exclusions: string[];
  term: string;
};

declare type BackgroundType =
  | "plain"
  | "ice"
  | "fire"
  | "sunset"
  | "aurora"
  | "ocean"
  | "forest"
  | "lavender"
  | "mint"
  | "galaxy"
  | "rose"
  | "midnight";

declare type FontType = "default" | "serif" | "writing" | "rounded" | "stencil" | "pixels";

declare type ThemeType = "light" | "dark";