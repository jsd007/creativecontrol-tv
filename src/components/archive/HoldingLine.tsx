import Link from "next/link";
import type { ArchiveClip } from "@/data/types";
import { clipHeading } from "@/lib/clipDisplay";
import { holdingPlace } from "@/lib/holdings";

export function HoldingLine({ clip }: { clip: ArchiveClip }) {
  const place = holdingPlace(clip) || "—";
  const title = clipHeading(clip);

  return (
    <Link
      href={`/clip/${clip.slug}`}
      className="holding-line group grid grid-cols-[3.25rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-0.5 border-t border-paper/10 py-2.5 md:grid-cols-[3.25rem_minmax(0,1.6fr)_6.5rem_minmax(6rem,10rem)] md:gap-x-5"
    >
      <span className="type-meta">{clip.year}</span>
      <span className="type-title min-w-0 font-cond text-[15px] leading-snug tracking-[0.04em] group-hover:text-leader md:text-[16px]">
        {title}
      </span>
      <span className="type-label">BROADCAST</span>
      <span className="type-label">{place}</span>
    </Link>
  );
}
