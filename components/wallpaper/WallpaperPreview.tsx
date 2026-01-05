import WallpaperImage from "./WallpaperImage";
import { Iphone } from "../ui/iphone";
import { BackgroundType, FontType, ThemeType } from "./WallpaperForm";
import { cn } from "@/lib/utils";

interface WallpaperPreviewProps {
  events: CalendarEvent[];
  imageRef: React.RefObject<HTMLDivElement | null>;
  background: BackgroundType;
  font: FontType;
  theme: ThemeType;
}

const backgroundStyles: Record<BackgroundType, string> = {
  "gradient-1": "bg-gradient-to-b from-background dark:from-muted to-muted dark:to-background",
  "gradient-2": "bg-gradient-to-b from-sky-100 dark:from-sky-500 to-blue-200 dark:to-blue-800",
  "gradient-3": "bg-gradient-to-b from-orange-100 dark:from-orange-500 to-red-200 dark:to-red-800",
};

const fontStyles: Record<FontType, string> = {
  default: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

export function WallpaperPreview({
  events,
  imageRef,
  background,
  font,
  theme,
}: WallpaperPreviewProps) {
  return (
    <div className="flex justify-center items-center bg-muted border-r p-10 h-full">
      <Iphone className="max-w-70" theme={theme}>
        <div ref={imageRef}>
          <div
            className={cn(
              "overflow-hidden w-full aspect-18/39 py-3.5 px-2 flex flex-col justify-end items-stretch",
              backgroundStyles[background],
              fontStyles[font],
            )}
          >
            <WallpaperImage events={events} />
          </div>
        </div>
      </Iphone>
    </div>
  );
}
