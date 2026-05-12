"use client";

import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils/schedule";
import { eventColors, lightEventColors } from "@/constants";
import { TriangleAlert } from "lucide-react";
import {
  type AnyEvent,
  getCourseTitle,
  getEventColor,
} from "@/lib/utils/events";

interface EventProps {
  event: AnyEvent;
  style?: React.CSSProperties;
  className?: string;
  isWallpaper?: boolean;
  wallpaperTheme?: ThemeType;
  eventInfo?: EventInfoType;
}

export default function EventBlock({
  event,
  style,
  className,
  isWallpaper = false,
  wallpaperTheme = "light",
  eventInfo = "location",
  ...props
}: EventProps) {
  const color = getEventColor(event);
  const courseTitle = getCourseTitle(event);

  const colorPalette =
    isWallpaper && wallpaperTheme === "light" ? lightEventColors : eventColors;
  const colorClass = color
    ? colorPalette[color as keyof typeof colorPalette] ?? colorPalette.fallback
    : colorPalette.fallback;

  return (
    <div
      className={cn(
        "absolute left-0 right-0 mx-[0.08rem] border-[1.5px]",
        "text-xs font-medium z-20 relative",
        !isWallpaper && "md:my-1 md:mx-0.5 sm:p-2",
        isWallpaper
          ? "rounded-sm px-[0.15rem] py-[0.1rem] my-[0.1rem]"
          : "rounded-lg p-[0.3rem] my-[0.2rem]",
        colorClass,
        event.recurrence !== "weekly" && "opacity-75",
        className
      )}
      style={style}
      {...props}
    >
      {(!event.course_code || !event.type) && !isWallpaper && (
        <div className="absolute -top-1.5 -right-1.5 size-5 md:size-6 flex justify-center items-center rounded-full border-[1.5px] text-amber-600 bg-amber-200 border-amber-100">
          <TriangleAlert className="size-3 md:size-3.5" />
        </div>
      )}
      <div className="flex items-start justify-between gap-1">
        <div
          className={cn(
            "w-full",
            !isWallpaper && "md:space-y-1",
            isWallpaper ? "space-y-0" : "space-y-0.5"
          )}
        >
          <div className="w-full flex items-center justify-between gap-2">
            {event.course_code ? (
              <div
                className={cn(
                  "font-bold truncate",
                  !isWallpaper && "md:text-xs",
                  isWallpaper ? "text-[6px]" : "text-xxs"
                )}
              >
                {event.course_code}
              </div>
            ) : (
              <div
                className={cn(
                  "font-bold truncate",
                  !isWallpaper && "md:text-xs",
                  isWallpaper ? "text-[6px]" : "text-xxs"
                )}
              >
                {courseTitle}
              </div>
            )}
            {event.type && (
              <div
                className={cn(
                  "hidden text-xxs opacity-75 capitalize",
                  !isWallpaper && "md:block md:text-xs"
                )}
              >
                {event.type}
              </div>
            )}
          </div>
          <div
            className={cn(
              "opacity-75 flex justify-start items-center gap-0.5 flex-wrap tracking-tight",
              !isWallpaper && "md:text-xs",
              isWallpaper ? "text-[5.5px]" : "text-xxs"
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
