import { Navbar } from "@/components/Navbar";
import Schedule from "@/components/Schedule";
import { getEvents } from "@/lib/actions/events.actions";
import { getLoggedInUser } from "@/lib/actions/users.actions";

export default async function SchedulePage() {
  const user = await getLoggedInUser();
  const events = await getEvents(user.$id);

  return (
    <>
      <Navbar isApp={true} />
      <section className="flex flex-col gap-2 max-w-[90rem] mx-auto px-8 py-16">
        <h1 className="heading-3">Fall 2025</h1>
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="h-[800px] max-w-[70rem] w-full">
              <Schedule events={events} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
