/**
 * Single source of truth for everything that shows up in a link preview.
 *
 * `SITE_URL` is deliberately the production origin rather than
 * `NEXT_PUBLIC_SITE_URL`: it only ever feeds `metadataBase`, and the absolute
 * URLs Next builds from it are read by crawlers that cannot reach a preview
 * deployment or a laptop. `NEXT_PUBLIC_SITE_URL` stays what it is — the origin
 * the running app redirects users to.
 */
export const SITE_URL = "https://www.coursecal.com";

export const SITE_NAME = "CourseCal";

/** Shown under the title in unfurls and search results. */
export const SITE_DESCRIPTION =
  "Easily compare your University of Calgary schedule with friends and find time when everyone’s free.";

/** Second line of the invite card, and the description on `/join`. */
export const INVITE_DESCRIPTION =
  "Upload your UCalgary schedule, add your friends, and CourseCal shows when everyone’s free.";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** Support address, surfaced in settings and as the metadata author. */
export const SUPPORT_EMAIL = "max@maxboucher.com";
