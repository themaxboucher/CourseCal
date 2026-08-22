"use client";

import { useEffect, useRef, useState } from "react";
import WallpaperImage from "./WallpaperImage";
import { Iphone } from "../ui/iphone";
import { cn } from "@/lib/utils";
import { backgroundOptions } from "@/constants";

const fontStyles: Record<FontType, string> = {
  default: "font-sans",
  serif: "font-serif",
  writing: "font-writing",
  rounded: "font-rounded",
  stencil: "font-stencil",
  pixels: "font-pixels",
};

import type { AnyEvent } from "@/lib/utils/events";

interface WallpaperPreviewProps {
  events: AnyEvent[];
  // Applied to the box the frame is fitted into, not to the frame itself.
  className?: string;
  // When true the frame scales down to fit a box shorter than it is, instead
  // of overflowing it. Off by default so callers that size by width are
  // unaffected.
  fitToBox?: boolean;
  imageRef?: React.RefObject<HTMLDivElement | null>;
  background: BackgroundType;
  font: FontType;
  theme: ThemeType;
  cellHeight: number;
  eventInfo: EventInfoType;
}

export default function WallpaperPreview({
  events,
  className,
  fitToBox = false,
  imageRef,
  background,
  font,
  theme,
  cellHeight,
  eventInfo,
}: WallpaperPreviewProps) {
  const bgOption = backgroundOptions.find((opt) => opt.value === background);
  const bgClass = bgOption?.[theme] ?? "";

  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // The wallpaper is laid out at a fixed geometry so the exported image is the
  // same on every device. Where the box is shorter than the frame we scale the
  // whole frame rather than narrowing it, which would shrink the fixed type
  // inside out of proportion with the phone around it. A transform leaves the
  // frame's layout size alone, so the export is unaffected.
  useEffect(() => {
    if (!fitToBox) return;
    const box = boxRef.current;
    const frame = frameRef.current;
    if (!box || !frame) return;

    const fit = () => {
      const { width, height } = box.getBoundingClientRect();
      const { offsetWidth, offsetHeight } = frame;
      if (!offsetWidth || !offsetHeight) return;
      setScale(Math.min(1, width / offsetWidth, height / offsetHeight));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [fitToBox]);

  const frame = (
    <Iphone className="max-w-70" theme={theme}>
      <div ref={imageRef}>
        <div
          className={cn(
            "overflow-hidden w-full aspect-18/39 py-3.5 px-2 flex flex-col justify-end items-stretch",
            bgClass,
            fontStyles[font],
          )}
        >
          <WallpaperImage
            events={events}
            theme={theme}
            cellHeight={cellHeight}
            eventInfo={eventInfo}
          />
        </div>
      </div>
    </Iphone>
  );

  if (!fitToBox) {
    return <div className={cn("w-full max-w-70", className)}>{frame}</div>;
  }

  return (
    <div
      ref={boxRef}
      className={cn(
        "flex w-full items-center justify-center overflow-hidden",
        className,
      )}
    >
      <div
        ref={frameRef}
        className="w-70 max-w-full shrink-0 origin-center"
        style={{ transform: `scale(${scale})` }}
      >
        {frame}
      </div>
    </div>
  );
}
