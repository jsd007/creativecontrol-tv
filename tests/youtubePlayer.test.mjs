import test from "node:test";
import assert from "node:assert/strict";
import { createPlayerSoundObserver, subscribeYouTubeApiReady } from "../src/lib/youtubePlayer.ts";
import { youtubeEmbedSrc } from "../src/data/youtube.ts";

test("bootstrap sound state establishes a baseline without claiming a native user choice", () => {
  const observer = createPlayerSoundObserver();
  assert.equal(observer.sample(true, true, 0), undefined);
  assert.equal(observer.sample(true, true, 250), undefined);
  assert.equal(observer.sample(false, true, 500), false);
  assert.equal(observer.sample(false, true, 750), undefined);
});

test("a blocked unmute cannot silently replace the requested sound preference", () => {
  const observer = createPlayerSoundObserver();
  observer.expect(false, 0);
  for (const now of [0, 250, 749, 750, 1_000, 10_000, 1_000_000]) {
    assert.equal(observer.sample(true, true, now), undefined);
  }
  // A late successful unmute is an acknowledgement, not an instruction to change preference.
  assert.equal(observer.sample(false, true, 1_000_250), undefined);
  assert.equal(observer.sample(true, true, 1_000_500), true);
});

test("an acknowledged sound command stays quiet throughout the 750ms settle window", () => {
  const observer = createPlayerSoundObserver();
  observer.expect(false, 100);
  assert.equal(observer.sample(false, true, 200), undefined);
  assert.equal(observer.sample(true, true, 400), undefined);
  assert.equal(observer.sample(true, true, 849), undefined);
  assert.equal(observer.sample(false, true, 850), undefined);
  assert.equal(observer.sample(true, true, 851), true);
});

test("a native change after acknowledgement is observable at the settle boundary", () => {
  const observer = createPlayerSoundObserver();
  observer.expect(false, 0);
  assert.equal(observer.sample(false, true, 100), undefined);
  assert.equal(observer.sample(true, true, 749), undefined);
  assert.equal(observer.sample(true, true, 750), true);
});

test("an explicit mute must be acknowledged before a native unmute can change preference", () => {
  const observer = createPlayerSoundObserver();
  observer.expect(true, 0);
  assert.equal(observer.sample(false, true, 900), undefined);
  assert.equal(observer.sample(true, true, 950), undefined);
  assert.equal(observer.sample(false, true, 951), false);
});

test("paused players can report native volume choices without requesting playback", () => {
  const observer = createPlayerSoundObserver();
  observer.expect(false, 0);
  // The player passes canObserve=true for both playing and paused states.
  assert.equal(observer.sample(false, true, 750), undefined);
  assert.equal(observer.sample(true, true, 1_000), true);
  assert.equal(observer.sample(false, true, 1_250), false);
});

test("idle, buffering, or unavailable observations neither emit nor replace the baseline", () => {
  const observer = createPlayerSoundObserver();
  assert.equal(observer.sample(true, false, 0), undefined);
  assert.equal(observer.sample(false, true, 250), undefined);
  assert.equal(observer.sample(true, false, 500), undefined);
  assert.equal(observer.sample(true, false, 750), undefined);
  assert.equal(observer.sample(true, true, 1_000), true);
});

test("command acknowledgement can settle while inactive but native changes remain gated", () => {
  const observer = createPlayerSoundObserver();
  observer.expect(false, 0);
  assert.equal(observer.sample(false, false, 100), undefined);
  assert.equal(observer.sample(false, false, 750), undefined);
  assert.equal(observer.sample(true, false, 1_000), undefined);
  assert.equal(observer.sample(true, true, 1_250), true);
});

test("repeated samples do not re-emit the same native volume choice", () => {
  const observer = createPlayerSoundObserver();
  observer.expect(false, 0);
  assert.equal(observer.sample(false, true, 750), undefined);
  assert.equal(observer.sample(true, true, 1_000), true);
  for (const now of [1_250, 1_500, 10_000]) assert.equal(observer.sample(true, true, now), undefined);
  assert.equal(observer.sample(false, true, 10_250), false);
  assert.equal(observer.sample(false, true, 10_500), undefined);
});

test("a superseding sound command discards the old acknowledgement", () => {
  const observer = createPlayerSoundObserver();
  observer.expect(false, 0);
  assert.equal(observer.sample(false, true, 100), undefined);
  observer.expect(true, 200);
  assert.equal(observer.sample(false, true, 950), undefined);
  assert.equal(observer.sample(false, true, 1_000), undefined);
  assert.equal(observer.sample(true, true, 1_250), undefined);
  assert.equal(observer.sample(false, true, 1_500), false);
});

test("retrying a command starts a new settle window rather than reusing an old acknowledgement", () => {
  const observer = createPlayerSoundObserver();
  observer.expect(false, 0);
  assert.equal(observer.sample(false, true, 100), undefined);
  observer.expect(false, 500);
  assert.equal(observer.sample(true, true, 900), undefined);
  assert.equal(observer.sample(false, true, 1_250), undefined);
  assert.equal(observer.sample(true, true, 1_251), true);
});

test("the YouTube API readiness subscription is safe during server rendering", () => {
  let calls = 0;
  const unsubscribe = subscribeYouTubeApiReady(() => calls++);
  unsubscribe();
  assert.equal(calls, 0);
});

test("default embed links remain quiet, inline, and privacy-enhanced", () => {
  const url = new URL(youtubeEmbedSrc("Gk67adLmz3Q"));
  assert.equal(url.origin, "https://www.youtube-nocookie.com");
  assert.equal(url.pathname, "/embed/Gk67adLmz3Q");
  assert.equal(url.searchParams.get("autoplay"), "0");
  assert.equal(url.searchParams.get("mute"), "1");
  assert.equal(url.searchParams.get("playsinline"), "1");
  assert.equal(url.searchParams.get("rel"), "0");
  assert.equal(url.searchParams.has("enablejsapi"), false);
  assert.equal(url.searchParams.has("origin"), false);
});

test("interactive embed links explicitly allow intended playback and origin-scoped API control", () => {
  const origin = "https://creativecontrol-tv.vercel.app";
  const url = new URL(youtubeEmbedSrc("Gk67adLmz3Q", { autoplay: true, mute: false, enableJsApi: true, origin }));
  assert.equal(url.searchParams.get("autoplay"), "1");
  assert.equal(url.searchParams.get("mute"), "0");
  assert.equal(url.searchParams.get("enablejsapi"), "1");
  assert.equal(url.searchParams.get("origin"), origin);
  const noApi = new URL(youtubeEmbedSrc("Gk67adLmz3Q", { origin }));
  assert.equal(noApi.searchParams.has("enablejsapi"), false);
  assert.equal(noApi.searchParams.has("origin"), false);
  const noOrigin = new URL(youtubeEmbedSrc("Gk67adLmz3Q", { enableJsApi: true }));
  assert.equal(noOrigin.searchParams.get("enablejsapi"), "1");
  assert.equal(noOrigin.searchParams.has("origin"), false);
});
