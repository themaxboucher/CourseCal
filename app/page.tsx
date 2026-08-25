import { LandingNavbar } from "@/components/landing-page/LandingNavbar";
import { Footer } from "@/components/landing-page/Footer";
import UploadSchedule from "@/components/UploadSchedule";
import { TextAnimate } from "@/components/ui/text-animate";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Iphone } from "@/components/ui/iphone";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/video/coursecal-demo-poster.webp"
        type="image/webp"
        fetchPriority="high"
      />
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
                  Find time when everyone&rsquo;s free.
                </TextAnimate>
                <TextAnimate
                  animation="slideUp"
                  by="word"
                  once={true}
                  delay={0.3}
                  className="text-muted-foreground text-lg md:text-2xl max-w-[18rem] md:max-w-lg"
                >
                  Easily compare your University of Calgary schedule with
                  friends.
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
            <AnimatedContent
              className="w-full flex justify-between items-center"
              distance={50}
              delay={0.6}
            >
              <div className="w-54 md:w-72 md:rotate-2 mx-auto translate-y-4">
                <Iphone
                  videoSrc="/video/coursecal-demo.mp4"
                  poster="/video/coursecal-demo-poster.webp"
                  priority
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
                  <h3 className="heading-3">Add friends</h3>
                </div>
                <p className="text-muted-foreground max-w-[15rem]">
                  Follow your friends to see their schedules.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 py-10 px-6 w-full bg-muted/75 dark:bg-muted/50 rounded-xl">
                <div className="flex justify-center items-center gap-2">
                  <div className="font-bold size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    3
                  </div>
                  <h3 className="heading-3">Compare</h3>
                </div>
                <p className="text-muted-foreground max-w-[15rem]">
                  See when everyone has overlapping free time.
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
