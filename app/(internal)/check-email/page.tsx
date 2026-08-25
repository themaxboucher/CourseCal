import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { OutlookIcon } from "@/components/icons/OutlookIcon";
import { InboxFilled } from "@/components/icons";

export const metadata: Metadata = { title: "Check your email" };

interface CheckEmailPageProps {
  searchParams: Promise<{ intent?: string }>;
}

export default async function CheckEmailPage({
  searchParams,
}: CheckEmailPageProps) {
  const { intent } = await searchParams;
  const isSignup = intent === "signup";

  return (
    <section className="min-h-[calc(100dvh-68px)] flex flex-col gap-2 max-w-72 mx-auto px-4 md:px-8 py-16">
      <div className="flex flex-1 flex-col items-center justify-center gap-4 sm:gap-6 mb-20">
        <div className="flex items-center justify-center rounded-full bg-red-500 border-2 border-red-300 dark:border-red-800 text-white p-3.5">
          <InboxFilled className="size-6" />
        </div>
        <div className="flex flex-col items-center gap-2 max-w-md">
          <h1 className="heading-3 text-center max-w-64">
            {isSignup
              ? "Almost there! Check your email."
              : "A login link has been sent to your email!"}
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            {isSignup
              ? "Click the link in your email to finish creating your account."
              : "Click the link in your email to login."}
          </p>
        </div>
        <div className="hidden md:flex justify-center">
          <Button variant="outline" className="mt-2" asChild>
            <a
              href="https://outlook.office.com/"
              target="_blank"
              rel="noopener"
            >
              <OutlookIcon />
              Open Outlook
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
