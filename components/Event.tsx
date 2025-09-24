import { cn } from "@/lib/utils";

interface EventProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  style?: React.CSSProperties;
  className?: string;
}

const colorPalette = [
  "bg-red-100 border-red-200 text-red-800",
  "bg-orange-100 border-orange-200 text-orange-800",
  "bg-yellow-100 border-yellow-200 text-yellow-800",
  "bg-green-100 border-green-200 text-green-800",
  "bg-blue-100 border-blue-200 text-blue-800",
  "bg-purple-100 border-purple-200 text-purple-800",
  "bg-pink-100 border-pink-200 text-pink-800",
];

// Simple hash function to consistently assign colors to subject codes
const getSubjectColor = (subjectCode: string): string => {
  if (!subjectCode) return "bg-gray-100 border-gray-200 text-gray-800";

  let hash = 0;
  for (let i = 0; i < subjectCode.length; i++) {
    const char = subjectCode.charCodeAt(i);
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
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const subjectColor = getSubjectColor(event.course.subjectCode);

  return (
    <div
      className={cn(
        "absolute left-0 right-0 mx-1 rounded-lg border p-2 cursor-pointer hover:shadow-sm transition-shadow",
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
            <div className="font-semibold truncate">
              {event.course.subjectCode} {event.course.catalogNumber}
            </div>
            <div className="text-xs opacity-75 capitalize">
              {event.course.instructionalComponents}
            </div>
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
