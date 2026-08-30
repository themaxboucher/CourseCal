"use client";

import { useMemo, useState } from "react";
import { preload } from "react-dom";
import { CheckFilled } from "@/components/icons";
import UserAvatar from "@/components/UserAvatar";
import type { AvailabilityPerson } from "@/components/schedule/AvailabilityLayer";
import WeekView from "@/components/schedule/WeekView";
import { heroFriends, heroUserEvents } from "@/constants";
import {
  buildAvailability,
  DEFAULT_MIN_SLOT_MINUTES,
  type Participant,
} from "@/lib/utils/availability";
import { getTimeRange } from "@/lib/utils/schedule";
import { cn } from "@/lib/utils";

/**
 * Stands in for the signed-in account. The hero's classes are drawn in their
 * own colours rather than as busy blocks, which is what `viewerId` buys.
 */
const VIEWER_ID = "hero-you";

/**
 * Hand-drawn pointer at the first friend in the rail.
 *
 * Lives outside the card, so it draws at the page's own scale instead of
 * through the card's `[zoom]`. That costs it the card's coordinate space, so
 * it is anchored to the wrapper instead — which is sized to the card's
 * rendered box precisely so the two agree. Inert and absolutely positioned:
 * the rail lays out exactly as it does without it.
 *
 * The tip reaches over the card. That works because the card is not itself
 * positioned, so its background paints under this, positioned, layer — give
 * the card `relative` again and the arrowhead disappears behind it.
 */
function TapHint() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none text-muted-foreground">
      {/* Rex sits inside the card's padding, which steps from p-4 to md:p-8 —
          12px once the card's zoom is applied — so the arrow steps with him,
          or the tip lands on his head at one width and beside him at the
          other. The text keeps one offset: it is placed against the card's top
          edge, which the reserved band holds still at both. */}
      <svg
        viewBox="0 0 68 77"
        aria-hidden="true"
        className="absolute top-[8px] left-[40px] h-12 w-10 fill-current md:top-[12px] md:left-[50px]"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M36.4058 21.9334L41.1332 16.3559C39.2314 17.9379 37.6704 19.8143 36.4058 21.9334ZM23.1688 30.9494C25.2167 29.029 27.1793 27.057 29.4146 25.3858C26.7801 26.6313 24.9064 28.7351 23.1688 30.9494ZM33.2576 34.8628C33.7854 35.8059 34.3218 35.3399 34.8298 34.9399C36.5485 33.5884 36.678 31.5876 36.7834 29.6735C36.8603 28.2784 36.7645 26.8185 36.0412 25.5301C35.7657 25.0387 35.412 24.7259 34.9817 25.4387C33.8074 27.3851 32.9252 29.4359 32.76 31.7319C32.6813 32.8257 32.8093 33.9015 33.2576 34.8628ZM30.044 26.4983C28.4758 27.3028 27.2555 28.5674 26.0094 29.7814C20.6252 35.0274 17.2489 41.4539 14.905 48.5197C13.3395 53.2397 12.2395 58.0626 11.3075 62.9339C11.2221 63.3783 11.1535 63.8311 10.8458 64.1895C10.4999 64.592 10.1735 64.7341 10.044 64.0384C10.0116 63.8672 10.1324 63.62 9.81447 63.6931C8.71764 63.9447 8.57833 63.1202 8.38728 62.4074C8.02827 61.0698 8.27652 59.7088 8.39131 58.3751C8.71242 54.6385 9.17526 50.9104 10.1232 47.2754C11.0034 43.9008 12.3627 40.6916 13.8111 37.5224C14.7331 35.505 15.6989 33.4657 17.2506 31.8988C18.2815 30.8578 18.8385 29.5395 19.8363 28.51C21.7493 26.5365 23.6757 24.5912 25.9913 23.0773C27.8973 21.8315 29.9825 21.148 32.2609 21.1387C33.0121 21.1359 33.5561 20.852 33.993 20.285C35.171 18.7574 36.4016 17.263 37.6421 15.7973C39.6599 13.4123 42.0469 11.3584 44.4974 9.40976C48.406 6.30179 52.5732 3.62757 57.3413 2.00582C60.1437 1.05265 62.9687 0.295021 65.9574 1.11102C66.7443 1.32581 67.4328 1.66676 67.8401 2.42598C68.016 2.75297 68.0549 3.05479 67.8179 3.37093C67.5375 3.74424 67.3526 3.49944 67.042 3.35738C64.9118 2.3824 62.9132 3.24742 60.9212 3.90867C55.4318 5.7307 50.8176 9.01166 46.4398 12.6746C43.0898 15.4778 40.0455 18.5808 37.3679 22.0365C37.1552 22.3109 36.7658 22.5228 37.3009 22.9146C39.1654 24.2792 40.116 26.2265 40.5107 28.4278C41.1203 31.8255 40.7845 35.0594 38.2512 37.6832C36.8901 39.0932 35.496 39.1912 33.7364 38.3538C29.2533 36.221 28.3904 31.6356 29.8533 27.7477C29.9848 27.3997 30.1159 27.0518 30.2468 26.7046C30.1792 26.6355 30.1114 26.567 30.044 26.4983Z"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.7396 69.066C11.1773 70.7696 9.87903 72.6455 8.96903 74.7731C10.2258 72.8709 11.4825 70.9684 12.7396 69.066ZM4.16018 63.3217C5.28587 65.375 6.04163 67.5845 6.8814 69.7589C7.00686 70.0839 6.98214 70.5315 7.50699 70.5757C8.01112 70.618 8.14131 70.2023 8.2923 69.9013C9.11672 68.2617 10.3763 66.9558 11.4775 65.5213C12.1728 64.6148 12.7024 63.5696 13.4452 62.6601C14.5892 61.2601 15.6297 59.7727 16.6756 58.2955C17.2058 57.547 18.0634 57.0791 18.326 56.0843C18.5838 55.1085 19.3593 54.91 20.7139 55.5058C21.4054 55.8096 21.9699 56.4212 21.6002 57.3018C21.2961 58.026 20.9306 58.7392 20.4918 59.389C17.5869 63.6895 14.6474 67.9665 11.7376 72.2636C11.0844 73.228 10.4955 74.2376 9.88906 75.2334C8.78653 77.0441 7.96815 77.2015 6.16577 76.0678C4.76664 75.1877 3.99186 73.9692 3.66283 72.3613C3.02909 69.2664 2.30718 66.1894 1.09654 63.2558C0.853796 62.668 0.528696 62.1149 0.262714 61.5357C-0.0458552 60.8654 0.158774 60.5306 0.921301 60.5897C2.61148 60.7196 2.87504 60.94 4.16018 63.3217Z"
        />
      </svg>
      <span className="absolute top-0 left-[88px] whitespace-nowrap text-sm md:top-[4px] md:left-[98px]">
        Tap to compare schedules
      </span>
    </div>
  );
}

