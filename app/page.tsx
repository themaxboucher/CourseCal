import { LandingNavbar } from "@/components/landing-page/LandingNavbar";
import { Footer } from "@/components/landing-page/Footer";
import UploadSchedule from "@/components/UploadSchedule";
import WallpaperPreview from "@/components/wallpaper/WallpaperPreview";
import { displayEvents1, displayEvents2 } from "@/constants";
import { TextAnimate } from "@/components/ui/text-animate";
import AnimatedContent from "@/components/ui/AnimatedContent";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <LandingNavbar />
      <main>
        <section className="grid grid-cols-1 lg:grid-cols-2 items-center gap-4 max-w-[75rem] mx-auto md:px-8 px-2 py-12">
          <div className="flex flex-col gap-10 md:gap-20">
            <div className="flex flex-col items-center lg:items-start gap-6 lg:gap-12 px-2">
              <div className="flex flex-col gap-2 md:gap-4 items-center lg:items-start text-center lg:text-left">
                <TextAnimate
                  animation="slideUp"
                  by="word"
                  once={true}
                  className="heading-1 md:text-6xl max-w-[18rem] md:max-w-[28rem]"
                >
                  New schedule, new lock screen.
                </TextAnimate>
                <TextAnimate
                  animation="slideUp"
                  by="word"
                  once={true}
                  delay={0.3}
                  className="text-muted-foreground text-lg md:text-2xl max-w-[18rem] md:max-w-lg"
                >
                  Get a beautiful lock screen wallpaper of your University of
                  Calgary schedule in seconds.
                </TextAnimate>
              </div>
              <AnimatedContent
                className="w-full flex justify-center lg:justify-start items-center"
                distance={50}
                delay={0.5}
              >
                <UploadSchedule />
              </AnimatedContent>
            </div>
          </div>
          <div className="flex justify-center items-center w-full relative h-[500px] -mb-[100px] md:mb-0 md:h-full overflow-hidden">
            <div className="w-full h-[60%] lg:h-[70%] absolute left-0 right-0 top-auto bottom-auto bg-muted/75 dark:bg-muted/50 rounded-xl" />
            <div className="w-full h-[20%] lg:h-[15%] absolute left-0 right-0 top-auto bottom-0 bg-background z-10" />
            <AnimatedContent className="w-full" distance={50} delay={0.6}>
              <div className="size-full scale-75 md:scale-90 -rotate-3 flex justify-center items-center -translate-x-10">
                <WallpaperPreview
                  events={displayEvents2}
                  background="midnight"
                  font="default"
                  theme="dark"
                  cellHeight={100}
                />
              </div>
              <div className="size-full absolute inset-0 flex justify-center items-center scale-65 md:scale-75 rotate-4 translate-x-14 sm:translate-x-20 translate-y-12">
                <WallpaperPreview
                  events={displayEvents1}
                  background="ice"
                  font="rounded"
                  theme="light"
                  cellHeight={100}
                />
              </div>
            </AnimatedContent>
          </div>
        </section>
        <section className="flex flex-col gap-2 max-w-[75rem] mx-auto md:px-8 px-4 py-12 md:pt-16 pt-12">
          <div className="flex flex-col items-center gap-8 text-center">
            <div>
              <h2 className="heading-2">How it works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center items-center w-full">
              <div className="flex flex-col items-center gap-2 py-10 px-6 w-full bg-muted/75 dark:bg-muted/50 rounded-xl">
                <div className="flex justify-center items-center gap-2">
                  <div className="font-bold size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    1
                  </div>
                  <h3 className="heading-3">Upload</h3>
                </div>
                <p className="text-muted-foreground max-w-[15rem]">
                  Drag and drop a screenshot of your schedule.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 py-10 px-6 w-full bg-muted/75 dark:bg-muted/50 rounded-xl">
                <div className="flex justify-center items-center gap-2">
                  <div className="font-bold size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    2
                  </div>
                  <h3 className="heading-3">Customize</h3>
                </div>
                <p className="text-muted-foreground max-w-[15rem]">
                  Choose a background and font for your wallpaper.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 py-10 px-6 w-full bg-muted/75 dark:bg-muted/50 rounded-xl">
                <div className="flex justify-center items-center gap-2">
                  <div className="font-bold size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    3
                  </div>
                  <h3 className="heading-3">Download</h3>
                </div>
                <p className="text-muted-foreground max-w-[15rem]">
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
