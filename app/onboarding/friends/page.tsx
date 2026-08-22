import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FriendsStep from "@/components/onboarding/FriendsStep";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { getRelationshipMap } from "@/lib/actions/friends.actions";
import { getProfileByUsername } from "@/lib/actions/profiles.actions";
import {
  getFallbackProfiles,
  getSuggestedFriends,
} from "@/lib/actions/suggestions.actions";
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

  // No classmates and no mutuals — for the earliest accounts that is every
  // account. Rather than leave the step bare, fall back to whoever is around.
  const fallback =
    filteredSuggestions.length === 0
      ? (await getFallbackProfiles()).filter(
          (profile) => profile.id !== referrer?.id,
        )
      : [];

  const termLabel = `${term.season.charAt(0).toUpperCase() + term.season.slice(1)} ${term.year}`;

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="mx-auto w-full max-w-md space-y-2 text-center">
        <h1 className="heading-3">Add your friends</h1>
        <p className="text-muted-foreground">
          Overlay their schedule on yours to find the hours you&apos;re all
          free.
        </p>
      </div>
      <FriendsStep
        username={user.username}
        referrer={referrer}
        referrerStatus={
          referrer ? (relationships[referrer.id] ?? "none") : "none"
        }
        suggestions={filteredSuggestions}
        fallback={fallback}
        relationships={relationships}
        termLabel={termLabel}
      />
    </div>
  );
}
