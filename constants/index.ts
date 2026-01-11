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

// Mock terms for display events
const fallTerm = {
  $id: "mock-fall",
  $createdAt: "2025-09-01",
  $updatedAt: "2025-09-01",
  year: 2025,
  season: "fall" as const,
  startDate: "2025-09-08",
  endDate: "2025-12-15",
};

const winterTerm = {
  $id: "mock-winter",
  $createdAt: "2026-01-01",
  $updatedAt: "2026-01-01",
  year: 2026,
  season: "winter" as const,
  startDate: "2026-01-06",
  endDate: "2026-04-15",
};

export const displayEvents1: ScheduleEvent[] = [
  {
    course: {
      courseCode: "ENDG 319",
      title: "Engineering Design",
    } as Course,
    type: "lecture",
    days: ["monday", "wednesday", "friday"],
    startTime: "08:00",
    endTime: "08:50",
    location: "Engineering Block C 70",
    courseColor: { color: "blue" },
    term: fallTerm,
  },
  {
    course: {
      courseCode: "ENDG 319",
      title: "Engineering Design",
    } as Course,
    type: "tutorial",
    days: ["tuesday"],
    startTime: "08:00",
    endTime: "09:15",
    location: "Science Theatres 143",
    courseColor: { color: "blue" },
    term: fallTerm,
  },
  {
    course: {
      courseCode: "ECON 201",
      title: "Economics",
    } as Course,
    type: "tutorial",
    days: ["thursday"],
    startTime: "08:30",
    endTime: "09:20",
    location: "Social Science 113",
    courseColor: { color: "red" },
    term: fallTerm,
  },
  {
    course: {
      courseCode: "ENEL 353",
      title: "Digital Circuits",
    } as Course,
    type: "lecture",
    days: ["monday", "wednesday", "friday"],
    startTime: "09:00",
    endTime: "09:50",
    location: "Science Theatres 141",
    courseColor: { color: "yellow" },
    term: fallTerm,
  },
  {
    course: {
      courseCode: "ECON 201",
      title: "Economics",
    } as Course,
    type: "lecture",
    days: ["tuesday", "thursday"],
    startTime: "09:30",
    endTime: "10:45",
    location: "Murray Fraser Hall 162",
    courseColor: { color: "red" },
    term: fallTerm,
  },
  {
    course: {
      courseCode: "ENSF 337",
      title: "Programming Fundamentals",
    } as Course,
    type: "lecture",
    days: ["monday", "wednesday", "friday"],
    startTime: "11:00",
    endTime: "11:50",
    location: "Info & Communication Tech 122",
    courseColor: { color: "orange" },
    term: fallTerm,
  },
  {
    course: {
      courseCode: "ENEL 353",
      title: "Digital Circuits",
    } as Course,
    type: "tutorial",
    days: ["monday"],
    startTime: "12:00",
    endTime: "12:50",
    location: "Science Theatres 145",
    courseColor: { color: "yellow" },
    term: fallTerm,
  },
  {
    course: {
      courseCode: "ENSF 300",
      title: "Software Engineering",
    } as Course,
    type: "lecture",
    days: ["tuesday", "thursday"],
    startTime: "12:30",
    endTime: "13:45",
    location: "Info & Communication Tech 319",
    courseColor: { color: "green" },
    term: fallTerm,
  },
  {
    course: {
      courseCode: "ENSF 300",
      title: "Software Engineering",
    } as Course,
    type: "lab",
    days: ["monday"],
    startTime: "15:00",
    endTime: "16:50",
    location: "Info & Communication Tech 319",
    courseColor: { color: "green" },
    term: fallTerm,
  },
  {
    course: {
      courseCode: "ENEL 353",
      title: "Digital Circuits",
    } as Course,
    type: "lab",
    days: ["tuesday"],
    startTime: "15:30",
    endTime: "18:15",
    location: "Engineering Block G 130",
    courseColor: { color: "yellow" },
    term: fallTerm,
  },
  {
    course: {
      courseCode: "ENSF 337",
      title: "Programming Fundamentals",
    } as Course,
    type: "lab",
    days: ["friday"],
    startTime: "15:00",
    endTime: "16:50",
    location: "Off-Site Web-Based",
    courseColor: { color: "orange" },
    term: fallTerm,
  },
];

