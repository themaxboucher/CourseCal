"use client";

import { cn, formatTime } from "@/lib/utils";
import { eventColors } from "@/constants";

interface EventProps {
  event: CalendarEvent | DisplayEvent;
  style?: React.CSSProperties;
  className?: string;
  isWallpaper?: boolean;
}

export default function EventBlock({
  event,
  style,
  className,
  isWallpaper = false,
  ...props
}: EventProps) {
  return (
    <div
      className={cn(
        "absolute left-0 right-0 my-[0.2rem] mx-[0.08rem] border-[1.5px] ",
        "text-xs font-medium z-20 relative",
        !isWallpaper && "md:my-1 md:mx-0.5 sm:p-2",
        isWallpaper ? "rounded-sm px-[0.15rem] py-[0.1rem]" : "rounded-lg p-[0.3rem]",
        event.courseColor
          ? eventColors[event.courseColor.color as keyof typeof eventColors] ||
              eventColors.fallback
          : eventColors.fallback,
        "recurrence" in event && event.recurrence !== "weekly" && "opacity-75",
        className
      )}
      style={style}
      {...props}
    >
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
                  "font-semibold truncate",
                  !isWallpaper && "md:text-xs",
                  isWallpaper ? "text-[6px]" : "text-xxs"
                )}
              >
                {event.course.subjectCode} {event.course.catalogNumber}
              </div>
            ) : (
              <div
                className={cn(
                  "font-semibold truncate",
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
              "opacity-75 flex items-center gap-0.5 flex-wrap",
              !isWallpaper && "md:text-xs",
              isWallpaper ? "text-[5px]" : "text-xxs"
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
