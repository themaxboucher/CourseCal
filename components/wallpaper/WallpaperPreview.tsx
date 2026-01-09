import WallpaperImage from "./WallpaperImage";
import { Iphone } from "../ui/iphone";
import { cn } from "@/lib/utils";

const backgroundStyles: Record<BackgroundType, Record<ThemeType, string>> = {
  plain: {
    light: "bg-gradient-to-b from-white to-zinc-100",
    dark: "bg-gradient-to-b from-zinc-800 to-zinc-950",
  },
  ice: {
    light: "bg-gradient-to-b from-sky-100 to-blue-200",
    dark: "bg-gradient-to-b from-sky-500 to-blue-800",
  },
  fire: {
    light: "bg-gradient-to-b from-orange-100 to-red-200",
    dark: "bg-gradient-to-b from-orange-500 to-red-800",
  },
};

const fontStyles: Record<FontType, string> = {
  default: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

interface WallpaperPreviewProps {
  events: ScheduleEvent[];
  imageRef?: React.RefObject<HTMLDivElement | null>;
  background: BackgroundType;
  font: FontType;
  theme: ThemeType;
}

export default function WallpaperPreview({
  events,
  imageRef,
  background,
  font,
  theme,
}: WallpaperPreviewProps) {
  return (
    <Iphone className="max-w-70" theme={theme}>
      <div ref={imageRef}>
        <div
          className={cn(
            "overflow-hidden w-full aspect-18/39 py-3.5 px-2 flex flex-col justify-end items-stretch",
            backgroundStyles[background][theme],
            fontStyles[font]
          )}
        >
          <WallpaperImage events={events} theme={theme} />
        </div>
      </div>
    </Iphone>
  );
}
