import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import UploadSchedule from "@/components/UploadSchedule";
import WallpaperPreview from "@/components/wallpaper/WallpaperPreview";
import { displayEvents } from "@/constants";
import { TextAnimate } from "@/components/ui/text-animate";
import { BlurFade } from "@/components/ui/blur-fade";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 max-w-[75rem] mx-auto md:px-8 px-2 py-12">
          <div className="flex flex-col gap-10 md:gap-20">
            <div className="flex flex-col gap-12 px-2">
              <div className="space-y-4">
                <TextAnimate
                  animation="slideUp"
                  by="word"
                  className="heading-1 md:text-6xl max-w-[28rem]"
                >
                  New schedule, new lock screen.
                </TextAnimate>
                <TextAnimate
                  animation="slideUp"
                  by="word"
                  delay={0.3}
                  className="text-muted-foreground text-lg md:text-2xl"
                >
                  Get a beautiful lock screen wallpaper of your University of
                  Calgary schedule in seconds.
                </TextAnimate>
              </div>
              <UploadSchedule />
            </div>
          </div>
          <BlurFade direction="up" inView>
            <div className="flex justify-center items-center w-full relative">
              <div className="w-full h-[75%] absolute left-0 right-0 top-auto bottom-auto bg-muted/50 rounded-xl" />
              <div className="w-full h-[12.5%] absolute left-0 right-0 top-auto bottom-0 bg-background z-10" />
              <div className="size-full scale-90 -rotate-3 flex justify-center items-center -translate-x-8">
                <WallpaperPreview
                  events={displayEvents}
                  background="plain"
                  font="default"
                  theme="dark"
                />
              </div>
              <div className="size-full absolute inset-0 flex justify-end items-end scale-75 rotate-4 translate-y-12">
                <WallpaperPreview
                  events={displayEvents}
                  background="ice"
                  font="default"
                  theme="light"
                />
              </div>
            </div>
          </BlurFade>
        </section>
        <section className="flex flex-col gap-2 max-w-[75rem] mx-auto md:px-8 px-4 py-12 md:pt-16 pt-12">
          <div className="flex flex-col items-center gap-8 text-center">
            <div>
              <h2 className="heading-2">How it works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center items-center w-full">
              <div className="flex flex-col items-center gap-2 p-10 w-full bg-muted/50 rounded-xl">
                <div className="flex justify-center items-center gap-2">
                  <div className="font-bold size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    1
                  </div>
                  <h3 className="heading-3">Upload</h3>
                </div>
                <p className="text-muted-foreground">
                  Drag and drop a screenshot of your schedule.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 p-10 w-full bg-muted/50 rounded-xl">
                <div className="flex justify-center items-center gap-2">
                  <div className="font-bold size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    2
                  </div>
                  <h3 className="heading-3">Customize</h3>
                </div>
                <p className="text-muted-foreground">
                  Choose a background and font for your wallpaper.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 p-10 w-full bg-muted/50 rounded-xl">
                <div className="flex justify-center items-center gap-2">
                  <div className="font-bold size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    3
                  </div>
                  <h3 className="heading-3">Download</h3>
                </div>
                <p className="text-muted-foreground">
                  Download your wallpaper and set it as your lock screen.
                </p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
