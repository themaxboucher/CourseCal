import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectFieldOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  color?: string;
  group?: string;
}

interface SelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: SelectFieldOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  warning?: string;
}

export function SelectField({
  form,
  name,
  label,
  options,
  placeholder = "Select an option",
  className,
  disabled = false,
  warning,
}: SelectFieldProps) {
  const hasError = form.formState.errors[name];

  // Group options if group is provided
  const groupedOptions = options.reduce<Record<string, SelectFieldOption[]>>(
    (acc, option) => {
      const group = option.group || "";
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    },
    {}
  );

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      className={className}
      warning={warning}
    >
      {({ field }: { field: ControllerRenderProps<any, string> }) => {
        const selectedOption = options.find(
          (option) => option.value === field.value
        );
        return (
          <Select value={field.value || ""} onValueChange={field.onChange}>
            <SelectTrigger
              className={cn(
                "w-full disabled:opacity-100",
                hasError && "border-destructive focus:ring-destructive"
              )}
              disabled={disabled}
              aria-invalid={hasError ? "true" : "false"}
            >
              <SelectValue
                placeholder={placeholder}
                title={selectedOption?.label}
              >
                {selectedOption && (
                  <div className="flex items-center gap-2">
                    {selectedOption.icon ? (
                      <selectedOption.icon
                        className={cn("size-4", selectedOption.color)}
                      />
                    ) : null}
                    <span className="truncate max-w-[120px]">
                      {selectedOption.label}
                    </span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupedOptions).map(([group, groupOptions]) =>
                group ? (
                  <SelectGroup key={group}>
                    <SelectLabel>{group}</SelectLabel>
                    {groupOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="flex items-center gap-2"
                        title={option.label}
                      >
                        {option.icon ? (
                          <option.icon className={cn("size-4", option.color)} />
                        ) : null}
                        <span>{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ) : (
                  groupOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="flex items-center gap-2"
                    >
                      {option.icon ? (
                        <option.icon className={cn("size-4", option.color)} />
                      ) : null}
                      <span className="truncate">{option.label}</span>
                    </SelectItem>
                  ))
                )
              )}
            </SelectContent>
          </Select>
        );
      }}
    </FormFieldWrapper>
  );
}
