"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { catalog, clipsOnTape, getLocation, getTape } from "@/data";
import type { SourceTape, TapeFormat } from "@/data/types";
import { isUnlogged } from "@/lib/clipDisplay";
import { broadcastYearKey, broadcastYears, broadcastYearTape, parseBroadcastYearKey } from "@/lib/holdings";
import { densityStamp, EmptySlot, TapeObject, TapeSpine, UnopenedShell } from "./TapeObject";
import { emptyFill, shelfBays, shelfOf, splitRack, TapeShelf, type ShelfKey } from "./TapeShelf";
import { isTypingTarget } from "@/lib/keys";
import { EASE_GATE, useIsCompact, usePrefersReducedMotion } from "@/lib/motion";
import { playEngage } from "@/lib/sound";
import "./aisle.css";

const FORMATS: Array<TapeFormat | "ALL"> = ["ALL", "MINIDV", "HI8", "VHS", "DIGITAL", "PHONE"];

const MUTE_WORDS = ["UNOPENED", "QUEUED INGEST", "SHOEBOX STILL CLOSED", "NOT IN THIS MOCK", "LABEL ONLY", "HELD"] as const;
const MUTE_FORMATS: TapeFormat[] = ["MINIDV", "HI8", "VHS", "DIGITAL", "PHONE"];

function muteShells(format: TapeFormat | "ALL") {
  const formats = format === "ALL" ? MUTE_FORMATS : [format];
  const count = format === "ALL" ? 12 : 6;
  return Array.from({ length: count }, (_, i) => ({
    format: formats[i % formats.length],
    label: MUTE_WORDS[i % MUTE_WORDS.length],
  }));
}

function requestedOpenId(raw: string | null) {
  if (!raw) return null;
  if (raw === "t-broadcast") {
    const year = getTape("t-broadcast")?.year;
    return year ? broadcastYearKey(year) : null;
  }
  return raw;
}

type Sheet = { left: number; top: number; width: number };
type Cam = { x: number; y: number };

function density(tapeId: string) {
  const frames = clipsOnTape(tapeId);
  const unlogged = frames.filter((c) => isUnlogged(c)).length;
  return { logged: frames.length - unlogged, unlogged };
}

