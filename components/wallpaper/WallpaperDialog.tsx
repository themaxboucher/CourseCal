import { CellphoneFilled } from "@/components/icons";
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
import { useIsMobile } from "@/hooks/use-mobile";
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
  // The trigger button has to render before the viewport can be measured, so
  // an unmeasured viewport falls back to the desktop layout.
  const isMobile = useIsMobile() ?? false;
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
          <CellphoneFilled className="size-5" />
        </Button>
      </DrawerTrigger>
    ) : (
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CellphoneFilled className="size-4" />
          Wallpaper
        </Button>
      </DialogTrigger>
    )
  ) : null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        {trigger}
        <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[90dvh]">
          <DrawerHeader className="shrink-0 border-b py-3">
            <DrawerTitle>Download wallpaper</DrawerTitle>
            <VisuallyHidden>
              <DrawerDescription>
                Download a wallpaper of your schedule that isn&apos;t blocked by
                your lock screens time or widgets.
              </DrawerDescription>
            </VisuallyHidden>
          </DrawerHeader>
          <WallpaperForm events={events} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent className="sm:max-w-5xl p-0 overflow-hidden">
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
