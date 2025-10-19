import { Button } from "@/components/ui/button";
import { OutlookIcon } from "@/components/icons/OutlookIcon";
import { Inbox } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <>
      <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          <div className="flex items-center justify-center rounded-full bg-red-500 border-2 border-red-300 text-white p-3.5">
            <Inbox className="size-8" />
          </div>
          <div className="flex flex-col items-center gap-2 max-w-md">
            <h1 className="heading-3 text-center max-w-64">
              A login link has been sent to your email!
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Click the link in your email to login.
            </p>
          </div>
          <div className="hidden md:flex justify-center">
            <Button variant="outline" className="mt-2" asChild>
              <a href="https://outlook.office.com/" target="_blank">
                <OutlookIcon />
                Open Outlook
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
