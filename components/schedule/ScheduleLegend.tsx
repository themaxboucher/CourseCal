"use client";

import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { eventColors } from "@/constants";
import { cn } from "@/lib/utils";
import { hatch } from "@/lib/utils/schedule";

/**
 * Legend swatches are 36px, where the grid's 18px stripes would leave one and
 * a half of them — too few to read as stripes. Halving the width keeps the
 * mark recognisable at swatch size; the strength stays exactly what the grid
 * draws, so the swatch is the same mark, only smaller.
 */
const SWATCH_STRIPE_PX = 6;

function LegendRow({
  swatch,
  title,
  children,
}: {
  swatch: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      {swatch}
      <div className="space-y-0.5">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-xs text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}

export default function ScheduleLegend() {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={100}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="What the striped blocks mean"
          className={cn(
            "size-9 md:size-8 shrink-0 rounded-md border-[1.5px] shadow-xs font-bold text-white text-lg cursor-help",
            eventColors.fallback,
          )}
          style={{ backgroundImage: hatch(SWATCH_STRIPE_PX) }}
        >
          ?
        </button>
      </HoverCardTrigger>

      <HoverCardContent align="end" className="w-74 space-y-3">
        <p className="text-sm font-semibold">Striped blocks</p>

        <ul className="space-y-3">
          <LegendRow
            title="Biweekly class"
            swatch={
              <div
                className={cn(
                  "size-9 shrink-0 rounded-lg border-[1.5px]",
                  eventColors.purple,
                )}
                style={{ backgroundImage: hatch(SWATCH_STRIPE_PX) }}
              />
            }
          >
            Runs every other week instead of every week.
          </LegendRow>

          <LegendRow
            title="Free time depending on the week"
            swatch={
              <div
                className="size-9 shrink-0 rounded-lg ring-2 ring-inset ring-ring/70 bg-sky-200/90 text-sky-500 dark:bg-sky-900/90"
                style={{ backgroundImage: hatch(SWATCH_STRIPE_PX, 20) }}
              />
            }
          >
            Someone you selected has a biweekly class then, so the time is free
            on some weeks and taken on others.
          </LegendRow>
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
}
