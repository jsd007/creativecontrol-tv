import type { ArchiveClip, Visibility } from "@/data/types";
import { formatDuration } from "@/lib/format";
import { holdFor } from "@/lib/visibility";

/** Large rights sleeve in the gate. Catalog language — not a lock screen. */
export function ClipSleeve({ clip }: { clip: ArchiveClip }) {
  const hold = holdFor(clip);
  const paper = clip.visibility === "MEMBERS_ONLY";
  const ink = paper ? "text-void" : "text-paper";
  const quiet = paper ? "text-void/65" : "text-bone";
  const body = paper ? "text-void/75" : "text-bone";

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink">
      <SleeveField visibility={clip.visibility} />
      <div className="grain-held" />

      <div className={`relative z-10 flex h-full flex-col justify-between ${paper ? "p-[14%]" : "p-5 md:p-7"}`}>
        <div className="flex items-start justify-between gap-4">
          <span className={`font-mono text-[12px] tracking-[0.08em] ${quiet}`}>HELD SLEEVE</span>
          <span className={`font-mono text-[12px] tracking-[0.08em] ${quiet}`}>{clip.formatHint}</span>
        </div>

        <div className="max-w-[22ch]">
          <p className={`font-cond leading-none tracking-[0.16em] ${ink} text-[clamp(1.7rem,4.4vw,2.8rem)]`}>
            {hold.status}
          </p>
          <p className={`mt-4 max-w-[34ch] text-[15px] leading-relaxed ${body}`}>{hold.line}</p>
          <p className={`mt-4 font-mono text-[12px] tracking-[0.08em] ${quiet}`}>
            {clip.rightsStatus.replaceAll("_", " ")}
          </p>
        </div>

        <div className="flex items-end justify-between">
          <span className={`font-mono text-[12px] tracking-[0.08em] ${quiet}`}>{clip.startTimecode}</span>
          <span className={`font-mono text-[12px] tracking-[0.08em] ${quiet}`}>{formatDuration(clip.duration)}</span>
        </div>
      </div>
    </div>
  );
}

function SleeveField({ visibility }: { visibility: Visibility }) {
  switch (visibility) {
    case "MEMBERS_ONLY":
      return (
        <div className="absolute inset-0 bg-[#1c1812]">
          <div className="absolute inset-[9%] bg-paper shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-x-[10%] top-[18%] h-px bg-void/10" />
            <div className="absolute inset-x-[10%] bottom-[18%] h-px bg-void/10" />
          </div>
        </div>
      );
    case "PENDING_CLEARANCE":
      return (
        <div className="absolute inset-0 bg-[#16120c]">
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_36%_28%,#3d2c12,transparent_62%)]" />
          <div className="absolute inset-[12%] border border-leader/35" />
          <div className="absolute inset-x-[10%] bottom-[20%] h-px bg-leader/40" />
        </div>
      );
    case "RESTRICTED":
      return (
        <div className="absolute inset-0 bg-[#0c0c10]">
          <div className="absolute inset-[11%] border border-paper/20" />
          <div className="absolute inset-[16%] border border-paper/10" />
        </div>
      );
    case "PRIVATE":
      return (
        <div className="absolute inset-0 bg-[#070706]">
          <div className="absolute inset-[15%] border border-paper/15" />
        </div>
      );
    case "COMING_SOON":
      return (
        <div className="absolute inset-0 bg-[#12100c]">
          <div className="leader-bars absolute inset-x-0 top-0 h-2 opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(80%_55%_at_50%_60%,#2a2214,transparent_58%)]" />
        </div>
      );
    case "UNLISTED":
      return (
        <div className="absolute inset-0 bg-[#16140f]">
          <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_30%_20%,#2a2418,transparent_62%)]" />
          <div className="absolute inset-x-[14%] top-[30%] h-10 -rotate-2 bg-[#d7b56a]/40" />
        </div>
      );
    default:
      return <div className="absolute inset-0 bg-ink" />;
  }
}
