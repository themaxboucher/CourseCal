"use client";

import { useState, useRef, useEffect } from "react";
import {
  analyzeScheduleImage,
  type ScheduleAnalysisResult,
} from "@/lib/actions/ai.actions";
import { saveEvents as saveLocalEvents } from "@/lib/indexeddb";
import { CalendarAddFilled, Loading3Filled } from "@/components/icons";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import ShinyText from "./ui/ShinyText";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { getTerms } from "@/lib/actions/terms.actions";
import { parsedToDBEvents, parsedToLocalEvents } from "@/lib/utils/upload";
import { createEvents } from "@/lib/actions/events.actions";
import { markUserCompletedOnboarding } from "@/lib/actions/users.actions";
import type { Tables } from "@/types/supabase";
import { getRelevantTerm } from "@/lib/utils/schedule";
import { captureEvent } from "@/lib/posthog-client";

/** Where in the app this uploader is mounted. */
export type UploadSurface = "landing" | "onboarding" | "dialog";

interface UploadScheduleProps {
  term?: Tables<"terms"> | null;
  surface: UploadSurface;
}

export default function UploadSchedule({ term, surface }: UploadScheduleProps) {
  const [result, setResult] = useState<ScheduleAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  // `null` until the first client render, so the paste hint never flashes the
  // wrong modifier key on hydration.
  const [isMac, setIsMac] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsMac(/Mac/.test(navigator.userAgent));
  }, []);

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyze = async (imageBase64: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const analysisResult = await analyzeScheduleImage(imageBase64);
      setResult(analysisResult);

      if (!analysisResult.success || !analysisResult.isSchedule) {
        captureEvent("schedule_upload_failed", {
          surface,
          // A rejected screenshot and a failed call look the same to the user
          // but mean opposite things: one is a bad upload, the other is us.
          reason: analysisResult.success ? "not_a_schedule" : "analysis_failed",
        });
        clearFileInput();
        return;
      }

      const user = await getLoggedInUser();
      const terms = await getTerms();
      const effectiveTerm = term ?? getRelevantTerm(terms);

      // If the user is already logged in, save the events to the database
      if (user) {
        const { events: dbEvents, courseColors } = await parsedToDBEvents(
          analysisResult.events,
          user.id,
          effectiveTerm.id,
        );
        await createEvents(dbEvents, courseColors);
      } else {
        // If the user is not logged in, save the events to IndexedDB
        const localEvents = await parsedToLocalEvents(
          analysisResult.events,
          effectiveTerm.id,
        );
        await saveLocalEvents(localEvents);
      }

      captureEvent("schedule_uploaded", {
        surface,
        is_authenticated: Boolean(user),
        // A logged-out upload lives in IndexedDB until the account that claims
        // it exists — `app/(internal)/verify/page.tsx` is what moves it.
        persisted: user ? "db" : "local",
        event_count: analysisResult.events.length,
        term_id: effectiveTerm.id,
      });

      if (surface === "onboarding") {
        router.push("/onboarding/friends");
        return;
      }

      // If the user is logged in and has a name and major, mark them as completed onboarding
      // biome-ignore lint/complexity/useOptionalChain: `user` is `T | false`, not nullable — `?.` wouldn't narrow away the `false` branch the way `&&` does.
      if (user && user.name && user.major) {
        await markUserCompletedOnboarding(user.id);
      }

      router.push("/schedule?uploadSuccess=true");
    } catch (error) {
      console.error("Failed to save schedule:", error);
      captureEvent("schedule_upload_failed", {
        surface,
        reason: "save_failed",
      });
      setResult({
        success: false,
        error: "Failed to save schedule. Please try again.",
      });
      clearFileInput();
    } finally {
      setIsLoading(false);
    }
  };

  // Shared by all three input paths: the file picker, drag and drop, and paste.
  const processFile = (file: File) => {
    if (isLoading) return;

    if (!file.type.startsWith("image/")) {
      captureEvent("schedule_upload_failed", {
        surface,
        reason: "not_an_image",
      });
      setResult({ success: false, error: "Please select an image file" });
      clearFileInput();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setResult(null);
      analyze(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Lets the window-level paste listener reach the latest `processFile` without
  // resubscribing on every render.
  const processFileRef = useRef(processFile);
  useEffect(() => {
    processFileRef.current = processFile;
  });

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      // Paste only fires on the focused editable element, so the listener has to
      // sit on `window` for Cmd+V to work anywhere on the page — which means
      // stepping aside when the user is genuinely typing somewhere.
      const target = e.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes(target?.tagName ?? "")
      ) {
        return;
      }

      // A screenshot on the clipboard arrives as a `file` item, the same `File`
      // the picker and drop handler produce.
      const item = Array.from(e.clipboardData?.items ?? []).find(
        (i) => i.kind === "file" && i.type.startsWith("image/"),
      );
      if (!item) return;

      const file = item.getAsFile();
      if (!file) return;

      e.preventDefault();
      processFileRef.current(file);
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
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
    if (file) processFile(file);
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

        {/* Desktop upload */}
        {/* biome-ignore lint/a11y/useSemanticElements: the zone contains its own <Button>, so it cannot be one. */}
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
            "hidden lg:flex group w-full h-54 border-2 border-input border-dashed hover:border-ring hover:bg-ring/5 hover:text-ring ring-white rounded-2xl flex-col items-center justify-center gap-4 text-muted-foreground transition-colors cursor-pointer",
            isDragging && "border-ring bg-ring/5 text-ring",
          )}
        >
          {!isLoading ? (
            <>
              <div
                className={cn(
                  "flex items-center justify-center rounded-2xl bg-muted/50 group-hover:bg-ring/5 group-hover:text-ring p-3",
                  isDragging && "bg-ring/5 text-ring",
                )}
              >
                <CalendarAddFilled className="size-6" />
              </div>

              {isDragging ? (
                <span>Drop your schedule here</span>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4">
                  <span>Upload a screenshot of your schedule</span>
                  <div className="flex flex-col items-center gap-2">
                    <Button>Choose file</Button>
                    {isMac !== null && (
                      <span className="text-xs text-muted-foreground/70 group-hover:text-ring/70">
                        or paste with {isMac ? "⌘V" : "Ctrl+V"}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Loading3Filled className="size-8 animate-spin text-primary" />
              <ShinyText text="Analyzing schedule" speed={1.5} />
            </>
          )}
        </div>

        {/* Tablet & Mobile upload */}
        {!isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 lg:hidden">
            <Button onClick={() => fileInputRef.current?.click()}>
              <CalendarAddFilled className="size-4" />
              Choose file
            </Button>
            <p className="text-muted-foreground text-sm">
              Upload a screenshot of your schedule
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground lg:hidden">
            <Loading3Filled className="size-6 text-primary animate-spin" />
            <ShinyText text="Analyzing schedule" speed={1.5} />
          </div>
        )}
      </div>

      {/* Error state */}
      {result && !result.success && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
          {result.error}
        </div>
      )}

      {/* Not a schedule */}
      {result?.success && !result.isSchedule && (
        <div className="p-4 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm">
          This doesn&apos;t appear to be a university schedule. Please upload a
          screenshot of your course schedule.
        </div>
      )}
    </div>
  );
}
