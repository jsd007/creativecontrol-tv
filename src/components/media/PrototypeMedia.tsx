import type { ArchiveClip } from "@/data/types";
import { formatDuration } from "@/lib/format";
import { clipHeading, isUnlogged } from "@/lib/clipDisplay";
import { resolveMediaVoice, type MediaVoice, type VoiceClip } from "@/lib/mediaVoice";

type Props = {
  clip: VoiceClip &
    Pick<ArchiveClip, "id" | "tags" | "startTimecode" | "duration" | "cameraCredit">;
  className?: string;
  large?: boolean;
};

export function PrototypeMedia({ clip, className = "", large = false }: Props) {
  const mute = isUnlogged(clip);
  const voice = mute ? "default" : resolveMediaVoice(clip);
  const minidv = clip.formatHint === "MINIDV" || clip.formatHint === "HI8" || clip.formatHint === "VHS";

  return (
    <div className={`viewfinder viewfinder-br relative overflow-hidden bg-ink ${className}`}>
      {mute ? <UnloggedField /> : <Field clip={clip} voice={voice} />}
      {!mute && clip.mediaKind === "LEADER" && voice === "default" ? (
        <div className="leader-bars absolute inset-0 opacity-90" />
      ) : null}
      {!mute && voice !== "default" && clip.mediaKind === "LEADER" ? (
        <div className="leader-bars absolute inset-x-0 top-0 h-2 opacity-80" />
      ) : null}
      <div className="scan absolute inset-0" />
      {minidv && voice !== "channel-zero-open" ? <FourByThree /> : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

      {mute ? null : <Lockup clip={clip} voice={voice} large={large} />}

      <div className="relative z-10 flex h-full flex-col justify-between p-3">
        <div className="flex items-start justify-between gap-3">
          <span className="font-mono text-[9px] tracking-[0.16em] text-paper/80">PROTOTYPE MEDIA</span>
          <span className="font-mono text-[9px] tracking-[0.16em] text-paper/70">{clip.formatHint}</span>
        </div>
        {large && !mute ? (
          <div className={voice === "default" ? "" : "opacity-90"}>
            <p className="font-cond text-[11px] tracking-[0.2em] text-leader">
              {clip.year} · {clip.type.toUpperCase()}
            </p>
            <h2 className="mt-1 max-w-[16ch] font-display text-3xl leading-none text-paper md:text-5xl">{clipHeading(clip)}</h2>
          </div>
        ) : large && mute ? (
          <p className="font-mono text-[11px] tracking-[0.2em] text-dust">UNLOGGED</p>
        ) : (
          <span />
        )}
        <div className="flex items-end justify-between">
          <span className="font-mono text-[9px] tracking-[0.12em] text-paper/70">{clip.startTimecode}</span>
          <span className="font-mono text-[9px] tracking-[0.12em] text-paper/70">
            {mute ? formatDuration(clip.duration) : `${clip.cameraCredit} · ${formatDuration(clip.duration)}`}
          </span>
        </div>
      </div>
    </div>
  );
}

function UnloggedField() {
  return (
    <div className="absolute inset-0 bg-[#12100c]">
      <div className="absolute inset-0 bg-[radial-gradient(75%_60%_at_38%_28%,#2a2418,transparent_64%)]" />
    </div>
  );
}

function Field({ clip, voice }: { clip: VoiceClip; voice: MediaVoice }) {
  const field = `hsl(${clip.hue} 28% 18%)`;
  const wash = `hsl(${(clip.hue + 40) % 360} 45% 42%)`;

  if (voice === "ali") return <AliField />;
  if (voice === "kendall") return <KendallField />;
  if (voice === "coney") return <ConeyField />;
  if (voice === "channel-zero-open") return <ChannelZeroOpen />;
  if (voice === "channel-zero") return <ChannelZeroField />;
  if (voice === "sessions") return <SessionsField />;
  if (voice === "window-seat") return <WindowSeatField />;
  if (voice === "ingest") return <IngestField />;
  if (voice === "basement") return <BasementField />;
  if (voice === "sports") return <SportsField />;
  if (voice === "architecture") return <ArchitectureField />;

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            clip.mediaKind === "LEADER"
              ? undefined
              : clip.mediaKind === "STATIC"
                ? `repeating-linear-gradient(180deg, #111 0 1px, #2a2a28 1px 2px)`
                : `radial-gradient(120% 90% at 30% 20%, ${wash}, transparent 55%), ${field}`,
        }}
      />
      {clip.mediaKind === "MAP" ? (
        <svg className="absolute inset-[12%] opacity-40" viewBox="0 0 100 60" aria-hidden>
          <path d="M8 40 C22 12, 40 18, 52 28 S78 10, 94 22" fill="none" stroke="#efe6d6" strokeWidth="0.6" />
          <circle cx="28" cy="30" r="1.6" fill="#e8c36a" />
          <circle cx="70" cy="18" r="1.1" fill="#efe6d6" />
        </svg>
      ) : null}
      {clip.mediaKind === "CONTACT" ? (
        <div className="absolute inset-6 grid grid-cols-3 gap-1 opacity-50">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-paper/20" />
          ))}
        </div>
      ) : null}
    </>
  );
}

