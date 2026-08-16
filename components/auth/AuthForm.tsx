"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Form } from "../ui/form";
import FormAlert from "../FormAlert";
import { Button } from "../ui/button";
import { TextField } from "../form-fields/TextField";
import { useRouter } from "next/navigation";
import {
  sendMagicLink,
  type AuthIntent,
  type SendMagicLinkResult,
} from "@/lib/actions/auth.actions";

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email" })
    .refine((value) => value.toLowerCase().endsWith("@ucalgary.ca"), {
      message: "Email must be a ucalgary.ca address",
    }),
});

type FailureReason = Extract<SendMagicLinkResult, { ok: false }>["reason"];

const ERROR_MESSAGES: Record<FailureReason, string> = {
  invalid_domain: "Please use your ucalgary.ca email address.",
  no_account: "No account exists for that email.",
  rate_limited: "Too many attempts. Please try again in a few minutes.",
  unknown: "An unknown error occurred. Please try again.",
};

export default function AuthForm({ type }: { type: AuthIntent }) {
  const [error, setError] = useState<FailureReason | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function submit(email: string, intent: AuthIntent) {
    setLoading(true);
    setError(null);
    try {
      const result = await sendMagicLink(email, intent);
      if (!result.ok) {
        setError(result.reason);
        return;
      }
      router.push(`/check-email?intent=${intent}`);
    } catch {
      setError("unknown");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitHandler(data: z.infer<typeof formSchema>) {
    await submit(data.email, type);
  }

  // The login path refuses to create accounts, so offer the user a one-click
  // way to sign up with the address they already typed.
  async function signUpInstead() {
    await submit(form.getValues("email"), "signup");
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col items-center gap-4 w-full max-w-70 pointer-events-auto"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        <div className="flex flex-col items-stretch gap-4 w-full">
          <TextField form={form} name="email" placeholder="you@ucalgary.ca" />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {!loading && "Continue"}
          </Button>
        </div>
        {error && (
          <div className="flex flex-col items-stretch gap-2 w-full">
            <FormAlert message={ERROR_MESSAGES[error]} type="error" />
            {error === "no_account" && (
              <div
                className="w-full text-sm flex items-center justify-center cursor-pointer hover:underline"
                onClick={signUpInstead}
              >
                <span>Create an account instead</span>
              </div>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
