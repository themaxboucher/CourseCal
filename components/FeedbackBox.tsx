import { MessageCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function FeedbackBox() {
  return (
    <Popover>
      <PopoverTrigger className="fixed z-20 bottom-4 right-4 md:bottom-6 md:right-6 p-2.5 md:p-3 rounded-full bg-foreground text-background shadow-md hover:shadow-lg hover:cursor-pointer">
        <MessageCircle className="size-5 md:size-6" />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={10}>
        <div className="space-y-1">
          <p className="font-semibold">Got feedback?</p>

          <p className="text-sm text-muted-foreground">
            Send me a DM on{" "}
            <a
              href="https://www.instagram.com/maximeboucher_/"
              target="_blank"
              className="text-sky-500 hover:underline"
            >
              Instagram
            </a>{" "}
            or{" "}
            <a
              href="https://www.linkedin.com/in/maxboucher/"
              target="_blank"
              className="text-sky-500 hover:underline"
            >
              LinkedIn
            </a>{" "}
            for questions, feature requests, bug reports, love letters, or hate
            mail.
          </p>
          <p className="text-sm text-muted-foreground">
            You can also vote on new features and make a public feature requests{" "}
            <a
              href="https://coursecal.featurebase.app/"
              target="_blank"
              className="text-sky-500 hover:underline"
            >
              here
            </a>
            .
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
