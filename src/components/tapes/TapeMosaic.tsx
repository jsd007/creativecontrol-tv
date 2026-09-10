"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { catalog, clipsOnTape, getLocation, getTape } from "@/data";
import type { SourceTape, TapeFormat } from "@/data/types";
import { isUnlogged } from "@/lib/clipDisplay";
import { broadcastYearKey, broadcastYears, broadcastYearTape, parseBroadcastYearKey } from "@/lib/holdings";
import { EmptySlot, TapeObject, TapeSpine, UnopenedShell } from "./TapeObject";
import { shelfBays, shelfOf, splitRack, TapeShelf, type ShelfKey } from "./TapeShelf";
import { isActionTarget, isTypingTarget } from "@/lib/keys";
import { EASE_GATE, useIsNarrow, usePrefersReducedMotion } from "@/lib/motion";
import { playEngage } from "@/lib/sound";
import "./aisle.css";

const FORMATS: Array<TapeFormat | "ALL"> = ["ALL", "MINIDV", "HI8", "VHS", "DIGITAL", "PHONE"];

const MUTE_WORDS = ["UNOPENED", "QUEUED INGEST", "SHOEBOX STILL CLOSED", "NOT IN THIS MOCK", "LABEL ONLY", "HELD"] as const;
const MUTE_FORMATS: TapeFormat[] = ["MINIDV", "HI8", "VHS", "DIGITAL", "PHONE"];

