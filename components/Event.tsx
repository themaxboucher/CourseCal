"use client";

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
import EventBlock from "./EventBlock";

interface EventProps {
  event: UserEvent | ScheduleEvent;
  style?: React.CSSProperties;
  events?: (UserEvent | ScheduleEvent)[];
  user?: User;
  isGuest?: boolean;
  onEventsChange?: () => void;
}

export default function Event({
  event,
  style,
  events = [],
  user,
  isGuest = false,
  onEventsChange,
}: EventProps) {
  return (
    <>
      {/* Desktop: Popover */}
      <div className="hidden md:block">
        <Popover>
          <PopoverTrigger asChild>
            <EventBlock
              event={event}
              style={style}
              className="cursor-pointer hover:opacity-95 transition-opacity"
            />
          </PopoverTrigger>
          <PopoverContent
            side="left"
            align="start"
            sideOffset={10}
            alignOffset={-25}
            className="border-[1.5px]"
          >
            <EventDetails
              event={event}
              events={events}
              user={user}
              isGuest={isGuest}
              onEventsChange={onEventsChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile: Drawer */}
      <div className="block md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <EventBlock
              event={event}
              style={style}
              className="cursor-pointer hover:opacity-95 transition-opacity"
            />
          </DrawerTrigger>
          <DrawerContent className="border-[1.5px]">
            <VisuallyHidden>
              <DrawerHeader>
                <DrawerTitle>
                  {event.course.courseCode}
                </DrawerTitle>
              </DrawerHeader>
            </VisuallyHidden>
            <div className="px-4 pb-4 pt-6">
              <EventDetails
                event={event}
                events={events}
                user={user}
                isGuest={isGuest}
                onEventsChange={onEventsChange}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
