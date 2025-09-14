import { Calendar } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="size-6 text-primary" />
      <h1 className="text-xl font-semibold">CourseCal</h1>
    </div>
  );
}
