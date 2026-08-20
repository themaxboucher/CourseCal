import { timeToMinutes } from "./schedule";

/**
 * Shared free-time engine.
 *
 * Pure and framework-free: everything here is minutes-from-midnight arithmetic
 * over closed-open intervals `[startMin, endMin)`, so it can be reasoned about
 * and tested without a schedule grid, a database, or React.
 */

/**
 * Monday–Friday in grid order. The index of each day matches
 * `getWeekdayIndex` in `./schedule` and the column order of `weekdays` in
 * `@/constants`, so callers can position results without remapping.
 */
export const WEEK_DAYS: readonly WeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

export const DEFAULT_MIN_SLOT_MINUTES = 30;

export interface Interval {
  startMin: number;
  endMin: number;
}

/**
 * `busy`  — at least one person definitely has a class.
 * `maybe` — only biweekly classes fall here. `events` stores no anchor date, so
 *           nothing in the data says which week a biweekly class lands on;
 *           this is "free unless it's the other week".
 * `free`  — everybody counted is available.
 */
export type BandKind = "busy" | "maybe" | "free";

export interface Band extends Interval {
  day: WeekDay;
  kind: BandKind;
  /** Who this band is about: the busy people, or everyone free. */
  participantIds: string[];
}

export interface SharedSlot extends Interval {
  day: WeekDay;
  participantIds: string[];
}

/**
 * The minimum an event must expose to be scheduled against. Both `LocalEvent`
 * and the Supabase event row satisfy this structurally, so `AnyEvent[]` can be
 * passed directly without this module importing either.
 */
export interface ScheduleEvent {
  days?: WeekDay[] | null;
  start_time: string;
  end_time: string;
  recurrence?: Recurrence | null;
}

export interface Participant {
  id: string;
  events: ScheduleEvent[];
  /**
   * False when this person has no schedule for the term being viewed. They are
   * dropped from the calculation entirely rather than counted as free — absent
   * data must never render as availability.
   */
  hasSchedule: boolean;
}

export interface AvailabilityOptions {
  /** Free stretches shorter than this are not worth surfacing. */
  minDurationMin?: number;
  /**
   * Restrict free time to the window where everyone is already on campus —
   * between their first and last class of that day.
   */
  betweenClassesOnly?: boolean;
  /** The grid's visible range. Busy and maybe bands are clipped to it. */
  dayStartMin: number;
  dayEndMin: number;
}

export interface Availability {
  bands: Band[];
  /** Confirmed-free stretches, longest first. */
  slots: SharedSlot[];
  /** Participants that were counted. */
  includedIds: string[];
  /** Selected participants with no schedule for this term. */
  excludedIds: string[];
}

// -- Interval algebra -------------------------------------------------------

/** Sorts and unions overlapping *or touching* intervals into a minimal set. */
function mergeIntervals(intervals: Interval[]): Interval[] {
  const sorted = intervals
    .filter((interval) => interval.endMin > interval.startMin)
    .sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

  const merged: Interval[] = [];
  for (const interval of sorted) {
    const last = merged[merged.length - 1];
    // `<=` rather than `<` so back-to-back classes read as one busy stretch
    // instead of leaving a zero-width gap between them.
    if (last && interval.startMin <= last.endMin) {
      last.endMin = Math.max(last.endMin, interval.endMin);
    } else {
      merged.push({ ...interval });
    }
  }
  return merged;
}

/** Set difference. `base` and `remove` are merged internally, so any input works. */
function subtractIntervals(base: Interval[], remove: Interval[]): Interval[] {
  const blockers = mergeIntervals(remove);
  if (blockers.length === 0) return mergeIntervals(base);

  const remaining: Interval[] = [];
  for (const interval of mergeIntervals(base)) {
    let cursor = interval.startMin;
    for (const blocker of blockers) {
      if (blocker.endMin <= cursor) continue;
      if (blocker.startMin >= interval.endMin) break;
      if (blocker.startMin > cursor) {
        remaining.push({ startMin: cursor, endMin: blocker.startMin });
      }
      cursor = Math.max(cursor, blocker.endMin);
      if (cursor >= interval.endMin) break;
    }
    if (cursor < interval.endMin) {
      remaining.push({ startMin: cursor, endMin: interval.endMin });
    }
  }
  return remaining;
}

/** Intersection of two interval sets. */
function intersectIntervals(a: Interval[], b: Interval[]): Interval[] {
  const left = mergeIntervals(a);
  const right = mergeIntervals(b);
  const result: Interval[] = [];

  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    const startMin = Math.max(left[i].startMin, right[j].startMin);
    const endMin = Math.min(left[i].endMin, right[j].endMin);
    if (endMin > startMin) result.push({ startMin, endMin });
    if (left[i].endMin < right[j].endMin) i++;
    else j++;
  }
  return result;
}

function overlaps(a: Interval, b: Interval): boolean {
  return a.startMin < b.endMin && b.startMin < a.endMin;
}

// -- Event reading ----------------------------------------------------------

interface DayIntervals {
  definite: Interval[];
  tentative: Interval[];
}

/**
 * Splits one person's events for a single weekday into certain and biweekly
 * intervals. Events with an unparseable or inverted time range are skipped —
 * a bad row should cost its own block, not the whole day.
 */
