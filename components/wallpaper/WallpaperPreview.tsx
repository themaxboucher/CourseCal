import Image from "next/image";
import WeekView from "../WeekView";
import WallpaperImage from "./WallpaperImage";
import { Iphone } from "../ui/iphone";

interface WallpaperPreviewProps {
  events: CalendarEvent[];
  imageRef: React.RefObject<HTMLDivElement | null>;
}

export function WallpaperPreview({ events, imageRef }: WallpaperPreviewProps) {
  return (
    <div className="flex justify-center items-center bg-muted border-r p-10 h-full">
      <Iphone className="max-w-70">
        <div ref={imageRef}>
          <div className="bg-gradient-to-b from-background to-muted dark:from-muted dark:to-background overflow-hidden w-full aspect-18/39 p-3 flex flex-col justify-end items-stretch">
            <WallpaperImage events={events} />
          </div>
        </div>
      </Iphone>
    </div>
  );
}
