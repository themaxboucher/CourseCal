import {
  BookFilled,
  FlaskFilled,
  GrassFilled,
  GroupFilled,
  LeafFilled,
  Loading3Filled,
  MortarboardFilled,
  Presentation1Filled,
  SnowflakeFilled,
  SunFilled,
} from "@/components/icons";
import type { ScheduleEvent } from "@/lib/utils/availability";

export const icons = {
  Loading3Filled,
  SnowflakeFilled,
  SunFilled,
  LeafFilled,
  GrassFilled,
  MortarboardFilled,
};

export const seasonColors = {
  winter: "text-blue-500",
  spring: "text-green-500",
  summer: "text-yellow-500",
  fall: "text-orange-500",
  default: "text-gray-500",
};

export const seasonIcons = {
  winter: SnowflakeFilled,
  spring: GrassFilled,
  summer: SunFilled,
  fall: LeafFilled,
  default: MortarboardFilled,
};

export const classTypeIcons = {
  lecture: Presentation1Filled,
  tutorial: BookFilled,
  lab: FlaskFilled,
  seminar: GroupFilled,
  default: BookFilled,
};

export const colors: Color[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
];

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

/**
 * Wallpaper palettes are picked by the wallpaper's own theme prop, not the
 * `dark` variant, so a dark wallpaper renders with dark colors even while the
 * app around it is in light mode (and vice versa).
 */
export const darkEventColors = {
  red: "bg-red-700 border-red-900 text-white",
  orange: "bg-orange-700 border-orange-900 text-white",
  yellow: "bg-yellow-500 border-yellow-700 text-white",
  green: "bg-green-700 border-green-900 text-white",
  cyan: "bg-cyan-700 border-cyan-900 text-white",
  blue: "bg-blue-700 border-blue-900 text-white",
  purple: "bg-purple-700 border-purple-900 text-white",
  pink: "bg-pink-700 border-pink-900 text-white",
  fallback: "bg-zinc-700 border-zinc-900 text-white",
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

/**
 * The landing page hero's schedule: one week of classes presented as the
 * visitor's own, and three friends to overlay it with.
 *
 * Every class here sits between 09:00 and 15:50 so `getTimeRange` resolves to
 * its 9am–3pm floor — the grid stays exactly seven rows tall whichever friends
 * are selected, instead of growing a row and shifting the hero as somebody is
 * toggled on. Each event carries a course code and a type, so `EventBlock`'s
 * missing-data badge never fires on a schedule nobody can fix.
 */
export const heroUserEvents: LocalEvent[] = [
  {
    id: 1,
    course_code: "CPSC 331",
    course: null,
    type: "lecture",
    days: ["monday", "wednesday", "friday"],
    start_time: "09:00",
    end_time: "09:50",
    location: "Science Theatres 141",
    course_color: "blue",
    term: null,
    recurrence: "weekly",
  },
  {
    id: 2,
    course_code: "MATH 267",
    course: null,
    type: "lecture",
    days: ["tuesday", "thursday"],
    start_time: "10:00",
    end_time: "11:15",
    location: "Murray Fraser Hall 162",
    course_color: "pink",
    term: null,
    recurrence: "weekly",
  },
  {
    id: 3,
    course_code: "ENGG 233",
    course: null,
    type: "lecture",
    days: ["monday", "wednesday", "friday"],
    start_time: "11:00",
    end_time: "11:50",
    location: "Info & Communication Tech 122",
    course_color: "orange",
    term: null,
    recurrence: "weekly",
  },
  {
    id: 4,
    course_code: "CPSC 355",
    course: null,
    type: "lab",
    days: ["wednesday"],
    start_time: "13:00",
    end_time: "14:50",
    location: "Math Sciences 521",
    course_color: "yellow",
    term: null,
    recurrence: "weekly",
  },
  {
    id: 5,
    course_code: "CPSC 331",
    course: null,
    type: "tutorial",
    days: ["friday"],
    start_time: "14:00",
    end_time: "14:50",
    location: "Math Sciences 337",
    course_color: "blue",
    term: null,
    recurrence: "biweekly",
  },
];

/**
 * A friend in the hero rail. Their classes are only ever read by
 * `buildAvailability` — the grid draws them as anonymous busy blocks, never as
 * course blocks — so they carry the times and nothing else. Inventing a
 * location and a colour for something that cannot render would only be data to
 * keep in step later.
 */
export interface HeroFriend {
  /**
   * Stable and arbitrary. Only reaches `getColorFromId`, which colours the
   * initial shown if the avatar below ever fails to load.
   */
  id: string;
  name: string;
  /** Served straight from `public/`. */
  avatar: string;
  events: ScheduleEvent[];
}

export const heroFriends: HeroFriend[] = [
  {
    id: "hero-rex",
    name: "Rex",
    avatar: "/profile-photos/rex.png",
    events: [
      {
        days: ["monday", "wednesday", "friday"],
        start_time: "10:00",
        end_time: "10:50",
        recurrence: "weekly",
      },
      {
        days: ["tuesday", "thursday"],
        start_time: "09:00",
        end_time: "10:15",
        recurrence: "weekly",
      },
      {
        days: ["tuesday"],
        start_time: "13:00",
        end_time: "14:50",
        recurrence: "weekly",
      },
      {
        days: ["monday", "wednesday", "friday"],
        start_time: "13:00",
        end_time: "13:50",
        recurrence: "weekly",
      },
      {
        days: ["thursday"],
        start_time: "11:30",
        end_time: "12:20",
        recurrence: "weekly",
      },
    ],
  },
  {
    id: "hero-cera",
    name: "Cera",
    avatar: "/profile-photos/cera.png",
    events: [
      {
        days: ["monday", "wednesday", "friday"],
        start_time: "09:00",
        end_time: "09:50",
        recurrence: "weekly",
      },
      {
        days: ["tuesday", "thursday"],
        start_time: "12:30",
        end_time: "13:45",
        recurrence: "weekly",
      },
      {
        days: ["friday"],
        start_time: "10:00",
        end_time: "11:50",
        recurrence: "weekly",
      },
      // The one biweekly on a friend, and the only source of a *visible*
      // tentative slot: a biweekly class is left out of the busy blocks, so
      // the time it covers renders as a striped sky gap rather than as grey.
      {
        days: ["monday"],
        start_time: "13:00",
        end_time: "14:50",
        recurrence: "biweekly",
      },
      {
        days: ["wednesday"],
        start_time: "14:00",
        end_time: "14:50",
        recurrence: "weekly",
      },
    ],
  },
  {
    id: "hero-terry",
    name: "Terry",
    avatar: "/profile-photos/terry.png",
    events: [
      {
        days: ["tuesday", "thursday"],
        start_time: "09:30",
        end_time: "10:45",
        recurrence: "weekly",
      },
      {
        days: ["monday"],
        start_time: "11:00",
        end_time: "12:50",
        recurrence: "weekly",
      },
      {
        days: ["wednesday"],
        start_time: "09:00",
        end_time: "11:50",
        recurrence: "weekly",
      },
      {
        days: ["monday", "wednesday", "friday"],
        start_time: "15:00",
        end_time: "15:50",
        recurrence: "weekly",
      },
    ],
  },
];
