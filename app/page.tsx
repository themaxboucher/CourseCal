import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import AuthForm from "@/components/landing-page/AuthForm";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="heading-1">
                  Easily compare your course schedule with friends.
                </h1>
                <p className="text-lg text-muted-foreground">
                  No more back and forth screenshots. Simply upload your
                  schedule from your UCalgary portal and find slots when
                  everyone is free.
                </p>
              </div>
              <AuthForm />
              <p className="text-sm text-muted-foreground">Social proof here</p>
            </div>
            <div className="rounded-xl bg-muted p-4"></div>
          </div>
        </section>
        <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
          <h2 className="heading-2 text-center">How it works</h2>
        </section>
        <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
          <h2 className="heading-2 text-center">Before and After</h2>
        </section>
        <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
          <Card className="w-full bg-muted/20 p-6">
            <CardContent className="flex flex-col lg:flex-row gap-12 py-8">
              <div>
                <Image
                  src="/max-profile.jpg"
                  alt="Max Boucher"
                  width={128}
                  height={128}
                  className="rounded-3xl size-32 object-cover shadow -rotate-4"
                />
              </div>
              <div className="text-muted-foreground text-lg space-y-2">
                <p>Hi 👋 I'm Max.</p>
                <p>
                  I'm a 2nd year Software Engineering student at U of C. I built
                  CourseCal because I wanted to easily compare my course
                  schedule with my friends to find more time to hang out.
                </p>
                <p>
                  CourseCal is a work in progress, so please bear with me as I
                  fix bugs and add features. If you have any feedback, please
                  reach out to me at{" "}
                  <a href="mailto:max@maxboucher.com">max@maxboucher.com</a>.
                </p>
                <p className="font-semibold text-lg">- Max</p>
              </div>
            </CardContent>
          </Card>
        </section>
        <Footer />
      </main>
    </>
  );
}
