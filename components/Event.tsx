"use client";

import { cn, getReadableRecurrence } from "@/lib/utils";
import { format } from "date-fns";
import {
  Clock,
  MapPin,
  Pen,
  RefreshCw,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { classTypeIcons } from "@/constants";
import { useState } from "react";
import EventDialog from "./EventDialog";
import DeleteEventDialog from "./DeleteEventDialog";

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
  console.log("event.days", event.days);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  function handleEditDialog() {
    setIsDialogOpen(true);
  }

  function handleDeleteDialog() {
    setIsDeleteDialogOpen(true);
  }

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
    <>
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
        <PopoverContent
          side="left"
          align="start"
          sideOffset={10}
          alignOffset={-25}
          className="border-[1.5px] space-y-4"
        >
          <div className="flex gap-3">
            <div
              className={cn("min-h-full w-1.5 rounded-[0.2rem]", subjectColor)}
            />
            <div>
              <div className="w-full flex items-center justify-between gap-2">
                <div>
                  {event.course?.subjectCode && event.course?.catalogNumber ? (
                    <div className="font-semibold truncate">
                      {event.course.subjectCode} {event.course.catalogNumber}
                    </div>
                  ) : (
                    <div className="font-semibold truncate">
                      {event.summary}
                    </div>
                  )}
                  <div className="text-sm opacity-75 text-muted-foreground">
                    {event.course?.title || event.summary}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <div className="flex items-center gap-1">
              {event.type &&
                (() => {
                  const IconComponent =
                    classTypeIcons[event.type] || classTypeIcons.default;
                  return (
                    <div className="p-1.5 bg-muted/50 rounded-full">
                      <IconComponent className="size-3 min-w-3" />
                    </div>
                  );
                })()}
              <div className="text-sm capitalize">{event.type}</div>
            </div>
            <div className="flex items-center gap-1">
              <div className="p-1.5 bg-muted/50 rounded-full">
                <Clock className="size-3 min-w-3" />
              </div>
              <div className="text-sm">
                {formatTime(event.startTime)} - {formatTime(event.endTime)}
              </div>
            </div>
            {event.location && (
              <div className="flex items-center gap-1">
                <div className="p-1.5 bg-muted/50 rounded-full">
                  <MapPin className="size-3 min-w-3" />
                </div>
                <div className="text-sm truncate">{event.location}</div>
              </div>
            )}
            <div className="flex items-center gap-1">
              <div className="p-1.5 bg-muted/50 rounded-full">
                <RefreshCw className="size-3 min-w-3" />
              </div>
              {event && event.recurrence && (
                <div className="text-sm truncate">
                  {getReadableRecurrence(event.recurrence, event.days)}
                </div>
              )}
            </div>
          </div>
          {(!event.course || !event.type) && (
            <Alert className="border-[1.5px] bg-yellow-100 border-yellow-400 dark:bg-yellow-800/20 text-yellow-600">
              <TriangleAlert className="size-3" />
              <AlertTitle>Incomplete details</AlertTitle>
              <AlertDescription className="text-yellow-600">
                Edit this class to add missing details.
              </AlertDescription>
            </Alert>
          )}
          <div className="flex gap-0.5">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={handleEditDialog}
            >
              <Pen className="size-3.5" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={handleDeleteDialog}
            >
              <Trash2 className="size-3.5" /> Delete
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <EventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        eventToEdit={event}
      />
      <DeleteEventDialog
        eventId={event.$id || ""}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
