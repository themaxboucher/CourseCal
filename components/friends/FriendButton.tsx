"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  Loading3Filled,
  TimeFilled,
  UserAddFilled,
  UserFilled,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "@/lib/actions/friends.actions";
import {
  FRIEND_ACTION_MESSAGES,
  type FriendActionResult,
  type RelationshipStatus,
} from "@/lib/utils/profiles";

interface FriendButtonProps {
  userId: string;
  status: RelationshipStatus;
  className?: string;
  /** Fires after a successful change, so a parent can react to it. */
  onActionComplete?: (status: RelationshipStatus) => void;
}

export default function FriendButton({
  userId,
  status: serverStatus,
  className,
  onActionComplete,
}: FriendButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  // Shows the new state immediately after an action, then defers back to the
  // server once a refresh delivers a different one. Recording which server
  // value the override was made against lets it expire during render, instead
  // of needing an effect to clear it.
  const [override, setOverride] = useState<{
    from: RelationshipStatus;
    to: RelationshipStatus;
  } | null>(null);
  const status = override?.from === serverStatus ? override.to : serverStatus;

  async function run(
    action: () => Promise<FriendActionResult>,
    nextStatus: RelationshipStatus,
    successMessage: string,
  ) {
    setBusy(true);
    try {
      const result = await action();
      if (!result.ok) {
        toast(FRIEND_ACTION_MESSAGES[result.reason], {
          icon: <CloseCircleFilled className="text-destructive size-5" />,
        });
        // Our idea of the relationship was stale — let the server correct it.
        router.refresh();
        return;
      }
      setOverride({ from: serverStatus, to: nextStatus });
      onActionComplete?.(nextStatus);
      toast(successMessage, {
        icon: <CheckCircleFilled className="text-green-500 size-5" />,
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast(FRIEND_ACTION_MESSAGES.unknown, {
        icon: <CloseCircleFilled className="text-destructive size-5" />,
      });
    } finally {
      setBusy(false);
    }
  }

  if (status === "self") return null;

  const spinner = <Loading3Filled className="size-4 animate-spin" />;

  if (status === "incoming_pending") {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={busy}
            onClick={() =>
              run(
                () => acceptFriendRequest(userId),
                "friends",
                "You're now friends",
              )
            }
          >
            {busy ? spinner : "Accept"}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={busy}
            onClick={() =>
              run(
                () => declineFriendRequest(userId),
                "none",
                "Request declined",
              )
            }
          >
            Decline
          </Button>
        </div>
      </div>
    );
  }

  if (status === "outgoing_pending") {
    return (
      <Button
        size="sm"
        variant="secondary"
        className={className}
        disabled={busy}
        onClick={() =>
          run(() => removeFriend(userId), "none", "Request cancelled")
        }
      >
        {busy ? spinner : <TimeFilled className="size-4" />}
        Requested
      </Button>
    );
  }

  if (status === "friends") {
    return (
      <Button
        size="sm"
        variant="secondary"
        className={className}
        disabled={busy}
        onClick={() =>
          run(() => removeFriend(userId), "none", "Removed from friends")
        }
      >
        {busy ? spinner : <UserFilled className="size-4" />}
        Friends
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      className={className}
      disabled={busy}
      onClick={() =>
        run(() => sendFriendRequest(userId), "outgoing_pending", "Request sent")
      }
    >
      {busy ? spinner : <UserAddFilled className="size-4" />}
      Add friend
    </Button>
  );
}