/**
 * The landing page's playable schedule: a fixed week presented as the
 * visitor's, and a rail of three friends to lay over it.
 *
 * The grid, the overlay and the free-time arithmetic are the app's own —
 * `WeekView` with no `user` renders read-only blocks, and `buildAvailability`
 * is the same function `/schedule` calls — so the hero cannot drift from the
 * product it is advertising. Only the rail is local: the real `FriendRail`
 * carries an auth dialog and a link into the signed-in friends page, neither
 * of which belongs on a demo control.
 */
export default function HeroSchedule() {
  // Radix's `AvatarImage` renders nothing until a `new Image()` it creates
  // itself reports a load, so the friends' photos are invisible to the
  // preload scanner and only get requested once this component hydrates —
  // late enough that the rail visibly pops from initials to faces. Preloading
  // during render puts a `<link rel="preload">` in the server HTML, so the
  // bytes are on their way while the bundle is still downloading and Radix
  // finds them already cached.
  for (const friend of heroFriends) {
    preload(friend.avatar, { as: "image", fetchPriority: "high" });
  }

  // Nothing starts selected: the grid opens as the visitor's own week, and the
  // shared free time is what their first tap buys them.
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedFriends = useMemo(
    () => heroFriends.filter((friend) => selectedIds.includes(friend.id)),
    [selectedIds],
  );

  const availability = useMemo(() => {
    if (selectedFriends.length === 0) return null;

    const participants: Participant[] = [
      { id: VIEWER_ID, events: heroUserEvents, hasSchedule: true },
      ...selectedFriends.map((friend) => ({
        id: friend.id,
        events: friend.events,
        hasSchedule: true,
      })),
    ];

    const rangeEvents = [
      ...heroUserEvents,
      ...selectedFriends.flatMap((friend) => friend.events),
    ];
    const { startHour, endHour } = getTimeRange(rangeEvents);

    return {
      ...buildAvailability(participants, {
        minDurationMin: DEFAULT_MIN_SLOT_MINUTES,
        dayStartMin: startHour * 60,
        // `endHour` labels the last row, which covers the hour after it.
        dayEndMin: (endHour + 1) * 60,
        viewerId: VIEWER_ID,
      }),
      rangeEvents,
    };
  }, [selectedFriends]);

  const people = useMemo(() => {
    const entries: Record<string, AvailabilityPerson> = {
      [VIEWER_ID]: { name: "You" },
    };
    for (const friend of heroFriends) {
      entries[friend.id] = { name: friend.name };
    }
    return entries;
  }, []);

  const toggleFriend = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    );

  return (
    // Capped at the card's own rendered width — max-w-xl seen through the
    // card's 0.75 zoom — so this box and the card are the same box. That is
    // what lets a hint outside the card be positioned against something inside
    // it; keep the two in step if either the zoom or max-w-xl changes.
    //
    // The band up top is the hint's, so the annotation never lands on the
    // upload prompt the hero stacks above the card on a phone.
    <div className="relative mx-auto w-full max-w-[calc(36rem*0.75)] pt-10">
      {selectedIds.length === 0 && <TapHint />}
      <div className="w-full bg-card border-[1.5px] shadow-lg md:shadow-xl p-4 md:px-8 md:pb-8 md:pt-6 max-w-xl mx-auto rounded-3xl [zoom:0.75]">
        <div className="w-full">
          <div className="mb-4">
            <div className="-mx-1 flex px-1 md:gap-2">
              {heroFriends.map((friend) => {
                const selected = selectedIds.includes(friend.id);
                return (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() => toggleFriend(friend.id)}
                    aria-pressed={selected}
                    className="flex w-18 shrink-0 cursor-pointer flex-col items-center gap-1 rounded-lg px-1 py-2 transition-colors hover:bg-muted/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="relative">
                      <span
                        className={cn(
                          "block rounded-full transition-all",
                          selected &&
                            "ring-2 ring-ring ring-offset-2 ring-offset-background",
                        )}
                      >
                        <UserAvatar
                          userId={friend.id}
                          avatarUrl={friend.avatar}
                          name={friend.name}
                        />
                      </span>
                      {selected && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-ring text-primary-foreground ring-2 ring-background">
                          <CheckFilled className="size-2.5" />
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        "w-full truncate text-center text-xs",
                        selected ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {friend.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <WeekView
            events={heroUserEvents}
            compact
            hideTimeColumn
            busyBlocks={availability?.busyBlocks}
            freeSlots={availability?.slots}
            people={people}
            rangeEvents={availability?.rangeEvents}
          />
        </div>
      </div>
    </div>
  );
}
