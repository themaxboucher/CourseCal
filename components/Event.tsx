"use client";

import { cn, getSubjectColor, formatTime } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import EventDetails from "./EventDetails";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
interface EventProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function Event({
  event,
  onClick,
  style,
  className,
}: EventProps) {
  const subjectColor = event.course?.title
    ? getSubjectColor(event.course.title)
    : event.summary
    ? getSubjectColor(event.summary)
    : "bg-gray-100 border-gray-200 text-gray-800";

  const eventContent = (
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
  );

  return (
    <>
      {/* Desktop: Popover */}
      <div className="hidden md:block">
        <Popover>
          <PopoverTrigger asChild>{eventContent}</PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            sideOffset={10}
            alignOffset={-25}
            className="border-[1.5px]"
          >
            <EventDetails event={event} />
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile: Drawer */}
      <div className="block md:hidden">
        <Drawer>
          <DrawerTrigger asChild>{eventContent}</DrawerTrigger>
          <DrawerContent className="border-[1.5px]">
            <VisuallyHidden>
              <DrawerHeader>
                <DrawerTitle>
                  {event.course?.subjectCode && event.course?.catalogNumber
                    ? `${event.course.subjectCode} ${event.course.catalogNumber}`
                    : event.summary}
                </DrawerTitle>
              </DrawerHeader>
            </VisuallyHidden>
            <div className="px-4 pb-4 pt-6">
              <EventDetails event={event} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
