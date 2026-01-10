import {
  LoaderCircle,
  Snowflake,
  Sun,
  Leaf,
  Sprout,
  GraduationCap,
  Book,
  FlaskConical,
  Presentation,
  Users,
} from "lucide-react";

export const icons = {
  LoaderCircle,
  Snowflake,
  Sun,
  Leaf,
  Sprout,
  GraduationCap,
};

export const seasonColors = {
  winter: "text-blue-500",
  spring: "text-green-500",
  summer: "text-yellow-500",
  fall: "text-orange-500",
  default: "text-gray-500",
};

export const seasonIcons = {
  winter: Snowflake,
  spring: Sprout,
  summer: Sun,
  fall: Leaf,
  default: GraduationCap,
};

export const classTypeIcons = {
  lecture: Presentation,
  tutorial: Book,
  lab: FlaskConical,
  seminar: Users,
  default: Book,
};

export const eventColors = {
  red: "bg-red-500 border-red-300 dark:bg-red-700 dark:border-red-900 text-white hover:bg-red-500 hover:dark:bg-red-700",
  orange:
    "bg-orange-500 border-orange-300 dark:bg-orange-700 dark:border-orange-900 text-white hover:bg-orange-500 hover:dark:bg-orange-700",
  yellow:
    "bg-yellow-400 border-yellow-300 dark:bg-yellow-500 dark:border-yellow-700 text-white hover:bg-yellow-400 hover:dark:bg-yellow-500",
  green:
    "bg-green-500 border-green-300 dark:bg-green-700 dark:border-green-900 text-white hover:bg-green-500 hover:dark:bg-green-700",
  cyan: "bg-cyan-500 border-cyan-300 dark:bg-cyan-700 dark:border-cyan-900 text-white hover:bg-cyan-500 hover:dark:bg-cyan-700",
  blue: "bg-blue-500 border-blue-300 dark:bg-blue-700 dark:border-blue-900 text-white hover:bg-blue-500 hover:dark:bg-blue-700",
  purple:
    "bg-purple-500 border-purple-300 dark:bg-purple-700 dark:border-purple-900 text-white hover:bg-purple-500 hover:dark:bg-purple-700",
  pink: "bg-pink-500 border-pink-300 dark:bg-pink-700 dark:border-pink-900 text-white hover:bg-pink-500 hover:dark:bg-pink-700",
  fallback:
    "bg-zinc-500 border-zinc-300 dark:bg-zinc-700 dark:border-zinc-900 text-white hover:bg-zinc-500 hover:dark:bg-zinc-700",
};

export const lightEventColors = {
  red: "bg-red-500 border-red-300 text-white hover:bg-red-500",
  orange: "bg-orange-500 border-orange-300 text-white hover:bg-orange-500",
  yellow: "bg-yellow-400 border-yellow-300 text-white hover:bg-yellow-400",
  green: "bg-green-500 border-green-300 text-white hover:bg-green-500",
  cyan: "bg-cyan-500 border-cyan-300 text-white hover:bg-cyan-500",
  blue: "bg-blue-500 border-blue-300 text-white hover:bg-blue-500",
  purple: "bg-purple-500 border-purple-300 text-white hover:bg-purple-500",
  pink: "bg-pink-500 border-pink-300 text-white hover:bg-pink-500",
  fallback: "bg-zinc-500 border-zinc-300 text-white hover:bg-zinc-500",
};

export const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

// Mock term for display events
const mockTerm = {
  $id: "mock",
  $createdAt: "2025-01-01",
  $updatedAt: "2025-01-01",
  year: 2025,
  season: "winter" as const,
  startDate: "2025-01-06",
  endDate: "2025-04-15",
};

