"use client";

import { MonitorFilled, MoonFilled, SunFilled } from "@/components/icons";
import { useTheme } from "next-themes";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return <SunFilled className="size-4" />;
      case "dark":
        return <MoonFilled className="size-4" />;
      case "system":
        return <MonitorFilled className="size-4" />;
      default:
        return <MonitorFilled className="size-4" />;
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
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-fit gap-2" size="sm">
        {getThemeIcon(theme || "system")}
        <SelectValue placeholder="Select theme">
          {getThemeLabel(theme || "system")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <SunFilled className="size-4" />
          Light
        </SelectItem>
        <SelectItem value="dark">
          <MoonFilled className="size-4" />
          Dark
        </SelectItem>
        <SelectItem value="system">
          <MonitorFilled className="size-4" />
          System
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
