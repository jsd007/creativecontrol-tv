"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePresent } from "@/components/chrome/Present";
import { HouseMark } from "@/components/entry/HouseMark";
import { LivingField } from "@/components/entry/LivingField";
import { activateOnSpace } from "@/lib/keys";
import { EASE_GATE, MOTION, usePrefersReducedMotion } from "@/lib/motion";

export const OPENINGS = [
  {
    id: "archive",
    name: "ARCHIVE",
    kicker: "1994 — PRESENT",
    title: "THE ARCHIVE",
    action: "ENTER",
    href: "/archive",
    other: { href: "/world", label: "THE WORLD" },
  },
  {
    id: "history",
    name: "HISTORY",
    kicker: "",
    title: "YOU ARE WATCHING HISTORY.",
    action: "BEGIN",
    href: "/tv",
    other: { href: "/archive", label: "THE ARCHIVE" },
  },
  {
    id: "document",
    name: "DOCUMENT",
    kicker: "CHANNEL ZERO · THE LONG SHOOT · THE NETWORK",
    title: "DOCUMENT EVERYTHING.",
    action: "WATCH",
    href: "/clip/channel-zero-never-aired",
    other: { href: "/tv", label: "THE NETWORK" },
  },
  {
    id: "span",
    name: "SPAN",
    kicker: "",
    title: "THE SPAN",
    action: "EXPLORE",
    href: "/timeline",
    other: { href: "/archive", label: "THE ARCHIVE" },
  },
] as const;

export type OpeningId = (typeof OPENINGS)[number]["id"];
type Opening = (typeof OPENINGS)[number];

const SPAN_FROM = 1994;
const SPAN_TO = 2026;
const SPAN_YEARS = Array.from({ length: SPAN_TO - SPAN_FROM + 1 }, (_, i) => SPAN_FROM + i);

function spanYearKind(year: number) {
  if (year === SPAN_FROM || year === SPAN_TO) return "is-edge";
  if (year % 10 === 0) return "is-beat";
  return "";
}

function OpeningSpanYears({ reduced }: { reduced: boolean }) {
  return (
    <div className={`opening-span-years ${reduced ? "is-still" : ""}`} aria-hidden>
      <div className="opening-span-rail">
        {SPAN_YEARS.map((year) => (
          <span key={year} className={`opening-span-year ${spanYearKind(year)}`}>
            {year}
          </span>
        ))}
      </div>
    </div>
  );
}

function OpeningHistoryRoom({ reduced }: { reduced: boolean }) {
  return (
    <div className={`opening-screening ${reduced ? "is-still" : ""}`} aria-hidden>
      <div className="opening-throw" />
      <div className="opening-aperture">
        <div className="opening-screen" />
      </div>
      <div className="opening-watch-line" />
      <div className="opening-rake" />
    </div>
  );
}

function OpeningDocumentRoom({ reduced }: { reduced: boolean }) {
  return (
    <div className={`opening-leftover-room ${reduced ? "is-still" : ""}`} aria-hidden>
      <div className="opening-leftover-unused" />
      <div className="opening-leftover-sheet" />
      <div className="opening-leftover-checker" />
      <div className="opening-leftover-hold" />
    </div>
  );
}

function OpeningField({ id, reduced }: { id: OpeningId; reduced: boolean }) {
  return (
    <div className={`opening-field is-${id}`} aria-hidden>
      <div className={`grain-held ${reduced ? "" : "grain-drift"}`} />
      <div className="opening-wash opening-wash-a" />
      <div className="opening-wash opening-wash-b" />
      <div className="opening-plate" />
      {id === "archive" ? (
        <div className={`leader-bars opening-leader ${reduced ? "" : "leader-crawl"}`} />
      ) : null}
      {id === "history" ? <OpeningHistoryRoom reduced={reduced} /> : null}
      {id === "document" ? <OpeningDocumentRoom reduced={reduced} /> : null}
      <div className="opening-floor" />
      {id === "span" ? <OpeningSpanYears reduced={reduced} /> : null}
    </div>
  );
}

function OpeningDoors({
  opening,
  presenting,
  onPresentNext,
}: {
  opening: Opening;
  presenting: boolean;
  onPresentNext: () => void;
}) {
  return (
    <div className={`opening-doors is-${opening.id}`}>
      {presenting ? (
        <button type="button" onClick={onPresentNext} className="enter-take">
          {opening.action}
        </button>
      ) : (
        <Link href={opening.href} className="enter-take" onKeyDown={activateOnSpace}>
          {opening.action}
        </Link>
      )}
      {presenting ? null : (
        <Link href={opening.other.href} className="opening-world" onKeyDown={activateOnSpace}>
          {opening.other.label}
        </Link>
      )}
    </div>
  );
}

