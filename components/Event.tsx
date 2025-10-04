import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface EventProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  style?: React.CSSProperties;
  className?: string;
}

const colorPalette = [
  "bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200",
  "bg-orange-100 dark:bg-orange-900 border-orange-200 dark:border-orange-900 text-orange-800 dark:text-orange-200",
  "bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-900 text-yellow-800 dark:text-yellow-200",
  "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-900 text-green-800 dark:text-green-200",
  "bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-200",
  "bg-purple-100 dark:bg-purple-900 border-purple-200 dark:border-purple-900 text-purple-800 dark:text-purple-200",
  "bg-pink-100 dark:bg-pink-900 border-pink-200 dark:border-pink-900 text-pink-800 dark:text-pink-200",
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
    <div
      className={cn(
        "absolute left-0 right-0 m-0.5 rounded-lg border-[1.5px] p-2 cursor-pointer hover:shadow-sm transition-shadow",
        "text-xs font-medium overflow-hidden z-20",
        subjectColor,
        className
      )}
      style={style}
      onClick={() => onClick?.(event)}
    >
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

            <div className="text-xs opacity-75 capitalize">Lecture</div>
          </div>
          <div className="text-xs opacity-75">
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </div>
          {event.location && (
            <div className="text-xs opacity-75 truncate">
              📍 {event.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