function Lockup({ clip, voice, large }: { clip: VoiceClip; voice: MediaVoice; large: boolean }) {
  if (voice === "default") return null;
  const compact = !large;

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center px-6">
      {voice === "ali" ? (
        <p className="font-cond text-[clamp(2.4rem,12vw,5.5rem)] leading-none tracking-[0.08em] text-paper/90">
          ALI
        </p>
      ) : null}
      {voice === "kendall" ? (
        <div className="text-center">
          <p className="font-display italic text-[clamp(1.4rem,5vw,2.6rem)] leading-none text-paper/85">Kendall’s</p>
          <p className="mt-1 font-display text-[clamp(1.6rem,6vw,3rem)] leading-none tracking-[0.18em] text-paper">
            CROSS
          </p>
        </div>
      ) : null}
      {voice === "coney" ? (
        <p className="font-cond text-[clamp(1.1rem,4.2vw,2.1rem)] leading-none tracking-[0.12em] text-paper">
          A KID FR<span className="inline-block h-[0.62em] w-[0.62em] translate-y-[0.04em] rounded-full border-[3px] border-paper align-middle" />M CONEY
        </p>
      ) : null}
      {voice === "channel-zero-open" ? (
        <p className="font-cond text-[clamp(1.2rem,4.6vw,2.4rem)] tracking-[0.2em] text-[#1a1408]">CHANNEL ZERO</p>
      ) : null}
      {voice === "channel-zero" && compact ? (
        <p className="absolute bottom-10 left-3 font-cond text-[11px] tracking-[0.22em] text-paper/70">CH 00</p>
      ) : null}
      {voice === "sessions" && compact ? (
        <p className="font-cond text-[clamp(1.3rem,5vw,2.2rem)] tracking-[0.2em] text-leader/80">DD172</p>
      ) : null}
      {voice === "window-seat" && compact ? (
        <p className="font-display italic text-[clamp(1.3rem,4.5vw,2rem)] text-paper/80">Window Seat</p>
      ) : null}
      {voice === "ingest" && compact ? (
        <p className="font-mono text-[10px] tracking-[0.18em] text-paper/70">INGEST · 4:3</p>
      ) : null}
      {voice === "basement" && compact ? (
        <p className="font-mono text-[10px] tracking-[0.16em] text-leader/80">OCT 02 · BASEMENT</p>
      ) : null}
      {voice === "sports" && compact ? (
        <p className="font-cond text-[clamp(1.4rem,5vw,2.4rem)] tracking-[0.16em] text-paper/80">SPORTS</p>
      ) : null}
      {voice === "architecture" && compact ? (
        <p className="font-cond text-[11px] tracking-[0.22em] text-paper/60">PLAN</p>
      ) : null}
    </div>
  );
}

function FourByThree() {
  return (
    <div
      className="pointer-events-none absolute inset-y-[8%] left-[10%] right-[10%] border border-paper/15"
      aria-hidden
    />
  );
}

function AliField() {
  return (
    <div className="absolute inset-0 bg-[#1a0a08]">
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_40%,#6b1c14,transparent_62%)]" />
      <div className="absolute inset-x-[8%] top-[22%] h-px bg-paper/35" />
      <div className="absolute inset-x-[8%] top-[28%] h-px bg-paper/20" />
      <div className="absolute inset-x-[8%] bottom-[28%] h-px bg-paper/20" />
      <div className="absolute inset-x-[8%] bottom-[22%] h-px bg-paper/35" />
      <div className="absolute left-[8%] top-[22%] h-[56%] w-px bg-paper/25" />
      <div className="absolute right-[8%] top-[22%] h-[56%] w-px bg-paper/25" />
    </div>
  );
}

function KendallField() {
  return (
    <div className="absolute inset-0 bg-[#12110f]">
      <div className="proto-snow absolute inset-0 opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(239,230,214,0.08),transparent_55%)]" />
    </div>
  );
}

