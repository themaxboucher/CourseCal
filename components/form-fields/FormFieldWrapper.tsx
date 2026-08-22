import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import type { ReactNode } from "react";
import type { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { FormWarning } from "../FormWarning";

interface FormFieldWrapperProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  children:
    | ReactNode
    | ((props: { field: ControllerRenderProps<any, string> }) => ReactNode);
  className?: string;
  description?: React.ReactNode;
  warning?: string;
  suffix?: string;
}

export function FormFieldWrapper({
  form,
  name,
  label,
  children,
  className,
  description,
  warning,
  suffix,
}: FormFieldWrapperProps) {
  const hasError = form.formState.errors[name];

  // The suffix is drawn over the right edge of the control, so it only needs a
  // positioned wrapper when there is one to show.
  const withSuffix = (control: ReactNode) =>
    suffix ? (
      <div className="relative">
        {control}
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-base md:text-sm">
          {suffix}
        </span>
      </div>
    ) : (
      control
    );

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          {withSuffix(
            <FormControl>
              {typeof children === "function" ? children({ field }) : children}
            </FormControl>,
          )}
          {description && (
            <FormDescription className="text-xs text-muted-foreground">
              {description}
            </FormDescription>
          )}
          {warning && !hasError && <FormWarning message={warning} />}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