function muteShells(format: TapeFormat | "ALL") {
  const formats = format === "ALL" ? MUTE_FORMATS : [format];
  const count = format === "ALL" ? 22 : 10;
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

function fileHref(id: string) {
  return parseBroadcastYearKey(id) != null ? "/tapes/t-broadcast" : `/tapes/${id}`;
}

export function TapeMosaic() {
  const search = useSearchParams();
  const router = useRouter();
  const [format, setFormat] = useState<(typeof FORMATS)[number]>("ALL");
  const openId = requestedOpenId(search.get("open"));
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [cam, setCam] = useState<Cam>({ x: 50, y: 40 });
  const [walking, setWalking] = useState(false);
  const [arrived, setArrived] = useState(false);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const narrow = useIsNarrow();
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
  const flat = narrow || reduced;

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

  const walkIds = useMemo(() => {
    const ids: string[] = [];
    for (const bay of bays) {
      if (flat) {
        ids.push(...bay.tapes.map((tape) => tape.id));
        continue;
      }
      const walls = splitRack(bay.tapes);
      ids.push(...walls.left.map((tape) => tape.id), ...walls.right.map((tape) => tape.id));
    }
    return ids;
  }, [bays, flat]);

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
    if (narrow) {
      setSheet({ left: 0, top: Math.max(0, cr.bottom - fr.top + 14), width: fr.width });
      return;
    }
    const width = Math.min(fr.width - 24, 320);
    const left = Math.max(12, Math.min(cr.left - fr.left, fr.width - width - 12));
    setSheet({ left, top: Math.max(12, cr.bottom - fr.top + 16), width });
  }

  const walked = useRef(false);

  function writeOpen(id: string | null) {
    const next = new URLSearchParams(search.toString());
    if (id) next.set("open", id);
    else next.delete("open");
    const q = next.toString();
    router.replace(q ? `/tapes?${q}` : "/tapes", { scroll: false });
  }

  function openTape(id: string) {
    writeOpen(id);
    playEngage();
  }

  function closeTape() {
    writeOpen(null);
  }

  function walk(step: number) {
    if (!walkIds.length) return;
    const here = openId ? walkIds.indexOf(openId) : -1;
    const next =
      here === -1
        ? step > 0
          ? walkIds[0]
          : walkIds[walkIds.length - 1]
        : walkIds[(here + step + walkIds.length) % walkIds.length];
    if (!next) return;
    walked.current = true;
    openTape(next);
  }

  useEffect(() => {
    if (!openId) {
      setWalking(false);
      setArrived(false);
      return;
    }
    const instant = reduced || narrow;
    setWalking(!instant);
    setArrived(instant);
    if (instant) return;
    const walkTimer = window.setTimeout(() => setWalking(false), 820);
    const lock = window.setTimeout(() => setArrived(true), 560);
    return () => {
      window.clearTimeout(walkTimer);
      window.clearTimeout(lock);
    };
  }, [openId, reduced, narrow]);

  useLayoutEffect(() => {
    if (!openId) {
      setSheet(null);
      return;
    }
    measureCam(openId);
    if (!(arrived || narrow || reduced)) return;
    measureSheet(openId);
    const lock = window.setTimeout(() => measureSheet(openId), 240);
    return () => {
      window.clearTimeout(lock);
    };
  }, [openId, narrow, format, arrived, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.key === "Escape" && openId && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        closeTape();
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        walk(1);
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        walk(-1);
        return;
      }
      if (e.key === "Enter" && openId && !isActionTarget(e.target)) {
        e.preventDefault();
        router.push(fileHref(openId));
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  });

  useEffect(() => {
    if (!openId) return;
    const node = document.getElementById(`tape-cell-${openId}`);
    if (!node) return;
    const r = node.getBoundingClientRect();
    const inView = r.top >= 72 && r.bottom <= window.innerHeight - 48;
    if (!inView) node.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    if (!walked.current) return;
    walked.current = false;
    const hit = node.querySelector<HTMLButtonElement>(".tape-hit");
    hit?.focus({ preventScroll: true });
  }, [openId, reduced]);

  const ghostSplit = splitRack(ghosts);

  return (
    <div className="px-4 pb-24 md:px-6">
      <h1 className="sr-only">The Tapes</h1>
      <div className="aisle-formats" role="group" aria-label="Tape format">
        {FORMATS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={format === f}
            onClick={() => {
              setFormat(f);
              closeTape();
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div
        ref={fieldRef}
        className={`aisle-field relative mt-8 ${reduced ? "is-still" : ""}${openId ? " is-open" : ""}`}
        style={{
          perspective: reduced || narrow ? undefined : 1680,
          perspectiveOrigin: reduced || narrow ? undefined : openId ? `${cam.x}% ${cam.y}%` : "50% 22%",
        }}
      >
        <motion.div
          ref={mosaicRef}
          className={`aisle-cam aisle relative space-y-12${openId ? " is-open" : ""}${narrow ? " is-compact" : ""}${walking ? " is-walking" : ""}`}
          initial={false}
          animate={
            reduced || narrow
              ? { rotateX: 0, rotateY: 0, x: 0, y: 0, z: 0, scale: 1 }
              : {
                  rotateX: openId ? 3 : 1.4,
                  rotateY: openId ? (50 - cam.x) * 0.032 : 0,
                  x: openId ? (50 - cam.x) * 0.95 : 0,
                  y: openId ? (34 - cam.y) * 0.5 : 0,
                  z: openId ? 52 : 0,
                  scale: 1,
                }
          }
          style={
            reduced || narrow
              ? { transform: "none" }
              : { transformOrigin: `${cam.x}% ${cam.y}%`, transformStyle: "preserve-3d", willChange: walking ? "transform" : undefined }
          }
          transition={{ duration: 0.82, ease: [0.4, 0, 0.2, 1] }}
        >
          {openId && !reduced ? (
            <div
              className="aisle-veil"
              style={{
                background: `radial-gradient(ellipse at ${cam.x}% ${cam.y}%, transparent 16%, color-mix(in srgb, var(--void) 28%, transparent) 52%, color-mix(in srgb, var(--void) 62%, transparent) 100%)`,
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
                compact={narrow}
                depth={i}
                left={
                  flat
                    ? bay.tapes.map((tape) => (
                        <ShelfCassette
                          key={tape.id}
                          tape={tape}
                          openId={openId}
                          reduced={reduced}
                          compact={narrow}
                          wall="left"
                          onOpen={() => openTape(tape.id)}
                          onClose={closeTape}
                        />
                      ))
                    : walls.left.map((tape) => (
                        <ShelfCassette
                          key={tape.id}
                          tape={tape}
                          openId={openId}
                          reduced={reduced}
                          compact={narrow}
                          wall="left"
                          onOpen={() => openTape(tape.id)}
                          onClose={closeTape}
                        />
                      ))
                }
                right={
                  flat
                    ? undefined
                    : walls.right.map((tape) => (
                        <ShelfCassette
                          key={tape.id}
                          tape={tape}
                          openId={openId}
                          reduced={reduced}
                          compact={narrow}
                          wall="right"
                          onOpen={() => openTape(tape.id)}
                          onClose={closeTape}
                        />
                      ))
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
              compact={narrow}
              depth={bays.length}
              left={
                flat
                  ? [
                      ...ghosts.map((ghost, i) => <UnopenedShell key={`ghost-${i}`} format={ghost.format} label={ghost.label} />),
                      ...Array.from({ length: 6 }, (_, n) => <EmptySlot key={`ghost-ef-${n}`} fade={1 - n / 6} />),
                    ]
                  : [
                      ...ghostSplit.left.map((ghost, i) => (
                        <UnopenedShell key={`ghost-l-${i}`} format={ghost.format} label={ghost.label} />
                      )),
                      ...Array.from({ length: 5 }, (_, n) => <EmptySlot key={`ghost-el-${n}`} fade={1 - n / 5} />),
                    ]
              }
              right={
                flat
                  ? undefined
                  : [
                      ...ghostSplit.right.map((ghost, i) => (
                        <UnopenedShell key={`ghost-r-${i}`} format={ghost.format} label={ghost.label} />
                      )),
                      ...Array.from({ length: 5 }, (_, n) => <EmptySlot key={`ghost-er-${n}`} fade={1 - n / 5} />),
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
                  <p className="aisle-sheet-hold is-broadcast">PUBLIC BROADCAST</p>
                ) : hold ? (
                  <p className="aisle-sheet-hold">
                    <span className="is-logged">{hold.logged} LOGGED</span>
                    {" · "}
                    {hold.unlogged} UNLOGGED
                  </p>
                ) : null}
                <p className="aisle-sheet-meta">
                  {open.code} · {loc?.name?.toUpperCase()} · {open.recordedApproximate ?? open.recordedDate}
                </p>
                <Link href={broadcastOpen ? "/tapes/t-broadcast" : `/tapes/${open.id}`} className="aisle-sheet-open">
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
  const flat = compact || reduced;
  const slot = `tape-slot-${tape.format.toLowerCase()}`;

  return (
    <div
      id={`tape-cell-${tape.id}`}
      className={`tape-slot ${slot} ${wall === "right" ? "tape-slot-right" : "tape-slot-left"}${active ? " is-lit" : ""} scroll-mt-28`}
    >
      <button
        type="button"
        onClick={active ? onClose : onOpen}
        className="tape-hit"
        aria-expanded={active}
        aria-label={yearCassette ? `${tape.year}` : `${tape.code}, ${tape.originalLabel}`}
      >
        <div className={flat ? "tape-flat" : undefined}>
          <TapeSpine
            format={tape.format}
            code={yearCassette ? String(tape.year) : tape.code}
            year={yearCassette ? undefined : tape.year}
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
