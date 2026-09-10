import type { SourceTape, TapeFormat } from "@/data/types";
import { classNames } from "@/lib/format";

function shell(format: TapeFormat) {
  switch (format) {
    case "MINIDV":
      return "from-[#2c2416] to-[#12100c]";
    case "HI8":
      return "from-[#3a1f14] to-[#140e0c]";
    case "VHS":
      return "from-[#1c2230] to-[#0c0d10]";
    case "PHONE":
      return "from-[#1a1a1a] to-[#0a0a0a]";
    default:
      return "from-[#243028] to-[#0c100e]";
  }
}

function densityLine(logged?: number, unlogged?: number, clipCount?: number) {
  if (typeof logged === "number" && typeof unlogged === "number") {
    return `${logged} LOGGED · ${unlogged} UNLOGGED`;
  }
  if (typeof clipCount === "number") {
    return `${clipCount} ${clipCount === 1 ? "CLIP" : "CLIPS"}`;
  }
  return "";
}

export function densityStamp(logged?: number, unlogged?: number) {
  if (typeof logged !== "number" || typeof unlogged !== "number") return "";
  return `${logged}·${unlogged}`;
}

/** The spool window. Two hubs, one wound fuller than the other — it should read as a cassette. */
function TapeWindow() {
  return (
    <div className="absolute left-1/2 top-[40%] w-[46%] -translate-x-1/2" aria-hidden>
      <svg viewBox="0 0 92 34" className="w-full">
        <rect x="0.5" y="0.5" width="91" height="33" fill="#0a0907" stroke="rgba(239,230,214,0.20)" />
        <rect x="26" y="10" width="40" height="14" fill="#191409" />
        <circle cx="27" cy="17" r="11" fill="#171208" stroke="rgba(239,230,214,0.14)" />
        <circle cx="65" cy="17" r="7.5" fill="#171208" stroke="rgba(239,230,214,0.14)" />
        <circle cx="27" cy="17" r="3.4" fill="#2e2616" stroke="rgba(212,176,90,0.55)" />
        <circle cx="65" cy="17" r="3.4" fill="#2e2616" stroke="rgba(212,176,90,0.55)" />
        <path d="M27 6 H65" stroke="rgba(239,230,214,0.10)" strokeWidth="0.7" />
      </svg>
    </div>
  );
}

export function TapeObject({
  tape,
  size = "mosaic",
  clipCount,
  logged,
  unlogged,
  lit = false,
  onShelf = false,
  className = "",
}: {
  tape: SourceTape;
  size?: "mosaic" | "hero";
  clipCount?: number;
  logged?: number;
  unlogged?: number;
  lit?: boolean;
  onShelf?: boolean;
  className?: string;
}) {
  const hero = size === "hero";
  const density = densityLine(logged, unlogged, clipCount);

  return (
    <div
      className={classNames(
        "relative overflow-hidden bg-gradient-to-br",
        shell(tape.format),
        hero ? "aspect-[3/4] w-full max-w-[320px] shadow-frame" : "aspect-[3/4] w-full",
        onShelf && "shadow-[0_10px_18px_rgba(0,0,0,0.55)]",
        lit && "ring-1 ring-leader/70 shadow-[0_0_72px_rgba(196,160,90,0.38)]",
        className,
      )}
    >
      <div className="absolute left-0 top-0 h-full w-2.5 bg-black/55" />
      <div className="absolute left-2.5 top-0 h-full w-px bg-paper/10" />
      <div className="absolute right-0 top-0 h-full w-[3px] bg-black/25" />
      <div className="absolute inset-x-0 top-0 h-px bg-paper/10" />
      <div
        className={classNames(
          "absolute bg-[#d7b56a] text-center shadow-sm",
          hero ? "inset-x-6 top-10 h-16 -rotate-2" : "inset-x-4 top-7 h-11 -rotate-[1.5deg]",
        )}
      >
        <p className={classNames("font-mono tracking-[0.08em] text-void", hero ? "pt-2 text-[13px]" : "pt-1 text-[12px]")}>
          {tape.code}
        </p>
        <p className={classNames("font-cond tracking-[0.06em] text-void", hero ? "text-[15px]" : "text-[12px]")}>
          {tape.format}
        </p>
      </div>

      {tape.format === "MINIDV" || tape.format === "HI8" ? <TapeWindow /> : null}

      <div className={classNames("absolute inset-x-0 bottom-0", hero ? "p-5" : "p-3")}>
        <p className="font-mono text-[12px] tracking-[0.08em] text-paper">{tape.year}</p>
        <p className={classNames("mt-1 font-display leading-tight text-paper", hero ? "text-[28px]" : "line-clamp-3 text-[18px]")}>
          {tape.originalLabel}
        </p>
        {hero ? (
          <>
            <p className="mt-2 font-mono text-[12px] tracking-[0.06em] text-dust">
              {tape.camera}
              {density ? ` · ${density}` : ""}
            </p>
            <p className="mt-3 font-mono text-[12px] leading-relaxed tracking-[0.06em] text-dust">{tape.provenance}</p>
          </>
        ) : onShelf ? null : (
          <p className="mt-2 font-mono text-[12px] tracking-[0.06em] text-dust">
            {tape.camera}
            {density ? ` · ${density}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}

export function TapeSpine({
  format,
  code,
  year,
  note,
  muted = false,
  lit = false,
  held = false,
}: {
  format: TapeFormat;
  code?: string;
  year?: number | string;
  note?: string;
  muted?: boolean;
  lit?: boolean;
  held?: boolean;
}) {
  return (
    <div
      className={classNames(
        "tape-spine",
        `tape-spine-${format.toLowerCase()}`,
        muted && "tape-spine-muted",
        held && "tape-spine-held",
        lit && "tape-spine-lit",
      )}
    >
      <div className="tape-spine-tab" />
      {code ? <p className="tape-spine-code">{code}</p> : null}
      {year != null ? <p className="tape-spine-year">{year}</p> : null}
      {note ? <p className="tape-spine-note">{note}</p> : null}
    </div>
  );
}

export function UnopenedShell({ format, label }: { format: TapeFormat; label: string }) {
  const held = label === "HELD";
  return (
    <div className={`tape-slot tape-slot-${format.toLowerCase()}`} aria-hidden>
      <TapeSpine format={format} note={label} muted held={held} />
    </div>
  );
}

export function EmptySlot({ fade = 1 }: { fade?: number }) {
  return <div className="tape-empty" style={{ opacity: 0.42 * fade }} aria-hidden />;
}
