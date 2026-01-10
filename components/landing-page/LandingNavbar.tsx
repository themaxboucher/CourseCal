"use client";

import { useEffect, useState } from "react";
import { Navbar } from "../Navbar";
import { getEvents } from "@/lib/indexeddb";

export function LandingNavbar() {
  const [hasSchedule, setHasSchedule] = useState(false);

  useEffect(() => {
    const checkSchedule = async () => {
      try {
        const events = await getEvents();
        setHasSchedule(events.length > 0);
      } catch {
        setHasSchedule(false);
      }
    };

    checkSchedule();
  }, []);

  return <Navbar hasSchedule={hasSchedule} />;
}

