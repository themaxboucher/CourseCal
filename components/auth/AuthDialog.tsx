"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import AuthForm from "./AuthForm";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import type { AuthIntent } from "@/lib/actions/auth.actions";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: AuthIntent;
}

export function AuthDialog({ open, onOpenChange, type }: AuthDialogProps) {
  const isSignup = type === "signup";
  const isMobile = useIsMobile();

  const title = isSignup ? "Create an account" : "Log in";
  const description = isSignup
    ? "Enter your ucalgary.ca email below to sign up. You'll receive a magic link to create your account."
    : "Enter your ucalgary.ca email below to log in.";

  const logo = (
    <Image
      src="/coursecal-logo.svg"
      alt="Logo"
      width={100}
      height={100}
      className="size-10 mb-2"
    />
  );

  // Nothing renders until the viewport is measured, so the drawer never has to
  // replace an already-painted dialog.
  if (isMobile === undefined) {
    return null;
  }

  // A centered dialog sits behind the on-screen keyboard, which mobile browsers
  // open over the page without shrinking it. The sheet is anchored to the
  // bottom edge instead, and vaul lifts it as the keyboard comes up.
  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        direction="bottom"
        // Let the sheet finish opening before the keyboard appears, so the
        // ucalgary.ca instruction is readable. Tapping the field raises it.
        autoFocus={false}
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col items-center gap-2 pt-6">
            {logo}
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="flex justify-center px-4 pb-8">
            <AuthForm type={type} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm flex flex-col items-center gap-8">
        <DialogHeader className="flex flex-col items-center gap-2">
          {logo}
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <AuthForm type={type} />
      </DialogContent>
    </Dialog>
  );
}
