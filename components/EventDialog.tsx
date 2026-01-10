"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import EventForm from "./EventForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect, useState } from "react";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventToEdit: UserEvent | ScheduleEvent | null;
  term?: string;
  events?: (UserEvent | ScheduleEvent)[];
  user?: User;
  isGuest?: boolean;
  onEventSaved?: () => void;
}

export default function EventDialog({
  open,
  onOpenChange,
  eventToEdit,
  term,
  events = [],
  user,
  isGuest = false,
  onEventSaved,
}: EventDialogProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Render drawer for mobile
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
        <DrawerContent>
          <VisuallyHidden>
            <DrawerHeader>
              <DrawerTitle>
                {eventToEdit ? "Edit Class" : "New Class"}
              </DrawerTitle>
            </DrawerHeader>
          </VisuallyHidden>
          <div className="overflow-y-auto px-4 pb-4 pt-6">
            <EventForm
              eventToEdit={eventToEdit}
              onCancel={() => onOpenChange(false)}
              term={term}
              events={events}
              user={user}
              isGuest={isGuest}
              onEventSaved={onEventSaved}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Render dialog for desktop
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <DialogHeader>
          <DialogTitle>{eventToEdit ? "Edit Class" : "New Class"}</DialogTitle>
        </DialogHeader>
      </VisuallyHidden>
      <DialogContent className="sm:max-w-[400px] pt-12">
        <EventForm
          eventToEdit={eventToEdit}
          onCancel={() => onOpenChange(false)}
          term={term}
          events={events}
          user={user}
          isGuest={isGuest}
          onEventSaved={onEventSaved}
        />
      </DialogContent>
    </Dialog>
  );
}
