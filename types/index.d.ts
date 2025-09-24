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
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  subjectCode: string;
  subject: string;
  catalogNumber: number;
  title: string;
  description: string;
  units: number;
  instructionalComponents: "lecture" | "tutorial" | "laboratory" | "seminar";
}

declare interface Major {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  major: string;
  degreeType: string;
}

declare interface CalendarEvent {
  id: string;
  course: Course;
  location: string;
  startTime: string;
  endTime: string;
  recurrence?: string;
  exclusions?: string[];
}