function intervalsForDay(events: ScheduleEvent[], day: WeekDay): DayIntervals {
  const definite: Interval[] = [];
  const tentative: Interval[] = [];

  for (const event of events) {
    if (!event.days?.includes(day)) continue;

    const startMin = timeToMinutes(event.start_time);
    const endMin = timeToMinutes(event.end_time);
    if (!Number.isFinite(startMin) || !Number.isFinite(endMin)) continue;
    if (endMin <= startMin) continue;

    const interval = { startMin, endMin };
    if (event.recurrence === "biweekly") tentative.push(interval);
    else definite.push(interval);
  }

  return {
    definite: mergeIntervals(definite),
    tentative: mergeIntervals(tentative),
  };
}

/** The span a person is on campus that day: first class start to last class end. */
function onCampusSpan(day: DayIntervals): Interval | null {
  const all = mergeIntervals([...day.definite, ...day.tentative]);
  if (all.length === 0) return null;
  return { startMin: all[0].startMin, endMin: all[all.length - 1].endMin };
}

function idsBusyDuring(
  band: Interval,
  byParticipant: Map<string, Interval[]>,
): string[] {
  const ids: string[] = [];
  for (const [id, intervals] of byParticipant) {
    if (intervals.some((interval) => overlaps(interval, band))) ids.push(id);
  }
  return ids;
}

// -- Main entry point -------------------------------------------------------

/**
 * Computes the shaded bands and the ranked list of shared free slots for a
 * group, one weekday at a time.
 *
 * Busy and maybe bands are clipped to the visible grid window so they can be
 * positioned directly. Free time is computed inside a possibly narrower window
 * — see `betweenClassesOnly` — which is why the two are derived separately
 * rather than one from the other.
 */
export function buildAvailability(
  participants: Participant[],
  options: AvailabilityOptions,
): Availability {
  const {
    minDurationMin = DEFAULT_MIN_SLOT_MINUTES,
    betweenClassesOnly = false,
    dayStartMin,
    dayEndMin,
  } = options;

  const included = participants.filter((person) => person.hasSchedule);
  const includedIds = included.map((person) => person.id);
  const excludedIds = participants
    .filter((person) => !person.hasSchedule)
    .map((person) => person.id);

  const gridWindow: Interval[] =
    dayEndMin > dayStartMin
      ? [{ startMin: dayStartMin, endMin: dayEndMin }]
      : [];

  // With nobody to compute against, there is no availability to report. An
  // empty result is the honest answer; a fully free week would not be.
  if (included.length === 0 || gridWindow.length === 0) {
    return { bands: [], slots: [], includedIds, excludedIds };
  }

  const bands: Band[] = [];
  const slots: SharedSlot[] = [];

  for (const day of WEEK_DAYS) {
    const perPerson = new Map<string, DayIntervals>();
    for (const person of included) {
      perPerson.set(person.id, intervalsForDay(person.events, day));
    }

    const definiteByPerson = new Map<string, Interval[]>();
    const tentativeByPerson = new Map<string, Interval[]>();
    for (const [id, day] of perPerson) {
      definiteByPerson.set(id, day.definite);
      tentativeByPerson.set(id, day.tentative);
    }

    const allDefinite = mergeIntervals(
      [...perPerson.values()].flatMap((entry) => entry.definite),
    );
    // Biweekly time only counts as uncertain where nobody is definitely busy.
    const allTentative = subtractIntervals(
      [...perPerson.values()].flatMap((entry) => entry.tentative),
      allDefinite,
    );

    const busy = intersectIntervals(allDefinite, gridWindow);
    const maybe = intersectIntervals(allTentative, gridWindow);

    for (const interval of busy) {
      bands.push({
        ...interval,
        day,
        kind: "busy",
        participantIds: idsBusyDuring(interval, definiteByPerson),
      });
    }
    for (const interval of maybe) {
      bands.push({
        ...interval,
        day,
        kind: "maybe",
        participantIds: idsBusyDuring(interval, tentativeByPerson),
      });
    }

    const freeWindow = betweenClassesOnly
      ? intersectIntervals(sharedOnCampusWindow(perPerson), gridWindow)
      : gridWindow;

    const free = subtractIntervals(freeWindow, [...busy, ...maybe]).filter(
      (interval) => interval.endMin - interval.startMin >= minDurationMin,
    );

    for (const interval of free) {
      bands.push({
        ...interval,
        day,
        kind: "free",
        participantIds: includedIds,
      });
      slots.push({ ...interval, day, participantIds: includedIds });
    }
  }

  slots.sort(
    (a, b) =>
      b.endMin - b.startMin - (a.endMin - a.startMin) ||
      WEEK_DAYS.indexOf(a.day) - WEEK_DAYS.indexOf(b.day) ||
      a.startMin - b.startMin,
  );

  return { bands, slots, includedIds, excludedIds };
}

/**
 * The stretch where everyone with classes that day is already on campus.
 *
 * People with no classes that day are skipped rather than treated as absent:
 * a friend with no Friday lecture is free all Friday, and should not wipe out
 * a gap that genuinely works for everyone else. When nobody has classes there
 * is no "between classes" to speak of, so the window is empty.
 */
function sharedOnCampusWindow(
  perPerson: Map<string, DayIntervals>,
): Interval[] {
  const spans: Interval[] = [];
  for (const day of perPerson.values()) {
    const span = onCampusSpan(day);
    if (span) spans.push(span);
  }
  if (spans.length === 0) return [];

  const startMin = Math.max(...spans.map((span) => span.startMin));
  const endMin = Math.min(...spans.map((span) => span.endMin));
  return endMin > startMin ? [{ startMin, endMin }] : [];
}
