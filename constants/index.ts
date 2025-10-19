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

export const displayEvents = [
  // Core Classes - Mixed schedule with variety
  {
    course: {
      subjectCode: "MATH",
      catalogNumber: 101,
      title: "Calculus I",
    },
    type: "lecture",
    days: ["monday", "wednesday", "friday"],
    startTime: "09:00",
    endTime: "10:00",
    location: "Math Building Room 101",
    courseColor: { color: "blue" },
  },
  {
    course: {
      subjectCode: "PHYS",
      catalogNumber: 201,
      title: "Physics I: Mechanics",
    },
    type: "tutorial",
    days: ["tuesday", "thursday"],
    startTime: "09:30",
    endTime: "10:30",
    location: "Physics Lab 205",
    courseColor: { color: "orange" },
  },
  {
    course: {
      subjectCode: "CHAOS",
      catalogNumber: 520,
      title: "Embracing the Chaos of Life",
    },
    type: "lecture",
    days: ["monday", "wednesday"],
    startTime: "10:30",
    endTime: "12:00",
    location: "The Chaos Chamber (Room 911)",
    courseColor: { color: "red" },
  },
  {
    course: {
      subjectCode: "CHEM",
      catalogNumber: 301,
      title: "Organic Chemistry I",
    },
    type: "seminar",
    days: ["tuesday", "thursday"],
    startTime: "11:00",
    endTime: "12:30",
    location: "Chemistry Lab 301",
    courseColor: { color: "yellow" },
  },
  {
    course: {
      subjectCode: "NAP",
      catalogNumber: 101,
      title: "Strategic Napping Techniques",
    },
    type: "lab",
    days: ["friday"],
    startTime: "11:00",
    endTime: "12:00",
    location: "The Comfy Couch (Student Lounge)",
    courseColor: { color: "cyan" },
  },
  {
    course: {
      subjectCode: "BIOL",
      catalogNumber: 401,
      title: "Cell Biology",
    },
    type: "lecture",
    days: ["monday", "tuesday", "thursday", "friday"],
    startTime: "13:00",
    endTime: "14:00",
    location: "Biology Building Room 401",
    courseColor: { color: "green" },
  },
  {
    course: {
      subjectCode: "PSYC",
      catalogNumber: 150,
      title: "Introduction to Psychology",
    },
    type: "tutorial",
    days: ["wednesday"],
    startTime: "13:30",
    endTime: "15:00",
    location: "Psychology Building Room 150",
    courseColor: { color: "pink" },
  },
  {
    course: {
      subjectCode: "ECON",
      catalogNumber: 180,
      title: "Microeconomics",
    },
    type: "lab",
    days: ["tuesday", "thursday"],
    startTime: "14:30",
    endTime: "16:00",
    location: "Economics Building Room 180",
    courseColor: { color: "red" },
  },
  {
    course: {
      subjectCode: "HIST",
      catalogNumber: 380,
      title: "World History",
    },
    type: "seminar",
    days: ["monday", "friday"],
    startTime: "15:00",
    endTime: "16:30",
    location: "History Building Room 380",
    courseColor: { color: "purple" },
  },
  {
    course: {
      subjectCode: "ENGL",
      catalogNumber: 120,
      title: "English Composition",
    },
    type: "tutorial",
    days: ["wednesday"],
    startTime: "16:00",
    endTime: "17:00",
    location: "English Building Room 120",
    courseColor: { color: "cyan" },
  },
];
