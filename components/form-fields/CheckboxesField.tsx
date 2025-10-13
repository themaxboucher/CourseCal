import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn } from "react-hook-form";

interface CheckboxesFieldProps {
  form: UseFormReturn<any>;
  name: string;
  options: { value: string; label: string }[];
  label?: string;
  description?: React.ReactNode;
}

export function CheckboxesField({
  form,
  name,
  label,
  options,
  description,
}: CheckboxesFieldProps) {
  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
    >
      <div className="flex flex-wrap gap-4 py-2">
        {options.map((option) => (
          <Label key={option.value}>
            <Checkbox value={option.value} />
            <span className="font-normal">{option.label}</span>
          </Label>
        ))}
      </div>
    </FormFieldWrapper>
  );
}
