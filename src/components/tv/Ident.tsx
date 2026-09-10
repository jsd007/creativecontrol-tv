"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import type { Channel } from "@/lib/television";
import { accentHair, accentNumber, accentOnAir } from "@/lib/television";
import { houseGsap } from "@/lib/gsap";
import { GATE_EASE } from "@/lib/motion";

type Props = {
  channel: Channel;
  clock: string;
  titles: string[];
  onTitle: string;
  reduced: boolean;
};

export function Ident({ channel, clock, titles, onTitle, reduced }: Props) {
  const root = useRef<HTMLElement>(null);
  const line = titles.join("   ·   ");

  useGSAP(
    () => {
      const { gsap } = houseGsap();
      if (!root.current || reduced) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ defaults: { ease: GATE_EASE } })
        .fromTo(q(".tv-ident-rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.42, transformOrigin: "left center" }, 0)
        .fromTo(
          q(".tv-ident-n"),
          { opacity: 0.28, letterSpacing: "0.22em" },
          { opacity: 1, letterSpacing: "0.02em", duration: 0.4 },
          0,
        )
        .fromTo(
          q(".tv-ident-name"),
          { opacity: 0.35, y: 8, letterSpacing: "0.28em" },
          { opacity: 1, y: 0, letterSpacing: "0.08em", duration: 0.42 },
          0.04,
        )
        .fromTo(q(".tv-ident-voice"), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.32 }, 0.1);
    },
    { scope: root, dependencies: [channel.id, reduced] },
  );

  return (
    <header ref={root} className="tv-ident border-b border-paper/15 pb-3 pt-3">
      <div className={`tv-ident-rule mb-3 h-px origin-left ${accentHair(channel.accent)}`} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="font-cond text-[12px] tracking-[0.36em] text-leader">CC-TV</p>
          <h1 className="mt-0.5 flex flex-wrap items-end gap-x-3 gap-y-1 text-paper" aria-live="polite">
            <span className={`tv-ident-n font-cond text-[56px] leading-none tracking-[0.02em] md:text-[72px] ${accentNumber(channel.accent)}`}>
              {channel.n}
            </span>
            <span className="tv-ident-name mb-1 font-cond text-[20px] tracking-[0.08em] md:text-[24px]">{channel.name}</span>
          </h1>
          <p className="tv-ident-voice mt-0.5 font-cond text-[13px] tracking-[0.2em] text-dust">{channel.voice}</p>
        </div>
        <div className="flex items-baseline gap-5 font-mono text-[10px] tracking-[0.16em] text-dust">
          <p className={`tv-live ${accentOnAir(channel.accent)}`}>ON AIR</p>
          <p aria-hidden>{clock}</p>
          <p className="hidden sm:block" aria-hidden>
            0–8 · ↑↓
          </p>
          <p className="sr-only">Channels 0 through 8. Arrow keys change channel.</p>
        </div>
      </div>
      {reduced ? (
        onTitle ? <p className="mt-4 truncate font-cond text-[13px] tracking-[0.14em] text-bone">{onTitle}</p> : null
      ) : line ? (
        <div className="tv-crawl mt-4" aria-hidden>
          <div className="tv-crawl-track font-cond text-[12px] tracking-[0.16em] text-dust">
            <span>{line}</span>
            <span>{line}</span>
          </div>
        </div>
      ) : null}
    </header>
  );
}
