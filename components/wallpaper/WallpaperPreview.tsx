import WallpaperImage from "./WallpaperImage";
import { Iphone } from "../ui/iphone";
import { cn } from "@/lib/utils";
import { backgroundOptions } from "@/constants";

const fontStyles: Record<FontType, string> = {
  default: "font-sans",
  serif: "font-serif",
  writing: "font-writing",
  rounded: "font-rounded",
  stencil: "font-stencil",
  pixels: "font-pixels",
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
  const bgOption = backgroundOptions.find((opt) => opt.value === background);
  const bgClass = bgOption?.[theme] ?? "";

  return (
    <Iphone className="max-w-70" theme={theme}>
      <div ref={imageRef}>
        <div
          className={cn(
            "overflow-hidden w-full aspect-18/39 py-3.5 px-2 flex flex-col justify-end items-stretch",
            bgClass,
            fontStyles[font]
          )}
        >
          <WallpaperImage events={events} theme={theme} />
        </div>
      </div>
    </Iphone>
  );
}
