"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { houseGsap } from "@/lib/gsap";
import { EASE_GATE, GATE_EASE, MOTION, usePrefersReducedMotion } from "@/lib/motion";

export function ClipStage({
  cassette,
  picture,
  file,
}: {
  cassette: React.ReactNode;
  picture: React.ReactNode;
  file: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      const { gsap } = houseGsap();
      if (!root.current) return;
      const q = gsap.utils.selector(root);

      if (reduced) {
        gsap.set(q(".clip-aperture"), { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
        gsap.set(q(".clip-cassette"), { y: 0, rotate: 0, opacity: 1 });
        gsap.set(q(".clip-hair"), { scaleX: 1 });
        gsap.set(q(".clip-file"), { y: 0, opacity: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: GATE_EASE } })
        .fromTo(
          q(".clip-aperture"),
          { clipPath: "inset(7% 9% 7% 9%)", opacity: 0.76 },
          { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: MOTION.speak },
          0,
        )
        .fromTo(
          q(".clip-cassette"),
          { y: 16, rotate: -2.1, opacity: 0 },
          { y: 0, rotate: 0, opacity: 1, duration: MOTION.tape },
          0.05,
        )
        .fromTo(q(".clip-hair"), { scaleX: 0 }, { scaleX: 1, duration: 0.4, transformOrigin: "left center" }, 0.1)
        .fromTo(q(".clip-file"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.18);
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div ref={root} className="mt-6">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(140px,188px)_minmax(0,1fr)] lg:gap-8">
        <div className="clip-cassette max-w-[188px]">{cassette}</div>
        <div className="clip-gate relative">
          <div className="pointer-events-none absolute -left-px -right-px -top-px h-px bg-leader/50" />
          <div className="clip-aperture relative bg-void">
            <Sprocket side="left" />
            <Sprocket side="right" />
            <div className="relative">{picture}</div>
          </div>
          <div className="pointer-events-none absolute -bottom-px -left-px -right-px h-px bg-paper/15" />
        </div>
      </div>
      <div className="clip-hair mt-8 h-px origin-left bg-leader/55" />
      <div className="clip-file mt-7">{file}</div>
    </div>
  );
}

function Sprocket({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 z-[3] w-[11px] ${side === "left" ? "left-0" : "right-0"}`}
      style={{
        background:
          "repeating-linear-gradient(180deg, transparent 0 8px, #070706 8px 14px, transparent 14px 21px)",
        boxShadow:
          side === "left"
            ? "inset -1px 0 0 rgba(239,230,214,0.14)"
            : "inset 1px 0 0 rgba(239,230,214,0.14)",
      }}
    />
  );
}

export function RelatedReveal({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
      initial={reduced ? false : { opacity: 0, clipPath: "inset(0 14% 0 0)" }}
      animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: reduced ? 0 : 0.7, ease: EASE_GATE, delay: reduced ? 0 : 0.1 }}
    >
      {children}
    </motion.div>
  );
}
