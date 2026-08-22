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
import { useState } from "react";
import { useCompactViewport } from "@/lib/hooks/useMediaQuery";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "../ui/drawer";

import type { AnyEvent } from "@/lib/utils/events";

interface WallpaperDialogProps {
  events: AnyEvent[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function WallpaperDialog({
  events,
  open: controlledOpen,
  onOpenChange,
}: WallpaperDialogProps) {
  const isMobile = useCompactViewport();
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
                Download a wallpaper of your schedule that isn&apos;t blocked by
                your lock screens time or widgets.
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
      <DialogContent className="w-full sm:max-w-[min(64rem,calc(100%-2rem))] p-0">
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
