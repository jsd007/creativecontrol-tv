export type YouTubePlayer = {
  playVideo(): void;
  cueVideoById(videoId: string): void;
  loadVideoById(videoId: string): void;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getPlayerState(): number;
  destroy(): void;
};

type PlayerEvent = { target: YouTubePlayer };
type PlayerOptions = {
  events: {
    onReady(event: PlayerEvent): void;
    onStateChange(event: PlayerEvent & { data: number }): void;
    onAutoplayBlocked(event: PlayerEvent): void;
    onError(event: PlayerEvent & { data: number }): void;
  };
};

export type YouTubeApi = {
  Player: new (iframe: HTMLIFrameElement, options: PlayerOptions) => YouTubePlayer;
};

type YouTubeWindow = Window & {
  YT?: YouTubeApi;
  onYouTubeIframeAPIReady?: () => void;
};

const apiListeners = new Set<(api: YouTubeApi) => void>();
let installedReadyHandler = false;

export function notifyYouTubeApiReady() {
  if (typeof window === "undefined") return;
  const api = (window as YouTubeWindow).YT;
  if (!api?.Player) return;
  apiListeners.forEach((listener) => listener(api));
}

/** next/script owns the download; this is the API's documented shared ready callback. */
export function subscribeYouTubeApiReady(listener: (api: YouTubeApi) => void) {
  if (typeof window === "undefined") return () => {};
  const youtubeWindow = window as YouTubeWindow;
  if (!installedReadyHandler) {
    const previous = youtubeWindow.onYouTubeIframeAPIReady;
    youtubeWindow.onYouTubeIframeAPIReady = () => {
      previous?.();
      notifyYouTubeApiReady();
    };
    installedReadyHandler = true;
  }
  apiListeners.add(listener);
  if (youtubeWindow.YT?.Player) listener(youtubeWindow.YT);
  return () => { apiListeners.delete(listener); };
}

/**
 * A commanded mute/unmute must be acknowledged before polling can represent a
 * native user choice. Otherwise the iframe's bootstrap mute or a browser's
 * blocked unmute could silently replace the user's requested sound preference.
 */
export function createPlayerSoundObserver() {
  let lastMuted: boolean | undefined;
  let pending: { muted: boolean; acknowledged: boolean; settleAfter: number } | undefined;

  return {
    expect(muted: boolean, now = Date.now()) {
      pending = { muted, acknowledged: false, settleAfter: now + 750 };
    },
    sample(muted: boolean, canObserve: boolean, now = Date.now()): boolean | undefined {
      if (pending) {
        if (muted === pending.muted) pending.acknowledged = true;
        if (!pending.acknowledged || now < pending.settleAfter) return undefined;
        lastMuted = pending.muted;
        pending = undefined;
      }
      if (!canObserve) return undefined;
      if (lastMuted === undefined) {
        lastMuted = muted;
        return undefined;
      }
      if (lastMuted === muted) return undefined;
      lastMuted = muted;
      return muted;
    },
  };
}
