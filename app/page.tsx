import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import AuthForm from "@/components/landing-page/AuthForm";
import { getAuthUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";
import { Smartphone, Users } from "lucide-react";
import WeekView from "@/components/WeekView";
import { displayEvents } from "@/constants";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getAuthUser();
  if (user) {
    redirect("/schedule");
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="flex flex-col gap-2 max-w-[75rem] mx-auto md:px-8 px-2 py-12">
          <div className="flex flex-col items-center gap-10 md:gap-20">
            <div className="flex flex-col items-center gap-8 px-2">
              <div className="space-y-4 text-center">
                <h1 className="heading-1">A better course schedule.</h1>
                <p className="text-muted-foreground md:text-lg max-w-90 mx-auto">
                  Get a beautiful U of C schedule in seconds. Use your UCalgary
                  email to get started.
                </p>
              </div>
              <AuthForm />
            </div>
            <WeekView events={displayEvents} />
          </div>
        </section>
        <section className="flex flex-col gap-2 max-w-[75rem] mx-auto md:px-8 px-6 py-12">
          <h2 className="heading-2 text-center">Comming soon...</h2>
          <div className="flex flex-col items-center gap-10 pt-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="size-10 min-w-10 bg-pink-500 dark:bg-pink-700 border-2 border-pink-300 dark:border-pink-900 text-white rounded-full flex items-center justify-center">
                <Users className="size-4" />
              </div>
              <p className="font-medium">
                Easily compare your schedule with friends.
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="size-10 min-w-10 bg-blue-500 dark:bg-blue-700 border-2 border-blue-300 dark:border-blue-900 text-white rounded-full flex items-center justify-center">
                <Smartphone className="size-4" />
              </div>
              <p className="font-medium">
                Download your schedule as a phone lock screen wallpaper.
              </p>
            </div>
          </div>
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
                  I'm a 2nd year Software Engineering student at U of C. I built
                  CourseCal because I wanted to easily compare my course
                  schedule with friends. CourseCal is a work in progress, so
                  please bear with me as I fix bugs and add features. If you
                  have any feedback, please reach out to me at{" "}
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
