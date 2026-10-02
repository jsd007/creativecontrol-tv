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
  const loadedModule = { exports: {} };
  modules.set(filename, loadedModule); // CommonJS-style caching also supports local cycles.
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
    localRequire, loadedModule, loadedModule.exports, filename, path.dirname(filename),
  );
  return loadedModule.exports;
}

const { catalog, getClip, getProject, getTrack, getPerson, clipsForPerson, transcriptForClip, transcriptSearchText } = loadSource("@/data");
const { youtubeUploads, YOUTUBE_CHANNEL } = loadSource("@/data/youtube");
const { PUBLIC_PORTFOLIO_CLIP_IDS, PORTFOLIO_CLIP_IDS, PORTFOLIO_BLOCK } = loadSource("@/data/portfolio");
const { officialBlock, CHANNELS, channelLineup } = loadSource("@/lib/television");
const { relatedClips } = loadSource("@/lib/archiveQuery");
const { filterClips } = loadSource("@/lib/archiveQuery");
const { publicMediaReplacements, publicMediaAdditions, PUBLIC_CHANNEL_SELECTIONS } = loadSource("@/data/publicMedia");
const { channelZeroClips } = loadSource("@/data/channelZero");
const { availableViewingJourneys, journeysForClip, journeyTvHref, viewingJourneyClips } = loadSource("@/lib/viewingJourneys");
const { WORK_PROCESS } = loadSource("@/data/workProcess");
const { workProcessForClip } = loadSource("@/lib/workProcess");
const { creditedPublicWork, hasPersonCredit } = loadSource("@/lib/credits");
const { isRecordedDate } = loadSource("@/lib/format");
const { discoveryDoors } = loadSource("@/lib/discovery");

function unique(values, label) {
  assert.equal(new Set(values).size, values.length, `${label} are unique`);
}

test("catalog IDs, slugs, and public YouTube IDs have no duplicate records", () => {
  unique(catalog.clips.map((clip) => clip.id), "Clip IDs");
  unique(catalog.clips.map((clip) => clip.slug), "Clip slugs");
  unique(catalog.clips.filter((clip) => clip.youtubeId).map((clip) => clip.youtubeId), "Public YouTube IDs");
  unique(catalog.projects.map((project) => project.id), "Project IDs");
  unique(catalog.projects.map((project) => project.slug), "Project slugs");
  unique(catalog.people.map((person) => person.id), "Person IDs");
  unique(catalog.people.map((person) => person.slug), "Person slugs");
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
  assert.equal(catalog.clips.filter((clip) => clip.youtubeId).length, 381 + channelZeroClips.length);
});

test("all eleven new public records have publisher evidence and no invented cassette or transcript", () => {
  const additions = [...publicMediaReplacements, ...publicMediaAdditions];
  assert.equal(additions.length, 11);
  for (const reference of additions) {
    const clip = getClip(reference.id);
    assert.equal(clip.contentState, "public-source");
    assert.equal(clip.visibility, "PUBLIC");
    assert.equal(clip.rightsStatus, "UNCLEAR");
    assert.equal(clip.sourceTapeId, "");
    assert.equal(clip.duration, 0);
    assert.equal(clip.startTimecode, "00:00:00:00");
    assert.equal(clip.endTimecode, "00:00:00:00");
    assert.equal(clip.transcriptId, undefined);
    assert.equal(transcriptForClip(clip), undefined);
    assert.equal(transcriptSearchText(clip), "");
    assert.equal(clip.publicSource.url, `https://www.youtube.com/watch?v=${clip.youtubeId}`);
    assert.ok(clip.publicSource.publisher && clip.publicSource.published);
  }
});

test("replacing a work card preserves its saved URL, not its prototype metadata", () => {
  const aliases = {
    "c-20": "window-seat-one-take", "c-25": "a-cut-from-the-vault", "c-27": "joey-brooklyn-daylight",
    "c-46": "jesus-walks-third", "c-47": "two-words-card",
  };
  for (const [id, slug] of Object.entries(aliases)) assert.equal(getClip(slug).id, id);
  assert.equal(getClip("c-20").type, "Performance", "Finished Window Seat is not a fabricated BTS scene");
  assert.equal(getClip("c-27").type, "Performance");
  assert.equal(getClip("c-25").locationId, "", "No invented London premiere tape");
});

