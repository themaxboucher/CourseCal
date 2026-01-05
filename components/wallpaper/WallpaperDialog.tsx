import { Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import WeekView from "../WeekView";
import { WallpaperForm } from "./WallpaperForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface WallpaperDialogProps {
  events: CalendarEvent[];
}

export function WallpaperDialog({ events }: WallpaperDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hidden md:flex">
          <Smartphone className="size-4" />
          <span className="hidden md:block">Wallpaper</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full !max-w-5xl p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Wallpaper</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <WallpaperForm events={events} />
      </DialogContent>
    </Dialog>
  );
}
