import type { Metadata } from "next";
import { redirect } from "next/navigation";
import JoinPanel from "@/components/JoinPanel";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { INVITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { sanitizeReferral } from "@/lib/utils/referral";

export const dynamic = "force-dynamic";

interface JoinPageProps {
  searchParams: Promise<{ ref?: string }>;
}

/**
 * An invite link is pasted into iMessage, Instagram and Discord far more often
 * than it is opened cold, so the unfurl is most of the pitch. The `ref` is
 * echoed straight from the URL into the title and the card — see
 * `app/api/og/invite/route.tsx` for why that is safe and why the display name
 * behind it is not.
 *
 * The canonical points at bare `/join` because every `?ref=` is the same page;
 * without it each invite would read as its own thin, duplicated URL. It does
 * not affect the unfurl — the crawlers read `og:*`, not `link[rel=canonical]`.
 */
export async function generateMetadata({
  searchParams,
}: JoinPageProps): Promise<Metadata> {
  const referral = sanitizeReferral((await searchParams).ref);

  const title = referral
    ? `@${referral} invited you to ${SITE_NAME}`
    : `You’ve been invited to ${SITE_NAME}`;
  const image = referral
    ? `/api/og/invite?ref=${encodeURIComponent(referral)}`
    : "/api/og/invite";
  const alt = referral
    ? `@${referral} invited you to ${SITE_NAME}`
    : `An invitation to ${SITE_NAME}`;

  return {
    title: { absolute: title },
    description: INVITE_DESCRIPTION,
    alternates: { canonical: "/join" },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description: INVITE_DESCRIPTION,
      url: "/join",
      locale: "en_CA",
      images: [{ url: image, width: 1200, height: 630, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: INVITE_DESCRIPTION,
      images: [{ url: image, alt }],
    },
  };
}

/**
 * Landing spot for a shared invite link.
 *
 * The `ref` is captured into a cookie by `proxy.ts` before this renders, so
 * this page only has to decide where the visitor should end up. It cannot name
 * the person who invited them: `users` is readable by `authenticated` only, and
 * opening that up to anonymous visitors would turn predictable usernames into a
 * way to harvest names and photos.
 */
export default async function JoinPage({ searchParams }: JoinPageProps) {
  const { ref } = await searchParams;
  const referral = sanitizeReferral(ref);
  const user = await getLoggedInUser();

  if (user) {
    // Signed in already — the useful destination is whoever shared the link.
    if (user.has_completed_onboarding) {
      redirect(referral ? `/u/${referral}` : "/friends?tab=discover");
    }
    redirect("/onboarding/profile");
  }

  return <JoinPanel />;
}
