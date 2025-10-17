"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "../form-fields/TextField";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { CircleCheck, CircleX, LoaderCircle, Trash } from "lucide-react";
import { deleteAccount } from "@/lib/actions/users.actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

const deleteSchema = z.object({
  confirm: z.string().refine((val) => val === "DELETE", {
    message: "You must type DELETE to confirm.",
  }),
});

type DeleteFormData = { confirm: string };

interface DeleteAccountProps {
  user: User;
}

export default function DeleteAccount({ user }: DeleteAccountProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const deleteForm = useForm<DeleteFormData>({
    resolver: zodResolver(deleteSchema),
    defaultValues: { confirm: "" },
  });

  async function onDelete() {
    setLoading(true);
    try {
      const authUserId = user.userId;
      const docUserId = user.$id;
      if (!authUserId || !docUserId) {
        throw new Error("User not found");
      }
      await deleteAccount(authUserId, docUserId, user.avatar);

      toast("Account deleted", {
        icon: <CircleCheck className="text-green-500 size-5" />,
      });
      router.push("/");
    } catch (error) {
      toast("Error deleting account", {
        icon: <CircleX className="text-destructive size-5" />,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="size-4" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[375px]">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle>
            Are you sure you want to delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account and all associated data.
            Please type <span className="font-semibold">DELETE</span> to
            confirm:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...deleteForm}>
          <form
            onSubmit={deleteForm.handleSubmit(onDelete)}
            className="space-y-4"
          >
            <TextField
              form={deleteForm}
              name="confirm"
              placeholder="DELETE"
              variant="destructive"
            />

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className="bg-destructive hover:bg-destructive/90"
                disabled={!deleteForm.formState.isValid}
              >
                {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {!loading && "Delete account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
