import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { eventColors } from "@/constants";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";

interface ColorFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: React.ReactNode;
  className?: string;
}

export function ColorField({
  form,
  name,
  label,
  description,
  className,
}: ColorFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
      className={className}
    >
      {({ field }) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "size-8 p-0 border-2",
                field.value || eventColors[0]
              )}
            >
              <div className="w-full h-full rounded-sm" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" sideOffset={10} className="w-fit p-3">
            <div className="grid grid-cols-4 gap-2">
              {eventColors.map((color) => (
                <Button
                  key={color}
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    "size-6 p-0 border-2 hover:scale-105 transition-transform",
                    color,
                    field.value === color && "ring-2 ring-offset-2 ring-ring"
                  )}
                  onClick={() => {
                    field.onChange(color);
                    setOpen(false);
                  }}
                ></Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </FormFieldWrapper>
  );
}
