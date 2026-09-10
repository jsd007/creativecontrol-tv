import Link from "next/link";
import type { ArchiveClip, Transcript } from "@/data/types";
import { offsetSmpte } from "@/lib/format";

export function TranscriptDossier({
  clip,
  transcript,
  activeSegmentId,
}: {
  clip: ArchiveClip;
  transcript: Transcript;
  activeSegmentId?: string;
}) {
  return (
    <section className="mt-16 max-w-3xl">
      <p className="font-cond text-[12px] tracking-[0.1em] text-leader">PROTOTYPE TRANSCRIPT</p>
      <p className="mt-1 font-mono text-[12px] tracking-[0.08em] text-dust">
        EDITORIAL INFERENCE · NOT A RECORDING
      </p>
      {transcript.note ? (
        <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-bone/70">{transcript.note}</p>
      ) : null}
      <ol className="mt-6 border-t border-paper/10">
        {transcript.segments.map((seg) => {
          const active = activeSegmentId === seg.id;
          const tc = offsetSmpte(clip.startTimecode, seg.start);
          return (
            <li key={seg.id} id={`seg-${seg.id}`} className="scroll-mt-20">
              <Link
                href={`/clip/${clip.slug}?seg=${seg.id}#seg-${seg.id}`}
                className={`block border-l-2 py-3.5 pl-4 hover:text-leader ${
                  active ? "border-leader text-leader" : "border-paper/15 text-paper"
                }`}
              >
                <p className="font-mono text-[12px] tracking-[0.08em] text-dust">
                  {tc}
                  {seg.speaker ? ` · ${seg.speaker}` : ""}
                </p>
                <p className="mt-1 text-[15px] leading-snug">{seg.text}</p>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
