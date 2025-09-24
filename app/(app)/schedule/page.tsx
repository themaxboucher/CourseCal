import Schedule from "@/components/Schedule";
import { sampleEvents } from "@/constants";

export default function SchedulePage() {
  return (
    <>
      <section className="flex flex-col gap-2 max-w-[90rem] mx-auto px-8 py-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium">Friends</h2>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-muted"></div>
              <div className="size-12 rounded-full bg-muted"></div>
              <div className="size-12 rounded-full bg-muted"></div>
              <div className="size-12 rounded-full bg-muted"></div>
              <div className="size-12 rounded-full bg-muted"></div>
              <div className="size-12 rounded-full bg-muted"></div>
              <div className="size-12 rounded-full bg-muted"></div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-medium">Schedule</h2>
            <div className="h-[800px] max-w-[70rem]">
              <Schedule events={sampleEvents} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
