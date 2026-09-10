"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BrandStill } from "@/components/brand/BrandStill";
import { useCut } from "@/components/chrome/Cut";
import { isActionTarget, isTypingTarget } from "@/lib/keys";
import { useIsCompact, usePrefersReducedMotion } from "@/lib/motion";
import { matchBeat, PRESENT_BEATS, readPresentFlag, writePresentFlag } from "@/lib/present";

type PresentApi = {
  active: boolean;
  ready: boolean;
  index: number;
  next: () => void;
  prev: () => void;
  exit: () => void;
  start: () => void;
};

const PresentContext = createContext<PresentApi>({
  active: false,
  ready: false,
  index: 0,
  next: () => undefined,
  prev: () => undefined,
  exit: () => undefined,
  start: () => undefined,
});

export function usePresent() {
  return useContext(PresentContext);
}

export function PresentProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const reduced = usePrefersReducedMotion();
  const compact = useIsCompact();
  const { to } = useCut();
  const fromUrl = search.has("present");
  const [active, setActive] = useState(fromUrl);
  const [ready, setReady] = useState(fromUrl);
  const routeIndex = useMemo(() => matchBeat(pathname, search), [pathname, search]);
  const [index, setIndex] = useState(routeIndex);
  const indexRef = useRef(routeIndex);
  const intentRef = useRef<number | null>(null);
  const fromRef = useRef(routeIndex);
  indexRef.current = index;

  useEffect(() => {
    const on = search.has("present") || readPresentFlag();
    if (on) {
      writePresentFlag(true);
      setActive(true);
    }
    setReady(true);
  }, [search]);

  useEffect(() => {
    const intent = intentRef.current;
    if (intent === null) {
      indexRef.current = routeIndex;
      setIndex(routeIndex);
      fromRef.current = routeIndex;
      return;
    }
    if (routeIndex === intent) {
      intentRef.current = null;
      indexRef.current = routeIndex;
      setIndex(routeIndex);
      fromRef.current = routeIndex;
      return;
    }
    const lo = Math.min(fromRef.current, intent);
    const hi = Math.max(fromRef.current, intent);
    if (routeIndex < lo || routeIndex > hi) {
      intentRef.current = null;
      indexRef.current = routeIndex;
      setIndex(routeIndex);
      fromRef.current = routeIndex;
    }
  }, [routeIndex]);

  useEffect(() => {
    if (!active) return;
    const ahead = PRESENT_BEATS[index + 1];
    const behind = PRESENT_BEATS[index - 1];
    if (ahead) router.prefetch(ahead.href);
    if (behind) router.prefetch(behind.href);
  }, [active, index, router]);

  const go = useCallback(
    (i: number) => {
      const beat = PRESENT_BEATS[i];
      if (!beat) return;
      if (intentRef.current === null) fromRef.current = indexRef.current;
      intentRef.current = i;
      indexRef.current = i;
      setIndex(i);
      to(beat.href);
    },
    [to],
  );

  const next = useCallback(() => {
    const cursor = intentRef.current ?? indexRef.current;
    go(Math.min(PRESENT_BEATS.length - 1, cursor + 1));
  }, [go]);
  const prev = useCallback(() => {
    const cursor = intentRef.current ?? indexRef.current;
    go(Math.max(0, cursor - 1));
  }, [go]);

  const exit = useCallback(() => {
    intentRef.current = null;
    writePresentFlag(false);
    setActive(false);
    const nextParams = new URLSearchParams(search.toString());
    nextParams.delete("present");
    const q = nextParams.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [pathname, router, search]);

  const start = useCallback(() => {
    writePresentFlag(true);
    setActive(true);
    router.push("/?present=1");
  }, [router]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (isActionTarget(e.target) && (e.key === " " || e.key === "Enter")) return;
      if (e.key === " " || e.key === "." || e.key === "n") {
        e.preventDefault();
        next();
      }
      if (e.key === "," || e.key === "p") {
        e.preventDefault();
        prev();
      }
      if (e.key === "x" || (e.key === "Escape" && e.shiftKey)) {
        e.preventDefault();
        exit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, exit, next, prev]);

  const value = useMemo(
    () => ({ active, ready, index, next, prev, exit, start }),
    [active, ready, exit, index, next, prev, start],
  );

  return (
    <PresentContext.Provider value={value}>
      {children}
      {active && !compact ? (
        <PresentMarks index={index} reduced={reduced} onNext={next} onPrev={prev} onExit={exit} />
      ) : null}
    </PresentContext.Provider>
  );
}

function PresentMarks({
  index,
  reduced,
  onNext,
  onPrev,
  onExit,
}: {
  index: number;
  reduced: boolean;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}) {
  const atStart = index === 0;
  const atEnd = index === PRESENT_BEATS.length - 1;
  const beat = PRESENT_BEATS[index];

  return (
    <>
      {reduced ? null : <div key={index} className="present-line" aria-hidden />}
      <nav className="present-controls hidden md:flex" aria-label="Presentation controls">
        <BrandStill decorative className="present-mark-still" />
        <button type="button" onClick={onPrev} disabled={atStart} aria-label="Previous scene">
          BACK
        </button>
        <div className="present-progress" aria-live="polite">
          <p>
            {String(index + 1).padStart(2, "0")} / {String(PRESENT_BEATS.length).padStart(2, "0")} · {beat.label.toUpperCase()}
          </p>
          <div className="present-marks" aria-hidden>
            {PRESENT_BEATS.map((item, i) => (
              <span
                key={item.id}
                className="present-mark"
                style={{
                  width: i === index ? 18 : 9,
                  background: i === index ? "var(--leader)" : "var(--dust)",
                  opacity: reduced ? 0.55 : i === index ? 1 : 0.58,
                }}
              />
            ))}
          </div>
        </div>
        <button type="button" onClick={atEnd ? onExit : onNext} aria-label={atEnd ? "Exit presentation" : "Next scene"}>
          {atEnd ? "EXPLORE" : "NEXT"}
        </button>
      </nav>
    </>
  );
}
