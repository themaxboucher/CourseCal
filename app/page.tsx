import { ThemeSelector } from "@/components/ThemeSelector";

export default function Home() {
  return (
    <div>
      <h1 className="heading-1">DinoCal</h1>
      <p className="text-sm text-muted-foreground">
        A better UCalgary schedule.
      </p>
      <div>
        <ThemeSelector />
      </div>
    </div>
  );
}
