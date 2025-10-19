import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center gap-2.5">
        <Image
          src="/coursecal-logo.svg"
          alt="CourseCal logo"
          width={36}
          height={36}
          className="size-8 md:size-9"
        />
        <h1 className="text-2xl font-semibold">CourseCal</h1>
      </div>
    </Link>
  );
}
