import { cn } from "@/lib/utils";
import type { Band } from "@/lib/utils/availability";

interface AvailabilityLayerProps {
  /** Bands for a single weekday. */
  bands: Band[];
  startHour: number;
  pxPerHour: number;
  /** Participant id to display name, for the hover description. */
  names: Record<string, string>;
}

// Biweekly classes have no anchor date, so there is no way to know which week
// they fall on. Stripes read as "provisional" without competing with the solid
// busy wash or the free highlight.
const HATCH: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, transparent 0 5px, color-mix(in srgb, currentColor 22%, transparent) 5px 10px)",
};

const BAND_CLASS: Record<Band["kind"], string> = {
  busy: "bg-foreground/10",
  maybe: "text-foreground/70",
  free: "bg-emerald-500/30 ring-2 ring-inset ring-emerald-500/50 rounded-xl",
};

function describe(band: Band, names: Record<string, string>): string {
  const people = band.participantIds
    .map((id) => names[id])
    .filter(Boolean)
    .join(", ");

  if (band.kind === "free") {
    return people ? `Everyone free — ${people}` : "Everyone free";
  }
  if (band.kind === "maybe") {
    return people
      ? `${people} may have class here (every other week)`
      : "Possible class every other week";
  }
  return people ? `Busy: ${people}` : "Busy";
}

/**
 * The aggregate overlay: one neutral wash wherever somebody is busy, stripes
 * where a biweekly class makes it uncertain, and a highlight where everybody
 * counted is free.
 *
 * Sits beneath the event blocks — the viewer's own classes stay legible on top
 * of their own busy shading.
 */
export default function AvailabilityLayer({
  bands,
  startHour,
  pxPerHour,
  names,
}: AvailabilityLayerProps) {
  if (bands.length === 0) return null;

  return (
    <>
      {bands.map((band) => {
        const top = (band.startMin - startHour * 60) * (pxPerHour / 60);
        const height = (band.endMin - band.startMin) * (pxPerHour / 60);

        return (
          <div
            key={`${band.kind}-${band.startMin}-${band.endMin}`}
            className={cn(
              "absolute inset-x-0 z-0 pointer-events-auto",
              BAND_CLASS[band.kind],
            )}
            style={{
              top: `${top}px`,
              height: `${height}px`,
              ...(band.kind === "maybe" ? HATCH : {}),
            }}
            title={describe(band, names)}
          />
        );
      })}
    </>
  );
}
