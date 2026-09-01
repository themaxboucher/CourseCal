"use client";

import { cn } from "@/lib/utils";
import { formatTime, hatch } from "@/lib/utils/schedule";
import { darkEventColors, eventColors, lightEventColors } from "@/constants";
import { AlertFilled } from "@/components/icons";
import {
  type AnyEvent,
  getCourseTitle,
  getEventColor,
} from "@/lib/utils/events";

interface EventProps {
  event: AnyEvent;
  style?: React.CSSProperties;
  className?: string;
  /**
   * Keeps the phone treatment — small type, tight padding, no class-type label
   * — whatever the viewport. Every upgrade below is gated on viewport width,
   * but what a block actually has to fit is its column: the landing page hero
   * gives the grid half the page, so its columns are as narrow as a phone's
   * while the viewport is still `md`, and desktop type there costs the course
   * code its room and wraps a 50-minute block's times out of its own height.
   */
  compact?: boolean;
  isWallpaper?: boolean;
  wallpaperTheme?: ThemeType;
  eventInfo?: EventInfoType;
}

export default function EventBlock({
  event,
  style,
  className,
  compact = false,
  isWallpaper = false,
  wallpaperTheme = "light",
  eventInfo = "location",
  ...props
}: EventProps) {
  const color = getEventColor(event);
  const courseTitle = getCourseTitle(event);
  // A wallpaper's blocks are a few pixels tall and already carry their own
  // scale, so it reaches the same place from the other direction.
  const roomy = !isWallpaper && !compact;

  // A wallpaper carries its own theme, so its palette can't come from the
  // `dark` variant — that follows the app's theme, which would leave a dark
  // wallpaper wearing light colors whenever the app is in light mode.
  const colorPalette = isWallpaper
    ? wallpaperTheme === "dark"
      ? darkEventColors
      : lightEventColors
    : eventColors;
  const colorClass = color
    ? (colorPalette[color as keyof typeof colorPalette] ??
      colorPalette.fallback)
    : colorPalette.fallback;

  return (
    <div
      className={cn(
        "absolute left-0 right-0 mx-[0.08rem] border-[1.5px]",
        "text-xs font-medium z-20 relative",
        !isWallpaper && "md:mx-0.5",
        roomy && "sm:p-2",
        isWallpaper
          ? "rounded-sm px-[0.15rem] py-[0.1rem] my-[0.1rem]"
          : "rounded-lg p-[0.3rem]",
        colorClass,
        className,
      )}
      style={
        event.recurrence === "biweekly"
          ? { backgroundImage: hatch(isWallpaper ? 7 : 18), ...style }
          : style
      }
      {...props}
    >
      {(!event.course_code || !event.type) && !isWallpaper && (
        <div className="absolute -top-1.5 -right-1.5 size-5 md:size-6 flex justify-center items-center rounded-full border-[1.5px] text-amber-600 bg-amber-200 border-amber-100">
          <AlertFilled className="size-3 md:size-3.5" />
        </div>
      )}
      <div className="flex items-start justify-between gap-1">
        <div
          className={cn(
            "w-full",
            roomy && "md:space-y-1",
            isWallpaper ? "space-y-0" : "space-y-0.5",
          )}
        >
          <div className="w-full flex items-center justify-between gap-2">
            {event.course_code ? (
              <div
                className={cn(
                  "font-bold truncate",
                  roomy && "md:text-xs",
                  isWallpaper ? "text-[6px]" : "text-xxs",
                )}
              >
                {event.course_code}
              </div>
            ) : (
              <div
                className={cn(
                  "font-bold truncate",
                  roomy && "md:text-xs",
                  isWallpaper ? "text-[6px]" : "text-xxs",
                )}
              >
                {courseTitle}
              </div>
            )}
            {event.type && !compact && (
              <div
                className={cn(
                  "hidden text-xxs opacity-75 capitalize",
                  !isWallpaper && "md:block md:text-xs",
                )}
              >
                {event.type}
              </div>
            )}
          </div>
          <div
            className={cn(
              "opacity-75 flex justify-start items-center gap-0.5 flex-wrap tracking-tight",
              roomy && "md:text-xs",
              isWallpaper
                ? "text-[5.5px]"
                : compact
                  ? "text-[8px] leading-tight sm:text-[10px]"
                  : "text-xxs",
            )}
          >
            {isWallpaper && eventInfo === "location" ? (
              <span className="truncate">
                {event.location || "No location"}
              </span>
            ) : (
              <span>
                {formatTime(event.start_time, !isWallpaper)}
                {isWallpaper ? "-" : " - "}
                {formatTime(event.end_time, !isWallpaper)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
