"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandStill } from "@/components/brand/BrandStill";
import { CutProvider } from "@/components/chrome/Cut";
import { DiscoverField } from "@/components/chrome/DiscoverField";
import { PresentProvider, usePresent } from "@/components/chrome/Present";
import { houseGsap } from "@/lib/gsap";
import { activateOnSpace, isTypingTarget } from "@/lib/keys";
import { GATE_EASE, usePrefersReducedMotion } from "@/lib/motion";
import { isSoundEnabled, playCut, playThreshold, useSound } from "@/lib/sound";

const LENSES = [
  { href: "/archive", label: "ARCHIVE" },
  { href: "/world", label: "WORLD" },
  { href: "/tv", label: "TV" },
  { href: "/tapes", label: "TAPES" },
  { href: "/timeline", label: "TIMELINE" },
];

export function ArchiveShell({ children }: { children: React.ReactNode }) {
  return (
    <CutProvider>
      <PresentProvider>
        <ArchiveChrome>{children}</ArchiveChrome>
      </PresentProvider>
    </CutProvider>
  );
}

function ArchiveActs({
  className,
  discover,
  discoverOpen,
  sound,
  onDiscover,
  onSound,
}: {
  className: string;
  discover: boolean;
  discoverOpen: boolean;
  sound: boolean;
  onDiscover: () => void;
  onSound: () => void;
}) {
  return (
    <div className={className}>
      {discover ? (
        <button
          type="button"
          aria-expanded={discoverOpen}
          aria-controls="discover-field"
          aria-haspopup="dialog"
          onClick={onDiscover}
          className="archive-act archive-act-discover font-cond text-[11px] tracking-[0.2em] text-dust hover:text-paper"
        >
          DISCOVER
        </button>
      ) : null}
      <button
        type="button"
        onClick={onSound}
        className="archive-act archive-act-sound font-mono text-[10px] tracking-[0.16em] text-dust hover:text-paper"
        aria-pressed={sound}
        aria-label={sound ? "Sound on" : "Sound off"}
      >
        SOUND {sound ? "ON" : "OFF"}
      </button>
    </div>
  );
}

function ArchiveChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { active: presenting, ready: presentReady } = usePresent();
  const isEntry = pathname === "/";
  const { on: sound, toggle: toggleSound, reduced } = useSound();
  const [open, setOpen] = useState(false);
  const showDiscover = presentReady && !presenting;
  const pathRef = useRef<string | null>(null);

  useEffect(() => {
    if (presenting) setOpen(false);
  }, [presenting]);

  useEffect(() => {
    const prev = pathRef.current;
    pathRef.current = pathname;
    if (prev === null || prev === pathname) return;
    if (!isSoundEnabled() || reduced) return;
    if (pathname === "/") playThreshold();
    else playCut();
  }, [pathname, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.key === "Escape") setOpen(false);
      if (!presenting && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presenting]);

  const toggleDiscover = () => setOpen((v) => !v);
  const toggleSoundAct = () => {
    void (async () => {
      const turningOn = !isSoundEnabled();
      await toggleSound();
      if (turningOn && pathname === "/") playThreshold();
    })();
  };

  return (
    <div className={`relative z-10 min-h-screen ${isEntry ? "is-threshold" : "is-lenses"}`}>
      <a href="#main" className="skip-to-content" tabIndex={open ? -1 : undefined}>
        Skip to content
      </a>
      <header className="archive-mast fixed inset-x-0 top-0 z-30 flex items-end justify-between bg-gradient-to-b from-void via-void/85 to-transparent px-4 py-3 md:px-6">
        <Link href="/" className="archive-mark" aria-label="Creative Control">
          <BrandStill decorative className="archive-mark-still" />
        </Link>
        <LensRail pathname={pathname} />
        <ArchiveActs
          className="archive-acts hidden items-center gap-3 md:flex"
          discover={showDiscover}
          discoverOpen={open}
          sound={sound}
          onDiscover={toggleDiscover}
          onSound={toggleSoundAct}
        />
      </header>

      {showDiscover ? <DiscoverField open={open} onOpenChange={setOpen} /> : null}

      <main id="main" tabIndex={-1} inert={open || undefined} className={isEntry ? "archive-entry" : "archive-page pt-14"}>
        {children}
      </main>

      <div className={`lens-mobile md:hidden ${isEntry ? "is-entry" : ""}`}>
        <div className="lens-mobile-acts">
          <Link href="/" className="lens-mobile-mark" aria-label="Creative Control">
            <BrandStill decorative className="lens-mobile-emblem" />
          </Link>
          <ArchiveActs
            className="lens-mobile-acts-row"
            discover={showDiscover}
            discoverOpen={open}
            sound={sound}
            onDiscover={toggleDiscover}
            onSound={toggleSoundAct}
          />
        </div>
        {!isEntry ? (
          <nav className="lens-mobile-lenses" aria-label="Archive lenses">
            {LENSES.map((lens) => {
              const active = pathname === lens.href || pathname.startsWith(`${lens.href}/`);
              return (
                <Link
                  key={lens.href}
                  href={lens.href}
                  aria-current={active ? "page" : undefined}
                  onKeyDown={activateOnSpace}
                  className={`lens-mobile-lens ${active ? "is-on" : ""}`}
                >
                  {lens.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function LensRail({ pathname }: { pathname: string }) {
  const reduced = usePrefersReducedMotion();
  const rail = useRef<HTMLElement>(null);
  const hair = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const { gsap, Flip } = houseGsap();
      const nav = rail.current;
      const line = hair.current;
      if (!nav || !line) return;
      const active = nav.querySelector("[aria-current='page']");
      if (!(active instanceof HTMLElement)) {
        gsap.to(line, { opacity: 0, duration: reduced || first.current ? 0 : 0.18, ease: GATE_EASE });
        first.current = false;
        return;
      }
      if (first.current || reduced) {
        gsap.set(line, { x: active.offsetLeft, width: active.offsetWidth, opacity: 1 });
        first.current = false;
        return;
      }
      const state = Flip.getState(line);
      gsap.set(line, { x: active.offsetLeft, width: active.offsetWidth, opacity: 1 });
      Flip.from(state, { duration: 0.42, ease: GATE_EASE });
    },
    { dependencies: [pathname, reduced] },
  );

  return (
    <nav ref={rail} className="lens-rail relative hidden items-center gap-5 md:flex" aria-label="Archive lenses">
      {LENSES.map((lens) => {
        const active = pathname === lens.href || pathname.startsWith(`${lens.href}/`);
        return (
          <Link
            key={lens.href}
            href={lens.href}
            aria-current={active ? "page" : undefined}
            onKeyDown={activateOnSpace}
            className={`font-cond text-[12px] tracking-[0.22em] ${active ? "text-paper" : "text-dust hover:text-paper"}`}
          >
            {lens.label}
          </Link>
        );
      })}
      <span ref={hair} className="lens-hair" aria-hidden />
    </nav>
  );
}