test("every themed TV channel opens with four to eight real public programs", () => {
  for (const [id, selection] of Object.entries(PUBLIC_CHANNEL_SELECTIONS)) {
    const channel = CHANNELS.find((row) => row.id === id);
    const lineup = channelLineup(channel);
    assert.ok(lineup.length >= 4 && lineup.length <= 8, `${id} has a useful small selection`);
    assert.deepEqual(lineup.map((clip) => clip.id), [...selection], `${id} preserves editorial order`);
    assert.ok(lineup.every((clip) => clip.youtubeId && clip.visibility === "PUBLIC"));
  }
  assert.equal(CHANNELS.find((row) => row.id === "unseen").name, "PREVIEWS");
});

test("public releases are discoverable through their Index collection filters", () => {
  for (const id of ["c-public-through-wire", "c-public-teyana", "c-public-netflix-studio", "c-20", "c-27"]) {
    const clip = getClip(id);
    for (const collection of clip.collectionIds) {
      assert.ok(filterClips({ collection }).some((row) => row.id === id), `${id} remains discoverable in ${collection}`);
    }
  }
});

test("work and footage years never inherit later upload dates as recording dates", () => {
  const expected = [
    ["c-public-through-wire", 2003, "release-year", "2006-10-03"],
    ["c-46", 2004, "release-year", "2006-10-02"],
    ["c-47", 2005, "release-year", "2009-06-16"],
    ["c-public-slow-jamz", 2004, "recorded-year", "2022-02-28"],
    ["c-public-teyana", 2017, "recorded-year", "2022-03-07"],
  ];
  for (const [id, year, dateBasis, published] of expected) {
    const clip = getClip(id);
    assert.equal(clip.year, year);
    assert.equal(clip.dateBasis, dateBasis);
    assert.equal(clip.dateExact, undefined);
    assert.equal(clip.publicSource.published, published);
    assert.ok(clip.dateNote);
  }
  assert.equal(getProject("two-words").year, 2005);
  assert.equal(getTrack("two-words").year, 2004);
  assert.ok(catalog.eras.find((era) => era.id === getClip("c-47").era).endYear >= 2005, "Two Words' era includes its corrected video year");
});

test("the upload generator doesn't assign unsupported cities or universal on-screen directors", () => {
  const unnamed = catalog.clips.filter((clip) => clip.sourceTapeId === "t-broadcast" && !clip.locationId);
  assert.ok(unnamed.length > 250);
  assert.ok(unnamed.some((clip) => clip.peopleIds.length === 0));
  assert.equal(getClip("c-236").locationId, "tokyo");
  assert.equal(getClip("c-344").locationId, "new-orleans");
});

test("Channel Zero selections resolve verified public records and explicit crew identities", () => {
  assert.equal(channelZeroClips.length, 12);
  assert.equal(channelZeroClips.reduce((sum, clip) => sum + clip.duration, 0), 4680);
  for (const reference of channelZeroClips) {
    const clip = getClip(reference.id);
    assert.equal(clip.sourceTapeId, "");
    assert.equal(clip.startTimecode, "00:00:00:00");
    assert.equal(clip.endTimecode, "00:00:00:00");
    assert.equal(clip.visibility, "PUBLIC");
    assert.equal(clip.rightsStatus, "UNCLEAR");
    assert.equal(transcriptForClip(clip), undefined);
    assert.equal(clip.publicSource.url, `https://www.youtube.com/watch?v=${clip.youtubeId}`);
    assert.ok(clip.dateNote && clip.publicSource.published && clip.duration > 0);
    for (const id of clip.peopleIds) assert.ok(getPerson(id), `On-screen person ${id} resolves`);
    for (const credit of clip.credits ?? []) for (const id of credit.personIds ?? []) assert.ok(getPerson(id), `Credited person ${id} resolves`);
  }
  assert.equal(hasPersonCredit(getClip("c-cz-homecoming-1"), "sorge"), true);
  assert.equal(hasPersonCredit(getClip("c-cz-homecoming-1"), "coodie"), false);
  assert.equal(hasPersonCredit(getClip("c-cz-homecoming-1"), "chike"), false);
  assert.equal(getClip("c-cz-camron-1998").dateExact, "1998-07-02");
  assert.equal(getClip("c-cz-nipsey-session").dateExact, "2010-12-06");
  assert.equal(getClip("c-cz-jamie-angie").dateExact, "2004-02-13");
  assert.equal(getClip("c-cz-culo-1").locationId, "miami");
});

