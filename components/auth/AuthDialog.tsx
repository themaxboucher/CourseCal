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
import type { AuthIntent } from "@/lib/actions/auth.actions";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: AuthIntent;
}

export function AuthDialog({ open, onOpenChange, type }: AuthDialogProps) {
  const isSignup = type === "signup";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm flex flex-col items-center gap-8">
        <DialogHeader className="flex flex-col items-center gap-2">
          <Image
            src="/coursecal-logo.svg"
            alt="Logo"
            width={100}
            height={100}
            className="size-10 mb-2"
          />
          <DialogTitle className="text-center">
            {isSignup ? "Create an account" : "Log in"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isSignup
              ? "Enter your ucalgary.ca email below to sign up. You'll receive a magic link to create your account."
              : "Enter your ucalgary.ca email below to log in."}
          </DialogDescription>
        </DialogHeader>
        <AuthForm type={type} />
      </DialogContent>
    </Dialog>
  );
}
