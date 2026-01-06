"use client";

import { cn, formatTime } from "@/lib/utils";
import { eventColors, lightEventColors } from "@/constants";
import { ThemeType } from "./wallpaper/WallpaperForm";
import { TriangleAlert } from "lucide-react";

interface EventProps {
  event: CalendarEvent | DisplayEvent;
  style?: React.CSSProperties;
  className?: string;
  isWallpaper?: boolean;
  wallpaperTheme?: ThemeType;
}

export default function EventBlock({
  event,
  style,
  className,
  isWallpaper = false,
  wallpaperTheme = "light",
  ...props
}: EventProps) {
  return (
    <div
      className={cn(
        "absolute left-0 right-0 mx-[0.08rem] border-[1.5px]",
        "text-xs font-medium z-20 relative",
        !isWallpaper && "md:my-1 md:mx-0.5 sm:p-2",
        isWallpaper
          ? "rounded-sm px-[0.15rem] py-[0.1rem] my-[0.1rem]"
          : "rounded-lg p-[0.3rem] my-[0.2rem]",
        // Event colors
        isWallpaper && wallpaperTheme === "light"
          ? event.courseColor?.color
            ? lightEventColors[
                event.courseColor.color as keyof typeof lightEventColors
              ] || lightEventColors.fallback
            : lightEventColors.fallback
          : event.courseColor?.color
          ? eventColors[event.courseColor.color as keyof typeof eventColors] ||
            eventColors.fallback
          : eventColors.fallback,
        "recurrence" in event && event.recurrence !== "weekly" && "opacity-75",
        className
      )}
      style={style}
      {...props}
    >
      {(!event.course || !event.type) && !isWallpaper && (
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
            {event.course?.subjectCode && event.course?.catalogNumber ? (
              <div
                className={cn(
                  "font-bold truncate",
                  !isWallpaper && "md:text-xs",
                  isWallpaper ? "text-[6px]" : "text-xxs"
                )}
              >
                {event.course.subjectCode} {event.course.catalogNumber}
              </div>
            ) : (
              <div
                className={cn(
                  "font-bold truncate",
                  !isWallpaper && "md:text-xs",
                  isWallpaper ? "text-[6px]" : "text-xxs"
                )}
              >
                {"summary" in event ? event.summary : event.course?.title}
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
              isWallpaper ? "text-[4.5px]" : "text-xxs"
            )}
          >
            <span>{formatTime(event.startTime, !isWallpaper)} - </span>
            <span>{formatTime(event.endTime, !isWallpaper)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
