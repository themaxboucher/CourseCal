import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { MapPin } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface EventProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  style?: React.CSSProperties;
  className?: string;
}

const colorPalette = [
  "bg-red-500  border-red-300 dark:bg-red-700 dark:border-red-900 text-white",
  "bg-orange-500  border-orange-300 dark:bg-orange-700 dark:border-orange-900 text-white",
  "bg-yellow-400 border-yellow-300 dark:bg-yellow-500 dark:border-yellow-700 text-white",
  "bg-green-500  border-green-300 dark:bg-green-700 dark:border-green-900 text-white",
  "bg-blue-500  border-blue-300 dark:bg-blue-700 dark:border-blue-900 text-white",
  "bg-purple-500  border-purple-300 dark:bg-purple-700 dark:border-purple-900 text-white",
  "bg-pink-500  border-pink-300 dark:bg-pink-700 dark:border-pink-900 text-white",
];

// Simple hash function to consistently assign colors to course titles
const getSubjectColor = (title: string): string => {
  if (!title) return "bg-gray-100 border-gray-200 text-gray-800";

  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    const char = title.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

export default function Event({
  event,
  onClick,
  style,
  className,
}: EventProps) {
  console.log(event.course);
  const formatTime = (timeString: string) => {
    // Handle time strings like "16:00:00" or "16:00"
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes || 0, 0, 0);
    return format(date, "h:mm a");
  };

  const subjectColor = event.course?.title
    ? getSubjectColor(event.course.title)
    : event.summary
    ? getSubjectColor(event.summary)
    : "bg-gray-100 border-gray-200 text-gray-800";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "absolute left-0 right-0 my-[0.2rem] mx-[0.08rem] md:my-1 md:mx-0.5 rounded-lg border-[1.5px] p-[0.3rem] sm:p-2 cursor-pointer hover:opacity-95 transition-opacity",
            "text-xs font-medium z-20 relative",
            subjectColor,
            className
          )}
          style={style}
          onClick={() => onClick?.(event)}
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
                    {event.summary}
                  </div>
                )}
                {event.type && (
                  <div className="text-xxs md:text-xs opacity-75 capitalize">
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
      </PopoverTrigger>
      <PopoverContent side="left" align="center">
        <div className="flex items-start justify-between gap-1">
          <div className="space-y-1 w-full">
            <div className="w-full flex items-center justify-between gap-2">
              {event.course?.subjectCode && event.course?.catalogNumber ? (
                <div className="font-semibold truncate">
                  {event.course.subjectCode} {event.course.catalogNumber}
                </div>
              ) : (
                <div className="font-semibold truncate">{event.summary}</div>
              )}
              {event.type && (
                <div className="text-xs opacity-75 capitalize">
                  {event.type}
                </div>
              )}
            </div>
            <div className="text-xs opacity-75">
              {formatTime(event.startTime)} - {formatTime(event.endTime)}
            </div>
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="size-3 min-w-3" />
                <div className="text-xs opacity-75 truncate">
                  {event.location}
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
