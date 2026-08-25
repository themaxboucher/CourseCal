"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loading3Filled } from "@/components/icons";
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

const EMAIL_DOMAIN = "@ucalgary.ca";

// Every account is on the same domain, so the field holds only the part before
// it and the input shows the domain as a suffix.
const formSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Enter your email" })
    .refine((value) => !value.includes("@"), {
      message: `Enter only the part before ${EMAIL_DOMAIN}`,
    }),
});

const toEmail = (username: string) =>
  `${username.trim().toLowerCase()}${EMAIL_DOMAIN}`;

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
      username: "",
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
    await submit(toEmail(data.username), type);
  }

  // The login path refuses to create accounts, so offer the user a one-click
  // way to sign up with the address they already typed.
  async function signUpInstead() {
    await submit(toEmail(form.getValues("username")), "signup");
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col items-center gap-4 w-full max-w-70 pointer-events-auto"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        <div className="flex flex-col items-stretch gap-4 w-full">
          <TextField
            form={form}
            name="username"
            placeholder="username"
            suffix={EMAIL_DOMAIN}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loading3Filled className="h-4 w-4 animate-spin" />}
            {!loading && "Continue"}
          </Button>
        </div>
        {error && (
          <div className="flex flex-col items-stretch gap-2 w-full">
            <FormAlert message={ERROR_MESSAGES[error]} type="error" />
            {error === "no_account" && (
              <button
                type="button"
                className="w-full text-sm flex items-center justify-center cursor-pointer hover:underline"
                onClick={signUpInstead}
              >
                <span>Create an account instead</span>
              </button>
            )}
          </div>
        )}
      </form>
    </Form>
  );
}
