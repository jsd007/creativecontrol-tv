import test from "node:test";
import assert from "node:assert/strict";
import { ALL_PROGRAMS, TV_STARTERS, tvChannel, tvClipHref, tvHref, tvNeighbors, tvReturnHref, tvSelection } from "../src/lib/tvNavigation.ts";

const row = (slug, index, block = "TEAR UP", year = 2014) => ({
  clip: { id: slug, slug, title: `Original ${slug}`, year }, title: slug, block, index,
});
const programs = TV_STARTERS.map((slug, index) => row(slug, index));

test("starting selection contains six public entry points in an intentional order", () => {
  const selected = tvSelection([...programs].reverse(), true, "", "");
  assert.deepEqual(selected.map((program) => program.clip.slug), [...TV_STARTERS]);
  assert.equal(selected[0].clip.slug, "wiki-wikispeaks");
});

test("search and block filters use one sequence and preserve source-title search", () => {
  const list = [row("one", 0), row("two", 1, "CHANNEL ZERO", 2016), row("three", 2)];
  assert.deepEqual(tvSelection(list, true, "TEAR UP", "2014").map((program) => program.index), [0, 2]);
  assert.deepEqual(tvSelection(list, true, ALL_PROGRAMS, "original TWO").map((program) => program.index), [1]);
  assert.equal(tvSelection(list, true, "TEAR UP", "2016").length, 0);
});

test("house channels retain their complete lineup, including more than eight titles", () => {
  const list = Array.from({ length: 12 }, (_, i) => row(`example-${i}`, i));
  assert.equal(tvSelection(list, false, "", "").length, 12);
});

test("previous/next stay within the selected sequence and stop at its ends", () => {
  assert.equal(tvNeighbors(programs, programs[0].clip.id).previous, undefined);
  assert.equal(tvNeighbors(programs, programs[0].clip.id).next, programs[1]);
  assert.equal(tvNeighbors(programs, programs[5].clip.id).next, undefined);
  assert.equal(tvNeighbors(programs, "outside").next, programs[0]);
  assert.equal(tvNeighbors([], "outside").next, undefined);
});

test("invalid channel links fall back safely instead of indexing a fractional channel", () => {
  for (const raw of [null, "", "7.5", "-1", "9", "NaN", "Infinity"]) assert.equal(tvChannel(raw, 9, 7), 7);
  assert.equal(tvChannel("00", 9, 7), 0);
  assert.equal(tvChannel("08", 9, 7), 8);
});

test("program links preserve presentation and guide context while encoding values", () => {
  const href = tvHref("present=1&block=TEAR+UP&q=Round&page=3", { ch: "07", clip: "tear-up-round-1", page: null });
  const params = new URL(href, "http://localhost").searchParams;
  assert.equal(params.get("present"), "1");
  assert.equal(params.get("block"), "TEAR UP");
  assert.equal(params.get("clip"), "tear-up-round-1");
  assert.equal(params.get("q"), "Round");
  assert.equal(params.has("page"), false);
});

test("archive details return to the chosen title and preserve guide context", () => {
  const details = new URL(tvClipHref("tear-up-round-2", "/tv?ch=07&block=TEAR+UP&q=Round&page=1&present=1"), "http://localhost");
  assert.equal(details.pathname, "/clip/tear-up-round-2");
  const back = new URL(tvReturnHref(details.searchParams.get("tv")), "http://localhost");
  assert.equal(back.searchParams.get("clip"), "tear-up-round-2");
  assert.equal(back.searchParams.get("block"), "TEAR UP");
  assert.equal(back.searchParams.get("q"), "Round");
  assert.equal(back.searchParams.get("page"), "1");
  assert.equal(back.searchParams.get("present"), "1");
});

test("return links reject external destinations and discard unrelated parameters", () => {
  for (const raw of [undefined, "https://example.com", "//example.com/tv", "/tv-other?ch=07", `/tv?q=${"x".repeat(2048)}`]) assert.equal(tvReturnHref(raw), undefined);
  assert.equal(tvReturnHref("/tv?ch=07&redirect=https%3A%2F%2Fexample.com"), "/tv?ch=07");
});

test("journey guide and neighbors follow editorial order rather than upload or lineup order", () => {
  const list = [row("part-3", 0), row("part-1", 14), row("part-2", 9)];
  const sequence = tvSelection(list, true, "", "", ["part-1", "part-2", "part-3"]);
  assert.deepEqual(sequence.map((item) => item.index), [14, 9, 0]);
  assert.equal(tvNeighbors(sequence, "part-2").next.clip.id, "part-3");
  assert.equal(tvNeighbors(sequence, "part-2").previous.clip.id, "part-1");
});

test("clip detail returns retain only known journey IDs", () => {
  const details = new URL(tvClipHref("channel-zero-homecoming-2", "/tv?ch=07&journey=homecoming&present=1"), "https://archive.local");
  const back = new URL(tvReturnHref(details.searchParams.get("tv")), "https://archive.local");
  assert.equal(back.searchParams.get("journey"), "homecoming");
  assert.equal(back.searchParams.get("clip"), "channel-zero-homecoming-2");
  assert.equal(tvReturnHref("/tv?ch=07&journey=made-up"), "/tv?ch=07");
});
