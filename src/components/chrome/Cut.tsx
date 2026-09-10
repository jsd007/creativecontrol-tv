"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { houseGsap } from "@/lib/gsap";
import { GATE_EASE, usePrefersReducedMotion } from "@/lib/motion";
import { presentKeepsLensMotion, readPresentFlag } from "@/lib/present";

type CutApi = {
  to: (href: string) => void;
};

const CutContext = createContext<CutApi>({ to: () => undefined });

export function useCut() {
  return useContext(CutContext);
}

function destOf(href: string) {
  const url = new URL(href, window.location.origin);
  return { path: url.pathname, key: `${url.pathname}${url.search}` };
}

function isInternalAnchor(a: HTMLAnchorElement) {
  if (a.target && a.target !== "_self") return false;
  if (a.hasAttribute("download")) return false;
  const href = a.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  try {
    return new URL(a.href, window.location.origin).origin === window.location.origin;
  } catch {
    return false;
  }
}

export function CutProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const reduced = usePrefersReducedMotion();
  const pending = useRef<{ key: string; resolve: () => void } | null>(null);
  const busy = useRef(false);
  const queued = useRef<string | null>(null);

  useEffect(() => {
    const wait = pending.current;
    if (!wait) return;
    const key = `${pathname}${search.toString() ? `?${search.toString()}` : ""}`;
    if (key === wait.key) {
      wait.resolve();
      pending.current = null;
    }
  }, [pathname, search]);

  const to = useCallback(
    (href: string) => {
      const { path, key } = destOf(href);
      const here = `${window.location.pathname}${window.location.search}`;
      if (key === here) return;

      const samePath = path === window.location.pathname;
      const presenting = readPresentFlag();
      const keepLens = samePath && presentKeepsLensMotion(path);
      const instant = reduced || (presenting ? keepLens : samePath);

      const navigate = () => {
        router.push(key);
        return new Promise<void>((resolve) => {
          pending.current = { key, resolve };
          window.setTimeout(() => {
            if (pending.current?.resolve === resolve) {
              pending.current = null;
              resolve();
            }
          }, 880);
        });
      };

      if (busy.current) {
        if (presenting) queued.current = href;
        else if (instant) void navigate();
        return;
      }

      if (instant) {
        document.documentElement.classList.remove("is-cutting", "is-present-cut");
        void navigate();
        return;
      }

      busy.current = true;
      document.documentElement.classList.toggle("is-present-cut", presenting);
      document.documentElement.classList.add("is-cutting");

      const finish = () => {
        busy.current = false;
        document.documentElement.classList.remove("is-cutting", "is-present-cut");
        const nextHref = queued.current;
        queued.current = null;
        if (nextHref) to(nextHref);
      };

      if (typeof document.startViewTransition === "function") {
        const vt = document.startViewTransition(async () => {
          await navigate();
        });
        void vt.finished.finally(finish);
        return;
      }

      void fallbackCut(navigate).finally(finish);
    },
    [reduced, router],
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const node = e.target;
      if (!(node instanceof Element)) return;
      const a = node.closest("a");
      if (!(a instanceof HTMLAnchorElement) || !isInternalAnchor(a)) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      to(a.href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [to]);

  const api = useMemo(() => ({ to }), [to]);

  return (
    <CutContext.Provider value={api}>
      {children}
      <CutOverlay />
    </CutContext.Provider>
  );
}

function CutOverlay() {
  return (
    <div className="cut-overlay" aria-hidden>
      <div className="cut-black" />
      <div className="cut-bar" />
    </div>
  );
}

async function fallbackCut(navigate: () => Promise<void>) {
  const root = document.querySelector(".cut-overlay");
  const black = root?.querySelector(".cut-black");
  const bar = root?.querySelector(".cut-bar");
  if (!(root instanceof HTMLElement) || !(black instanceof HTMLElement) || !(bar instanceof HTMLElement)) {
    await navigate();
    return;
  }
  const { gsap } = houseGsap();
  gsap.set(root, { opacity: 1 });
  gsap.set(black, { opacity: 0.94 });
  gsap.set(bar, { xPercent: -40, opacity: 1 });
  await gsap.to(bar, { xPercent: 520, opacity: 0, duration: 0.15, ease: GATE_EASE });
  await navigate();
  await gsap.to(black, { opacity: 0, duration: 0.16, ease: GATE_EASE });
  gsap.set(root, { opacity: 0 });
}
