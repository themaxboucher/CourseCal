import { Input } from "../ui/input";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface TimeFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: React.ReactNode;
}

export default function TimeField({
  form,
  name,
  label,
  description,
}: TimeFieldProps) {
  const hasError = form.formState.errors[name];

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
    >
      <Input
        type="time"
        step="60"
        {...form.register(name)}
        className={cn(
          "bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none",
          hasError && "border-destructive focus-visible:ring-destructive"
        )}
        aria-invalid={hasError ? "true" : "false"}
      />
    </FormFieldWrapper>
  );
}
