import Link from "next/link";
import Image from "next/image";
import type { ArchiveClip } from "@/data/types";
import { youtubeThumbnail } from "@/data/youtube";
import { HeldFrame } from "@/components/media/HeldFrame";
import { PrototypeMedia } from "@/components/media/PrototypeMedia";
import { clipHeading, isUnlogged } from "@/lib/clipDisplay";
import { classNames, formatDate, formatDuration, visibilityLabel } from "@/lib/format";
import { isClosed } from "@/lib/visibility";
import { clipHref } from "@/lib/lensNavigation";

export function TapeFrame({
  clip,
  current = false,
  returnHref,
}: {
  clip: ArchiveClip;
  current?: boolean;
  returnHref?: string;
}) {
  const unlogged = isUnlogged(clip);
  const closed = isClosed(clip) && !unlogged;

  return (
    <Link
      href={clipHref(clip.slug, returnHref)}
      aria-current={current ? "true" : undefined}
      className={classNames("group block", unlogged && "opacity-70", current && "frame-in-gate")}
    >
      {clip.contentState === "project-reference" ? (
        <div className="border-y border-paper/15 py-6">
          <p className="type-label text-leader">PROJECT REFERENCE</p>
          <p className="mt-3 text-[13px] leading-relaxed text-dust">Public project information. No film footage is represented.</p>
        </div>
      ) : clip.youtubeId ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-ink">
          <Image src={youtubeThumbnail(clip.youtubeId)} alt="" width={480} height={360} unoptimized className="h-full w-full object-cover" />
          <p className="absolute inset-x-0 bottom-0 bg-void/90 px-3 py-2 font-mono text-[10px] leading-snug tracking-[0.06em] text-paper">
            {clip.publicSource?.kind === "trailer" ? "PUBLIC TRAILER" : "PUBLIC SOURCE"} · {clip.publicSource?.publisher ?? "Creative Control"}
          </p>
        </div>
      ) : closed ? (
        <HeldFrame clip={clip} className="aspect-[4/3] w-full" />
      ) : (
        <PrototypeMedia clip={clip} chrome="stamp" className="aspect-[4/3] w-full" />
      )}
      <p className="mt-2 font-mono text-[12px] tracking-[0.08em] text-dust">
        {clip.youtubeId || clip.contentState === "project-reference" ? formatDate(clip) : clip.startTimecode}
        {unlogged ? ` · ${formatDuration(clip.duration)}` : ""}
      </p>
      {unlogged ? (
        <p className="font-mono text-[12px] tracking-[0.08em] text-dust/70">
          {closed ? visibilityLabel(clip.visibility) : "UNLOGGED"}
        </p>
      ) : (
        <>
          <p className="font-display text-[20px] leading-tight text-paper group-hover:text-leader">{clipHeading(clip)}</p>
          {closed && !clip.youtubeId && clip.contentState !== "project-reference" ? (
            <p className="mt-1 font-mono text-[12px] tracking-[0.08em] text-dust">{visibilityLabel(clip.visibility)}</p>
          ) : null}
        </>
      )}
    </Link>
  );
}
