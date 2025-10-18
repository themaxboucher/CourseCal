import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormWarningProps {
  message: string;
  className?: string;
}

export function FormWarning({ message, className }: FormWarningProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400",
        className
      )}
    >
      <AlertTriangle className="h-3 w-3" />
      <span>{message}</span>
    </div>
  );
}
