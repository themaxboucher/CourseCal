import { UseFormReturn } from "react-hook-form";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { Input } from "../ui/input";

interface TextFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  description?: React.ReactNode;
  variant?: "destructive" | "default";
  warning?: string;
}

export function TextField({
  form,
  name,
  label,
  placeholder,
  className,
  description,
  variant = "default",
  warning,
}: TextFieldProps) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
      warning={warning}
    >
      <Input
        placeholder={placeholder}
        {...form.register(name)}
        className={className}
        aria-invalid={
          form.formState.errors[name] || variant === "destructive"
            ? "true"
            : "false"
        }
      />
    </FormFieldWrapper>
  );
}
