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
export const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];
export const timeSlotsShort = [
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
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
