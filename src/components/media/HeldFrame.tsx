import type { ArchiveClip, Visibility } from "@/data/types";
import { formatDuration } from "@/lib/format";
import { holdFor } from "@/lib/visibility";

type HeldClip = Pick<
  ArchiveClip,
  "visibility" | "rightsStatus" | "sensitivityStatus" | "startTimecode" | "duration" | "formatHint"
>;

type Props = {
  clip: HeldClip;
  className?: string;
  large?: boolean;
};

export function HeldFrame({ clip, className = "", large = false }: Props) {
  const hold = holdFor(clip);
  const onPaper = clip.visibility === "MEMBERS_ONLY";
  const ink = onPaper ? "text-void" : "text-paper";
  const quiet = onPaper ? "text-void/65" : "text-bone";
  const body = onPaper ? "text-void/75" : "text-bone";

  return (
    <div className={`viewfinder viewfinder-br relative overflow-hidden bg-ink ${className}`}>
      <HoldField visibility={clip.visibility} />
      <div className="grain-held" />
      <div className="scan absolute inset-0" />

      <div className="relative z-10 flex h-full flex-col justify-between p-3">
        <div className="flex items-start justify-between gap-3">
          <span className={`font-mono text-[12px] tracking-[0.08em] ${quiet}`}>HELD</span>
          <span className={`font-mono text-[12px] tracking-[0.08em] ${quiet}`}>{clip.formatHint}</span>
        </div>

        <div className={large ? "max-w-[22ch] px-[8%]" : ""}>
          <p
            className={`font-cond leading-none tracking-[0.16em] ${ink} ${
              large ? "text-[clamp(1.6rem,4.2vw,2.6rem)]" : "text-[13px]"
            }`}
          >
            {hold.status}
          </p>
          {large ? (
            <p className={`mt-3 max-w-[36ch] text-[14px] leading-relaxed ${body}`}>{hold.line}</p>
          ) : (
            <p className={`mt-1 font-mono text-[12px] tracking-[0.08em] ${quiet}`}>
              {clip.rightsStatus.replaceAll("_", " ")}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between">
          <span className={`font-mono text-[12px] tracking-[0.08em] ${quiet}`}>{clip.startTimecode}</span>
          <span className={`font-mono text-[12px] tracking-[0.08em] ${quiet}`}>{formatDuration(clip.duration)}</span>
        </div>
      </div>
    </div>
  );
}

function HoldField({ visibility }: { visibility: Visibility }) {
  switch (visibility) {
    case "UNLISTED":
      return (
        <div className="absolute inset-0 bg-[#16140f]">
          <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_30%_20%,#2a2418,transparent_62%)]" />
          <div className="absolute inset-x-[12%] top-[28%] h-10 -rotate-2 bg-[#d7b56a]/35" />
        </div>
      );
    case "PRIVATE":
      return (
        <div className="absolute inset-0 bg-[#070706]">
          <div className="absolute inset-[14%] border border-paper/15" />
        </div>
      );
    case "COMING_SOON":
      return (
        <div className="absolute inset-0 bg-[#12100c]">
          <div className="leader-bars absolute inset-x-0 top-0 h-2 opacity-80" />
          <div className="absolute inset-0 bg-[radial-gradient(80%_55%_at_50%_60%,#2a2214,transparent_58%)]" />
        </div>
      );
    case "MEMBERS_ONLY":
      return (
        <div className="absolute inset-0 bg-[#1a1610]">
          <div className="absolute inset-[16%] bg-paper/90" />
          <div className="absolute inset-x-[20%] top-[38%] h-px bg-void/20" />
        </div>
      );
    case "RESTRICTED":
      return (
        <div className="absolute inset-0 bg-[#101014]">
          <div className="absolute inset-[12%] border border-paper/20" />
          <div className="absolute inset-[16%] border border-paper/10" />
        </div>
      );
    case "PENDING_CLEARANCE":
      return (
        <div className="absolute inset-0 bg-[#1a160e]">
          <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_40%_30%,#3d2e14,transparent_60%)]" />
          <div className="absolute inset-x-[10%] bottom-[22%] h-px bg-leader/35" />
        </div>
      );
    default:
      return <div className="absolute inset-0 bg-ink" />;
  }
}
