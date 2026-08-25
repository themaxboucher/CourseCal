import { cn } from "@/lib/utils";
import { formatTime, withBlockGap } from "@/lib/utils/schedule";
import type { BusyBlock, SharedSlot } from "@/lib/utils/availability";

export interface AvailabilityPerson {
  name: string;
}

interface AvailabilityLayerProps {
  /** A single weekday's worth of each. */
  busyBlocks: BusyBlock[];
  slots: SharedSlot[];
  startHour: number;
  pxPerHour: number;
  /** Participant id to display name. */
  people: Record<string, AvailabilityPerson>;
}

/** Fine diagonal stripes: the "somebody is in class here" mark. */
const HATCH: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, transparent 0 5px, color-mix(in srgb, currentColor 50%, transparent) 5px 10px)",
};

/**
 * The same stripes at EventBlock's width, for a slot that is only free on
 * alternating weeks. Reusing the mark a biweekly class already carries means
 * the grid says "this one depends on the week" in one vocabulary, whether the
 * time reads as taken or as free.
 */
const THICK_HATCH: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, transparent 0 18px, color-mix(in srgb, currentColor 20%, transparent) 18px 36px)",
};

function minutesToLabel(minutes: number, includeAmPm = true): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return formatTime(
    `${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`,
    includeAmPm,
  );
}

function durationLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${remainder}m`;
  if (remainder === 0) return `${hours}h`;
  return `${hours}h ${remainder}m`;
}

function describeSlot(
  slot: SharedSlot,
  people: Record<string, AvailabilityPerson>,
): string {
  const list = slot.participantIds
    .map((id) => people[id]?.name)
    .filter(Boolean)
    .join(", ");

  const span = `${minutesToLabel(slot.startMin)} – ${minutesToLabel(slot.endMin)}`;
  const length = durationLabel(slot.endMin - slot.startMin);
  const caveat = slot.tentative ? " — only on the weeks nobody has class" : "";
  return `Free ${span} · ${length}${list ? ` — ${list}` : ""}${caveat}`;
}

function describeBlock(
  block: BusyBlock,
  people: Record<string, AvailabilityPerson>,
): string {
  const list = block.participantIds
    .map((id) => people[id]?.name)
    .filter(Boolean)
    .join(", ");
  return list ? `Busy: ${list}` : "Busy";
}

/**
 * One shared gap, built to read as a sibling of the class blocks around it:
 * same rounding, padding and type scale as EventBlock, with the duration
 * taking the slot the course code holds there and the time range underneath.
 *
 * A 15-minute gap is only 16px tall, so the time range is dropped as the
 * block shrinks. What is dropped stays in the hover description.
 */
function FreeSlot({
  slot,
  top,
  height,
  people,
}: {
  slot: SharedSlot;
  top: number;
  height: number;
  people: Record<string, AvailabilityPerson>;
}) {
  // Budgeted against the desktop type, the taller of the two: each row of text
  // costs 16px, the row gap 2-4px, and the padding 10px tight or 32px roomy.
  // Mobile type is smaller, so anything clearing these clears there too.
  const roomy = height >= 92;
  const showTimeRow = height >= 46;

  return (
    <div
      className={cn(
        // Matches EventBlock's footprint so a free slot lines up with the
        // classes above and below it rather than sitting a few pixels off.
        "absolute left-0 right-0 mx-[0.08rem] md:mx-0.5",
        "z-0 overflow-hidden rounded-xl p-[0.3rem] text-xs font-medium text-sky-500",
        roomy && "sm:p-2",
        "pointer-events-auto ring-2 ring-inset ring-ring/70",
        "bg-sky-200/90 dark:bg-sky-900/90",
      )}
      style={{
        ...withBlockGap(top, height),
        ...(slot.tentative ? THICK_HATCH : {}),
      }}
      title={describeSlot(slot, people)}
    >
      <div className={cn("w-full space-y-0.5", roomy && "md:space-y-1")}>
        <div className="text-xxs font-bold md:text-xs">
          {durationLabel(slot.endMin - slot.startMin)}
        </div>

        {showTimeRow && (
          <div className="flex flex-wrap items-center justify-start gap-0.5 text-xxxs tracking-tight opacity-75 md:text-xs">
            {/* The full "9:00 AM - 10:00 AM" only wraps at that width, and it
                breaks after the dash, so the phone gets the short form a size
                down — matching the grid's own time gutter. */}
            <span className="whitespace-nowrap md:hidden">
              {minutesToLabel(slot.startMin, false)}–
              {minutesToLabel(slot.endMin, false)}
            </span>
            <span className="hidden md:inline">
              {minutesToLabel(slot.startMin)} - {minutesToLabel(slot.endMin)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Time the group has lost to somebody else's class: no title, no colour, just
 * a hatched stretch. Merged across people and classes, so a morning three
 * friends have booked back to back is one block, and hovering it names them.
 */
function FriendBlock({
  block,
  top,
  height,
  people,
}: {
  block: BusyBlock;
  top: number;
  height: number;
  people: Record<string, AvailabilityPerson>;
}) {
  return (
    <div
      className={cn(
        "absolute left-0 right-0",
        "z-0 border-2 dark:border-muted pointer-events-auto",
        "bg-border dark:bg-muted text-background",
      )}
      style={{ ...withBlockGap(top, height), ...HATCH }}
      title={describeBlock(block, people)}
    />
  );
}

/**
 * The shared-availability overlay: everyone else's classes as hatched grey
 * blocks, and the gaps they leave everybody as sky ones.
 *
 * Sits beneath the event blocks, so the viewer's own classes stay legible in
 * their own colours on top of the grey.
 */
export default function AvailabilityLayer({
  busyBlocks,
  slots,
  startHour,
  pxPerHour,
  people,
}: AvailabilityLayerProps) {
  const positionOf = (interval: { startMin: number; endMin: number }) => ({
    top: (interval.startMin - startHour * 60) * (pxPerHour / 60),
    height: (interval.endMin - interval.startMin) * (pxPerHour / 60),
  });

  return (
    <>
      {busyBlocks.map((block) => {
        const { top, height } = positionOf(block);
        return (
          <FriendBlock
            key={`busy-${block.startMin}-${block.endMin}`}
            block={block}
            top={top}
            height={height}
            people={people}
          />
        );
      })}

      {slots.map((slot) => {
        const { top, height } = positionOf(slot);
        return (
          <FreeSlot
            key={`free-${slot.startMin}-${slot.endMin}`}
            slot={slot}
            top={top}
            height={height}
            people={people}
          />
        );
      })}
    </>
  );
}
