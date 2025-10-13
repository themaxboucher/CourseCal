import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import EventForm from "./EventForm";

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventToEdit: CalendarEvent | null;
}

export default function EventDialog({
  open,
  onOpenChange,
  eventToEdit,
}: EventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{eventToEdit ? "Edit Class" : "Add Class"}</DialogTitle>
        </DialogHeader>
        <EventForm
          eventToEdit={eventToEdit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
