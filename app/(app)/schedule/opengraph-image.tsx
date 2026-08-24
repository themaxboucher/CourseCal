import { renderOgCard } from "@/lib/og/card";
import { OG_IMAGE_SIZE } from "@/lib/site";

export const alt = "Your CourseCal week, with your friends' classes on top";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

/**
 * `/schedule` sets its own `openGraph` block, and doing that drops the image
 * the root `opengraph-image.tsx` would otherwise have supplied — Next replaces
 * the parent block rather than merging into it. Hence a card of its own.
 */
export default async function Image() {
  return renderOgCard({
    eyebrow: "For UCalgary students",
    headline: "Your whole week on one screen.",
    body: "Upload your schedule, add your friends, and find out when everyone’s free.",
  });
}
