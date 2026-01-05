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
        <div
          ref={imageRef}
          className="bg-background h-full overflow-hidden p-3 flex flex-col justify-end items-stretch"
        >
          <WallpaperImage events={events} />
        </div>
      </Iphone>
      {/* <div className="relative h-[35rem] w-[10rem]">
            <Image src="/iphone-skin.png" alt="iPhone skin" width={200} height={500} className="absolute inset-0 w-full h-full object-cover" />
        </div> */}
    </div>
  );
}
