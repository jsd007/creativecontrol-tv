"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { youtubeEmbedSrc, youtubeThumbnail } from "@/data/youtube";
import { classNames } from "@/lib/format";
import { playbackSession } from "@/lib/playbackSession";
import { usePlaybackSession } from "@/lib/usePlaybackSession";
import { createPlayerSoundObserver, notifyYouTubeApiReady, subscribeYouTubeApiReady, type YouTubePlayer } from "@/lib/youtubePlayer";

type Props = {
  youtubeId: string;
  title: string;
  className?: string;
  large?: boolean;
  publisher?: string;
  autoplay?: boolean;
  playRequest?: number;
};

type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "ended" | "blocked" | "native" | "error";

export function BroadcastPlayer({
  youtubeId,
  title,
  className = "",
  large = false,
  publisher = "CC-TV",
  autoplay = false,
  playRequest = 0,
}: Props) {
  const session = usePlaybackSession();
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const host = useRef<HTMLDivElement>(null);
  const iframe = useRef<HTMLIFrameElement | null>(null);
  const player = useRef<YouTubePlayer | null>(null);
  const isReady = useRef(false);
  const loadedVideo = useRef("");
  const handledRequest = useRef<number | undefined>(undefined);
  const appliedSound = useRef<boolean | undefined>(undefined);
  const soundObserver = useRef(createPlayerSoundObserver());
  const latest = useRef({ youtubeId, title, autoplay, playRequest });
  latest.current = { youtubeId, title, autoplay, playRequest };
  const wantsSound = session.sound !== "off";

  const applySound = useCallback((target: YouTubePlayer, force = false) => {
    const soundOn = playbackSession.getSnapshot().sound !== "off";
    if (!force && appliedSound.current === soundOn) return;
    appliedSound.current = soundOn;
    soundObserver.current.expect(!soundOn);
    if (soundOn) target.unMute();
    else target.mute();
  }, []);

  const requestPlayback = useCallback(() => {
    playbackSession.engage();
    setStatus("loading");
    setActive(true);
    if (isReady.current && player.current) {
      applySound(player.current, true);
      player.current.playVideo();
      if (player.current.getPlayerState() === 1) setStatus("playing");
    }
  }, [applySound]);

  // A fresh URL never requests sound. TV only opts in after an actual site intent.
  useEffect(() => {
    if (autoplay && session.engaged && !active) {
      setStatus("loading");
      setActive(true);
    }
  }, [active, autoplay, session.engaged]);

  useEffect(() => {
    if (!active || !host.current) return;
    let disposed = false;
    const container = host.current;
    const current = latest.current;
    const frame = document.createElement("iframe");
    frame.src = youtubeEmbedSrc(current.youtubeId, {
      autoplay: true,
      mute: playbackSession.getSnapshot().sound === "off",
      enableJsApi: true,
      origin: window.location.origin,
    });
    frame.title = current.title;
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.className = "absolute inset-0 h-full w-full";
    container.appendChild(frame);
    iframe.current = frame;
    loadedVideo.current = current.youtubeId;
    handledRequest.current = undefined;
    const nativeFallback = window.setTimeout(() => {
      if (!disposed && !isReady.current) setStatus("native");
    }, 12_000);

    const unsubscribe = subscribeYouTubeApiReady((api) => {
      if (disposed || player.current) return;
      player.current = new api.Player(frame, {
        events: {
          onReady(event) {
            if (disposed) return;
            player.current = event.target;
            isReady.current = true;
            window.clearTimeout(nativeFallback);
            setReady(true);
          },
          onStateChange(event) {
            if (disposed || !isReady.current) return;
            if (event.data === 1) setStatus("playing");
            else if (event.data === 2) setStatus("paused");
            else if (event.data === 0) setStatus("ended");
            else if (event.data === 3) setStatus("loading");
          },
          onAutoplayBlocked() {
            // Ignore a late blocked callback if the current program is already playing.
            if (!disposed && player.current?.getPlayerState() !== 1) setStatus("blocked");
          },
          onError() {
            if (!disposed) setStatus("error");
          },
        },
      });
    });

    const observeNativeSound = window.setInterval(() => {
      const target = player.current;
      if (disposed || !isReady.current || !target) return;
      const state = target.getPlayerState();
      // Native playback may start before a state listener attaches. Reconcile
      // from the API's actual state, without issuing another playback command.
      if (state === 1) setStatus("playing");
      else if (state === 2) setStatus((current) => current === "playing" ? "paused" : current);
      const nativeMute = soundObserver.current.sample(target.isMuted(), state === 1 || state === 2);
      if (nativeMute !== undefined) playbackSession.observeMuted(nativeMute);
    }, 250);

    return () => {
      disposed = true;
      unsubscribe();
      window.clearTimeout(nativeFallback);
      window.clearInterval(observeNativeSound);
      isReady.current = false;
      setReady(false);
      player.current?.destroy();
      player.current = null;
      iframe.current = null;
      appliedSound.current = undefined;
      container.replaceChildren();
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    if (iframe.current) iframe.current.title = title;
    const shouldPlay = autoplay && playbackSession.getSnapshot().engaged;
    const changedVideo = loadedVideo.current !== youtubeId;
    if (!ready || !player.current) {
      // A rapid channel switch while the API downloads must not leave the old video visible.
      if (changedVideo && iframe.current) {
        loadedVideo.current = youtubeId;
        iframe.current.src = youtubeEmbedSrc(youtubeId, {
          autoplay: shouldPlay,
          mute: playbackSession.getSnapshot().sound === "off",
          enableJsApi: true,
          origin: window.location.origin,
        });
      }
      return;
    }
    const target = player.current;
    if (changedVideo) {
      loadedVideo.current = youtubeId;
      handledRequest.current = playRequest;
      setStatus(shouldPlay ? "loading" : "idle");
      if (shouldPlay) target.loadVideoById(youtubeId);
      else target.cueVideoById(youtubeId);
      applySound(target, true);
    } else if (handledRequest.current !== playRequest) {
      const firstReady = handledRequest.current === undefined;
      handledRequest.current = playRequest;
      applySound(target, true);
      if (shouldPlay || firstReady) {
        setStatus("loading");
        target.playVideo();
        // The native iframe can already be playing before the API finishes loading.
        if (target.getPlayerState() === 1) setStatus("playing");
      }
    }
  }, [active, applySound, autoplay, playRequest, ready, title, youtubeId]);

  useEffect(() => {
    if (ready && player.current) applySound(player.current);
  }, [applySound, ready, session.sound]);

  const statusMessage = status === "loading" ? `Loading ${title}.`
    : status === "playing" ? `Playing ${title}.`
      : status === "blocked" ? "Playback needs a tap in this browser. Use the retry button or the video’s own Play button."
        : "";

  return (
    <div className={classNames("viewfinder viewfinder-br relative overflow-hidden bg-ink", className)}>
      {active ? (
        <>
          <Script id="youtube-iframe-api" src="https://www.youtube.com/iframe_api" strategy="afterInteractive" onReady={notifyYouTubeApiReady} onError={() => setStatus("native")} />
          <div ref={host} className="absolute inset-0" />
          {status === "blocked" ? (
            <button type="button" onClick={requestPlayback} aria-label={`Play ${title} ${wantsSound ? "with sound" : "muted"}`} className="absolute right-2 top-2 z-20 min-h-11 max-w-[calc(100%-1rem)] border border-paper/40 bg-void/95 px-3 py-1 text-paper">
              <span className="block font-mono text-[8px] leading-3 tracking-[0.08em]">PLAYBACK NEEDS A TAP</span>
              <span className="block font-cond text-[13px] leading-5 tracking-[0.18em]">PLAY · {wantsSound ? "SOUND ON" : "MUTED"}</span>
            </button>
          ) : null}
          {status === "native" ? (
            <p className="pointer-events-none absolute left-3 top-12 z-20 bg-void/90 px-3 py-2 font-mono text-[10px] text-paper">Use the video’s Play button to start playback.</p>
          ) : null}
          {status === "error" ? (
            <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer" className="absolute left-3 top-12 z-20 bg-void/95 px-3 py-3 font-mono text-[10px] text-paper underline underline-offset-4">Video unavailable here. Watch on YouTube ↗</a>
          ) : null}
        </>
      ) : (
        <button type="button" aria-label={`Play ${title} ${wantsSound ? "with sound" : "muted"}`} onClick={requestPlayback} className="absolute inset-0 block h-full w-full">
          {/* Official YouTube thumbnail URL. Not downloaded into the repo. */}
          <Image src={youtubeThumbnail(youtubeId)} alt="" fill sizes={large ? "(max-width: 767px) 100vw, 70vw" : "(max-width: 767px) 50vw, 33vw"} unoptimized className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-void/90 px-3 py-2 font-cond text-[13px] tracking-[0.22em] text-paper">
            PLAY · {wantsSound ? "SOUND ON" : "MUTED"}
          </span>
        </button>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-3">
        <span className="font-mono text-[9px] tracking-[0.16em] text-paper/80">PUBLIC BROADCAST</span>
        {large ? <span className="font-mono text-[9px] tracking-[0.16em] text-paper/70">{publisher.toUpperCase()}</span> : null}
      </div>
      <span className="sr-only" role="status" aria-live="polite">{statusMessage}</span>
    </div>
  );
}
