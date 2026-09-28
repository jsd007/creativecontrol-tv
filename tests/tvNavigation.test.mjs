import test from "node:test";
import assert from "node:assert/strict";
import { ALL_PROGRAMS, TV_STARTERS, tvChannel, tvHref, tvNeighbors, tvSelection } from "../src/lib/tvNavigation.ts";

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
