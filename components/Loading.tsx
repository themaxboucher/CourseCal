import { Loading3Filled } from "@/components/icons";

export default function Loading({ message }: { message?: string }) {
  return (
    <div className="absolute inset-0 size-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loading3Filled className="size-10 animate-spin text-primary" />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
