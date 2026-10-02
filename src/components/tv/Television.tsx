"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { programTitle } from "@/lib/clipDisplay";
import { isTypingTarget } from "@/lib/keys";
import { MOTION, usePrefersReducedMotion } from "@/lib/motion";
import { playSwitch } from "@/lib/sound";
import { playbackSession } from "@/lib/playbackSession";
import { ALL_PROGRAMS, tvChannel, tvHref, tvNeighbors, tvSelection, type TVProgram } from "@/lib/tvNavigation";
import { availableViewingJourneys } from "@/lib/viewingJourneys";
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
import { ViewingJourneys } from "./ViewingJourneys";

const JOURNEYS = availableViewingJourneys();

function clockLabel() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

/** CH 07 is the channel with the content. The house cuts are siblings, not the front door. */
const DEFAULT_CH = CHANNELS.findIndex((c) => c.id === "broadcast");
const BROADCAST_OPENER = "wiki-wikispeaks";

function openingSlot(channel: (typeof CHANNELS)[number], lineup: ReturnType<typeof channelLineup>) {
  return channel.id === "broadcast" ? Math.max(0, lineup.findIndex((clip) => clip.slug === BROADCAST_OPENER)) : 0;
}

function navigate(patch: Record<string, string | null>, replace = false) {
  const href = tvHref(window.location.search, patch);
  if (href === `${window.location.pathname}${window.location.search}`) return;
  // Next's native-history integration updates useSearchParams without reloading the player.
  if (replace) window.history.replaceState(null, "", href);
  else window.history.pushState(null, "", href);
}

