import { CalendarCheck } from "lucide-react";
import { formatTime } from "@/lib/utils/schedule";
import type { SharedSlot } from "@/lib/utils/availability";

interface SharedSlotsListProps {
  slots: SharedSlot[];
  /** Participant id to display name. */
  names: Record<string, string>;
  /** How many to show before collapsing the rest into a count. */
  limit?: number;
}

function minutesToLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return formatTime(
    `${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`,
  );
}

function durationLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours === 0) return `${remainder}m`;
  if (remainder === 0) return `${hours}h`;
  return `${hours}h ${remainder}m`;
}

function peopleLabel(ids: string[], names: Record<string, string>): string {
  const list = ids.map((id) => names[id]).filter(Boolean);
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}`;
}

/**
 * The answer in words. Scanning five columns for a shared gap is work the page
 * can do for the reader, and it survives a 375px screen where the grid barely
 * does.
 */
export default function SharedSlotsList({
  slots,
  names,
  limit = 6,
}: SharedSlotsListProps) {
  if (slots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-6 text-center">
        <p className="text-sm font-medium">No shared free time</p>
        <p className="text-sm text-muted-foreground">
          Try a shorter minimum gap, or fewer people.
        </p>
      </div>
    );
  }

  const shown = slots.slice(0, limit);
  const remaining = slots.length - shown.length;

  return (
    <div className="space-y-2">
      <h2 className="flex items-center gap-2 text-sm font-medium">
        <CalendarCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
        When you&apos;re all free
      </h2>
      <ul className="divide-y rounded-lg border">
        {shown.map((slot) => (
          <li
            key={`${slot.day}-${slot.startMin}-${slot.endMin}`}
            className="flex items-baseline justify-between gap-3 px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-sm">
                <span className="font-medium capitalize">{slot.day}</span>{" "}
                <span className="text-muted-foreground tabular-nums">
                  {minutesToLabel(slot.startMin)} –{" "}
                  {minutesToLabel(slot.endMin)}
                </span>
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {peopleLabel(slot.participantIds, names)}
              </p>
            </div>
            <span className="shrink-0 text-sm font-medium tabular-nums">
              {durationLabel(slot.endMin - slot.startMin)}
            </span>
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <p className="text-xs text-muted-foreground">
          + {remaining} more shorter {remaining === 1 ? "slot" : "slots"}
        </p>
      )}
    </div>
  );
}
