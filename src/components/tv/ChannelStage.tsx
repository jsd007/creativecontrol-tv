"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArchivePicture } from "@/components/media/ArchivePicture";
import type { ArchiveClip } from "@/data/types";
import type { Channel } from "@/lib/television";
import { accentOnAir, accentRule } from "@/lib/television";
import { houseGsap } from "@/lib/gsap";
import { GATE_EASE } from "@/lib/motion";
import { tvClipHref } from "@/lib/tvNavigation";
import { publicMediaKind } from "@/lib/format";
import { Acquire } from "./Acquire";

type Props = {
  channel: Channel;
  now?: ArchiveClip;
  next?: ArchiveClip;
  previous?: ArchiveClip;
  onTitle: string;
  nextTitle: string;
  previousTitle: string;
  selectionLabel: string;
  position: number;
  total: number;
  programLink: string;
  nowMark: string;
  switching: boolean;
  reduced: boolean;
  onNext: () => void;
  onPrevious: () => void;
};

export function ChannelStage({
  channel,
  now,
  next,
  previous,
  onTitle,
  nextTitle,
  previousTitle,
  selectionLabel,
  position,
  total,
  programLink,
  nowMark,
  switching,
  reduced,
  onNext,
  onPrevious,
}: Props) {
  const third = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState("");
  const [manualLink, setManualLink] = useState("");

  async function copyLink() {
    const url = new URL(programLink, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(programLink);
      setManualLink("");
    } catch {
      setManualLink(url);
    }
  }

  useGSAP(
    () => {
      if (!third.current || reduced) return;
      const { gsap } = houseGsap();
      gsap.fromTo(
        third.current,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 0.22, ease: GATE_EASE },
      );
    },
    { dependencies: [channel.id, now?.id, reduced] },
  );

  return (
    <div>
      <div className="tv-stage-frame relative mx-auto w-full overflow-hidden">
        {now ? (
          <ArchivePicture
            key={now.id}
            clip={now}
            large={Boolean(now.youtubeId)}
            chrome="stamp"
            className="aspect-video w-full"
          />
        ) : null}
        <Acquire on={switching} accent={channel.accent} n={channel.n} reduced={reduced} />
        <div ref={third} className="tv-stage-caption pointer-events-none">
          <div className={`h-px ${accentRule(channel.accent)}`} />
          <div className="tv-third px-4 py-3">
            <p className={`font-cond text-[11px] tracking-[0.24em] ${accentOnAir(channel.accent)}`}>
              NOW · {channel.name}
              {nowMark ? ` · ${nowMark}` : ""}
            </p>
            {onTitle ? (
              <h2 tabIndex={-1} className="mt-1 font-display text-3xl leading-none text-paper md:text-5xl" aria-live="polite">
                {onTitle}
              </h2>
            ) : null}
            <p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-dust">
              {now?.year}{now?.dateBasis ? ` ${now.dateBasis === "recorded-year" ? "FOOTAGE" : "VIDEO"}` : ""} · {now?.youtubeId ? `PUBLIC ${publicMediaKind(now).toUpperCase()}` : "EXAMPLE PROGRAM"}
            </p>
          </div>
        </div>
      </div>
      <div className="tv-screen-actions">
        {now ? (
          <Link href={tvClipHref(now.slug, programLink)} className="text-paper underline underline-offset-4">
            CLIP DETAILS
          </Link>
        ) : null}
        {now?.publicSource ? (
          <a href={now.publicSource.url} target="_blank" rel="noopener noreferrer" className="text-dust hover:text-paper">
            ORIGINAL · {now.publicSource.publisher.toUpperCase()} ↗
          </a>
        ) : null}
        <a href="#guide" className="text-dust hover:text-paper">
          PROGRAM GUIDE
        </a>
        <button type="button" onClick={copyLink} className="text-leader">
          {copied === programLink ? "LINK COPIED" : "COPY PROGRAM LINK"}
        </button>
      </div>
      <span className="sr-only" role="status">{copied === programLink ? "Program link copied to clipboard." : ""}</span>
      {manualLink ? (
        <label className="tv-manual-link">Copy this program link
          <input aria-label="Program link to copy" readOnly value={new URL(programLink, manualLink).href} onFocus={(event) => event.target.select()} />
        </label>
      ) : null}
      <div className="tv-sequence">
        <p className="tv-sequence-context">
          <span>{selectionLabel}</span>
          <span>{position >= 0 ? `${position + 1} OF ${total}` : "CURRENT PROGRAM OUTSIDE THIS VIEW"}</span>
        </p>
        <div className="tv-sequence-controls">
          <button type="button" onClick={onPrevious} disabled={!previous} aria-label={previous ? `Previous program: ${previousTitle}` : "No previous program"}>
            <span>← PREVIOUS</span>
            <strong>{previousTitle || "Start of selection"}</strong>
          </button>
          <button type="button" onClick={onNext} disabled={!next} aria-label={next ? `Next program: ${nextTitle}` : "No next program"}>
            <span>{position < 0 ? "START THIS VIEW" : "NEXT PROGRAM"} →</span>
            <strong>{nextTitle || (total ? "End of selection" : "No matching programs")}</strong>
          </button>
        </div>
      </div>
    </div>
  );
}
