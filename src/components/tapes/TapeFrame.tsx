import Link from "next/link";
import type { ArchiveClip } from "@/data/types";
import { HeldFrame } from "@/components/media/HeldFrame";
import { PrototypeMedia } from "@/components/media/PrototypeMedia";
import { clipHeading, isUnlogged } from "@/lib/clipDisplay";
import { classNames, formatDuration, visibilityLabel } from "@/lib/format";
import { isClosed } from "@/lib/visibility";

export function TapeFrame({
  clip,
  current = false,
}: {
  clip: ArchiveClip;
  current?: boolean;
}) {
  const unlogged = isUnlogged(clip);
  const closed = isClosed(clip) && !unlogged;

  return (
    <Link
      href={`/clip/${clip.slug}`}
      aria-current={current ? "true" : undefined}
      className={classNames("group block", unlogged && "opacity-70", current && "frame-in-gate")}
    >
      {closed ? (
        <HeldFrame clip={clip} className="aspect-[4/3] w-full" />
      ) : (
        <PrototypeMedia clip={clip} className="aspect-[4/3] w-full" />
      )}
      <p className="mt-2 font-mono text-[12px] tracking-[0.08em] text-dust">
        {clip.startTimecode}
        {unlogged ? ` · ${formatDuration(clip.duration)}` : ""}
      </p>
      {unlogged ? (
        <p className="font-mono text-[12px] tracking-[0.08em] text-dust/70">
          {closed ? visibilityLabel(clip.visibility) : "UNLOGGED"}
        </p>
      ) : (
        <>
          <p className="font-display text-[20px] leading-tight text-paper group-hover:text-leader">{clipHeading(clip)}</p>
          {closed ? (
            <p className="mt-1 font-mono text-[12px] tracking-[0.08em] text-dust">{visibilityLabel(clip.visibility)}</p>
          ) : null}
        </>
      )}
    </Link>
  );
}
