"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import WallpaperPreview from "./WallpaperPreview";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

const backgroundOptions: { value: BackgroundType; label: string; color: string }[] = [
  { value: "plain", label: "Plain", color: "bg-zinc-500" },
  { value: "ice", label: "Ice", color: "bg-blue-500" },
  { value: "fire", label: "Fire", color: "bg-red-500" },
  { value: "sunset", label: "Sunset", color: "bg-orange-500" },
  { value: "aurora", label: "Aurora", color: "bg-emerald-500" },
  { value: "ocean", label: "Ocean", color: "bg-teal-500" },
  { value: "forest", label: "Forest", color: "bg-green-500" },
  { value: "lavender", label: "Lavender", color: "bg-violet-500" },
  { value: "mint", label: "Mint", color: "bg-cyan-500" },
  { value: "galaxy", label: "Galaxy", color: "bg-indigo-500" },
  { value: "rose", label: "Rose", color: "bg-pink-500" },
  { value: "midnight", label: "Midnight", color: "bg-slate-700" },
];

interface WallpaperFormProps {
  events: ScheduleEvent[];
}

export function WallpaperForm({ events }: WallpaperFormProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [background, setBackground] = useState<BackgroundType>("plain");
  const [font, setFont] = useState<FontType>("default");
  const [theme, setTheme] = useState<ThemeType>("light");

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 6, // Higher quality export
      });

      // Create a download link
      const link = document.createElement("a");
      link.download = `wallpaper-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error downloading wallpaper:", error);
      toast.error("Failed to download wallpaper");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex justify-center items-center bg-muted border-b md:border-b-0 md:border-r p-10 h-full">
        <WallpaperPreview
          events={events}
          imageRef={previewRef}
          background={background}
          font={font}
          theme={theme}
        />
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="space-y-1 hidden md:block">
          <h2 className="heading-3">Download wallpaper</h2>
          <p className="text-muted-foreground">
            Download a wallpaper of your schedule that isn't blocked by your
            lock screens time or widgets.
          </p>
        </div>

        <form className="flex flex-col gap-6 justify-between h-full">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Label>Theme</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex-1 normal-case font-medium flex flex-col items-center justify-center gap-1 h-full py-2",
                    theme === "light" &&
                      "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                  )}
                >
                  <Sun className="size-4" />
                  Light
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex-1 normal-case font-medium flex flex-col items-center justify-center gap-1 h-full py-2",
                    theme === "dark" &&
                      "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                  )}
                >
                  <Moon className="size-4" />
                  Dark
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Label>Background</Label>
              <div className="grid grid-cols-4 gap-2">
                {backgroundOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setBackground(option.value)}
                    className={cn(
                      "normal-case font-medium",
                      background === option.value &&
                        "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                    )}
                  >
                    <span className={cn("size-3 rounded-full", option.color)} />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Label>Font</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setFont("default")}
                  className={cn(
                    "flex-1 font-medium normal-case",
                    font === "default" &&
                      "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                  )}
                >
                  Default
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setFont("serif")}
                  className={cn(
                    "flex-1 font-serif normal-case font-medium",
                    font === "serif" &&
                      "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                  )}
                >
                  Serif
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setFont("mono")}
                  className={cn(
                    "flex-1 font-mono normal-case font-medium",
                    font === "mono" &&
                      "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                  )}
                >
                  Mono
                </Button>
              </div>
            </div>
          </div>
          <Button type="button" onClick={handleDownload} className="gap-2">
            <Download className="size-4" />
            Download
          </Button>
        </form>
      </div>
    </div>
  );
}
