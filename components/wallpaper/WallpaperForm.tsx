"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import { WallpaperPreview } from "./WallpaperPreview";
import { toast } from "sonner";

interface WallpaperFormProps {
  events: CalendarEvent[];
}

export function WallpaperForm({ events }: WallpaperFormProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 6, // Higher quality export
      });

      // Create a download link
      const link = document.createElement("a");
      link.download = `wallpaper-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error downloading wallpaper:", error);
      toast.error("Failed to download wallpaper");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <WallpaperPreview events={events} imageRef={previewRef} />
      </div>

      <div className="p-6 flex flex-col gap-2">
        <div>
          <h2 className="heading-3">Download a wallpaper</h2>
          <p className="text-muted-foreground">
            Download a lock screen phone wallpaper of your schedule.
          </p>
        </div>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="size-4" />
          Download Wallpaper
        </Button>
      </div>
    </div>
  );
}
