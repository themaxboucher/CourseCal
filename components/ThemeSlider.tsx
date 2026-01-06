"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeSlider() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex items-center gap-1 rounded-full bg-muted-foreground/5 p-1 mx-2">
      <Button
        variant="ghost"
        onClick={() => setTheme("light")}
        className={cn(
          "rounded-full size-7 p-0",
          mounted && theme === "light"
            ? "bg-popover text-foreground"
            : "text-muted-foreground"
        )}
      >
        <Sun className="size-4" />
        <span className="sr-only">Light theme</span>
      </Button>
      <Button
        variant="ghost"
        onClick={() => setTheme("dark")}
        className={cn(
          "rounded-full size-7 p-0",
          mounted && theme === "dark"
            ? "bg-popover text-foreground"
            : "text-muted-foreground"
        )}
      >
        <Moon className="size-4" />
        <span className="sr-only">Dark theme</span>
      </Button>
      <Button
        variant="ghost"
        onClick={() => setTheme("system")}
        className={cn(
          "rounded-full size-7 p-0",
          mounted && theme === "system"
            ? "bg-popover text-foreground"
            : "text-muted-foreground"
        )}
      >
        <Monitor className="size-4" />
        <span className="sr-only">System theme</span>
      </Button>
    </div>
  );
}
