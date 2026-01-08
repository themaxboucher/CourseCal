import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import WeekView from "@/components/WeekView";
import { displayEvents } from "@/constants";
import UploadSchedule from "@/components/UploadSchedule";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="grid grid-cols-2 gap-4 max-w-[75rem] mx-auto md:px-8 px-2 py-12">
          <div className="flex flex-col gap-10 md:gap-20">
            <div className="flex flex-col gap-12 px-2">
              <div className="space-y-4">
                <h1 className="heading-1 text-6xl">New schedule, new lock screen.</h1>
                <p className="text-muted-foreground text-lg md:text-2xl">
                  Get a beautiful lock screen wallpaper of your University of
                  Calgary schedule in seconds.
                </p>
              </div>
              {/* <AuthForm /> */}
              <UploadSchedule />
            </div>
          </div>
          <WeekView events={displayEvents} />
        </section>
        <section className="flex flex-col gap-2 max-w-[75rem] mx-auto md:px-8 px-4 py-12 md:pt-16 pt-12">
          <Card className="w-full p-6 border-2 bg-red-500 border-red-300 dark:border-red-800 text-white">
            <CardContent className="flex flex-col lg:flex-row gap-12 py-8">
              <div>
                <Image
                  src="/max-profile.jpg"
                  alt="Max Boucher"
                  width={128}
                  height={128}
                  className="rounded-3xl size-30 min-w-30 object-cover border-2 border-red-300 dark:border-red-800 shadow -rotate-3"
                />
              </div>
              <div className="text-lg space-y-2">
                <p>Hi 👋 I'm Max.</p>
                <p>
                  I'm a 2nd year Software Engineering student at U of C.
                  CourseCal is a work in progress, so please bear with me as I
                  fix bugs and add features. If you have any feedback, please
                  reach out to me at{" "}
                  <a
                    href="mailto:max@maxboucher.com"
                    className="underline font-medium"
                  >
                    max@maxboucher.com
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
        <Footer />
      </main>
    </>
  );
}
