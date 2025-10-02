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

interface CourseSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CourseSelect({
  value,
  onValueChange,
  placeholder = "Select course...",
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
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchCourses]);

  const selectedCourse = courses.find((course) => course.$id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={className}
          disabled={loading}
        >
          {loading
            ? "Loading courses..."
            : selectedCourse
            ? `${selectedCourse.subjectCode} ${selectedCourse.catalogNumber} - ${selectedCourse.title}`
            : placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search courses..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading courses..." : "No course found."}
            </CommandEmpty>
            <CommandGroup>
              {courses.map((course) => (
                <CommandItem
                  key={course.$id}
                  value={course.$id}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    onValueChange?.(newValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === course.$id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {course.subjectCode} {course.catalogNumber}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {course.title}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
