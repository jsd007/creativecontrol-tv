"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

let ready = false;

/** Register once on the client. ScrollTrigger stays off — the archive is not a scroll story. */
export function houseGsap() {
  if (!ready && typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP, Flip);
    ready = true;
  }
  return { gsap, Flip };
}

export { gsap, Flip };