function ConeyField() {
  return (
    <div className="absolute inset-0 bg-[#0c1018]">
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#07080c] to-transparent" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 90" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <rect x="18" y="38" width="28" height="46" fill="#161b24" />
        <rect x="50" y="28" width="36" height="56" fill="#121821" />
        <rect x="90" y="34" width="24" height="50" fill="#181e28" />
        <rect x="118" y="42" width="22" height="42" fill="#141922" />
        {[
          [24, 48],
          [32, 56],
          [58, 40],
          [70, 52],
          [96, 46],
          [124, 54],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="3" height="4" fill="#e8c36a" opacity="0.55" />
        ))}
        <circle cx="138" cy="18" r="7" fill="#efe6d6" opacity="0.12" />
      </svg>
    </div>
  );
}

function ChannelZeroOpen() {
  return (
    <div className="absolute inset-0 bg-[#d4b44a]">
      <div className="absolute inset-x-0 top-[38%] h-[18%] proto-checker opacity-90" />
    </div>
  );
}

function ChannelZeroField() {
  return (
    <div className="absolute inset-0 bg-[#1c1610]">
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_20%_30%,#3d2a14,transparent_58%)]" />
      <div className="absolute inset-x-0 bottom-[18%] h-3 proto-checker opacity-70" />
    </div>
  );
}

function SessionsField() {
  return (
    <div className="absolute inset-0 bg-[#24180e]">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_70%_20%,#8a5a28,transparent_50%)]" />
      <div className="absolute inset-[14%] grid grid-cols-4 grid-rows-3 gap-[3px] opacity-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border border-paper/25 bg-paper/5" />
        ))}
      </div>
    </div>
  );
}

function WindowSeatField() {
  return (
    <div className="absolute inset-0 bg-[#2a1814]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#6a3a2a_0%,#2a1814_55%,#1a120e_100%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 100 60" aria-hidden>
        <path d="M4 48 L92 18" fill="none" stroke="#efe6d6" strokeWidth="0.45" />
        <circle cx="28" cy="41" r="1.2" fill="#efe6d6" />
        <rect x="62" y="8" width="22" height="14" fill="none" stroke="#efe6d6" strokeWidth="0.3" />
      </svg>
    </div>
  );
}

function IngestField() {
  return (
    <div className="absolute inset-0 bg-[#14120e]">
      <div className="absolute left-[12%] top-[16%] h-[68%] w-[76%] border border-paper/25" />
      <div className="absolute left-[16%] top-[22%] grid w-[68%] grid-cols-3 gap-1 opacity-45">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-tape" />
        ))}
      </div>
      <span className="absolute left-[14%] top-[12%] h-1.5 w-1.5 rounded-full bg-signal" />
    </div>
  );
}

function BasementField() {
  return (
    <div className="absolute inset-0 bg-[#1a120c]">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_35%_25%,#5a3a1c,transparent_58%)]" />
      <div className="absolute left-[18%] top-[20%] h-[58%] w-[64%] rotate-[-2deg] border border-paper/30 bg-paper/5" />
      <div className="absolute right-[14%] top-[28%] h-[22%] w-[18%] rotate-[6deg] border border-paper/20 bg-paper/10" />
    </div>
  );
}

function SportsField() {
  return (
    <div className="absolute inset-0 bg-[#12140f]">
      <div className="absolute left-[12%] top-[10%] h-16 w-16 rounded-full bg-paper/10 blur-md" />
      <div className="absolute right-[18%] top-[8%] h-10 w-10 rounded-full bg-leader/20 blur-md" />
      <svg className="absolute inset-[10%] opacity-35" viewBox="0 0 100 70" aria-hidden>
        <rect x="8" y="8" width="84" height="54" fill="none" stroke="#efe6d6" strokeWidth="0.5" />
        <ellipse cx="50" cy="35" rx="16" ry="10" fill="none" stroke="#efe6d6" strokeWidth="0.45" />
        <path d="M8 35 H92" stroke="#efe6d6" strokeWidth="0.35" />
      </svg>
      <div className="absolute bottom-[20%] left-[8%] right-[8%] flex gap-1 opacity-40">
        <div className="h-6 flex-1 bg-paper/15" />
        <div className="h-6 flex-1 bg-leader/20" />
        <div className="h-6 flex-1 bg-paper/10" />
      </div>
    </div>
  );
}

function ArchitectureField() {
  return (
    <div className="absolute inset-0 bg-[#161614]">
      <svg className="absolute inset-[12%] opacity-40" viewBox="0 0 100 70" aria-hidden>
        <rect x="10" y="10" width="80" height="50" fill="none" stroke="#efe6d6" strokeWidth="0.4" />
        <rect x="22" y="20" width="56" height="30" fill="none" stroke="#efe6d6" strokeWidth="0.35" />
        <rect x="38" y="28" width="24" height="14" fill="#efe6d6" opacity="0.08" />
        <path d="M10 35 H90 M50 10 V60" stroke="#efe6d6" strokeWidth="0.25" />
      </svg>
    </div>
  );
}
