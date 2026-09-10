"use client";

import { useEffect, useRef } from "react";

/** James-authorized jeen-yuhs loading film as a muted home texture. Not the Framer reel. */
export function LivingField() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    node.muted = true;
    node.defaultMuted = true;
    node.volume = 0;
    const lock = () => {
      node.muted = true;
      node.volume = 0;
    };
    lock();
    const play = () => {
      lock();
      void node.play().catch(() => undefined);
    };
    play();
    node.addEventListener("volumechange", lock);
    return () => node.removeEventListener("volumechange", lock);
  }, []);

  return (
    <video
      ref={ref}
      className="opening-living"
      src="/brand/jeenyuhs-loading.mp4"
      muted
      playsInline
      autoPlay
      loop
      preload="auto"
      disablePictureInPicture
      controls={false}
      aria-hidden
    />
  );
}
