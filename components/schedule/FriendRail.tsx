"use client";

import {
  AddFilled,
  CalendarXFilled,
  CheckFilled,
  GroupFilled,
} from "@/components/icons";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/utils/profiles";
import { Button } from "../ui/button";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useState } from "react";

export interface RailFriend {
  profile: Profile;
  selected: boolean;
  /** False when this friend has no events in the term being viewed. */
  hasSchedule: boolean;
}

interface FriendRailProps {
  friends: RailFriend[];
  isLoggedIn: boolean;
  onToggle: (username: string) => void;
  termLabel: string;
}

// Shared footprint so the "add" tile lines up with the friend tiles.
const tileClass =
  "flex w-18 shrink-0 cursor-pointer flex-col items-center gap-1 rounded-lg px-1 py-2 transition-colors hover:bg-muted/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * Horizontal strip of friends to overlay. Friends with no schedule for the
 * selected term stay selectable but are marked and contribute nothing to the
 * free-time maths — absent data must read as absent, never as availability.
 */
export default function FriendRail({
  friends,
  isLoggedIn,
  onToggle,
  termLabel,
}: FriendRailProps) {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <>
        <div className="flex items-center justify-between gap-4 rounded-xl border-[1.5px] border-dashed px-4 py-3 mb-4">
          <p className="text-sm text-muted-foreground">
            <GroupFilled className="mr-2 inline size-4 align-text-bottom" />
            Sign up to see when you and your friends are free.
          </p>
          <Button size="sm" onClick={() => setAuthDialogOpen(true)}>
            Sign up
          </Button>
        </div>
        <AuthDialog
          open={authDialogOpen}
          onOpenChange={setAuthDialogOpen}
          type="signup"
        />
      </>
    );
  }

  if (friends.length === 0) {
    return (
      <Link
        href="/friends?tab=discover"
        className="flex items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-dashed px-4 py-3 mb-4 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-ring hover:bg-ring/10"
      >
        <AddFilled className="size-3.5" />
        <p className="invisible hidden sm:visible sm:block">
          Add friends to see when you&apos;re all free.
        </p>
        <p className="sm:invisible sm:hidden">Add friends.</p>
      </Link>
    );
  }

  return (
    <div className="-mx-1 flex gap-0 md:gap-2 overflow-x-auto px-1 mb-4">
      {friends.map(({ profile, selected, hasSchedule }) => {
        const label = profile.name ?? profile.username;
        return (
          <button
            key={profile.id}
            type="button"
            onClick={() => onToggle(profile.username)}
            aria-pressed={selected}
            title={
              hasSchedule ? label : `${label} has no schedule for ${termLabel}`
            }
            className={tileClass}
            disabled={!hasSchedule}
          >
            <span className="relative">
              <span
                className={cn(
                  "block rounded-full transition-all",
                  hasSchedule &&
                    selected &&
                    "ring-2 ring-ring ring-offset-2 ring-offset-background",
                  !hasSchedule && "opacity-50",
                )}
              >
                <UserAvatar
                  userId={profile.id}
                  avatarUrl={profile.avatar}
                  name={profile.name}
                />
              </span>
              {hasSchedule && selected && (
                <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-ring text-primary-foreground ring-2 ring-background">
                  <CheckFilled className="size-2.5" />
                </span>
              )}
              {!hasSchedule && (
                <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-muted-foreground text-white ring-2 ring-background">
                  <CalendarXFilled className="size-2.5" />
                </span>
              )}
            </span>
            <span
              className={cn(
                "w-full truncate text-center text-xs",
                selected ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
      <Link
        href="/friends?tab=discover"
        title="Find more friends"
        className={cn(tileClass, "group")}
      >
        <span className="flex size-12 items-center justify-center rounded-full border-2 border-dashed border-border text-muted-foreground bg-muted/40 transition-colors group-hover:border-ring group-hover:text-ring group-hover:bg-ring/10">
          <AddFilled className="size-5" />
        </span>
        <span className="w-full truncate text-center text-xs transition-colors text-muted-foreground invisible group-hover:visible">
          Add
        </span>
      </Link>
    </div>
  );
}
