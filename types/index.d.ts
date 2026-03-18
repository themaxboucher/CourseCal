// === Utility Types ===
declare type Override<T, R> = Omit<T, keyof R> & R;

declare type Color =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "cyan"
  | "blue"
  | "purple"
  | "pink";
declare type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";
declare type ClassType = "lecture" | "tutorial" | "lab" | "seminar";
declare type Recurrence = "weekly" | "biweekly";
declare type Season = "winter" | "spring" | "summer" | "fall";

declare interface User {
  id: string;
  email: string;
  name: string;
  major: string;
  avatar: string;
  hasCompletedOnboarding: boolean;
  hasBeenWelcomed: boolean;
  createdAt: string;
}

declare interface ParsedEvent {
  courseCode: string;
  location: string;
  type: ClassType | null;
  startTime: string;
  endTime: string;
  days: WeekDay[];
}

declare interface LocalEvent {
  courseCode: string;
  course: number | null;
  courseColor: Color;
  type: ClassType | null;
  location: string;
  startTime: string;
  endTime: string;
  days: WeekDay[];
  term: number | null;
  recurrence: Recurrence;
}

declare interface DBEvent{
  user: string;
  courseCode: string;
  course: number | null;
  type: ClassType | null;
  location: string;
  startTime: string;
  endTime: string;
  days: WeekDay[];
  term: number | null;
  recurrence: Recurrence;
}

declare interface Course {
  code: string;
  title: string;
  subject: string;
  description?: string;
  color?: CourseColor;
}

declare interface Term {
  year: number;
  season: Season;
  startDate: string;
  endDate: string;
}

declare interface CourseColor {
  user: string;
  course: string;
  color: Color;
}

// For creating/updating course colors (no Appwrite metadata)
declare type CourseColorInput = Pick<
  CourseColor,
  "course" | "user" | "color"
> & { $id?: string };

// Full stored event with all relationships
declare interface UserEvent extends LocalEvent {
  user: string;
}

// For creating events in the database
declare type CalendarEventInput = Omit<
  UserEvent,
  keyof AppwriteDoc | "course" | "courseColor"
> & {
  course?: string;
  days: WeekDay[];
  recurrence: Recurrence;
  exclusions: string[];
};

declare type CalendarEventDB = {
  user: string;
  course: string;
  type: ClassType;
  location: string;
  startTime: string;
  endTime: string;
  days: WeekDay[];
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

declare type FontType =
  | "default"
  | "serif"
  | "writing"
  | "rounded"
  | "stencil"
  | "pixels";

declare type ThemeType = "light" | "dark";

declare type EventInfoType = "time" | "location";
