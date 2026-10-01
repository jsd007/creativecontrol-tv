import test from "node:test";
import assert from "node:assert/strict";
import { clipHref, lensHref, parseLensReturn, tapeHref } from "../src/lib/lensNavigation.ts";

test("World records return to their selected city, year, and presentation mode", () => {
  const returnPath = lensHref("/world", "present=1&fly=1", { city: "new-york", year: "2012" });
  const href = new URL(clipHref("a public record", returnPath), "https://archive.local");
  assert.equal(href.pathname, "/clip/a%20public%20record");
  assert.equal(parseLensReturn(href.searchParams.get("from")).href, "/world?city=new-york&year=2012&present=1");
});

test("Index return context retains all search filters and the opened refine controls", () => {
  const context = "q=Chicago+studio&era=dropout&year=2004&location=chicago&person=ye&track=wire&album=dropout&project=wire&event=tour&type=Studio&collection=classics&month=02&day=14&decade=2000s&refine=1&present=1";
  const back = new URL(parseLensReturn(lensHref("/archive", context)).href, "https://archive.local");
  const expected = new URLSearchParams(context);
  for (const [key, value] of expected) assert.equal(back.searchParams.get(key), value);
});

test("Tapes preserve source, scope, search and inventory expansion through a source file", () => {
  const context = lensHref("/tapes", "open=t-0217&scope=CAMERA&q=Chicago&all=1&present=1");
  const file = new URL(tapeHref("t-0217", context), "https://archive.local");
  assert.equal(file.pathname, "/tapes/t-0217");
  assert.equal(parseLensReturn(file.searchParams.get("from")).href, context);
});

test("Timeline preserves through-line and date depth", () => {
  const context = "/timeline?through=ye&year=2004&month=2&day=14&present=1";
  assert.equal(parseLensReturn(context).href, context);
  assert.equal(parseLensReturn(context).label, "YOUR TIMELINE");
});

test("new context remains compatible with TV selection links", () => {
  const context = "/tv?ch=07&clip=tear-up&block=TEAR+UP&q=Round&page=2&present=1";
  assert.equal(parseLensReturn(context).href, context);
  assert.equal(parseLensReturn(context).label, "YOUR TV SELECTION");
});

test("unknown parameters never leak between lenses and empty patches remove state", () => {
  assert.equal(lensHref("/world", "city=chicago&year=2004&q=hello&redirect=evil", { year: null }), "/world?city=chicago");
  assert.equal(parseLensReturn("/archive?person=ye&next=https://evil.example").href, "/archive?person=ye");
});

test("external URLs, disguised paths, fragments and excessive inputs are rejected", () => {
  for (const raw of [undefined, "", "https://evil.example", "//evil.example/world", "/\\evil.example/world", "/world-other", "/people/coodie", "/world/../people", "/world#https://evil.example", `/archive?q=${"x".repeat(2048)}`]) {
    assert.equal(parseLensReturn(raw), undefined, raw);
  }
  assert.equal(clipHref("safe", "https://evil.example"), "/clip/safe");
  assert.equal(tapeHref("t-0217", "//evil.example"), "/tapes/t-0217");
});

test("malformed or repeated values are bounded and normalization is stable", () => {
  assert.equal(parseLensReturn(`/archive?q=${"x".repeat(513)}&year=2004`).href, "/archive?year=2004");
  assert.equal(parseLensReturn("/world?city=chicago&city=new-york").href, "/world?city=chicago");
  const href = lensHref("/archive", "q=A%26B&type=Interview");
  assert.equal(parseLensReturn(href).href, href);
});
