import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";

interface RadioGroupFieldProps {
  form: UseFormReturn<any>;
  name: string;
  options: { value: string; label: string }[];
  label?: string;
  description?: React.ReactNode;
}

export function RadioGroupField({
  form,
  name,
  label,
  options,
  description,
}: RadioGroupFieldProps) {
  const hasError = form.formState.errors[name];

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
    >
      {({ field }: { field: ControllerRenderProps<any, string> }) => (
        <RadioGroup
          value={field.value}
          onValueChange={field.onChange}
          className="flex flex-wrap gap-4 py-2"
        >
          {options.map((option) => (
            <Label
              key={option.value}
              className={cn(
                "flex items-center space-x-2 cursor-pointer",
                hasError && "text-destructive"
              )}
            >
              <RadioGroupItem value={option.value} />
              <span className="font-normal">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      )}
    </FormFieldWrapper>
  );
}
