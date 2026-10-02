import test from "node:test";
import assert from "node:assert/strict";
import { INITIAL_PLAYBACK_SESSION, createPlaybackSession, playbackSession } from "../src/lib/playbackSession.ts";

test("playback starts quiet and does not assume permission from an earlier visit", () => {
  assert.deepEqual(INITIAL_PLAYBACK_SESSION, { engaged: false, sound: "unset" });
  assert.deepEqual(playbackSession.getSnapshot(), INITIAL_PLAYBACK_SESSION);
  const first = createPlaybackSession();
  first.engage();
  assert.deepEqual(first.getSnapshot(), { engaged: true, sound: "on" });
  assert.deepEqual(createPlaybackSession().getSnapshot(), INITIAL_PLAYBACK_SESSION);
});

test("the first deliberate playback intent enables sound and later intent is idempotent", () => {
  const session = createPlaybackSession();
  const snapshots = [];
  session.subscribe(() => snapshots.push(session.getSnapshot()));
  session.engage();
  const engaged = session.getSnapshot();
  session.engage();
  assert.deepEqual(engaged, { engaged: true, sound: "on" });
  assert.equal(session.getSnapshot(), engaged);
  assert.deepEqual(snapshots, [engaged]);
});

test("a sound preference alone does not initiate playback", () => {
  for (const enabled of [true, false]) {
    const session = createPlaybackSession();
    session.setSoundEnabled(enabled);
    assert.deepEqual(session.getSnapshot(), { engaged: false, sound: enabled ? "on" : "off" });
    session.engage();
    assert.deepEqual(session.getSnapshot(), { engaged: true, sound: enabled ? "on" : "off" });
  }
});

test("new channel or program intent preserves an explicit mute choice", () => {
  const session = createPlaybackSession();
  session.engage();
  session.setSoundEnabled(false);
  const muted = session.getSnapshot();
  session.engage();
  assert.equal(session.getSnapshot(), muted);
  assert.deepEqual(muted, { engaged: true, sound: "off" });
  session.setSoundEnabled(true);
  session.engage();
  assert.deepEqual(session.getSnapshot(), { engaged: true, sound: "on" });
});

test("observed native player interaction records both engagement and the chosen volume state", () => {
  const session = createPlaybackSession();
  session.observeMuted(false);
  assert.deepEqual(session.getSnapshot(), { engaged: true, sound: "on" });
  session.observeMuted(true);
  assert.deepEqual(session.getSnapshot(), { engaged: true, sound: "off" });
  session.engage();
  assert.deepEqual(session.getSnapshot(), { engaged: true, sound: "off" });
  session.observeMuted(false);
  assert.deepEqual(session.getSnapshot(), { engaged: true, sound: "on" });
});

test("a muted native interaction still engages playback without forcing sound on", () => {
  const session = createPlaybackSession();
  session.observeMuted(true);
  session.engage();
  assert.deepEqual(session.getSnapshot(), { engaged: true, sound: "off" });
});

test("subscriptions publish only changed snapshots and unsubscribe cleanly", () => {
  const session = createPlaybackSession();
  let updates = 0;
  const unsubscribe = session.subscribe(() => updates++);
  const initial = session.getSnapshot();
  assert.equal(session.getSnapshot(), initial);
  assert.equal(updates, 0);
  session.setSoundEnabled(false);
  assert.equal(updates, 1);
  const silent = session.getSnapshot();
  assert.notEqual(silent, initial);
  session.setSoundEnabled(false);
  assert.equal(session.getSnapshot(), silent);
  assert.equal(updates, 1);
  session.observeMuted(true);
  assert.equal(updates, 2);
  const engaged = session.getSnapshot();
  assert.notEqual(engaged, silent);
  session.observeMuted(true);
  session.engage();
  assert.equal(session.getSnapshot(), engaged);
  assert.equal(updates, 2);
  unsubscribe();
  session.setSoundEnabled(true);
  assert.equal(updates, 2);
  assert.deepEqual(session.getSnapshot(), { engaged: true, sound: "on" });
});

test("session instances do not leak sound preference or notifications into one another", () => {
  const first = createPlaybackSession();
  const second = createPlaybackSession();
  let secondUpdates = 0;
  second.subscribe(() => secondUpdates++);
  first.observeMuted(true);
  assert.deepEqual(first.getSnapshot(), { engaged: true, sound: "off" });
  assert.deepEqual(second.getSnapshot(), INITIAL_PLAYBACK_SESSION);
  assert.equal(secondUpdates, 0);
  second.engage();
  assert.deepEqual(second.getSnapshot(), { engaged: true, sound: "on" });
  assert.deepEqual(first.getSnapshot(), { engaged: true, sound: "off" });
  assert.equal(secondUpdates, 1);
});
