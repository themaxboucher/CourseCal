import { redirect } from "next/navigation";
import JoinPanel from "@/components/JoinPanel";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { sanitizeReferral } from "@/lib/utils/referral";

export const dynamic = "force-dynamic";

interface JoinPageProps {
  searchParams: Promise<{ ref?: string }>;
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
