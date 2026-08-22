import { Navbar } from "@/components/Navbar";
import Schedule from "@/components/schedule/Schedule";
import { getEvents, getFriendsEvents } from "@/lib/actions/events.actions";
import { getTerms } from "@/lib/actions/terms.actions";
import WelcomeDialog from "@/components/WelcomeDialog";
import UploadSuccessDialog from "@/components/UploadSuccessDialog";
import FeedbackBox from "@/components/FeedbackBox";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import {
  getFriends,
  getPendingRequestCount,
} from "@/lib/actions/friends.actions";
export const dynamic = "force-dynamic";

interface SchedulePageProps {
  searchParams: Promise<{ uploadSuccess?: string }>;
}

export default async function SchedulePage({
  searchParams,
}: SchedulePageProps) {
  const { uploadSuccess } = await searchParams;
  const justUploaded = uploadSuccess === "true";
  const user = await getLoggedInUser();
  const terms = await getTerms();
  const events = user ? await getEvents(user.id) : [];
  const isLoggedIn = user !== false;
  const pendingRequestCount = user ? await getPendingRequestCount() : 0;
  const friends = user ? await getFriends() : [];
  // Every term at once, matching how the viewer's own events are loaded — the
  // term filter is applied client-side so switching terms needs no refetch.
  const friendEvents = user
    ? await getFriendsEvents(friends.map((friend) => friend.id))
    : [];

  return (
    <>
      {isLoggedIn && !justUploaded && (
        <WelcomeDialog user={user} show={!user.has_been_welcomed} />
      )}
      <UploadSuccessDialog show={justUploaded} />

      <Navbar
        isLoggedIn={isLoggedIn}
        user={user || null}
        pendingRequestCount={pendingRequestCount}
      />
      <section className="flex flex-col gap-2 max-w-[90rem] mx-auto md:px-8 px-2 md:py-8 pb-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="max-w-[70rem] w-full">
              <Schedule
                events={events}
                terms={terms}
                user={user || null}
                isLoggedIn={isLoggedIn}
                friends={friends}
                friendEvents={friendEvents}
              />
            </div>
          </div>
        </div>
      </section>

      <FeedbackBox />
    </>
  );
}
