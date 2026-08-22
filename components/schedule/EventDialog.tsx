"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import EventForm from "./EventForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useCompactViewport } from "@/lib/hooks/useMediaQuery";
import type { Tables } from "@/types/supabase";
import type { AnyEvent } from "@/lib/utils/events";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventToEdit: AnyEvent | null;
  // Term is only required when creating a new event. When editing, the term
  // is taken from the event being edited.
  term?: number;
  events?: AnyEvent[];
  user?: Tables<"users">;
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
  const isMobile = useCompactViewport();

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