function OpeningCopy({
  opening,
  reduced,
  presenting,
  onPresentNext,
}: {
  opening: Opening;
  reduced: boolean;
  presenting: boolean;
  onPresentNext: () => void;
}) {
  const fade = (delay: number) => ({
    initial: reduced ? false : { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: reduced ? 0 : MOTION.register, ease: EASE_GATE, delay: reduced ? 0 : delay },
  });

  return (
    <div className={`opening-copy is-${opening.id}`}>
      {opening.id === "document" ? (
        <>
          <motion.h1
            key={`${opening.id}-title`}
            initial={reduced ? false : { opacity: 0, letterSpacing: "0.42em" }}
            animate={{ opacity: 1, letterSpacing: "0.22em" }}
            transition={{ duration: reduced ? 0 : MOTION.register, ease: EASE_GATE, delay: reduced ? 0 : 0.82 }}
            className="opening-title"
          >
            {opening.title}
          </motion.h1>
          <motion.p key={`${opening.id}-kicker`} {...fade(0.96)} className="opening-credits">
            {opening.kicker}
          </motion.p>
        </>
      ) : (
        <>
          {opening.kicker ? (
            <motion.p
              key={`${opening.id}-kicker`}
              initial={reduced ? false : { opacity: 0, letterSpacing: "0.42em" }}
              animate={{ opacity: 1, letterSpacing: "0.28em" }}
              transition={{ duration: reduced ? 0 : MOTION.register, ease: EASE_GATE, delay: reduced ? 0 : 0.72 }}
              className="opening-kicker"
            >
              {opening.kicker}
            </motion.p>
          ) : null}
          <motion.h1
            key={`${opening.id}-title`}
            initial={reduced ? false : { opacity: 0, y: opening.id === "history" ? 0 : 8, letterSpacing: opening.id === "history" ? "0.38em" : undefined }}
            animate={{ opacity: 1, y: 0, letterSpacing: opening.id === "history" ? "0.16em" : undefined }}
            transition={{ duration: reduced ? 0 : MOTION.register, ease: EASE_GATE, delay: reduced ? 0 : 0.82 }}
            className="opening-title"
          >
            {opening.title}
          </motion.h1>
        </>
      )}
      {opening.id === "archive" ? (
        <motion.div
          key={`${opening.id}-rule`}
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduced ? 0 : 0.8, ease: EASE_GATE, delay: reduced ? 0 : 0.96 }}
          className="opening-rule"
        />
      ) : null}
      <motion.div
        key={`${opening.id}-doors`}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.7, ease: EASE_GATE, delay: reduced ? 0 : 1.08 }}
      >
        <OpeningDoors opening={opening} presenting={presenting} onPresentNext={onPresentNext} />
      </motion.div>
    </div>
  );
}

function OpeningTakes({
  index,
  onChoose,
  showShow,
  onShow,
}: {
  index: number;
  onChoose: (i: number) => void;
  showShow: boolean;
  onShow: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = box.current;
    if (!root?.contains(document.activeElement)) return;
    const on = root.querySelector<HTMLElement>(".opening-take.is-on");
    on?.focus();
  }, [index]);

  return (
    <div
      ref={box}
      className="opening-takes"
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          onChoose((index + 1) % OPENINGS.length);
        }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          onChoose((index - 1 + OPENINGS.length) % OPENINGS.length);
        }
      }}
    >
      {OPENINGS.map((item, i) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChoose(i)}
          aria-pressed={i === index}
          aria-current={i === index ? "true" : undefined}
          className={`opening-take ${i === index ? "is-on" : ""}`}
        >
          {item.name}
        </button>
      ))}
      {showShow ? (
        <button type="button" onClick={onShow} className="opening-show">
          SHOW
        </button>
      ) : null}
    </div>
  );
}

export function Threshold() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const requested = search.get("opening") as OpeningId | null;
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const { active: presenting, start, next } = usePresent();
  const showSwitcher =
    !presenting && (process.env.NODE_ENV === "development" || search.has("opening") || search.has("lens"));

  useEffect(() => {
    if (!requested) return;
    const nextOpening = OPENINGS.findIndex((o) => o.id === requested);
    if (nextOpening >= 0) setIndex(nextOpening);
  }, [requested]);

  const opening = OPENINGS[index];

  const choose = (i: number) => {
    setIndex(i);
    router.replace(`${pathname}?opening=${OPENINGS[i].id}`, { scroll: false });
  };

  return (
    <section className={`viewfinder viewfinder-br opening-room is-${opening.id} relative flex min-h-[100svh] flex-col overflow-x-clip overflow-y-auto md:overflow-hidden px-5 pb-16 pt-24 md:px-10`}>
      <div className="pointer-events-none absolute inset-0">
        {reduced ? null : <LivingField />}
        <OpeningField id={opening.id} reduced={reduced} />
      </div>

      {showSwitcher ? (
        <nav className="opening-switcher" aria-label="Opening">
          <details className="opening-switcher-fold md:hidden">
            <summary>OPENING</summary>
            <OpeningTakes
              index={index}
              onChoose={choose}
              showShow={process.env.NODE_ENV === "development"}
              onShow={start}
            />
          </details>
          <div className="opening-switcher-desk hidden md:flex">
            <p className="opening-switcher-label">OPENING</p>
            <OpeningTakes
              index={index}
              onChoose={choose}
              showShow={process.env.NODE_ENV === "development"}
              onShow={start}
            />
          </div>
        </nav>
      ) : null}

      <div className="relative flex flex-1 flex-col justify-center">
        <HouseMark reduced={reduced} />
        <OpeningCopy opening={opening} reduced={reduced} presenting={presenting} onPresentNext={next} />
      </div>
    </section>
  );
}
