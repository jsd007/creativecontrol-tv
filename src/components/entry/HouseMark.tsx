"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { BrandStill } from "@/components/brand/BrandStill";
import { houseGsap } from "@/lib/gsap";
import { GATE_EASE } from "@/lib/motion";

export function HouseMark({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const { gsap } = houseGsap();
      if (!root.current || reduced) return;
      const q = gsap.utils.selector(root);
      const still = q(".house-lockup-still");
      const gate = q(".house-mark-gate");
      const sheen = q(".house-mark-sheen");

      gsap.set(still, { opacity: 0, scale: 0.986 });
      gsap.set(gate, { opacity: 0 });
      gsap.set(sheen, { xPercent: -78, opacity: 0 });

      gsap
        .timeline({ defaults: { ease: GATE_EASE } })
        .to(gate, { opacity: 1, duration: 0.7 }, 0)
        .to(still, { opacity: 1, scale: 1, duration: 0.9 }, 0.06)
        .to(sheen, { xPercent: 118, opacity: 0.28, duration: 1.02 }, 0.42)
        .to(sheen, { opacity: 0, duration: 0.2 }, 1.36);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className={`house-mark ${reduced ? "is-still" : ""}`} role="img" aria-label="Creative Control">
      <div className="house-mark-gate" aria-hidden>
        <i className="house-reg house-reg-tl" />
        <i className="house-reg house-reg-tr" />
        <i className="house-reg house-reg-bl" />
        <i className="house-reg house-reg-br" />
      </div>
      <div className="house-mark-stage">
        <div className="house-mark-plate">
          <BrandStill decorative priority className="house-lockup-still" />
          {reduced ? null : <div className="house-mark-sheen" />}
        </div>
      </div>
    </div>
  );
}
