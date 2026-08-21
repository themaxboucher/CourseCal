"use client";

import { Settings6Filled } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const settings = (
    <>
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
    </>
  );

  // Render drawer for mobile
  if (isMobile) {
    return (
      <Drawer direction="bottom">
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings6Filled className="size-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Free time</DrawerTitle>
            <DrawerDescription>
              Pick what counts as a usable shared gap.
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-5 px-4 pb-8">{settings}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Render popover for desktop
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings6Filled className="size-4" />
          <span className="hidden sm:inline">Free time</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-5">
        {settings}
      </PopoverContent>
    </Popover>
  );
}
