import { Button } from "@/components/ui/button";
import { OutlookIcon } from "@/components/icons/OutlookIcon";

export default function CheckEmailPage() {
  return (
    <>
      <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <h1 className="heading-3 text-center">
            A login link has been sent to your email!
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Please check your email for a login link.
          </p>
          <Button variant="outline" asChild>
            <a href="https://outlook.office.com/" target="_blank">
              <OutlookIcon />
              Open Outlook
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
