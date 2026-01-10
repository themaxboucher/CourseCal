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
  sunset: {
    light: "bg-gradient-to-b from-amber-100 via-orange-200 to-rose-300",
    dark: "bg-gradient-to-b from-orange-500 via-rose-600 to-purple-800",
  },
  aurora: {
    light: "bg-gradient-to-b from-emerald-100 via-teal-200 to-violet-200",
    dark: "bg-gradient-to-b from-emerald-600 via-cyan-700 to-violet-800",
  },
  ocean: {
    light: "bg-gradient-to-b from-cyan-100 via-sky-200 to-blue-300",
    dark: "bg-gradient-to-b from-teal-600 via-cyan-700 to-indigo-900",
  },
  forest: {
    light: "bg-gradient-to-b from-lime-100 via-green-200 to-emerald-300",
    dark: "bg-gradient-to-b from-green-600 via-green-700 to-emerald-900",
  },
  lavender: {
    light: "bg-gradient-to-b from-violet-100 via-purple-200 to-fuchsia-200",
    dark: "bg-gradient-to-b from-violet-600 via-purple-700 to-fuchsia-900",
  },
  mint: {
    light: "bg-gradient-to-b from-teal-100 via-cyan-100 to-emerald-200",
    dark: "bg-gradient-to-b from-teal-600 via-cyan-700 to-emerald-800",
  },
  galaxy: {
    light: "bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200",
    dark: "bg-gradient-to-b from-slate-900 via-purple-900 to-violet-800",
  },
  rose: {
    light: "bg-gradient-to-b from-pink-100 via-rose-200 to-red-200",
    dark: "bg-gradient-to-b from-pink-600 via-rose-700 to-red-900",
  },
  midnight: {
    light: "bg-gradient-to-b from-slate-200 via-blue-200 to-indigo-300",
    dark: "bg-gradient-to-b from-slate-900 via-blue-950 to-indigo-950",
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
