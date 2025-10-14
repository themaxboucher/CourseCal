import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";

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
      {({ field }: { field: ControllerRenderProps<any, string> }) => (
        <div className="flex flex-wrap gap-4 py-2">
          {options.map((option) => {
            const isChecked = field.value?.includes(option.value) || false;

            return (
              <Label
                key={option.value}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    const currentValue = field.value || [];
                    if (checked) {
                      // Add the option to the array if it's not already there
                      if (!currentValue.includes(option.value)) {
                        field.onChange([...currentValue, option.value]);
                      }
                    } else {
                      // Remove the option from the array
                      field.onChange(
                        currentValue.filter(
                          (item: string) => item !== option.value
                        )
                      );
                    }
                  }}
                />
                <span className="font-normal">{option.label}</span>
              </Label>
            );
          })}
        </div>
      )}
    </FormFieldWrapper>
  );
}
