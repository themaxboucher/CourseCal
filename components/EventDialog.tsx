import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import EventForm from "./EventForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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
      <VisuallyHidden>
        <DialogHeader>
          <DialogTitle>{eventToEdit ? "Edit Class" : "New Class"}</DialogTitle>
        </DialogHeader>
      </VisuallyHidden>
      <DialogContent className="sm:max-w-[400px] pt-12">
        <EventForm
          eventToEdit={eventToEdit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
