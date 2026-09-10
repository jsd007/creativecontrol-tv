"use client";

import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { useRef } from "react";
import { ArchivePicture } from "@/components/media/ArchivePicture";
import type { ArchiveClip } from "@/data/types";
import type { Channel } from "@/lib/television";
import { accentOnAir, accentRule } from "@/lib/television";
import { houseGsap } from "@/lib/gsap";
import { GATE_EASE } from "@/lib/motion";
import { Acquire } from "./Acquire";

type Props = {
  channel: Channel;
  now?: ArchiveClip;
  next?: ArchiveClip;
  onTitle: string;
  nextTitle: string;
  nowMark: string;
  switching: boolean;
  reduced: boolean;
  onSurf: () => void;
};

export function ChannelStage({
  channel,
  now,
  next,
  onTitle,
  nextTitle,
  nowMark,
  switching,
  reduced,
  onSurf,
}: Props) {
  const third = useRef<HTMLDivElement>(null);

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
      <div className="tv-stage-frame relative mx-auto w-full max-w-[min(100%,calc(56vh*16/9))] overflow-hidden">
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
        <div ref={third} className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className={`h-px ${accentRule(channel.accent)}`} />
          <div className="tv-third px-4 py-3">
            <p className={`font-cond text-[11px] tracking-[0.24em] ${accentOnAir(channel.accent)}`}>
              NOW · {channel.name}
              {nowMark ? ` · ${nowMark}` : ""}
            </p>
            {onTitle ? (
              <h2 className="mt-1 font-display text-3xl leading-none text-paper md:text-5xl" aria-live="polite">
                {onTitle}
              </h2>
            ) : null}
            <p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-dust">
              {now?.year} · {now?.formatHint} · {now?.youtubeId ? "PUBLIC BROADCAST" : now?.startTimecode}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {now ? (
            <Link href={`/clip/${now.slug}`} className="font-cond text-[13px] tracking-[0.14em] text-paper underline underline-offset-4">
              OPEN CLIP
            </Link>
          ) : null}
          <a href="#guide" className="font-cond text-[13px] tracking-[0.14em] text-dust hover:text-paper">
            GUIDE
          </a>
        </div>
        {next && nextTitle ? (
          <button type="button" onClick={onSurf} className="tv-surf font-cond text-[13px] tracking-[0.18em] text-leader">
            SURF → {nextTitle}
          </button>
        ) : null}
      </div>
    </div>
  );
}
