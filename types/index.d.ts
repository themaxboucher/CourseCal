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

declare interface User {
  userId: string;
  email: string;
  name: string;
  major: string;
  avatar: string;
  hasCompletedOnboarding: boolean;
  hasBeenWelcomed: boolean;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

declare interface Course {
  subjectCode: string;
  subject: string;
  catalogNumber: number;
  title: string;
  description: string;
  units: number;
  instructionalComponents: "lecture" | "tutorial" | "laboratory" | "seminar";
  color?: CourseColor;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

declare interface Major {
  major: string;
  degreeType: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

declare interface Term {
  year: number;
  season: "winter" | "spring" | "summer" | "fall";
  startDate: string;
  endDate: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

declare interface CourseColor {
  course: string;
  user: string;
  color: Color;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

declare interface CourseColorDB {
  course: string;
  user: string;
  color: Color;
  $id: string;
}

declare interface DisplayEvent {
  course: {
    subjectCode: string;
    catalogNumber: number;
    title: string;
  };
  type: string;
  days: string[];
  startTime: string;
  endTime: string;
  location: string;
  courseColor: { color: string };
}

declare interface CalendarEvent {
  user: string;
  course: Course | null;
  summary?: string;
  type: "lecture" | "tutorial" | "lab" | "seminar" | null;
  location: string;
  startTime: string;
  endTime: string;
  days?: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday")[];
  recurrence?: "weekly" | "biweekly";
  exclusions?: string[];
  term: string;
  courseColor: CourseColor;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

declare interface CalendarEventDB {
  user: string;
  course?: string;
  summary?: string;
  type?: "lecture" | "tutorial" | "lab" | "seminar";
  location: string;
  startTime: string;
  endTime: string;
  days: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday")[];
  recurrence: "weekly" | "biweekly";
  exclusions: string[];
  term: string;
}

declare interface ParsedEvent {
  summary: string;
  location?: string;
  startTime: string;
  endTime: string;
  days?: ("monday" | "tuesday" | "wednesday" | "thursday" | "friday")[];
  recurrence?: "weekly" | "biweekly";
  exclusions?: string[];
}