test("ordered viewing journeys are complete, shareable, and never filled with examples", () => {
  const journeys = availableViewingJourneys();
  assert.equal(journeys.length, 3);
  for (const journey of journeys) {
    assert.deepEqual(journey.clips.map((clip) => clip.id), [...journey.clipIds]);
    assert.ok(journey.clips.every((clip) => clip.youtubeId && clip.visibility === "PUBLIC"));
    const href = new URL(journeyTvHref(journey, "present=1&q=old&page=3", journey.clipIds[1]), "https://archive.local");
    assert.equal(href.searchParams.get("journey"), journey.id);
    assert.equal(href.searchParams.get("ch"), "07");
    assert.equal(href.searchParams.get("clip"), journey.clips[1].slug);
    assert.equal(href.searchParams.get("present"), "1");
    assert.equal(href.searchParams.has("q"), false);
    assert.equal(href.searchParams.has("page"), false);
  }
  const missing = catalog.clips.filter((clip) => clip.id !== "c-cz-homecoming-2");
  assert.equal(availableViewingJourneys(missing).some((journey) => journey.id === "homecoming"), false);
  assert.equal(viewingJourneyClips(journeys[0], []).length, 0);
  assert.equal(journeysForClip("c-cz-homecoming-2")[0].id, "homecoming");
});

test("work/process pairings connect released work to independently sourced process media", () => {
  assert.equal(WORK_PROCESS.length, 3);
  for (const story of WORK_PROCESS) {
    for (const part of story.parts) {
      const result = workProcessForClip(part.clipId);
      assert.equal(result.id, story.id);
      assert.ok(result.parts.every(({ clip }) => clip.youtubeId && clip.visibility === "PUBLIC"));
    }
  }
  assert.equal(workProcessForClip("not-in-a-pair"), undefined);
  assert.equal(getClip("c-51").duration, 86);
  assert.equal(getClip("c-51").locationId, "");
  assert.deepEqual(getClip("c-51").peopleIds, ["coodie", "chike"]);
});

test("filmmaker browsing and Index include off-camera credit without claiming an appearance", () => {
  const directed = getClip("c-20");
  assert.equal(directed.peopleIds.includes("chike"), false);
  assert.equal(clipsForPerson("chike").some((clip) => clip.id === directed.id), true);
  assert.equal(filterClips({ person: "chike" }).some((clip) => clip.id === directed.id), true);
  for (const personId of ["coodie", "chike", "sorge"]) {
    assert.ok(creditedPublicWork(clipsForPerson(personId), personId).length >= 8);
  }
  assert.equal(creditedPublicWork(clipsForPerson("j-ivy"), "j-ivy").length, 1);
});

test("same upload batch is not treated as the same filming day", () => {
  const jesus = getClip("c-cz-jesus-walks-making");
  const culo = getClip("c-cz-culo-1");
  assert.equal(jesus.publicSource.published, culo.publicSource.published);
  assert.equal(isRecordedDate(jesus), false);
  assert.equal(jesus.relatedClipIds.includes(culo.id), false);
  assert.equal(isRecordedDate(getClip("c-cz-camron-1998")), true);
});

test("public discovery prefers playable moments and doesn't invent Coodie's endorsement", () => {
  const doors = discoveryDoors();
  for (const id of ["unseen", "chicago", "pick"]) {
    const door = doors.find((item) => item.id === id);
    const clip = getClip(door.href.split("/").pop());
    assert.ok(clip.youtubeId);
  }
  assert.equal(doors.find((item) => item.id === "pick").label, "HOUSE PICK");
  assert.equal(catalog.collections.find((collection) => collection.id === "coodies-picks").name, "House Picks");
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
