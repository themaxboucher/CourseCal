import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from "@/lib/utils/schedule";
import type { BusyBlock, SharedSlot } from "@/lib/utils/availability";

export interface AvailabilityPerson {
  name: string;
  avatar?: string | null;
  /**
   * The signed-in viewer. Every free block is free for them by definition, so
   * their avatar is left off — the row answers "which friends", not "who".
   */
  isViewer?: boolean;
}

interface AvailabilityLayerProps {
  /** A single weekday's worth of each. */
  busyBlocks: BusyBlock[];
  slots: SharedSlot[];
  startHour: number;
  pxPerHour: number;
  /** Participant id to display name and avatar. */
  people: Record<string, AvailabilityPerson>;
}

interface PersonWithId extends AvailabilityPerson {
  id: string;
}

/**
 * Diagonal stripes over a translucent wash: the "somebody is in class" mark,
 * drawn once per friend per class. Because each block is translucent, two
 * friends booked over the same hour compound into a visibly darker patch —
 * the depth of the grey is how many people a time costs you.
 *
 * Matches the hatch EventBlock draws on biweekly events.
 */
const HATCH: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, transparent 0 5px, color-mix(in srgb, currentColor 20%, transparent) 5px 10px)",
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
  return `Free ${span} · ${length}${list ? ` — ${list}` : ""}`;
}

function describeBlock(
  block: BusyBlock,
  person: AvailabilityPerson | undefined,
): string {
  const who = person?.name ?? "A friend";
  const what = block.courseCode
    ? `${who} — ${block.courseCode}`
    : `${who}: busy`;
  return block.tentative ? `${what} (every other week)` : what;
}

/** Overlapped avatars, capped so a narrow column never has to scroll. */
function AvatarRow({
  people,
  roomy,
}: {
  people: PersonWithId[];
  roomy: boolean;
}) {
  const shown = people.slice(0, 4);
  const remaining = people.length - shown.length;

  return (
    <div className="flex items-center -space-x-1">
      {shown.map((person) => (
        <Avatar
          key={person.id}
          title={person.name}
          className={cn(
            "size-4 ring-2 ring-background",
            roomy ? "md:size-5" : "md:size-4",
          )}
        >
          <AvatarImage
            className="object-cover"
            src={person.avatar ?? undefined}
          />
          <AvatarFallback className="bg-ring/20 text-[6px] font-bold text-ring md:text-[9px]">
            {person.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <span className="pl-1.5 text-xxxs tabular-nums opacity-70 md:text-xxs">
          +{remaining}
        </span>
      )}
    </div>
  );
}

/**
 * One shared gap, built to read as a sibling of the class blocks around it:
 * same rounding, padding and type scale as EventBlock, with the duration
 * taking the slot the course code holds there, the time range underneath it,
 * and the faces of everyone free underneath that.
 *
 * A 15-minute gap is only 16px tall, so rows are dropped from the bottom as
 * the block shrinks. Whatever is dropped stays in the hover description.
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
  const friends = slot.participantIds
    .map((id) => ({ id, ...people[id] }))
    .filter((person): person is PersonWithId =>
      Boolean(person.name && !person.isViewer),
    );

  // Budgeted against the desktop type, the taller of the two: each row of text
  // costs 16px, the avatars 16-20px, the row gap 2-4px, and the padding 10px
  // tight or 32px roomy. Mobile type is smaller, so anything clearing these
  // clears there too.
  //
  // An hour is the gap this has to get right: both the commonest and the
  // tightest fit for all three rows, which is why the spacing and the faces
  // shrink below the roomy tier rather than the faces being dropped.
  const roomy = height >= 92;
  const showAvatars = height >= 62 && friends.length > 0;
  const showTimeRow = height >= 46;

  return (
    <div
      className={cn(
        // Matches EventBlock's footprint so a free slot lines up with the
        // classes above and below it rather than sitting a few pixels off.
        "absolute left-0 right-0 mx-[0.08rem] my-[0.2rem] md:mx-0.5 md:my-1",
        "z-0 overflow-hidden rounded-xl p-[0.3rem] text-xs font-medium",
        roomy && "sm:p-2",
        "pointer-events-auto ring-2 ring-inset ring-ring/70",
        "bg-sky-200/90 dark:bg-sky-900/90",
      )}
      style={{ top: `${top}px`, height: `${height}px` }}
      title={describeSlot(slot, people)}
    >
      <div className={cn("w-full space-y-0.5", roomy && "md:space-y-1")}>
        {/* Wraps rather than squeezes: a day column is only ~63px wide on a
            phone, where the faces and the duration cannot share a line. The
            duration never shrinks — the faces are what drop to a line of their
            own. */}
        <div className="flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
          <div className="shrink-0 text-xxs font-bold md:text-xs">
            {durationLabel(slot.endMin - slot.startMin)}
          </div>
          {showAvatars && <AvatarRow people={friends} roomy={roomy} />}
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
 * A friend's class: no title, no colour, just the amount of grey one person's
 * hour costs. They stack rather than merge, so an hour three friends have
 * booked is three washes deep and reads darker than an hour only one has.
 *
 * A biweekly class lands on half as many weeks as a weekly one, and is drawn
 * at half the weight to say so — the same stacking scale, read as "this one
 * may not even be there this week".
 */
function FriendBlock({
  block,
  top,
  height,
  person,
}: {
  block: BusyBlock;
  top: number;
  height: number;
  person: AvailabilityPerson | undefined;
}) {
  return (
    <div
      className={cn(
        // EventBlock's footprint, so a friend's class lines up with the
        // viewer's own classes rather than sitting a few pixels off.
        "absolute left-0 right-0 mx-[0.08rem] my-[0.2rem] md:mx-0.5 md:my-1",
        "z-0 rounded-xl border-2 pointer-events-auto",
        block.tentative
          ? "border-foreground/15 bg-foreground/5 text-foreground/40"
          : "border-foreground/25 bg-foreground/10 text-foreground/70",
      )}
      style={{ top: `${top}px`, height: `${height}px`, ...HATCH }}
      title={describeBlock(block, person)}
    />
  );
}

/**
 * The shared-availability overlay: everyone else's classes as translucent grey
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
      {busyBlocks
        // The viewer's own classes are already on the grid in full colour;
        // greying them out again would only dim their own week.
        .filter((block) => !people[block.participantId]?.isViewer)
        .map((block) => {
          const { top, height } = positionOf(block);
          return (
            <FriendBlock
              key={`${block.participantId}-${block.startMin}-${block.endMin}`}
              block={block}
              top={top}
              height={height}
              person={people[block.participantId]}
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
