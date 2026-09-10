"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { programTitle } from "@/lib/clipDisplay";
import { isTypingTarget } from "@/lib/keys";
import { MOTION, usePrefersReducedMotion } from "@/lib/motion";
import { playSwitch } from "@/lib/sound";
import {
  CHANNELS,
  channelLineup,
  daypart,
  guideSections,
  officialBlock,
  programmedBlocks,
  programmedTitles,
} from "@/lib/television";
import { ChannelStage } from "./ChannelStage";
import { Guide } from "./Guide";
import { Ident } from "./Ident";
import { Tuner } from "./Tuner";

function clockLabel() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

function channelFromSearch(search: { get: (key: string) => string | null }) {
  const n = Number(search.get("ch"));
  return Number.isFinite(n) && n >= 0 && n <= 8 ? n : 0;
}

export function Television() {
  const search = useSearchParams();
  const [ch, setCh] = useState(() => channelFromSearch(search));
  const [slot, setSlot] = useState(0);
  const [switching, setSwitching] = useState(false);
  const [clock, setClock] = useState("00:00:00");
  const reduced = usePrefersReducedMotion();
  const acquireTimer = useRef(0);
  const chRef = useRef(ch);
  chRef.current = ch;

  const boards = useMemo(() => CHANNELS.map((channel) => channelLineup(channel)), []);
  /** What the tuner promises is what the guide can hand you — titled programs, not raw holdings. */
  const counts = useMemo(() => boards.map((board) => board.filter((clip) => programTitle(clip)).length), [boards]);
  const channel = CHANNELS[ch];
  const lineup = boards[ch];
  const now = lineup[slot % lineup.length];
  const next = lineup[(slot + 1) % lineup.length];
  const sections = useMemo(() => guideSections(channel, lineup), [channel, lineup]);
  const titles = useMemo(
    () => (channel.id === "broadcast" ? programmedBlocks(lineup) : programmedTitles(lineup)),
    [channel, lineup],
  );

  function acquire(ms: number) {
    if (reduced) return;
    playSwitch();
    setSwitching(true);
    window.clearTimeout(acquireTimer.current);
    acquireTimer.current = window.setTimeout(() => setSwitching(false), ms);
  }

  function goChannel(n: number) {
    const nextCh = ((n % CHANNELS.length) + CHANNELS.length) % CHANNELS.length;
    if (nextCh === chRef.current) {
      if (slot !== 0) {
        setSlot(0);
        acquire(MOTION.acquireMs);
      }
      return;
    }
    setCh(nextCh);
    setSlot(0);
    acquire(MOTION.acquireMs);
  }

  function surf() {
    setSlot((s) => s + 1);
    acquire(MOTION.surfMs);
  }

  function tuneSlot(index: number) {
    if (index < 0 || index === slot) return;
    setSlot(index);
    acquire(MOTION.surfMs);
  }

  useEffect(() => {
    setClock(clockLabel());
    const id = window.setInterval(() => setClock(clockLabel()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const raw = search.get("ch");
    if (raw == null) return;
    const n = Number(raw);
    if (Number.isFinite(n) && n >= 0 && n <= 8 && n !== chRef.current) goChannel(n);
  }, [search]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.target instanceof Element && e.target.closest("[data-guide]") && e.key.startsWith("Arrow")) return;
      if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        e.preventDefault();
        goChannel(chRef.current + 1);
      }
      if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        e.preventDefault();
        goChannel(chRef.current - 1);
      }
      if (/^[0-8]$/.test(e.key)) {
        goChannel(Number(e.key));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reduced, slot]);

  useEffect(() => () => window.clearTimeout(acquireTimer.current), []);

  const onTitle = now ? programTitle(now) : "";
  const nextTitle = next ? programTitle(next) : "";
  const nowMark =
    channel.id === "broadcast" && now
      ? officialBlock(now)
      : now && daypart(now) !== channel.name
        ? daypart(now)
        : "";

  return (
    <div className="television px-4 pb-24 md:px-6">
      <Ident channel={channel} clock={clock} titles={titles} onTitle={onTitle} reduced={reduced} />
      <Tuner ch={ch} counts={counts} reduced={reduced} onPick={goChannel} />
      <div className="mt-4">
        <ChannelStage
          channel={channel}
          now={now}
          next={next}
          onTitle={onTitle}
          nextTitle={nextTitle}
          nowMark={nowMark}
          switching={switching}
          reduced={reduced}
          onSurf={surf}
        />
      </div>
      <Guide channel={channel} sections={sections} lineup={lineup} nowId={now?.id} onTune={tuneSlot} />
    </div>
  );
}
