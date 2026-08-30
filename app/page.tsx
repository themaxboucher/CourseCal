import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingNavbar } from "@/components/landing-page/LandingNavbar";
import { Footer } from "@/components/landing-page/Footer";
import UploadSchedule from "@/components/UploadSchedule";
import { TextAnimate } from "@/components/ui/text-animate";
import AnimatedContent from "@/components/ui/AnimatedContent";
import HeroSchedule from "@/components/landing-page/HeroSchedule";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { INVITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { sanitizeReferral } from "@/lib/utils/referral";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: Promise<{ ref?: string }>;
}

/**
 * Invite links are just the landing page with a `?ref=`, so the unfurl has to
 * live here. An invite is pasted into iMessage, Instagram and Discord far more
 * often than it is opened cold, so the card is most of the pitch: with a `ref`
 * it says who sent it, without one the page keeps the plain site metadata from
 * the root layout.
 *
 * The `ref` is echoed straight from the URL into the title and the card — see
 * `app/api/og/invite/route.tsx` for why that is safe and why the display name
 * behind it is not. The canonical stays the bare `/` the layout sets, so the
 * invites do not read as a thousand thin copies of the landing page.
 */
export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const referral = sanitizeReferral((await searchParams).ref);
  if (!referral) return {};

  const title = `@${referral} invited you to ${SITE_NAME}`;
  const image = `/api/og/invite?ref=${encodeURIComponent(referral)}`;

  return {
    title: { absolute: title },
    description: INVITE_DESCRIPTION,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description: INVITE_DESCRIPTION,
      url: "/",
      locale: "en_CA",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: INVITE_DESCRIPTION,
      images: [{ url: image, alt: title }],
    },
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const referral = sanitizeReferral((await searchParams).ref);

  // `proxy.ts` has already written the referral to a cookie by the time this
  // renders, so a logged-out visitor just gets the landing page and picks the
  // referrer back up during onboarding. Somebody who is already signed in has
  // no use for the pitch — the useful destination is whoever shared the link.
  if (referral) {
    const user = await getLoggedInUser();
    if (user) {
      redirect(
        user.has_completed_onboarding
          ? `/u/${referral}`
          : "/onboarding/profile",
      );
    }
  }

  return (
    <>
      <LandingNavbar />
      <main>
        <section className="grid grid-cols-1 lg:grid-cols-2 items-center gap-14 lg:gap-8 max-w-[75rem] mx-auto md:px-8 px-2 py-12">
          <div className="flex flex-col gap-10 md:gap-20">
            <div className="flex flex-col items-center lg:items-start gap-6 lg:gap-12 px-2">
              <div className="flex flex-col gap-2 md:gap-4 items-center lg:items-start text-center lg:text-left">
                <TextAnimate
                  animation="slideUp"
                  by="word"
                  once={true}
                  className="heading-1 md:text-6xl max-w-[18rem] md:max-w-[28rem]"
                >
                  Find time when everyone&rsquo;s free.
                </TextAnimate>
                <TextAnimate
                  animation="slideUp"
                  by="word"
                  once={true}
                  delay={0.3}
                  className="text-muted-foreground text-lg md:text-2xl max-w-[18rem] md:max-w-lg"
                >
                  Easily compare your University of Calgary schedule with
                  friends.
                </TextAnimate>
              </div>
              <AnimatedContent
                className="w-full flex justify-center lg:justify-start items-center"
                distance={50}
                delay={0.5}
              >
                <UploadSchedule />
              </AnimatedContent>
            </div>
          </div>
          <AnimatedContent className="w-full" distance={50} delay={0.6}>
            <HeroSchedule />
          </AnimatedContent>
        </section>
        <section className="flex flex-col gap-2 max-w-[75rem] mx-auto md:px-8 px-4 py-12 md:pt-16 pt-12">
          <div className="flex flex-col items-center gap-8 text-center">
            <div>
              <h2 className="heading-2">How it works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center items-center w-full">
              <div className="flex flex-col items-center gap-2 py-10 px-6 w-full bg-muted/75 dark:bg-muted/50 rounded-xl">
                <div className="flex justify-center items-center gap-2">
                  <div className="font-bold size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    1
                  </div>
                  <h3 className="heading-3">Upload</h3>
                </div>
                <p className="text-muted-foreground max-w-[15rem]">
                  Drag and drop a screenshot of your schedule.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 py-10 px-6 w-full bg-muted/75 dark:bg-muted/50 rounded-xl">
                <div className="flex justify-center items-center gap-2">
                  <div className="font-bold size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    2
                  </div>
                  <h3 className="heading-3">Add friends</h3>
                </div>
                <p className="text-muted-foreground max-w-[15rem]">
                  Follow your friends to see their schedules.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 py-10 px-6 w-full bg-muted/75 dark:bg-muted/50 rounded-xl">
                <div className="flex justify-center items-center gap-2">
                  <div className="font-bold size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    3
                  </div>
                  <h3 className="heading-3">Compare</h3>
                </div>
                <p className="text-muted-foreground max-w-[15rem]">
                  See when everyone has overlapping free time.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
