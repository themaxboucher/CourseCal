"use client";

import { cn, formatTime } from "@/lib/utils";
import { eventColors } from "@/constants";

interface EventProps {
  event: CalendarEvent | DisplayEvent;
  style?: React.CSSProperties;
  className?: string;
}

export default function EventBlock({
  event,
  style,
  className,
  ...props
}: EventProps) {
  return (
    <div
      className={cn(
        "absolute left-0 right-0 my-[0.2rem] mx-[0.08rem] md:my-1 md:mx-0.5 rounded-lg border-[1.5px] p-[0.3rem] sm:p-2",
        "text-xs font-medium z-20 relative",
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
        <div className="space-y-0.5 md:space-y-1 w-full">
          <div className="w-full flex items-center justify-between gap-2">
            {event.course?.subjectCode && event.course?.catalogNumber ? (
              <div className="font-semibold truncate text-xxs md:text-xs">
                {event.course.subjectCode} {event.course.catalogNumber}
              </div>
            ) : (
              <div className="font-semibold truncate text-xxs md:text-xs">
                {"summary" in event ? event.summary : event.course?.title}
              </div>
            )}
            {event.type && (
              <div className="hidden md:block text-xxs md:text-xs opacity-75 capitalize">
                {event.type}
              </div>
            )}
          </div>
          <div className="text-xxs md:text-xs opacity-75 flex items-center gap-0.5 flex-wrap">
            <span>{formatTime(event.startTime)} - </span>
            <span>{formatTime(event.endTime)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
