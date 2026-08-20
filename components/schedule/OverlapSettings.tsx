"use client";

import { Settings6Filled } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface OverlapSettingsProps {
  minDurationMin: number;
  onMinDurationChange: (minutes: number) => void;
  betweenClassesOnly: boolean;
  onBetweenClassesOnlyChange: (value: boolean) => void;
}

/** What counts as a usable shared gap is the viewer's call, not ours. */
export default function OverlapSettings({
  minDurationMin,
  onMinDurationChange,
  betweenClassesOnly,
  onBetweenClassesOnlyChange,
}: OverlapSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings6Filled className="size-4" />
          <span className="hidden sm:inline">Free time</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-5">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="min-duration">Minimum gap</Label>
            <span className="text-sm text-muted-foreground tabular-nums">
              {minDurationMin} min
            </span>
          </div>
          <Slider
            id="min-duration"
            min={15}
            max={180}
            step={15}
            value={[minDurationMin]}
            onValueChange={([value]) => onMinDurationChange(value)}
          />
          <p className="text-xs text-muted-foreground">
            Shorter gaps are hidden.
          </p>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Label htmlFor="between-classes">Between classes only</Label>
            <p className="text-xs text-muted-foreground">
              Only count time while everyone is already on campus.
            </p>
          </div>
          <Switch
            id="between-classes"
            checked={betweenClassesOnly}
            onCheckedChange={onBetweenClassesOnlyChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
