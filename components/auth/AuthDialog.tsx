"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import AuthForm from "./AuthForm";
import Image from "next/image";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "signup" | "login";
}

export function AuthDialog({ open, onOpenChange, type }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full !max-w-sm flex flex-col items-center gap-8">
        <DialogHeader className="flex flex-col items-center gap-2">
          <Image src="/coursecal-logo.svg" alt="Logo" width={100} height={100} className="size-10 mb-2" />
          <DialogTitle className="text-center">
            {type === "signup" ? "Create an account" : "Log in"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {type === "signup"
              ? "Enter your ucalgary.ca email below to sign up."
              : "Enter your ucalgary.ca email below to log in."}
            {type === "signup" && (
              <p className="text-sm text-muted-foreground">
                You will receive a magic link to your email to sign up.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}
