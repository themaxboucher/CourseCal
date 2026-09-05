"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, type MotionProps } from "motion/react";

import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
  /**
   * Wraps the active word so callers can layer an effect on it, e.g. render it
   * through `ShinyText`. Defaults to plain text.
   */
  renderWord?: (word: string) => ReactNode;
}

export function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
  renderWord,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [words, duration]);

  const word = words[index];

  return (
    <div className="overflow-hidden py-1">
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          className={cn("block", className)}
          {...motionProps}
        >
          {renderWord ? renderWord(word) : word}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
