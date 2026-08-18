import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({
  avatarUrl,
  name,
  size = "md",
}: UserAvatarProps) {
  const sizeClass =
    size === "sm" ? "size-8" : size === "md" ? "size-12" : "size-16";
  const firstLetterOfName = name?.charAt(0);
  return (
    <Avatar className={cn(sizeClass, "border border-border")}>
      <AvatarImage
        className="object-cover shadow-inner"
        src={avatarUrl || undefined}
      />
      <AvatarFallback className="font-bold text-lg text-ring bg-ring/20">
        {firstLetterOfName}
      </AvatarFallback>
    </Avatar>
  );
}
