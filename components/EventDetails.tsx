import {
  cn,
  getReadableRecurrence,
  getSubjectColor,
  formatTime,
} from "@/lib/utils";
import {
  Clock,
  MapPin,
  Pen,
  RefreshCw,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { useState } from "react";
import DeleteEventDialog from "./DeleteEventDialog";
import EventDialog from "./EventDialog";
import { classTypeIcons } from "@/constants";

export default function EventDetails({ event }: { event: CalendarEvent }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const subjectColor = event.course?.title
    ? getSubjectColor(event.course.title)
    : event.summary
    ? getSubjectColor(event.summary)
    : "bg-gray-100 border-gray-200 text-gray-800";

  function handleEditDialog() {
    setIsDialogOpen(true);
  }

  function handleDeleteDialog() {
    setIsDeleteDialogOpen(true);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div
            className={cn("min-h-full w-1.5 rounded-[0.2rem]", subjectColor)}
          />
          <div>
            <div className="w-full flex items-center justify-between gap-2">
              <div>
                {event.course?.subjectCode && event.course?.catalogNumber && (
                  <div className="font-semibold truncate">
                    {event.course.subjectCode} {event.course.catalogNumber}
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
      </div>
      <EventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        eventToEdit={event}
      />
      <DeleteEventDialog
        eventId={event.$id || ""}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onEventDeleted={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
}