export function TapeMosaic() {
  const search = useSearchParams();
  const [format, setFormat] = useState<(typeof FORMATS)[number]>("ALL");
  const [openId, setOpenId] = useState<string | null>(() => requestedOpenId(search.get("open")));
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [cam, setCam] = useState<Cam>({ x: 50, y: 40 });
  const [walking, setWalking] = useState(false);
  const [arrived, setArrived] = useState(false);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const compact = useIsCompact();
  const years = useMemo(() => broadcastYears(), []);
  const tapes = useMemo(() => {
    const list = catalog.tapes.filter((t) => format === "ALL" || t.format === format);
    const extra = openId ? catalog.tapes.find((t) => t.id === openId) : undefined;
    if (extra && !list.some((t) => t.id === extra.id)) return [...list, extra];
    return list;
  }, [format, openId]);
  const openYear = openId ? parseBroadcastYearKey(openId) : null;
  const open =
    openYear != null
      ? broadcastYearTape(openYear)
      : (tapes.find((t) => t.id === openId) ?? catalog.tapes.find((t) => t.id === openId));
  const hold = open && openYear == null ? density(open.id) : null;
  const loc = open ? getLocation(open.locationId) : undefined;
  const openShelf: ShelfKey | null = openYear != null ? "broadcast" : open ? shelfOf(open) : null;
  const broadcastOpen = openYear != null;
  const ghosts = useMemo(() => muteShells(format), [format]);
  const flat = compact || reduced;

  const bays = useMemo(() => {
    return shelfBays()
      .map((bay) => {
        if (bay.key === "broadcast") {
          const show = format === "ALL" || format === "DIGITAL";
          return {
            ...bay,
            tapes: show ? years.map((row) => broadcastYearTape(row.year)).filter((t): t is SourceTape => Boolean(t)) : [],
          };
        }
        return {
          ...bay,
          tapes: tapes.filter((t) => t.id !== "t-broadcast" && shelfOf(t) === bay.key),
        };
      })
      .filter((bay) => bay.tapes.length > 0);
  }, [tapes, format, years]);

  function measureCam(id: string) {
    const mosaic = mosaicRef.current;
    const cell = document.getElementById(`tape-cell-${id}`);
    if (!mosaic || !cell) return;
    const mr = mosaic.getBoundingClientRect();
    const cr = cell.getBoundingClientRect();
    const ox = ((cr.left + cr.width / 2 - mr.left) / Math.max(mr.width, 1)) * 100;
    const oy = ((cr.top + cr.height / 2 - mr.top) / Math.max(mr.height, 1)) * 100;
    setCam({ x: Number.isFinite(ox) ? ox : 50, y: Number.isFinite(oy) ? oy : 40 });
  }

  function measureSheet(id: string) {
    const field = fieldRef.current;
    const cell = document.getElementById(`tape-cell-${id}`);
    if (!field || !cell) return;
    const target = cell.querySelector(".tape-pulled, .tape-object-face") ?? cell;
    const fr = field.getBoundingClientRect();
    const cr = target.getBoundingClientRect();
    if (compact) {
      setSheet({ left: 0, top: Math.max(0, cr.bottom - fr.top + 14), width: fr.width });
      return;
    }
    const width = Math.min(fr.width - 24, 320);
    const left = Math.max(12, Math.min(cr.left - fr.left, fr.width - width - 12));
    setSheet({ left, top: Math.max(12, cr.bottom - fr.top + 16), width });
  }

  function openTape(id: string) {
    setOpenId(id);
    playEngage();
  }

  useEffect(() => {
    const id = search.get("open");
    if (!id) return;
    if (id === "t-broadcast") {
      const year = getTape("t-broadcast")?.year ?? years[0]?.year;
      if (year) setOpenId(`broadcast-${year}`);
      return;
    }
    setOpenId(id);
  }, [search, years]);

  useEffect(() => {
    if (!openId) {
      setWalking(false);
      setArrived(false);
      return;
    }
    const instant = reduced || compact;
    setWalking(!instant);
    setArrived(instant);
    if (instant) return;
    const walk = window.setTimeout(() => setWalking(false), 820);
    const lock = window.setTimeout(() => setArrived(true), 560);
    return () => {
      window.clearTimeout(walk);
      window.clearTimeout(lock);
    };
  }, [openId, reduced, compact]);

  useLayoutEffect(() => {
    if (!openId) {
      setSheet(null);
      return;
    }
    measureCam(openId);
    if (!(arrived || compact || reduced)) return;
    measureSheet(openId);
    const lock = window.setTimeout(() => measureSheet(openId), 240);
    return () => {
      window.clearTimeout(lock);
    };
  }, [openId, compact, format, arrived, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.key !== "Escape" || !openId) return;
      if (e.shiftKey) return;
      e.preventDefault();
      e.stopPropagation();
      setOpenId(null);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [openId]);

  useEffect(() => {
    if (!openId) return;
    const node = document.getElementById(`tape-cell-${openId}`);
    if (!node) return;
    const r = node.getBoundingClientRect();
    const inView = r.top >= 72 && r.bottom <= window.innerHeight - 48;
    if (inView) return;
    node.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }, [openId, reduced]);

  const ghostSplit = splitRack(ghosts);

  return (
    <div className="px-4 pb-24 md:px-6">
      <h1 className="sr-only">The Tapes</h1>
      <div className="hand-strip flex flex-wrap gap-4 pt-4" role="tablist" aria-label="Tape format">
        {FORMATS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={format === f}
            onClick={() => {
              setFormat(f);
              setOpenId(null);
            }}
            className={`font-cond text-[13px] tracking-[0.18em] ${format === f ? "text-paper" : "text-dust hover:text-paper"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        ref={fieldRef}
        className={`aisle-field relative mt-8 ${reduced ? "is-still" : ""}${openId ? " is-open" : ""}`}
        style={{ perspective: reduced || compact ? undefined : 1480, perspectiveOrigin: reduced || compact ? undefined : openId ? `${cam.x}% ${cam.y}%` : "50% 28%" }}
      >
        <motion.div
          ref={mosaicRef}
          className={`aisle-cam aisle relative space-y-10${openId ? " is-open" : ""}${compact ? " is-compact" : ""}${walking ? " is-walking" : ""}`}
          initial={false}
          animate={
            reduced || compact
              ? { rotateX: 0, rotateY: 0, x: 0, y: 0, z: 0, scale: 1 }
              : {
                  rotateX: openId ? 2.4 : 0,
                  rotateY: openId ? (50 - cam.x) * 0.035 : 0,
                  x: openId ? (50 - cam.x) * 1.15 : 0,
                  y: openId ? (38 - cam.y) * 0.7 : 0,
                  z: openId ? 64 : 0,
                  scale: 1,
                }
          }
          style={
            reduced || compact
              ? { transform: "none" }
              : { transformOrigin: `${cam.x}% ${cam.y}%`, transformStyle: "preserve-3d", willChange: walking ? "transform" : undefined }
          }
          transition={{ duration: 0.82, ease: [0.4, 0, 0.2, 1] }}
        >
          {openId && !reduced ? (
            <div
              className="aisle-veil"
              style={{
                background: `radial-gradient(ellipse at ${cam.x}% ${cam.y}%, rgba(7,7,6,0) 18%, rgba(7,7,6,0.2) 54%, rgba(7,7,6,0.56) 100%)`,
              }}
            />
          ) : null}
          {!openId && !reduced ? <div className="aisle-haze" /> : null}

          {bays.map((bay, i) => {
            const recede = Boolean(openId && openShelf !== bay.key);
            const walls = splitRack(bay.tapes);
            return (
              <TapeShelf
                key={bay.key}
                label={bay.label}
                note={bay.note}
                recede={recede}
                approach={Boolean(openId && openShelf === bay.key)}
                reduced={reduced}
                compact={compact}
                depth={i}
                left={
                  flat
                    ? bay.tapes.map((tape) => (
                        <ShelfCassette
                          key={tape.id}
                          tape={tape}
                          openId={openId}
                          reduced={reduced}
                          compact={compact}
                          wall="left"
                          onOpen={() => openTape(tape.id)}
                          onClose={() => setOpenId(null)}
                        />
                      ))
                    : [
                        ...walls.left.map((tape) => (
                          <ShelfCassette
                            key={tape.id}
                            tape={tape}
                            openId={openId}
                            reduced={reduced}
                            compact={compact}
                            wall="left"
                            onOpen={() => openTape(tape.id)}
                            onClose={() => setOpenId(null)}
                          />
                        )),
                        ...Array.from({ length: emptyFill(walls.left.length) }, (_, n) => (
                          <EmptySlot key={`${bay.key}-el-${n}`} />
                        )),
                      ]
                }
                right={
                  flat
                    ? undefined
                    : [
                        ...walls.right.map((tape) => (
                          <ShelfCassette
                            key={tape.id}
                            tape={tape}
                            openId={openId}
                            reduced={reduced}
                            compact={compact}
                            wall="right"
                            onOpen={() => openTape(tape.id)}
                            onClose={() => setOpenId(null)}
                          />
                        )),
                        ...Array.from({ length: emptyFill(walls.right.length) }, (_, n) => (
                          <EmptySlot key={`${bay.key}-er-${n}`} />
                        )),
                      ]
                }
              />
            );
          })}

          {ghosts.length ? (
            <TapeShelf
              label="UNOPENED"
              note="NOT IN THIS MOCK"
              recede={Boolean(openId)}
              reduced={reduced}
              compact={compact}
              depth={bays.length}
              left={
                flat
                  ? ghosts.map((ghost, i) => <UnopenedShell key={`ghost-${i}`} format={ghost.format} label={ghost.label} />)
                  : [
                      ...ghostSplit.left.map((ghost, i) => (
                        <UnopenedShell key={`ghost-l-${i}`} format={ghost.format} label={ghost.label} />
                      )),
                      ...Array.from({ length: emptyFill(ghostSplit.left.length) }, (_, n) => (
                        <EmptySlot key={`ghost-el-${n}`} />
                      )),
                    ]
              }
              right={
                flat
                  ? undefined
                  : [
                      ...ghostSplit.right.map((ghost, i) => (
                        <UnopenedShell key={`ghost-r-${i}`} format={ghost.format} label={ghost.label} />
                      )),
                      ...Array.from({ length: emptyFill(ghostSplit.right.length) }, (_, n) => (
                        <EmptySlot key={`ghost-er-${n}`} />
                      )),
                    ]
              }
            />
          ) : null}

        </motion.div>

        <AnimatePresence>
          {open && sheet && arrived ? (
            <motion.div
              key={open.id}
              className="aisle-sheet"
              style={{ left: sheet.left, top: sheet.top, width: sheet.width }}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: EASE_GATE }}
            >
              <div className="aisle-sheet-panel">
                {broadcastOpen ? (
                  <p className="aisle-sheet-hold">PUBLIC BROADCAST</p>
                ) : hold ? (
                  <p className="aisle-sheet-hold">
                    {hold.logged} LOGGED · {hold.unlogged} UNLOGGED
                  </p>
                ) : null}
                <p className="aisle-sheet-meta">
                  {open.code} · {loc?.name?.toUpperCase()} · {open.recordedApproximate ?? open.recordedDate}
                </p>
                <Link
                  href={broadcastOpen ? "/tapes/t-broadcast" : `/tapes/${open.id}`}
                  className="aisle-sheet-open"
                >
                  OPEN THE FILE
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ShelfCassette({
  tape,
  openId,
  reduced,
  compact,
  wall,
  onOpen,
  onClose,
}: {
  tape: SourceTape;
  openId: string | null;
  reduced: boolean;
  compact: boolean;
  wall: "left" | "right";
  onOpen: () => void;
  onClose: () => void;
}) {
  const active = openId === tape.id;
  const yearCassette = parseBroadcastYearKey(tape.id) != null;
  const counts = yearCassette ? { logged: undefined as number | undefined, unlogged: undefined as number | undefined } : density(tape.id);
  const stamp = yearCassette ? "" : densityStamp(counts.logged, counts.unlogged);
  const flat = compact || reduced;

  return (
    <div
      id={`tape-cell-${tape.id}`}
      className={`tape-slot ${wall === "right" ? "tape-slot-right" : "tape-slot-left"}${active ? " is-lit" : ""} scroll-mt-28`}
    >
      <button
        type="button"
        onClick={active ? onClose : onOpen}
        className="tape-hit"
        aria-expanded={active}
        aria-label={
          yearCassette ? `${tape.code}, ${tape.year}` : `${tape.code}, ${tape.originalLabel}`
        }
      >
        <div className={flat ? "tape-flat" : undefined}>
          <TapeSpine
            format={tape.format}
            code={tape.code}
            year={tape.year}
            density={stamp}
            lit={active}
          />
          {active ? (
            <div className={flat ? "tape-object-face tape-pulled" : "tape-pulled"}>
              <TapeObject tape={tape} logged={counts.logged} unlogged={counts.unlogged} lit onShelf />
            </div>
          ) : null}
        </div>
      </button>
    </div>
  );
}
