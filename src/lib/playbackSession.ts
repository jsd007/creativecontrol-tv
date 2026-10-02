export type PlaybackSessionSnapshot = Readonly<{
  engaged: boolean;
  sound: "unset" | "on" | "off";
}>;

/** Permission is earned in this document, never restored as permission on a fresh visit. */
export const INITIAL_PLAYBACK_SESSION: PlaybackSessionSnapshot = Object.freeze({ engaged: false, sound: "unset" });

export function createPlaybackSession() {
  let snapshot = INITIAL_PLAYBACK_SESSION;
  const listeners = new Set<() => void>();

  function update(next: PlaybackSessionSnapshot) {
    if (next.engaged === snapshot.engaged && next.sound === snapshot.sound) return;
    snapshot = Object.freeze(next);
    listeners.forEach((listener) => listener());
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    /** A Play, channel, or program action can start media, but cannot undo an explicit mute. */
    engage() {
      update({ engaged: true, sound: snapshot.sound === "unset" ? "on" : snapshot.sound });
      return snapshot;
    },
    /** Selecting sound does not itself start a dormant video. */
    setSoundEnabled(on: boolean) {
      update({ ...snapshot, sound: on ? "on" : "off" });
    },
    /** Called only for a settled, active player, including the native YouTube controls. */
    observeMuted(muted: boolean) {
      update({ engaged: true, sound: muted ? "off" : "on" });
    },
  };
}

export const playbackSession = createPlaybackSession();
