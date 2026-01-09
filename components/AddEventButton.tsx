"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import EventDialog from "./EventDialog";

interface AddEventButtonProps {
  term: string;
  events?: (UserEvent | ScheduleEvent)[];
  user?: User | null;
  isGuest?: boolean;
  onEventSaved?: () => void;
}

export function AddEventButton({
  term,
  events = [],
  user,
  isGuest = false,
  onEventSaved,
}: AddEventButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function handleOpenDialog() {
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
  }

  return (
    <>
      <Button className="hidden md:flex" size="sm" onClick={handleOpenDialog}>
        <Plus className="size-4" />
        <span>Add Class</span>
      </Button>
      <Button className="md:hidden" size="icon" onClick={handleOpenDialog}>
        <Plus className="size-5" />
      </Button>
      <EventDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        eventToEdit={null}
        term={term}
        events={events}
        user={user ?? undefined}
        isGuest={isGuest}
        onEventSaved={onEventSaved}
      />
    </>
  );
}
