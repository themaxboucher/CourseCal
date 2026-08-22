import { cn } from "@/lib/utils";
import { eventColors } from "@/constants";
import { getColorFromId } from "@/lib/utils/colors";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  /**
   * Picks the fallback color out of the event palette. Without an id the
   * fallback stays neutral, so a placeholder avatar never claims a color
   * that belongs to a real account.
   */
  userId?: string | null;
  avatarUrl?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
}

export default function UserAvatar({
  userId,
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
      <AvatarFallback
        className={cn(
          "font-bold text-lg",
          userId ? eventColors[getColorFromId(userId)] : eventColors.fallback,
        )}
      >
        {firstLetterOfName}
      </AvatarFallback>
    </Avatar>
  );
}
