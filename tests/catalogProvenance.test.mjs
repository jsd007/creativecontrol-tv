import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Load trusted repo TS in memory so Node's tests can use the app's @/ aliases.
// No browser, network, emitted build files, or filesystem changes are involved.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(repoRoot, "src");
const nativeRequire = createRequire(import.meta.url);
const modules = new Map();

function sourceFile(specifier, from = sourceRoot) {
  const base = specifier.startsWith("@/")
    ? path.resolve(sourceRoot, specifier.slice(2))
    : path.resolve(from, specifier);
  assert.ok(base.startsWith(`${sourceRoot}${path.sep}`), "TS loader stays inside trusted src/");
  const filename = [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts")]
    .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  assert.ok(filename, `Resolve local module: ${specifier}`);
  assert.match(filename, /\.tsx?$/, "Only trusted TypeScript sources are transpiled");
  return filename;
}

function loadSource(specifier, from) {
  const filename = sourceFile(specifier, from);
  if (modules.has(filename)) return modules.get(filename).exports;
  const module = { exports: {} };
  modules.set(filename, module); // CommonJS-style caching also supports local cycles.
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText;
  const localRequire = (next) => next.startsWith("@/") || next.startsWith(".")
    ? loadSource(next, path.dirname(filename))
    : nativeRequire(next);
  new Function("require", "module", "exports", "__filename", "__dirname", compiled)(
    localRequire, module, module.exports, filename, path.dirname(filename),
  );
  return module.exports;
}

const { catalog, getClip, getProject, getTrack } = loadSource("@/data");
const { youtubeUploads, YOUTUBE_CHANNEL } = loadSource("@/data/youtube");
const { PUBLIC_PORTFOLIO_CLIP_IDS, PORTFOLIO_CLIP_IDS, PORTFOLIO_BLOCK } = loadSource("@/data/portfolio");
const { officialBlock, CHANNELS, channelLineup } = loadSource("@/lib/television");
const { relatedClips } = loadSource("@/lib/archiveQuery");

function unique(values, label) {
  assert.equal(new Set(values).size, values.length, `${label} are unique`);
}

test("catalog IDs, slugs, and public YouTube IDs have no duplicate records", () => {
  unique(catalog.clips.map((clip) => clip.id), "Clip IDs");
  unique(catalog.clips.map((clip) => clip.slug), "Clip slugs");
  unique(catalog.clips.filter((clip) => clip.youtubeId).map((clip) => clip.youtubeId), "Public YouTube IDs");
  unique(catalog.projects.map((project) => project.id), "Project IDs");
  unique(catalog.projects.map((project) => project.slug), "Project slugs");
  for (const id of PORTFOLIO_CLIP_IDS) assert.ok(getClip(id), `Shelf record ${id} resolves`);
});

test("external publishers do not inflate or contaminate the 366 CC uploads", () => {
  assert.equal(youtubeUploads.length, 366);
  assert.equal(YOUTUBE_CHANNEL.listedHere, 366);
  const officialIds = new Set(youtubeUploads.map((upload) => upload.id));
  assert.equal(officialIds.size, 366);
  for (const id of ["NjteP4qBqn4", "3UNVA-W_z6Q", "QWB_iPFa2OE", "wVnu7zi0daY"]) {
    assert.equal(officialIds.has(id), false, `${id} is not a CC channel upload`);
    assert.equal(catalog.clips.filter((clip) => clip.youtubeId === id).length, 1);
  }
  assert.equal(catalog.clips.filter((clip) => clip.youtubeId).length, 370);
});

test("public portfolio records retain exact publisher, source, role, and rights", () => {
  const expected = [
    ["c-portfolio-katrina", "HBO", "NjteP4qBqn4", "2022-08-15"],
    ["c-portfolio-coney", "Boardroom", "3UNVA-W_z6Q", "2020-01-30"],
    ["c-portfolio-meal-ticket", "Sports On Prime", "QWB_iPFa2OE", "2026-02-26"],
    ["c-34", "Lupe Fiasco", "wVnu7zi0daY", "2013-12-10"],
  ];
  for (const [id, publisher, youtubeId, published] of expected) {
    const clip = getClip(id);
    assert.equal(clip.contentState, "public-source");
    assert.equal(clip.visibility, "PUBLIC");
    assert.equal(clip.rightsStatus, "UNCLEAR");
    assert.equal(clip.youtubeId, youtubeId);
    assert.equal(clip.publicSource.publisher, publisher);
    assert.equal(clip.publicSource.published, published);
    assert.equal(clip.publicSource.url, `https://www.youtube.com/watch?v=${youtubeId}`);
    assert.equal(clip.dateExact, published);
    assert.equal(clip.sourceTapeId, "");
  }
  for (const id of ["c-portfolio-katrina", "c-portfolio-meal-ticket"]) {
    const credits = getClip(id).credits;
    assert.ok(credits.some((credit) => /Coodie.*Chike/.test(credit.name) && credit.role === "Executive producers"));
    assert.equal(credits.some((credit) => /Coodie.*Chike/.test(credit.name) && /director/i.test(credit.role)), false);
  }
  assert.equal(getClip("c-portfolio-meal-ticket").locationId, "", "No invented default New York filming city");
});

test("Old School Love is 2013, while Coney Island premiere and trailer dates stay distinct", () => {
  assert.equal(getClip("c-34").year, 2013);
  assert.equal(getTrack("old-school-love").year, 2013);
  assert.equal(getProject("old-school-love").year, 2013);
  assert.equal(getProject("coney").year, 2019);
  assert.equal(getClip("c-portfolio-coney").year, 2020);
  assert.match(getProject("coney").dateNote, /2019.*2020/);
});

test("empty tape references do not create fictitious cassette siblings or timecode neighbors", () => {
  for (const clip of catalog.clips.filter((record) => !record.sourceTapeId)) {
    const related = relatedClips(clip);
    assert.deepEqual(related.sameTape, []);
    assert.equal(related.before, undefined);
    assert.equal(related.after, undefined);
  }
});

test("the existing Benji trailer is promoted rather than duplicated", () => {
  const benji = catalog.clips.filter((clip) => clip.youtubeId === "BgXLP8rCwEE");
  assert.equal(benji.length, 1);
  assert.equal(benji[0].id, "c-104");
  assert.equal(benji[0].publicSource.publisher, "Creative Control");
  assert.equal(benji[0].rightsStatus, "UNCLEAR");
  assert.ok(benji[0].peopleIds.includes("benji"));
  assert.ok(benji[0].projectIds.includes("benji"));
});

test("five playable portfolio records share one editorial TV block", () => {
  assert.equal(PUBLIC_PORTFOLIO_CLIP_IDS.length, 5);
  const lineup = channelLineup(CHANNELS.find((channel) => channel.id === "broadcast"));
  const grouped = lineup.filter((clip) => officialBlock(clip) === PORTFOLIO_BLOCK);
  assert.deepEqual(new Set(grouped.map((clip) => clip.id)), new Set(PUBLIC_PORTFOLIO_CLIP_IDS));
  for (const id of PUBLIC_PORTFOLIO_CLIP_IDS) assert.equal(officialBlock(getClip(id)), PORTFOLIO_BLOCK);
});

test("Ernie Barnes is an announced, non-playable project reference, not available footage", () => {
  const ernie = getClip("c-portfolio-ernie");
  assert.equal(ernie.contentState, "project-reference");
  assert.equal(ernie.visibility, "COMING_SOON");
  assert.equal(ernie.youtubeId, undefined);
  assert.equal(ernie.previewVideo, undefined);
  assert.equal(ernie.rightsStatus, "UNCLEAR");
  assert.equal(ernie.publicSource.kind, "project-page");
  assert.equal(getProject("ernie-barnes").releaseStatus, "announced");
  assert.equal(channelLineup(CHANNELS.find((channel) => channel.id === "broadcast")).some((clip) => clip.id === ernie.id), false);
});
