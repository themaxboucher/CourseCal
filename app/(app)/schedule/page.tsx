import { Navbar } from "@/components/Navbar";
import Schedule from "@/components/Schedule";
import { getEvents } from "@/lib/actions/events.actions";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { getTerms } from "@/lib/actions/terms.actions";
import WelcomeDialog from "@/components/WelcomeDialog";

export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const user = await getLoggedInUser();
  const terms = await getTerms();
  const events = await getEvents(user.$id);

  return (
    <>
      <WelcomeDialog userId={user.$id} show={!user.hasBeenWelcomed} />

      <Navbar loggedIn={user !== false} />
      <section className="flex flex-col gap-2 max-w-[90rem] mx-auto md:px-8 px-2 md:py-10 py-2">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="h-[800px] max-w-[70rem] w-full">
              <Schedule events={events} terms={terms} user={user} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
