import { Navbar } from "@/components/Navbar";
import Schedule from "@/components/Schedule";
import { getEvents } from "@/lib/actions/events.actions";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { getTerms } from "@/lib/actions/terms.actions";
import WelcomeDialog from "@/components/WelcomeDialog";
import UploadSuccessDialog from "@/components/UploadSuccessDialog";

export const dynamic = "force-dynamic";

interface SchedulePageProps {
  searchParams: Promise<{ uploadSuccess?: string }>;
}

export default async function SchedulePage({
  searchParams,
}: SchedulePageProps) {
  const { uploadSuccess } = await searchParams;
  const user = await getLoggedInUser();
  const terms = await getTerms();
  const events = user ? await getEvents(user.$id) : [];
  const isLoggedIn = user !== false;

  return (
    <>
      {isLoggedIn && (
        <WelcomeDialog userId={user.$id} show={!user.hasBeenWelcomed} />
      )}
      <UploadSuccessDialog show={uploadSuccess === "true"} />

      <Navbar showSettings={isLoggedIn} />
      <section className="flex flex-col gap-2 max-w-[90rem] mx-auto md:px-8 px-2 md:py-8 py-2">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="max-w-[70rem] w-full">
              <Schedule
                events={events}
                terms={terms}
                user={user || null}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
