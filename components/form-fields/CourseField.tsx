"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

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
import { UseFormReturn, ControllerRenderProps } from "react-hook-form";

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
  const [open, setOpen] = React.useState(false);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const fetchCourses = React.useCallback(async (query: string = "") => {
    try {
      setLoading(true);
      const coursesData = await getCourses(7, query);
      setCourses(coursesData.documents || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial courses when component mounts
  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Debounced search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCourses(searchQuery);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchCourses]);

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
      className={className}
    >
      {({ field }: { field: ControllerRenderProps<any, string> }) => {
        const selectedCourse = courses.find(
          (course) => course.$id === field.value
        );

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "active:scale-100 font-normal normal-case justify-between",
                  selectedCourse && "font-medium"
                )}
                disabled={loading}
              >
                {loading
                  ? "Loading courses"
                  : selectedCourse
                  ? `${selectedCourse.subjectCode} ${selectedCourse.catalogNumber}`
                  : placeholder}
                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search course"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>
                    {loading ? "Loading courses" : "No course found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {courses.map((course) => (
                      <CommandItem
                        key={course.$id}
                        value={course.$id}
                        onSelect={(currentValue) => {
                          const newValue =
                            currentValue === field.value ? "" : currentValue;
                          field.onChange(newValue);
                          setOpen(false);
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {course.subjectCode} {course.catalogNumber}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {course.title}
                          </span>
                        </div>
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === course.$id
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
