"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCourses } from "@/lib/actions/courses.actions";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { UseFormReturn } from "react-hook-form";

interface CourseSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export function CourseField({
  form,
  name,
  label,
  description,
  placeholder = "Select a course",
  className,
}: CourseSelectProps) {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const hasError = form.formState.errors[name];

  const fetchCourses = async (query: string = "") => {
    try {
      const coursesData = await getCourses(10, query);
      setCourses(coursesData.documents || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  };

  // Fetch courses on mount
  useEffect(() => {
    const initializeCourses = async () => {
      // Fetch initial courses
      await fetchCourses();

      // If there's a selected course, add it to the list
      const fieldValue = form.getValues(name);
      if (fieldValue) {
        setCourses((prev) => {
          const exists = prev.some((c) => c.$id === fieldValue.$id);
          return exists ? prev : [...prev, fieldValue];
        });
      }
    };

    initializeCourses();
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCourses(searchQuery);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
      className={className}
    >
      {({ field }: { field: any }) => {
        const selectedCourse = field.value;

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "active:scale-100 font-normal normal-case justify-between",
                  selectedCourse && "font-medium",
                  hasError && "border-destructive focus:ring-destructive"
                )}
                aria-invalid={hasError ? "true" : "false"}
              >
                {selectedCourse
                  ? `${selectedCourse.subjectCode} ${selectedCourse.catalogNumber}`
                  : placeholder}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search course"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>No courses found.</CommandEmpty>
                  <CommandGroup>
                    {courses.map((course) => (
                      <CommandItem
                        key={course.$id}
                        value={course.$id}
                        onSelect={() => {
                          field.onChange({
                            $id: course.$id!,
                            subjectCode: course.subjectCode,
                            catalogNumber: course.catalogNumber,
                            title: course.title,
                          });
                          setOpen(false);
                        }}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {course.subjectCode} {course.catalogNumber}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {course.title}
                          </span>
                        </div>
                        <CheckIcon
                          className={cn(
                            "mr-2 size-4",
                            field.value?.$id === course.$id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        );
      }}
    </FormFieldWrapper>
  );
}
