declare type Override<T, R> = Omit<T, keyof R> & R;

declare interface User {
  userId: string;
  email: string;
  name: string;
  major: string;
  avatar: string;
  hasCompletedOnboarding: boolean;
  hasBeenWelcomed: boolean;
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

declare interface Course {
  subjectCode: string;
  subject: string;
  catalogNumber: number;
  title: string;
  description: string;
  units: number;
  instructionalComponents: "lecture" | "tutorial" | "laboratory" | "seminar";
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

declare interface Major {
  major: string;
  degreeType: string;
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

declare interface Term {
  year: number;
  season: "winter" | "spring" | "summer" | "fall";
  startDate: string;
  endDate: string;
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
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
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
}
