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
import { sendMagicLink } from "@/lib/actions/users.actions";

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email" })
    .refine((value) => value.toLowerCase().endsWith("@ucalgary.ca"), {
      message: "Email must be a ucalgary.ca address",
    }),
});

export default function AuthForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmitHandler(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await sendMagicLink(data.email);
      router.push("/check-email");
    } catch (error) {
      setError("An unknown error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
            {!loading && "Get started"}
          </Button>
        </div>
        {error && <FormAlert message={error} type="error" />}
      </form>
    </Form>
  );
}
