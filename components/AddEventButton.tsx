"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import EventDialog from "./EventDialog";

export function AddEventButton({ term }: { term: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  function handleOpenDialog() {
    setIsDialogOpen(true);
  }

  function handleCloseDialog() {
    setIsDialogOpen(false);
  }
  return (
    <>
      <Button size="sm" onClick={handleOpenDialog}>
        <Plus className="size-4" />
        <span className="hidden md:block">Add Class</span>
      </Button>
      <EventDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        eventToEdit={null}
        term={term}
      />
    </>
  );
}
