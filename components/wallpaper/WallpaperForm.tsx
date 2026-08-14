"use client";

import { useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import {
  Clock,
  Download,
  Info,
  Loader2,
  MapPin,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import WallpaperPreview from "./WallpaperPreview";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import {
  blobToDataUrl,
  canShareImageFile,
  downloadBlob,
  getWallpaperFontEmbedCSS,
  isShareDismissal,
  isTouchDevice,
} from "@/lib/wallpaper";
import { backgroundOptions } from "@/constants";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

const fontOptions: { value: FontType; label: string; className: string }[] = [
  { value: "default", label: "Default", className: "" },
  { value: "serif", label: "Serif", className: "font-serif" },
  { value: "writing", label: "Writing", className: "font-writing" },
  { value: "rounded", label: "Rounded", className: "font-rounded" },
  { value: "stencil", label: "Stencil", className: "font-stencil" },
  { value: "pixels", label: "Pixels", className: "font-pixels" },
];

interface WallpaperFormProps {
  events: ScheduleEvent[];
}

export function WallpaperForm({ events }: WallpaperFormProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [background, setBackground] = useState<BackgroundType>("plain");
  const [font, setFont] = useState<FontType>("default");
  const [theme, setTheme] = useState<ThemeType>("light");
  const [cellHeight, setCellHeight] = useState(50);
  const [eventInfo, setEventInfo] = useState<EventInfoType>("location");
  const [isSaving, setIsSaving] = useState(false);
  const [savedImage, setSavedImage] = useState<string | null>(null);

  // Fetching and inlining the font keeps the network off the critical path of
  // an export, so the share sheet opens while the tap that asked for it still
  // counts as user activation.
  useEffect(() => {
    if (previewRef.current) void getWallpaperFontEmbedCSS(previewRef.current);
  }, [font]);

  const handleDownload = async () => {
    if (!previewRef.current || isSaving) return;
    setIsSaving(true);

    try {
      const fontEmbedCSS = await getWallpaperFontEmbedCSS(previewRef.current);
      const blob = await toBlob(previewRef.current, {
        cacheBust: true,
        pixelRatio: 6, // Higher quality export
        fontEmbedCSS,
      });

      if (!blob) throw new Error("Wallpaper render produced no image");

      const fileName = `wallpaper-${new Date().getTime()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      if (canShareImageFile(file)) {
        try {
          await navigator.share({ files: [file] });
          return;
        } catch (error) {
          if (isShareDismissal(error)) return;
          // Sharing is refused when the tap's activation has expired. Fall
          // through so there's still a way to save the wallpaper.
          console.error("Error sharing wallpaper:", error);
        }
      }

      // iOS won't download a generated file from a link, so show the image and
      // let the user press and hold it to save it to Photos.
      if (isTouchDevice()) {
        setSavedImage(await blobToDataUrl(blob));
        return;
      }

      downloadBlob(blob, fileName);
    } catch (error) {
      console.error("Error downloading wallpaper:", error);
      toast.error("Failed to download wallpaper");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
      {savedImage && (
        <div className="absolute inset-0 z-20 bg-background">
          {/* The form scrolls behind this, so stay pinned to the visible area. */}
          <div className="sticky top-0 flex h-[100dvh] max-h-full flex-col items-center justify-center gap-6 p-6 text-center">
            <div className="space-y-1">
              <h2 className="heading-3">Save to Photos</h2>
              <p className="text-muted-foreground">
                Press and hold the wallpaper, then choose Save to Photos.
              </p>
            </div>
            <img
              src={savedImage}
              alt="Your schedule wallpaper"
              className="min-h-0 w-auto flex-1 rounded-xl border object-contain shadow-lg"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setSavedImage(null)}
            >
              Done
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center bg-muted border-b md:border-b-0 md:border-r p-10 h-full">
        <WallpaperPreview
          events={events}
          imageRef={previewRef}
          background={background}
          font={font}
          theme={theme}
          cellHeight={cellHeight}
          eventInfo={eventInfo}
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
          <div className="flex flex-col gap-6 md:max-h-[500px] md:pb-2 md:overflow-y-auto md:px-2 md:-mx-2 scrollbar-thin">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Label>Height</Label>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Info className="size-4 text-muted-foreground" />
                    </HoverCardTrigger>
                    <HoverCardContent align="start">
                      <p className="text-sm">
                        The schedule will take up more or less space, depending
                        on your phone's dimensions.
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <span className="text-sm text-muted-foreground">
                  {cellHeight}%
                </span>
              </div>
              <Slider
                value={[cellHeight]}
                onValueChange={(value) => setCellHeight(value[0])}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div className="flex flex-col gap-4">
              <Label>Display info</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setEventInfo("location")}
                  className={cn(
                    "flex-1 normal-case font-medium flex flex-col items-center justify-center gap-1 h-full py-2",
                    eventInfo === "location" &&
                      "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                  )}
                >
                  <MapPin className="size-4" />
                  Room
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setEventInfo("time")}
                  className={cn(
                    "flex-1 normal-case font-medium flex flex-col items-center justify-center gap-1 h-full py-2",
                    eventInfo === "time" &&
                      "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                  )}
                >
                  <Clock className="size-4" />
                  Time
                </Button>
              </div>
            </div>

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
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
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
                    <span
                      className={cn(
                        "size-3.5 min-w-3.5 rounded-[3.5px]",
                        option.preview
                      )}
                    />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Label>Font</Label>
              <div className="grid grid-cols-3 gap-3">
                {fontOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    onClick={() => setFont(option.value)}
                    className={cn(
                      "normal-case font-medium",
                      option.className,
                      font === option.value &&
                        "ring-2 ring-sky-500 ring-offset-2 ring-offset-background"
                    )}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Preparing
              </>
            ) : (
              <>
                <Download className="size-4" />
                Download
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
