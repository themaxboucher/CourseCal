"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Info, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { WallpaperPreview } from "./WallpaperPreview";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

interface WallpaperFormProps {
  events: CalendarEvent[];
}

export type BackgroundType = "gradient-1" | "gradient-2" | "gradient-3";

export type FontType = "default" | "serif" | "mono";

export type ThemeType = "light" | "dark";

export function WallpaperForm({ events }: WallpaperFormProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [background, setBackground] = useState<BackgroundType>("gradient-1");
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
    <div className="grid grid-cols-2 gap-4">
      <div>
        <WallpaperPreview
          events={events}
          imageRef={previewRef}
          background={background}
          font={font}
          theme={theme}
        />
      </div>

      <div className="p-6 flex flex-col gap-6">
        <div className="space-y-1">
          <h2 className="heading-3">Download a wallpaper</h2>
          <p className="text-muted-foreground">
            Make your uni schedule your lock screen.
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
              <div className="flex gap-4">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setBackground("gradient-1")}
                  className={cn(
                    "flex-1 normal-case font-medium",
                    background === "gradient-1" &&
                      "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                  )}
                >
                  <span className="size-3.5 rounded-full bg-foreground" />
                  Plain
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setBackground("gradient-2")}
                  className={cn(
                    "flex-1 normal-case font-medium",
                    background === "gradient-2" &&
                      "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                  )}
                >
                  <span className="size-3.5 rounded-full bg-blue-500" />
                  Ice
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setBackground("gradient-3")}
                  className={cn(
                    "flex-1 normal-case font-medium",
                    background === "gradient-3" &&
                      "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                  )}
                >
                  <span className="size-3.5 rounded-full bg-red-500" />
                  Fire
                </Button>
              </div>
              <Alert>
                <Info className="size-4" />
                <AlertTitle>More backgrounds coming soon!</AlertTitle>
              </Alert>
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
