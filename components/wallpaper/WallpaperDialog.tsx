import { Smartphone } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { WallpaperForm } from "./WallpaperForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "../ui/drawer";

interface WallpaperDialogProps {
  events: ScheduleEvent[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function WallpaperDialog({
  events,
  open: controlledOpen,
  onOpenChange,
}: WallpaperDialogProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    }
    if (!isControlled) {
      setInternalOpen(value);
    }
  };

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

  // Render trigger button only when uncontrolled
  const trigger = !isControlled ? (
    isMobile ? (
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Smartphone className="size-5" />
        </Button>
      </DrawerTrigger>
    ) : (
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Smartphone className="size-4" />
          Wallpaper
        </Button>
      </DialogTrigger>
    )
  ) : null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        {trigger}
        <DrawerContent>
          <DrawerHeader className="border-b">
            <VisuallyHidden>
              <DrawerTitle>Download wallpaper</DrawerTitle>
              <DrawerDescription>
                Download a wallpaper of your schedule that isn't blocked by your
                lock screens time or widgets.
              </DrawerDescription>
            </VisuallyHidden>
          </DrawerHeader>
          <div className="overflow-y-auto">
            <WallpaperForm events={events} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
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
