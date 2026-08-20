"use client";

import {
  CheckFilled,
  SelectorVerticalFilled,
} from "@mingcute/react/core-filled";
import { useState, useEffect, useCallback } from "react";
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
import type { UseFormReturn } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tables } from "@/types/supabase";

type Course = Tables<"courses">;

interface CourseSelectProps {
  form: UseFormReturn<any>;
  name: string;
  label?: string;
  description?: React.ReactNode;
  placeholder?: string;
  className?: string;
  warning?: string;
  onCourseSelect?: (course: Course) => void;
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
}: CourseSelectProps) {
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasError = form.formState.errors[name];

  const fetchCourses = useCallback(async (query: string = "") => {
    setIsLoading(true);
    try {
      const COURSE_LIMIT = 10;
      const coursesData = await getCourses(COURSE_LIMIT, query);
      setCourses(coursesData || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeCourses = async () => {
      // Fetch initial courses with user colors
      await fetchCourses();

      // If there's a selected course, add it to the list
      const fieldValue = form.getValues(name);
      if (fieldValue) {
        setCourses((prev) => {
          const exists = prev.some((c) => c.id === fieldValue.id);
          return exists ? prev : [...prev, fieldValue];
        });
      }
    };

    initializeCourses();
  }, [fetchCourses, form, name]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        fetchCourses(searchQuery);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchCourses]);

  return (
    <FormFieldWrapper
      form={form}
      name={name}
      label={label}
      description={description}
      className={className}
      warning={warning}
    >
      {({
        field,
      }: {
        field: {
          value: Course | null;
          onChange: (value: Course | null) => void;
        };
      }) => {
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
                  hasError && "border-destructive focus:ring-destructive",
                )}
                aria-invalid={hasError ? "true" : "false"}
              >
                {selectedCourse ? selectedCourse.code : placeholder}
                <SelectorVerticalFilled className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                          // biome-ignore lint/suspicious/noArrayIndexKey: placeholder skeletons are interchangeable and never reorder.
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
                          key={course.id}
                          value={course.code}
                          onSelect={() => {
                            field.onChange(course);
                            onCourseSelect?.(course);
                            setOpen(false);
                          }}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{course.code}</span>
                            <span className="text-xs text-muted-foreground truncate">
                              {course.title}
                            </span>
                          </div>
                          <CheckFilled
                            className={cn(
                              "mr-2 size-4",
                              field.value?.id === course.id
                                ? "opacity-100"
                                : "opacity-0",
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
