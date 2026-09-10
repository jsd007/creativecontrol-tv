"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { ArchiveClip } from "@/data/types";
import { programTitle } from "@/lib/clipDisplay";
import type { Channel, GuideSection } from "@/lib/television";
import { accentOnAir, guideNowClass } from "@/lib/television";

type Props = {
  channel: Channel;
  sections: GuideSection[];
  lineup: ArchiveClip[];
  nowId?: string;
  onTune: (index: number) => void;
};

type Row =
  | { kind: "mark"; key: string; label: string }
  | { kind: "title"; key: string; clip: ArchiveClip; title: string; index: number };

function matches(clip: ArchiveClip, title: string, find: string) {
  if (!find) return true;
  return `${title} ${clip.year}`.toLowerCase().includes(find);
}

export function Guide({ channel, sections, lineup, nowId, onTune }: Props) {
  const root = useRef<HTMLElement>(null);
  const [find, setFind] = useState("");

  /** One list. Every title on the channel, in air order, with the block as a quiet marker. */
  const { rows, shown, total } = useMemo(() => {
    const needle = find.trim().toLowerCase();
    const rows: Row[] = [];
    let shown = 0;
    let total = 0;
    for (const block of sections) {
      const hits: Row[] = [];
      for (const clip of block.rows) {
        const title = programTitle(clip);
        if (!title) continue;
        total += 1;
        if (!matches(clip, title, needle)) continue;
        shown += 1;
        hits.push({ kind: "title", key: clip.id, clip, title, index: lineup.indexOf(clip) });
      }
      if (!hits.length) continue;
      rows.push({ kind: "mark", key: `mark-${block.section}`, label: block.section });
      rows.push(...hits);
    }
    return { rows, shown, total };
  }, [sections, lineup, find]);

  function step(from: number, dir: 1 | -1) {
    const titles = rows.filter((r): r is Extract<Row, { kind: "title" }> => r.kind === "title");
    const at = titles.findIndex((r) => r.index === from);
    const next = titles[at + dir];
    if (!next) return;
    root.current
      ?.querySelector<HTMLElement>(`[data-guide-k="s:${next.index}"]`)
      ?.focus({ preventScroll: false });
  }

  function arrowKeys(e: KeyboardEvent, index: number) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      step(index, 1);
    }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      step(index, -1);
    }
  }

  return (
    <section ref={root} id="guide" className="tv-guide mt-12 scroll-mt-28" data-guide>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-paper/15 pb-2">
        <div>
          <p className="font-cond text-[12px] tracking-[0.22em] text-leader">GUIDE</p>
          <p className="mt-1 font-cond text-[13px] tracking-[0.12em] text-dust">{channel.voice}</p>
        </div>
        <div className="flex items-baseline gap-4">
          <p className="font-mono text-[11px] tracking-[0.14em] text-dust">
            {find.trim() ? `${shown} OF ${total}` : `${total} ${total === 1 ? "TITLE" : "TITLES"}`}
          </p>
          <input
            value={find}
            onChange={(e) => setFind(e.target.value)}
            type="search"
            placeholder="FIND A TITLE"
            aria-label="Find a title on this channel"
            className="tv-guide-find font-cond text-[13px] tracking-[0.12em]"
          />
        </div>
      </div>

      {rows.length ? (
        <div className="mt-1">
          {rows.map((row) =>
            row.kind === "mark" ? (
              <p key={row.key} className="tv-guide-mark font-cond text-[12px] tracking-[0.2em] text-leader">
                {row.label}
              </p>
            ) : (
              <TitleRow
                key={row.key}
                channel={channel}
                clip={row.clip}
                title={row.title}
                index={row.index}
                on={row.clip.id === nowId}
                onTune={onTune}
                onArrow={arrowKeys}
              />
            ),
          )}
        </div>
      ) : (
        <p className="mt-6 font-mono text-[11px] tracking-[0.18em] text-dust">NOTHING UNDER THAT NAME</p>
      )}

      {channel.id === "broadcast" && !find.trim() ? <BroadcastRemainder /> : null}
    </section>
  );
}

function TitleRow({
  channel,
  clip,
  title,
  index,
  on,
  onTune,
  onArrow,
}: {
  channel: Channel;
  clip: ArchiveClip;
  title: string;
  index: number;
  on: boolean;
  onTune: (index: number) => void;
  onArrow: (e: KeyboardEvent, index: number) => void;
}) {
  return (
    <div
      className={`grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-paper/10 py-2 ${
        on ? `${guideNowClass(channel.accent)} text-paper` : ""
      }`}
    >
      <span className={`font-cond text-[12px] tracking-[0.12em] ${on ? accentOnAir(channel.accent) : "text-dust"}`}>
        {on ? "ON" : clip.year}
      </span>
      <button
        type="button"
        data-guide-k={`s:${index}`}
        data-guide-i={index}
        aria-current={on ? "true" : undefined}
        onClick={() => onTune(index)}
        onKeyDown={(e) => onArrow(e, index)}
        className={`text-left font-sans text-[15px] leading-snug md:text-[16px] ${
          on ? "text-paper" : "text-bone hover:text-leader"
        }`}
      >
        {title}
      </button>
      <p className="hidden items-baseline gap-3 font-mono text-[12px] tracking-[0.08em] text-dust sm:flex">
        {clip.youtubeId ? null : <span>{clip.startTimecode}</span>}
        <Link href={`/clip/${clip.slug}`} className="tracking-[0.12em] text-dust hover:text-paper">
          CLIP
        </Link>
      </p>
    </div>
  );
}

/** After the official public titles. Unlisted / private / not on the listing. No invented shows. No upload count. */
function BroadcastRemainder() {
  const rows = ["HELD", "UNOPENED", "HELD", "UNOPENED", "", ""] as const;
  return (
    <div className="mt-10" aria-label="Not in this mock">
      <p className="font-cond text-[12px] tracking-[0.18em] text-dust">NOT IN THIS MOCK</p>
      <p className="mt-1 font-cond text-[13px] tracking-[0.12em] text-dust">Unlisted or private.</p>
      {rows.map((line, i) => (
        <div
          key={`held-${i}`}
          className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-4 border-b border-paper/10 py-3"
          style={{ opacity: line ? 0.55 : 0.22 }}
        >
          <span className="font-cond text-[12px] tracking-[0.12em] text-dust">—</span>
          <p className="font-mono text-[13px] tracking-[0.12em] text-dust">{line || "\u00a0"}</p>
        </div>
      ))}
    </div>
  );
}