export const backgroundOptions: {
  value: BackgroundType;
  label: string;
  preview: string;
  light: string;
  dark: string;
}[] = [
  {
    value: "plain",
    label: "Plain",
    preview: "bg-gradient-to-b from-white to-zinc-300",
    light: "bg-gradient-to-b from-white to-zinc-100",
    dark: "bg-gradient-to-b from-zinc-800 to-zinc-950",
  },
  {
    value: "ice",
    label: "Ice",
    preview: "bg-gradient-to-b from-sky-300 to-blue-500",
    light: "bg-gradient-to-b from-sky-100 to-blue-200",
    dark: "bg-gradient-to-b from-sky-500 to-blue-800",
  },
  {
    value: "fire",
    label: "Fire",
    preview: "bg-gradient-to-b from-orange-400 to-red-500",
    light: "bg-gradient-to-b from-orange-100 to-red-200",
    dark: "bg-gradient-to-b from-orange-500 to-red-800",
  },
  {
    value: "sunset",
    label: "Sunset",
    preview: "bg-gradient-to-b from-amber-300 via-orange-400 to-rose-500",
    light: "bg-gradient-to-b from-amber-100 via-orange-200 to-rose-300",
    dark: "bg-gradient-to-b from-orange-500 via-rose-600 to-purple-800",
  },
  {
    value: "aurora",
    label: "Aurora",
    preview: "bg-gradient-to-b from-emerald-400 via-teal-400 to-violet-500",
    light: "bg-gradient-to-b from-emerald-100 via-teal-200 to-violet-200",
    dark: "bg-gradient-to-b from-emerald-600 via-cyan-700 to-violet-800",
  },
  {
    value: "ocean",
    label: "Ocean",
    preview: "bg-gradient-to-b from-cyan-400 via-sky-500 to-blue-600",
    light: "bg-gradient-to-b from-cyan-100 via-sky-200 to-blue-300",
    dark: "bg-gradient-to-b from-teal-600 via-cyan-700 to-indigo-900",
  },
  {
    value: "forest",
    label: "Forest",
    preview: "bg-gradient-to-b from-lime-400 via-green-500 to-emerald-600",
    light: "bg-gradient-to-b from-lime-100 via-green-200 to-emerald-300",
    dark: "bg-gradient-to-b from-green-600 via-green-700 to-emerald-900",
  },
  {
    value: "lavender",
    label: "Lavender",
    preview: "bg-gradient-to-b from-violet-400 via-purple-500 to-fuchsia-500",
    light: "bg-gradient-to-b from-violet-100 via-purple-200 to-fuchsia-200",
    dark: "bg-gradient-to-b from-violet-600 via-purple-700 to-fuchsia-900",
  },
  {
    value: "mint",
    label: "Mint",
    preview: "bg-gradient-to-b from-teal-300 via-cyan-400 to-emerald-500",
    light: "bg-gradient-to-b from-teal-100 via-cyan-100 to-emerald-200",
    dark: "bg-gradient-to-b from-teal-600 via-cyan-700 to-emerald-800",
  },
  {
    value: "galaxy",
    label: "Galaxy",
    preview: "bg-gradient-to-b from-indigo-400 via-purple-500 to-pink-500",
    light: "bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200",
    dark: "bg-gradient-to-b from-slate-900 via-purple-900 to-violet-800",
  },
  {
    value: "rose",
    label: "Rose",
    preview: "bg-gradient-to-b from-pink-400 via-rose-500 to-red-500",
    light: "bg-gradient-to-b from-pink-100 via-rose-200 to-red-200",
    dark: "bg-gradient-to-b from-pink-600 via-rose-700 to-red-900",
  },
  {
    value: "midnight",
    label: "Midnight",
    preview: "bg-gradient-to-b from-slate-500 via-blue-800 to-indigo-900",
    light: "bg-gradient-to-b from-slate-200 via-blue-200 to-indigo-300",
    dark: "bg-gradient-to-b from-slate-900 via-blue-950 to-indigo-950",
  },
];

export const displayEvents: ScheduleEvent[] = [
  // Core Classes - Mixed schedule with variety
  {
    course: {
      courseCode: "MATH 101",
      title: "Calculus I",
    } as Course,
    type: "lecture",
    days: ["monday", "wednesday", "friday"],
    startTime: "09:00",
    endTime: "10:00",
    location: "Math Building Room 101",
    courseColor: { color: "blue" },
    term: mockTerm,
  },
  {
    course: {
      courseCode: "PHYS 201",
      title: "Physics I: Mechanics",
    } as Course,
    type: "tutorial",
    days: ["tuesday", "thursday"],
    startTime: "09:30",
    endTime: "10:30",
    location: "Physics Lab 205",
    courseColor: { color: "orange" },
    term: mockTerm,
  },
  {
    course: {
      courseCode: "CHAOS 520",
      title: "Embracing the Chaos of Life",
    } as Course,
    type: "lecture",
    days: ["monday", "wednesday"],
    startTime: "10:30",
    endTime: "12:00",
    location: "The Chaos Chamber (Room 911)",
    courseColor: { color: "red" },
    term: mockTerm,
  },
  {
    course: {
      courseCode: "CHEM 301",
      title: "Organic Chemistry I",
    } as Course,
    type: "seminar",
    days: ["tuesday", "thursday"],
    startTime: "11:00",
    endTime: "12:30",
    location: "Chemistry Lab 301",
    courseColor: { color: "yellow" },
    term: mockTerm,
  },
  {
    course: {
      courseCode: "NAP 101",
      title: "Strategic Napping Techniques",
    } as Course,
    type: "lab",
    days: ["friday"],
    startTime: "11:00",
    endTime: "12:00",
    location: "The Comfy Couch (Student Lounge)",
    courseColor: { color: "cyan" },
    term: mockTerm,
  },
  {
    course: {
      courseCode: "BIOL 401",
      title: "Cell Biology",
    } as Course,
    type: "lecture",
    days: ["monday", "tuesday", "thursday", "friday"],
    startTime: "13:00",
    endTime: "14:00",
    location: "Biology Building Room 401",
    courseColor: { color: "green" },
    term: mockTerm,
  },
  {
    course: {
      courseCode: "PSYC 150",
      title: "Introduction to Psychology",
    } as Course,
    type: "tutorial",
    days: ["wednesday"],
    startTime: "13:30",
    endTime: "15:00",
    location: "Psychology Building Room 150",
    courseColor: { color: "pink" },
    term: mockTerm,
  },
  {
    course: {
      courseCode: "ECON 180",
      title: "Microeconomics",
    } as Course,
    type: "lab",
    days: ["tuesday", "thursday"],
    startTime: "14:30",
    endTime: "16:00",
    location: "Economics Building Room 180",
    courseColor: { color: "red" },
    term: mockTerm,
  },
  {
    course: {
      courseCode: "HIST 380",
      title: "World History",
    } as Course,
    type: "seminar",
    days: ["monday", "friday"],
    startTime: "15:00",
    endTime: "16:30",
    location: "History Building Room 380",
    courseColor: { color: "purple" },
    term: mockTerm,
  },
  {
    course: {
      courseCode: "ENGL 120",
      title: "English Composition",
    } as Course,
    type: "tutorial",
    days: ["wednesday"],
    startTime: "16:00",
    endTime: "17:00",
    location: "English Building Room 120",
    courseColor: { color: "cyan" },
    term: mockTerm,
  },
];
