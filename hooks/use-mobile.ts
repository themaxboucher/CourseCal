"use client";

import { useSyncExternalStore } from "react";

// Tailwind's md breakpoint. Below it, modals render as bottom sheets so the
// on-screen keyboard can't cover them.
const MOBILE_BREAKPOINT = 768;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function subscribe(onStoreChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onStoreChange);
  return () => query.removeEventListener("change", onStoreChange);
}

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;

// The server has no viewport to measure. Callers get `undefined` until the
// first client render so they can hold off instead of guessing and flashing
// the wrong layout.
const getServerSnapshot = () => undefined;

export function useIsMobile(): boolean | undefined {
  return useSyncExternalStore<boolean | undefined>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}
