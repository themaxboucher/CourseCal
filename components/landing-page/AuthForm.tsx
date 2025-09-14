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

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

export default function AuthForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmitHandler(data: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log(data);
  }
  return (
    <Form {...form}>
      <form
        className="grid gap-4 w-full max-w-md pointer-events-auto"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
          <div className="md:col-span-3">
            <TextField form={form} name="email" placeholder="you@ucalgary.ca" />
          </div>
          <Button
            type="submit"
            className="w-full md:col-span-2"
            disabled={loading}
          >
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {!loading && "Get started!"}
          </Button>
        </div>
        {error && <FormAlert message={error} type="error" />}
        {success && (
          <FormAlert
            message="Check your email for a login link."
            type="success"
          />
        )}
      </form>
    </Form>
  );
}
