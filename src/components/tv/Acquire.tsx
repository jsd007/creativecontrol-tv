"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import type { ChannelAccent } from "@/lib/television";
import { accentNumber } from "@/lib/television";
import { houseGsap } from "@/lib/gsap";
import { GATE_EASE, MOTION } from "@/lib/motion";

type Props = {
  on: boolean;
  accent: ChannelAccent;
  n: string;
  reduced: boolean;
};

export function Acquire({ on, accent, n, reduced }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tick = on ? `${n}-${accent}` : "";

  useGSAP(
    () => {
      if (!root.current || reduced || !on) return;
      const { gsap } = houseGsap();
      const q = gsap.utils.selector(root);
      const ms = MOTION.acquireMs / 1000;
      gsap
        .timeline({ defaults: { ease: GATE_EASE } })
        .fromTo(q(".tv-wipe-black"), { opacity: 0.92 }, { opacity: 0, duration: ms }, 0)
        .fromTo(q(".tv-wipe-bar"), { xPercent: -42, opacity: 1 }, { xPercent: 520, opacity: 0, duration: ms }, 0)
        .fromTo(
          q(".tv-wipe-stamp"),
          { opacity: 0.22, letterSpacing: "0.28em", scale: 1.06 },
          { opacity: 1, letterSpacing: "0.04em", scale: 1, duration: ms * 0.55 },
          0,
        )
        .to(q(".tv-wipe-stamp"), { opacity: 0, duration: ms * 0.4 }, ms * 0.6);
    },
    { scope: root, dependencies: [tick, reduced, on] },
  );

  if (!on || reduced) return null;

  return (
    <div ref={root} className="acquire" aria-hidden>
      <div className="tv-wipe-black" />
      <div className={`tv-wipe-bar acquire-bar--${accent}`} />
      <p className={`tv-wipe-stamp acquire-stamp font-cond ${accentNumber(accent)}`}>{n}</p>
    </div>
  );
}