export function Television() {
  const search = useSearchParams();
  const ch = tvChannel(search.get("ch"), CHANNELS.length, DEFAULT_CH);
  const [switching, setSwitching] = useState(false);
  const [clock, setClock] = useState("00:00:00");
  const [autoplay, setAutoplay] = useState(false);
  const [playRequest, setPlayRequest] = useState(0);
  const reduced = usePrefersReducedMotion();
  const acquireTimer = useRef(0);
  const screen = useRef<HTMLDivElement>(null);
  const focusScreen = useRef(false);

  const boards = useMemo(() => CHANNELS.map((channel) => channelLineup(channel)), []);
  /** What the tuner promises is what the guide can hand you — titled programs, not raw holdings. */
  const counts = useMemo(() => boards.map((board) => board.filter((clip) => programTitle(clip)).length), [boards]);
  const channel = CHANNELS[ch];
  const lineup = boards[ch];
  const rawJourney = search.get("journey");
  const journey = channel.id === "broadcast" && !search.get("block") && !search.get("q")?.trim()
    ? JOURNEYS.find((item) => item.id === rawJourney)
    : undefined;
  const selectedSlot = lineup.findIndex((clip) => clip.slug === search.get("clip"));
  const journeyFirstSlot = journey ? lineup.findIndex((clip) => clip.id === journey.clipIds[0]) : -1;
  const defaultSlot = journeyFirstSlot >= 0 ? journeyFirstSlot : openingSlot(channel, lineup);
  const slot = selectedSlot >= 0 ? selectedSlot : defaultSlot;
  const now = lineup[slot];
  const sections = useMemo(() => guideSections(channel, lineup), [channel, lineup]);
  const programs = useMemo<TVProgram[]>(() => sections.flatMap((section) => section.rows.map((clip) => ({
    clip, title: programTitle(clip), block: section.section, index: lineup.indexOf(clip),
  }))), [sections, lineup]);
  const rawBlock = search.get("block") ?? "";
  const block = rawBlock === ALL_PROGRAMS || sections.some((section) => section.section === rawBlock) ? rawBlock : "";
  const find = (search.get("q") ?? "").slice(0, 120);
  const rawPage = Number(search.get("page") ?? 0);
  const page = Number.isSafeInteger(rawPage) && rawPage >= 0 ? rawPage : 0;
  const results = useMemo(() => tvSelection(programs, channel.id === "broadcast", block, find, journey?.clipIds), [programs, channel.id, block, find, journey]);
  const { previous, next, position } = tvNeighbors(results, now?.id);
  const selectionLabel = journey?.title ?? (find.trim() ? `Search: ${find.trim()}` : block === ALL_PROGRAMS ? "All broadcasts" : block || (channel.id === "broadcast" ? "Six starting points" : channel.name));
  const programLink = tvHref(search.toString(), { ch: channel.n, clip: now?.slug ?? null, journey: journey?.id ?? null });
  const titles = useMemo(
    () => (channel.id === "broadcast" ? programmedBlocks(lineup) : programmedTitles(lineup)),
    [channel, lineup],
  );

  const acquire = useCallback((ms: number) => {
    if (reduced) return;
    playSwitch();
    setSwitching(true);
    window.clearTimeout(acquireTimer.current);
    acquireTimer.current = window.setTimeout(() => setSwitching(false), ms);
  }, [reduced]);

  // A tuner/program action is intent to watch, unlike filtering or opening this page.
  const requestPlayback = useCallback(() => {
    playbackSession.engage();
    setAutoplay(true);
    setPlayRequest((request) => request + 1);
  }, []);

  const goChannel = useCallback((n: number) => {
    const nextCh = ((n % CHANNELS.length) + CHANNELS.length) % CHANNELS.length;
    requestPlayback();
    if (nextCh === ch && !journey) return;
    focusScreen.current = window.matchMedia("(max-width: 1000px)").matches;
    const firstSlot = openingSlot(CHANNELS[nextCh], boards[nextCh]);
    navigate({ ch: CHANNELS[nextCh].n, clip: boards[nextCh][firstSlot]?.slug ?? null, journey: null, block: null, q: null, page: null });
    acquire(MOTION.acquireMs);
  }, [boards, ch, acquire, journey, requestPlayback]);

  function tuneSlot(index: number) {
    const clip = lineup[index];
    if (!clip) return;
    requestPlayback();
    const reveal = window.matchMedia("(max-width: 1000px)").matches;
    if (index === slot) {
      if (reveal) screen.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
      return;
    }
    focusScreen.current = reveal;
    const resultIndex = results.findIndex((row) => row.clip.id === clip.id);
    navigate({ ch: channel.n, clip: clip.slug, page: resultIndex >= 8 ? String(Math.floor(resultIndex / 8)) : null });
    acquire(MOTION.surfMs);
  }

  function startJourney(id: string) {
    const selected = JOURNEYS.find((item) => item.id === id);
    if (!selected) return;
    requestPlayback();
    focusScreen.current = window.matchMedia("(max-width: 1000px)").matches;
    navigate({ ch: "07", clip: selected.clips[0].slug, journey: selected.id, block: null, q: null, page: null });
    acquire(MOTION.surfMs);
  }

  function leaveJourney() {
    const resultIndex = programs.findIndex((row) => row.clip.id === now?.id);
    navigate({ journey: null, block: ALL_PROGRAMS, q: null, page: resultIndex >= 8 ? String(Math.floor(resultIndex / 8)) : null });
  }

  function tunePair(slug: string) {
    const broadcastChannel = CHANNELS[DEFAULT_CH];
    const broadcastLineup = boards[DEFAULT_CH];
    const broadcastPrograms = guideSections(broadcastChannel, broadcastLineup).flatMap((section) => section.rows);
    const resultIndex = broadcastPrograms.findIndex((clip) => clip.slug === slug);
    if (resultIndex < 0) return;
    requestPlayback();
    if (now?.slug === slug) return;
    focusScreen.current = window.matchMedia("(max-width: 1000px)").matches;
    navigate({ ch: "07", clip: slug, journey: null, block: ALL_PROGRAMS, q: null, page: resultIndex >= 8 ? String(Math.floor(resultIndex / 8)) : null });
    acquire(MOTION.surfMs);
  }

  useEffect(() => {
    if (!focusScreen.current) return;
    focusScreen.current = false;
    screen.current?.querySelector<HTMLHeadingElement>("h2")?.focus({ preventScroll: true });
    screen.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }, [now?.id, reduced]);

  useEffect(() => {
    setClock(clockLabel());
    const id = window.setInterval(() => setClock(clockLabel()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || isTypingTarget(e.target)) return;
      if (e.target instanceof Element && e.target.closest("[data-guide]") && e.key.startsWith("Arrow")) return;
      if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        e.preventDefault();
        goChannel(ch + 1);
      }
      if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        e.preventDefault();
        goChannel(ch - 1);
      }
      if (/^[0-8]$/.test(e.key)) {
        goChannel(Number(e.key));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ch, goChannel]);

  useEffect(() => () => window.clearTimeout(acquireTimer.current), []);

  const onTitle = now ? programTitle(now) : "";
  const nowMark =
    now ? channel.selection ? "PUBLIC SELECTION" : channel.id === "broadcast" ? officialBlock(now) : daypart(now) : "";

  return (
    <div className="television px-4 pb-24 md:px-6">
      <Ident channel={channel} clock={clock} titles={titles} onTitle={onTitle} reduced={reduced} />
      <Tuner ch={ch} counts={counts} reduced={reduced} onPick={goChannel} />
      <div className="tv-program-layout">
        <div ref={screen} id="tv-screen" className="tv-screen">
          <ChannelStage
            channel={channel}
            now={now}
            next={next?.clip}
            previous={previous?.clip}
            onTitle={onTitle}
            nextTitle={next?.title ?? ""}
            previousTitle={previous?.title ?? ""}
            selectionLabel={selectionLabel}
            position={position}
            total={results.length}
            programLink={programLink}
            nowMark={nowMark}
            switching={switching}
            reduced={reduced}
            onNext={() => next && tuneSlot(next.index)}
            onPrevious={() => previous && tuneSlot(previous.index)}
            onPairPick={tunePair}
            autoplay={autoplay}
            playRequest={playRequest}
            journeys={<ViewingJourneys journeys={JOURNEYS} active={journey} position={position} onPick={startJourney} onLeave={leaveJourney} />}
          />
        </div>
        <Guide channel={channel} sections={sections} programs={programs} results={results} find={find} block={block} page={page} programLink={programLink}
          journeyTitle={journey?.title} onLeaveJourney={leaveJourney}
          onFind={(value) => navigate({ q: value.slice(0, 120), block: value.trim() && !block && channel.id === "broadcast" ? ALL_PROGRAMS : block, journey: null, page: null }, true)}
          onBlock={(value) => navigate({ block: value, q: null, journey: null, page: null }, true)}
          onPage={(value) => navigate({ page: value ? String(value) : null }, true)}
          onReset={() => navigate({ q: null, block: null, journey: null, page: null }, true)}
          nowId={now?.id} onTune={tuneSlot} />
      </div>
    </div>
  );
}
