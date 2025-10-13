import { Switch } from "../ui/switch";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn } from "react-hook-form";

interface SwitchFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: React.ReactNode;
}

export function SwitchField({
  form,
  name,
  label,
  description,
}: SwitchFieldProps) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
    >
      <div className="flex items-center gap-2">
        <Switch className="mt-0.5" />
        <span className="font-normal text-sm text-muted-foreground">
          {label}
        </span>
      </div>
    </FormFieldWrapper>
  );
}
