"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { CHANNELS, accentNumber, onAirTitle } from "@/lib/television";
import { houseGsap } from "@/lib/gsap";
import { GATE_EASE } from "@/lib/motion";

type Props = {
  ch: number;
  counts: number[];
  reduced: boolean;
  onPick: (n: number) => void;
};

export function Tuner({ ch, counts, reduced, onPick }: Props) {
  const root = useRef<HTMLElement>(null);
  const hair = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const { gsap, Flip } = houseGsap();
      const nav = root.current;
      const line = hair.current;
      if (!nav || !line) return;
      const strip = nav.querySelector("[data-tuner-strip]");
      const active = nav.querySelector("[aria-pressed='true']");
      if (!(strip instanceof HTMLElement) || !(active instanceof HTMLElement)) return;
      active.scrollIntoView({ inline: "center", block: "nearest", behavior: first.current || reduced ? "instant" : "smooth" });
      const box = strip.getBoundingClientRect();
      const on = active.getBoundingClientRect();
      const x = on.left - box.left;
      const y = on.bottom - box.top - 1;
      const width = on.width;
      if (first.current || reduced) {
        gsap.set(line, { x, y, width, opacity: 1 });
        first.current = false;
        return;
      }
      const state = Flip.getState(line);
      gsap.set(line, { x, y, width, opacity: 1 });
      Flip.from(state, { duration: 0.34, ease: GATE_EASE });
    },
    { dependencies: [ch, reduced] },
  );

  return (
    <nav ref={root} className="tv-tuner relative mt-3" aria-label="Tuner">
      <p className="font-cond text-[11px] tracking-[0.22em] text-dust">TUNER</p>
      <div data-tuner-strip className="relative mt-2">
        <ul className="hand-strip flex flex-wrap gap-x-1 gap-y-2">
          {CHANNELS.map((item, i) => {
            const on = i === ch;
            const title = onAirTitle(item);
            const held = counts[i] ?? 0;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={`${item.n} ${item.name}, ${held} titles${title ? `, ${title}` : ""}`}
                  onClick={() => onPick(i)}
                  className={`min-w-[4.5rem] px-1.5 py-1 text-left ${on ? "text-paper" : "text-dust hover:text-bone"}`}
                >
                  <span className="flex items-baseline gap-2">
                    <span className={`font-cond text-[20px] leading-none tracking-[0.08em] md:text-[24px] ${on ? accentNumber(item.accent) : ""}`}>
                      {item.n}
                    </span>
                    <span className="font-mono text-[10px] leading-none tracking-[0.1em]">{held}</span>
                  </span>
                  <span className="tv-tuner-name mt-1 block font-cond text-[10px] tracking-[0.16em]">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <span ref={hair} className="tv-tuner-hair" aria-hidden />
      </div>
    </nav>
  );
}
