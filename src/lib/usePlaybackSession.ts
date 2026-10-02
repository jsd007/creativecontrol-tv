"use client";

import { useSyncExternalStore } from "react";
import { INITIAL_PLAYBACK_SESSION, playbackSession } from "./playbackSession";

export function usePlaybackSession() {
  return useSyncExternalStore(playbackSession.subscribe, playbackSession.getSnapshot, () => INITIAL_PLAYBACK_SESSION);
}
