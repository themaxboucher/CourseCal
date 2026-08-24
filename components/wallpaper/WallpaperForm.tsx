"use client";

import { useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import {
  DownloadFilled,
  InformationFilled,
  Loading3Filled,
  LocationFilled,
  MoonFilled,
  SunFilled,
  TimeFilled,
} from "@/components/icons";
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

import type { AnyEvent } from "@/lib/utils/events";

interface WallpaperFormProps {
  events: AnyEvent[];
}

export function WallpaperForm({ events }: WallpaperFormProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const previewPhoneRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [background, setBackground] = useState<BackgroundType>("plain");
  const [font, setFont] = useState<FontType>("default");
  const [theme, setTheme] = useState<ThemeType>("light");
  const [cellHeight, setCellHeight] = useState(50);
  const [eventInfo, setEventInfo] = useState<EventInfoType>("location");
  const [isSaving, setIsSaving] = useState(false);
  const [savedImage, setSavedImage] = useState<string | null>(null);

  // The phone is laid out at the size it exports at, so on short screens it
  // stands taller than the room the layout can spare and gets clipped. Scaling
  // it to whatever space is left keeps the whole phone in view without
  // shrinking what gets exported.
  useEffect(() => {
    const area = previewAreaRef.current;
    const phone = previewPhoneRef.current;
    if (!area || !phone) return;

    // Every measurement here is a layout box, so neither the dialog's open
    // animation nor the scale being applied can be mistaken for the area
    // changing size.
    const fitToArea = () => {
      const { clientWidth, clientHeight } = area;
      const { offsetWidth, offsetHeight } = phone;
      if (!offsetWidth || !offsetHeight) return;
      setPreviewScale(
        Math.min(clientWidth / offsetWidth, clientHeight / offsetHeight, 1),
      );
    };

    // The observer's first callback only arrives once the page is being
    // rendered, so measure up front for the case where it opens hidden.
    fitToArea();
    const observer = new ResizeObserver(fitToArea);
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  // Fetching and inlining the font keeps the network off the critical path of
  // an export, so the share sheet opens while the tap that asked for it still
  // counts as user activation.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `font` isn't read here, but the embed CSS is built from the preview's *computed* font families, so it has to be rebuilt whenever the selected font changes.
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

      const fileName = `wallpaper-${Date.now()}.png`;
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
    <div className="relative flex min-h-0 flex-1 flex-col md:grid md:grid-cols-2 md:gap-4">
      {savedImage && (
        <div className="absolute inset-0 z-20 bg-background">
          <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
            <div className="space-y-1">
              <h2 className="heading-3">Save to Photos</h2>
              <p className="text-muted-foreground">
                Press and hold the wallpaper, then choose Save to Photos.
              </p>
            </div>
            {/* biome-ignore lint/performance/noImgElement: `savedImage` is a client-generated data: URL, which next/image cannot optimize, and press-and-hold to save to Photos needs a plain <img>. */}
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

      {/* The export is captured from the preview's laid-out size, so the phone
          always lays out at full width and is only scaled down for display. */}
      <div className="flex h-[38dvh] max-h-72 shrink-0 items-center justify-center overflow-hidden border-b bg-muted p-2 md:h-full md:max-h-none md:border-b-0 md:border-r md:p-10">
        <div
          ref={previewAreaRef}
          className="flex size-full items-center justify-center"
        >
          <div
            ref={previewPhoneRef}
            className="w-70 shrink-0"
            style={{ transform: `scale(${previewScale})` }}
          >
            <WallpaperPreview
              events={events}
              imageRef={previewRef}
              background={background}
              font={font}
              theme={theme}
              cellHeight={cellHeight}
              eventInfo={eventInfo}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="space-y-1 hidden md:block">
          <h2 className="heading-3">Download wallpaper</h2>
          <p className="text-muted-foreground">
            Download a wallpaper of your schedule that isn&apos;t blocked by
            your lock screens time or widgets.
          </p>
        </div>

        <form className="flex min-h-0 flex-1 flex-col justify-between gap-6 md:h-full">
          <div className="relative flex min-h-0 flex-1 flex-col md:flex-initial">
            <div className="flex flex-col gap-6 -mx-2 px-2 pb-2 overflow-y-auto md:max-h-[500px] scrollbar-thin">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Label>Height</Label>
                    <HoverCard>
                      <HoverCardTrigger>
                        <InformationFilled className="size-4 text-muted-foreground" />
                      </HoverCardTrigger>
                      <HoverCardContent align="start">
                        <p className="text-sm">
                          The schedule will take up more or less space,
                          depending on your phone&apos;s dimensions.
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
                        "ring-2 ring-sky-500 ring-offset-2 ring-offset-background",
                    )}
                  >
                    <LocationFilled className="size-4" />
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
                        "ring-2 ring-sky-500 ring-offset-2 ring-offset-background",
                    )}
                  >
                    <TimeFilled className="size-4" />
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
                        "ring-2 ring-sky-500 ring-offset-2 ring-offset-background",
                    )}
                  >
                    <SunFilled className="size-4" />
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
                        "ring-2 ring-sky-500 ring-offset-2 ring-offset-background",
                    )}
                  >
                    <MoonFilled className="size-4" />
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
                          "ring-2 ring-sky-500 ring-offset-2 ring-offset-background",
                      )}
                    >
                      <span
                        className={cn(
                          "size-3.5 min-w-3.5 rounded-[3.5px]",
                          option.preview,
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
                          "ring-2 ring-sky-500 ring-offset-2 ring-offset-background",
                      )}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            {/* Hints that the drawer's control list runs past the fold. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-linear-to-t from-background md:hidden" />
          </div>
          <Button
            type="button"
            onClick={handleDownload}
            disabled={isSaving}
            className="shrink-0 gap-2"
          >
            {isSaving ? (
              <>
                <Loading3Filled className="size-4 animate-spin" />
                Preparing
              </>
            ) : (
              <>
                <DownloadFilled className="size-4" />
                Download
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
