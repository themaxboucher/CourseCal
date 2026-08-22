"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query.
 *
 * `useSyncExternalStore` rather than `useState` + an effect: it keeps the
 * server render and the first client paint consistent (both use
 * `serverFallback`), then re-renders once with the real value instead of
 * flashing the wrong layout, and it re-evaluates on every change rather than
 * only on mount.
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

// A drawer beats a centred dialog when the viewport is narrow, and also when
// it is short — a phone held in landscape is neither tall enough for a dialog
// nor wide enough to want one.
const COMPACT_VIEWPORT = "(max-width: 767px), (max-height: 480px)";

export function useCompactViewport(): boolean {
  return useMediaQuery(COMPACT_VIEWPORT);
}
