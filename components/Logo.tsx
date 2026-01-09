import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/coursecal-logo.svg"
        alt="CourseCal logo"
        width={36}
        height={36}
        className="size-8 md:size-9"
      />
      <h1 className="text-2xl font-bold">CourseCal</h1>
    </Link>
  );
}
