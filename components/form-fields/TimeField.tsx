import { Input } from "../ui/input";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn } from "react-hook-form";

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
        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </FormFieldWrapper>
  );
}
