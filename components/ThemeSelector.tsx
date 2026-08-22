"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  // The stored theme is only readable in the browser, so the server has no
  // value to render. Hold the trigger empty until mount rather than printing
  // a guess the client then has to correct.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = mounted ? theme || "system" : undefined;

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return <Sun className="size-4" />;
      case "dark":
        return <Moon className="size-4" />;
      case "system":
        return <Monitor className="size-4" />;
      default:
        return <Monitor className="size-4" />;
    }
  };

  const getThemeLabel = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "System";
    }
  };

  return (
    <Select value={current} onValueChange={setTheme}>
      <SelectTrigger className="w-fit gap-2" size="sm" aria-label="Theme">
        {current && getThemeIcon(current)}
        <SelectValue placeholder="Theme">
          {current && getThemeLabel(current)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <Sun className="size-4" />
          Light
        </SelectItem>
        <SelectItem value="dark">
          <Moon className="size-4" />
          Dark
        </SelectItem>
        <SelectItem value="system">
          <Monitor className="size-4" />
          System
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
