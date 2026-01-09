"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { CircleX, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteEvent } from "@/lib/actions/events.actions";
import { deleteEvent as deleteLocalEvent } from "@/lib/indexeddb";

interface DeleteEventDialogProps {
  eventId: string | number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEventDeleted?: () => void;
  isGuest?: boolean;
}

export default function DeleteEventDialog({
  eventId,
  open,
  onOpenChange,
  onEventDeleted,
  isGuest = false,
}: DeleteEventDialogProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (isGuest) {
        await deleteLocalEvent(eventId as number);
      } else {
        await deleteEvent(eventId as string);
        router.refresh();
      }
      onEventDeleted?.();
    } catch (error) {
      toast("Error deleting class", {
        icon: <CircleX className="text-destructive size-5" />,
      });
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[375px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Class</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this class? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
