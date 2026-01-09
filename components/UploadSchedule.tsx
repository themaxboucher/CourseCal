"use client";

import { useState, useRef } from "react";
import {
  analyzeScheduleImage,
  ScheduleAnalysisResult,
} from "@/lib/actions/ai.actions";
import { saveEvents, saveCourseColors } from "@/lib/indexeddb";
import { Loader2, CalendarArrowUp } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function UploadSchedule() {
  const [result, setResult] = useState<ScheduleAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const analyze = async (imageBase64: string) => {
    setIsLoading(true);
    setResult(null);

    const analysisResult = await analyzeScheduleImage(imageBase64);
    console.log(analysisResult);
    setResult(analysisResult);

    if (analysisResult.success && analysisResult.isSchedule) {
      // Extract unique course colors from events
      const courseColors: CourseColor[] = [];
      const seenCourses = new Set<string>();

      for (const event of analysisResult.events) {
        const courseCode = event.course.courseCode;
        if (!seenCourses.has(courseCode)) {
          seenCourses.add(courseCode);
          courseColors.push({
            course: courseCode,
            color: event.courseColor.color,
          });
        }
      }

      // Store in IndexedDB
      await saveEvents(analysisResult.events);
      await saveCourseColors(courseColors);

      router.push("/schedule");
    }

    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setResult({ success: false, error: "Please select an image file" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;

      setResult(null);
      analyze(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setResult({ success: false, error: "Please select an image file" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setResult(null);
      analyze(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-[30rem] space-y-4">
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "group w-full h-54 border-2 border-input border-dashed hover:border-ring hover:bg-ring/5 ring-white rounded-xl flex flex-col items-center justify-center gap-4 text-muted-foreground transition-colors cursor-pointer",
            isDragging && "border-ring bg-ring/5"
          )}
        >
          {!isLoading ? (
            <>
              <CalendarArrowUp className="size-8" />

              {isDragging ? (
                <span>Drop your schedule here</span>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <span>Upload a screenshot of your schedule</span>

                  <Button>Choose file</Button>
                </div>
              )}
            </>
          ) : (
            <>
              <Loader2 className="size-8 animate-spin" />
              <span>Analyzing schedule...</span>
            </>
          )}
        </div>
      </div>

      {/* Error state */}
      {result && !result.success && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {result.error}
        </div>
      )}

      {/* Not a schedule */}
      {result && result.success && !result.isSchedule && (
        <div className="p-4 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm">
          This doesn&apos;t appear to be a university schedule. Please upload a
          screenshot of your course schedule.
        </div>
      )}
    </div>
  );
}
