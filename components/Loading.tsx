import { Loading3Filled } from "@/components/icons";

export default function Loading({ message }: { message?: string }) {
  return (
    <div className="flex min-h-[calc(100dvh-68px)] w-full items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <Loading3Filled className="size-10 animate-spin text-primary" />
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
