import type { UseFormReturn } from "react-hook-form";
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
  suffix?: string;
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
  suffix,
}: TextFieldProps) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
      warning={warning}
      suffix={suffix}
      className="flex-grow"
    >
      <Input
        placeholder={placeholder}
        {...form.register(name)}
        className={className}
        // Keep what the user types clear of the suffix. One `ch` per character
        // over-estimates the width of proportional text, which is the safe side.
        style={
          suffix ? { paddingRight: `calc(${suffix.length}ch)` } : undefined
        }
        aria-invalid={
          form.formState.errors[name] || variant === "destructive"
            ? "true"
            : "false"
        }
      />
    </FormFieldWrapper>
  );
}
