import { renderOgCard } from "@/lib/og/card";
import { OG_IMAGE_SIZE } from "@/lib/site";

export const alt =
  "CourseCal — compare your University of Calgary schedule with friends";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

/**
 * The card every route falls back to. Note that a segment which declares its
 * own `openGraph` block loses this one — Next replaces the parent block rather
 * than merging into it — so such a segment needs an `opengraph-image` of its
 * own. `/schedule` is the one that does.
 */
export default async function Image() {
  return renderOgCard({
    eyebrow: "For UCalgary students",
    headline: "Compare your schedule with friends",
  });
}