export const displayEvents2: ScheduleEvent[] = [
  {
    course: {
      courseCode: "PHYS 259",
      title: "Physics",
    } as Course,
    type: "lecture",
    days: ["wednesday"],
    startTime: "08:00",
    endTime: "10:45",
    location: "Engineering Block G 24",
    courseColor: { color: "cyan" },
    term: winterTerm,
  },
  {
    course: {
      courseCode: "ENGG 212",
      title: "Engineering Dynamics",
    } as Course,
    type: "lecture",
    days: ["thursday"],
    startTime: "08:00",
    endTime: "10:45",
    location: "Info & Communication Tech 114",
    courseColor: { color: "red" },
    term: winterTerm,
  },
  {
    course: {
      courseCode: "ENGG 200",
      title: "Engineering Design",
    } as Course,
    type: "lecture",
    days: ["friday"],
    startTime: "08:00",
    endTime: "10:45",
    location: "Info & Communication Tech 217",
    courseColor: { color: "blue" },
    term: winterTerm,
  },
  {
    course: {
      courseCode: "ENGG 200",
      title: "Engineering Design",
    } as Course,
    type: "lab",
    days: ["monday", "tuesday"],
    startTime: "09:00",
    endTime: "09:50",
    location: "Info & Communication Tech 217",
    courseColor: { color: "blue" },
    term: winterTerm,
  },
  {
    course: {
      courseCode: "MATH 277",
      title: "Calculus",
    } as Course,
    type: "lab",
    days: ["monday"],
    startTime: "10:00",
    endTime: "10:50",
    location: "Info & Communication Tech 114",
    courseColor: { color: "pink" },
    term: winterTerm,
  },
  {
    course: {
      courseCode: "PHYS 259",
      title: "Physics",
    } as Course,
    type: "lab",
    days: ["tuesday"],
    startTime: "10:00",
    endTime: "10:50",
    location: "Engineering Block G 03",
    courseColor: { color: "cyan" },
    term: winterTerm,
  },
  {
    course: {
      courseCode: "ENGG 202",
      title: "Engineering Statics",
    } as Course,
    type: "lecture",
    days: ["wednesday"],
    startTime: "11:00",
    endTime: "12:50",
    location: "Info & Communication Tech 217",
    courseColor: { color: "purple" },
    term: winterTerm,
  },
  {
    course: {
      courseCode: "MATH 277",
      title: "Calculus",
    } as Course,
    type: "lecture",
    days: ["friday"],
    startTime: "11:00",
    endTime: "12:50",
    location: "Engineering Block G 24",
    courseColor: { color: "pink" },
    term: winterTerm,
  },
  {
    course: {
      courseCode: "ENGG 202",
      title: "Engineering Statics",
    } as Course,
    type: "tutorial",
    days: ["monday", "tuesday"],
    startTime: "12:00",
    endTime: "12:45",
    location: "Engineering Block E 123",
    courseColor: { color: "purple" },
    term: winterTerm,
  },
  {
    course: {
      courseCode: "ENGG 200",
      title: "Engineering Design",
    } as Course,
    type: "seminar",
    days: ["tuesday"],
    startTime: "14:00",
    endTime: "14:50",
    location: "Engineering Block G 24",
    courseColor: { color: "blue" },
    term: winterTerm,
  },
  {
    course: {
      courseCode: "ENGG 212",
      title: "Engineering Dynamics",
    } as Course,
    type: "lab",
    days: ["monday", "tuesday"],
    startTime: "15:00",
    endTime: "15:45",
    location: "Engineering Block G 224",
    courseColor: { color: "red" },
    term: winterTerm,
  },
];
