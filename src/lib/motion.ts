"use client";

import { useSyncExternalStore } from "react";

/** Film-gate ease: settles into register. Not bounce. */
export const EASE_GATE = [0.19, 1, 0.22, 1] as const;
/** Same curve for GSAP / CSS view transitions. */
export const GATE_EASE = "cubic-bezier(0.19, 1, 0.22, 1)";
/** Travel / fly-to. */
export const EASE_TRAVEL = [0.22, 1, 0.36, 1] as const;
/** Physical lock (tape, sprocket). */
export const EASE_LOCK = [0.16, 1, 0.3, 1] as const;

export const MOTION = {
  acquireMs: 152,
  surfMs: 144,
  hop: 0.74,
  register: 1.12,
  tape: 0.9,
  speak: 0.92,
  cut: 0.22,
  cutPresent: 0.34,
} as const;

function subscribeMedia(query: string, onChange: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function snapshotMedia(query: string) {
  return window.matchMedia(query).matches;
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => subscribeMedia("(prefers-reduced-motion: reduce)", onChange),
    () => snapshotMedia("(prefers-reduced-motion: reduce)"),
    () => false,
  );
}

export function useIsCompact() {
  return useSyncExternalStore(
    (onChange) => subscribeMedia("(max-width: 767px), (pointer: coarse)", onChange),
    () => snapshotMedia("(max-width: 767px), (pointer: coarse)"),
    () => false,
  );
}

/** Viewport width only. Touch-primary desktops stay the desktop take. */
export function useIsNarrow() {
  return useSyncExternalStore(
    (onChange) => subscribeMedia("(max-width: 767px)", onChange),
    () => snapshotMedia("(max-width: 767px)"),
    () => false,
  );
}
