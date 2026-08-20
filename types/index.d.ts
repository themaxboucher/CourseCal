// === Utility Types ===
declare type Override<T, R> = Omit<T, keyof R> & R;

declare type MingcuteIcon = import("react").ComponentType<
  import("@mingcute/react").IconProps
>;

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

declare interface ParsedEvent {
  courseCode: string;
  location: string;
  type: ClassType | null;
  startTime: string;
  endTime: string;
  days: WeekDay[];
}

declare interface LocalEvent {
  // IndexedDB assigns an auto-incrementing id when the event is stored.
  // It's optional here because freshly built events haven't been persisted yet.
  id?: number;
  course_code: string;
  course: number | null;
  course_color: Color;
  type: ClassType | null;
  location: string;
  start_time: string;
  end_time: string;
  days: WeekDay[];
  term: number | null;
  recurrence: Recurrence;
}
