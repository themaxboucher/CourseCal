import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FriendsStep from "@/components/onboarding/FriendsStep";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { getRelationshipMap } from "@/lib/actions/friends.actions";
import { getProfileByUsername } from "@/lib/actions/profiles.actions";
import { getSuggestedFriends } from "@/lib/actions/suggestions.actions";
import { getTerms } from "@/lib/actions/terms.actions";
import { getRelevantTerm } from "@/lib/utils/schedule";
import { REFERRAL_COOKIE, sanitizeReferral } from "@/lib/utils/referral";

export const dynamic = "force-dynamic";

/**
 * Third and last onboarding step.
 *
 * It comes after upload rather than after profile because the classmate
 * suggestions are computed from the viewer's own course list — before the
 * schedule exists there is nothing to suggest from.
 */
export default async function OnboardingFriendsPage() {
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/");
  }

  const cookieStore = await cookies();
  const referral = sanitizeReferral(cookieStore.get(REFERRAL_COOKIE)?.value);

  const terms = await getTerms();
  const term = getRelevantTerm(terms);

  const [referrerProfile, suggestions, relationships] = await Promise.all([
    referral ? getProfileByUsername(referral) : Promise.resolve(null),
    getSuggestedFriends(term.id),
    getRelationshipMap(),
  ]);

  // Opening your own link should not pin you to your own onboarding.
  const referrer =
    referrerProfile && referrerProfile.id !== user.id ? referrerProfile : null;
  // The referrer already has a card of their own above the list.
  const filteredSuggestions = suggestions.filter(
    (suggestion) => suggestion.id !== referrer?.id,
  );

  return (
    <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
      <div className="flex flex-col items-center gap-8">
        <div className="max-w-md space-y-2 text-center">
          <h1 className="heading-3">Add your friends</h1>
          <p className="text-muted-foreground">
            Overlay their schedule on yours to find the hours you&apos;re all
            free. You can always do this later.
          </p>
        </div>
        <FriendsStep
          username={user.username}
          referrer={referrer}
          referrerStatus={
            referrer ? (relationships[referrer.id] ?? "none") : "none"
          }
          suggestions={filteredSuggestions}
          relationships={relationships}
          termLabel={`${term.season} ${term.year}`}
        />
      </div>
    </section>
  );
}
