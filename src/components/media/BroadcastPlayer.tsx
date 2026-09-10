"use client";

import { useState } from "react";
import { youtubeEmbedSrc, youtubeThumbnail } from "@/data/youtube";
import { classNames } from "@/lib/format";

type Props = {
  youtubeId: string;
  title: string;
  className?: string;
  large?: boolean;
};

export function BroadcastPlayer({ youtubeId, title, className = "", large = false }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={classNames("viewfinder viewfinder-br relative overflow-hidden bg-ink", className)}>
      {playing ? (
        <iframe
          src={youtubeEmbedSrc(youtubeId, { autoplay: true, mute: true })}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 block h-full w-full">
          {/* Official YouTube thumbnail URL. Not downloaded into the repo. */}
          <img
            src={youtubeThumbnail(youtubeId)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-void/90 px-3 py-2 font-cond text-[13px] tracking-[0.22em] text-paper">
            PLAY · MUTED
          </span>
        </button>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3">
        <span className="font-mono text-[9px] tracking-[0.16em] text-paper/80">PUBLIC BROADCAST</span>
        {large ? <span className="font-mono text-[9px] tracking-[0.16em] text-paper/70">CC-TV</span> : null}
      </div>
    </div>
  );
}
