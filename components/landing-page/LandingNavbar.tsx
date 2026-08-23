"use client";

import { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import { getEvents as getLocalEvents } from "@/lib/indexeddb";
import { getEvents as getServerEvents } from "@/lib/actions/events.actions";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import type { Tables } from "@/types/supabase";

export function LandingNavbar() {
  const [hasSchedule, setHasSchedule] = useState(false);
  const [user, setUser] = useState<Tables<"users"> | null>(null);
  useEffect(() => {
    async function checkSchedule() {
      try {
        const user = await getLoggedInUser();
        if (user) {
          setUser(user);
          const serverEvents = await getServerEvents(user.id);
          setHasSchedule(serverEvents.length > 0);
        } else {
          const localEvents = await getLocalEvents();
          setHasSchedule(localEvents.length > 0);
        }
      } catch {
        setHasSchedule(false);
      }
    }

    checkSchedule();
  }, []);

  return <Navbar onLandingPage={true} hasSchedule={hasSchedule} user={user} />;
}
