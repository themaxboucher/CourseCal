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
import { Skeleton } from "@/components/ui/skeleton";

interface CourseSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: React.ReactNode;
  placeholder?: string;
  className?: string;
  warning?: string;
  onCourseSelect?: (course: any) => void;
  userId: string;
}

export function CourseField({
  form,
  name,
  label,
  description,
  placeholder = "Select a course",
  className,
  warning,
  onCourseSelect,
  userId,
}: CourseSelectProps) {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasError = form.formState.errors[name];

  const fetchCourses = async (query: string = "") => {
    setIsLoading(true);
    try {
      const coursesData = await getCourses(10, query, userId);
      setCourses(coursesData || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch courses on mount and when userId changes
  useEffect(() => {
    const initializeCourses = async () => {
      // Fetch initial courses with user colors
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
  }, [userId]);

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
      warning={warning}
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
                  "active:scale-100 font-medium normal-case justify-between",
                  !selectedCourse && "font-normal text-muted-foreground",
                  hasError && "border-destructive focus:ring-destructive"
                )}
                aria-invalid={hasError ? "true" : "false"}
              >
                {selectedCourse
                  ? selectedCourse.courseCode
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
                    {isLoading && // Loading skeleton with pulsing animation
                      Array.from({ length: 5 }).map((_, index) => (
                        <CommandItem
                          key={`loading-${index}`}
                          disabled
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex flex-col space-y-2 w-full">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        </CommandItem>
                      ))}
                    {!isLoading &&
                      courses.map((course) => (
                        <CommandItem
                          key={course.$id}
                          value={course.$id}
                          onSelect={() => {
                            const selectedCourse = {
                              $id: course.$id!,
                              courseCode: course.courseCode,
                              title: course.title,
                              color: course.color,
                            };
                            field.onChange(selectedCourse);
                            onCourseSelect?.(selectedCourse);
                            setOpen(false);
                          }}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {course.courseCode}
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
