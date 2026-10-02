import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// credits.ts is a pure helper with type-only imports; evaluate trusted source in memory.
const filename = fileURLToPath(new URL("../src/lib/credits.ts", import.meta.url));
const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  fileName: filename,
}).outputText;
const loaded = { exports: {} };
new Function("module", "exports", compiled)(loaded, loaded.exports);
const { creditedPersonIds, hasPersonCredit, creditsForPerson, creditedPublicWork, creditRoleKey, creditRoleLabel, creditRolesForPerson } = loaded.exports;

test("a name or on-screen appearance never implies a filmmaker credit", () => {
  const clip = { peopleIds: ["coodie"], credits: [{ name: "Coodie & Chike", role: "Directors" }] };
  assert.deepEqual(creditedPersonIds(clip), []);
  assert.equal(hasPersonCredit(clip, "coodie"), false);
  assert.deepEqual(creditsForPerson(clip, "chike"), []);
});

test("explicit shared credits link both filmmakers without substring guesses", () => {
  const clip = { credits: [
    { name: "Coodie & Chike", role: "Documentary directors", personIds: ["coodie", "chike"] },
    { name: "Coodie", role: "Camera, per publisher", personIds: ["coodie"] },
  ] };
  assert.deepEqual(creditedPersonIds(clip), ["coodie", "chike"]);
  assert.equal(creditsForPerson(clip, "coodie").length, 2);
  assert.equal(creditsForPerson(clip, "chike").length, 1);
  assert.equal(hasPersonCredit(clip, "cood"), false);
});

test("featured filmography only includes playable public source records with explicit credits", () => {
  const base = { visibility: "PUBLIC", youtubeId: "public-id", publicSource: { publisher: "Publisher", url: "https://www.youtube.com/watch?v=public-id" }, credits: [{ name: "Chike", role: "Director", personIds: ["chike"] }] };
  const records = [
    { ...base, id: "verified", contentState: "public-source" },
    { ...base, id: "placeholder", contentState: "placeholder" },
    { ...base, id: "private", visibility: "PRIVATE" },
    { ...base, id: "reference", youtubeId: undefined, contentState: "project-reference" },
    { ...base, id: "no-source", publicSource: undefined },
    { ...base, id: "appearance", peopleIds: ["chike"], credits: [] },
  ];
  assert.deepEqual(creditedPublicWork(records, "chike").map((clip) => clip.id), ["verified"]);
});

test("role filters group exact variants while preserving the source role", () => {
  assert.equal(creditRoleKey("Directors"), "direction");
  assert.equal(creditRoleKey("Documentary directors"), "direction");
  assert.equal(creditRoleKey("Camera, per publisher"), "camera");
  assert.equal(creditRoleLabel("Documentary directors"), "Direction");
  assert.equal(creditRoleLabel("Graphics & title design"), "Graphics & title design");
  assert.equal(creditRoleKey("Graphics & title design"), "graphics-title-design");
  const original = { name: "Coodie & Chike", role: "Documentary directors", personIds: ["coodie", "chike"] };
  assert.equal(creditsForPerson({ credits: [original] }, "chike")[0].role, "Documentary directors");
});

test("role counts count works, not repeated credit lines", () => {
  const records = [
    { credits: [
      { name: "Coodie", role: "Camera", personIds: ["coodie"] },
      { name: "Coodie", role: "Camera, per publisher", personIds: ["coodie"] },
      { name: "Coodie & Chike", role: "Directors", personIds: ["coodie", "chike"] },
    ] },
    { credits: [{ name: "Coodie & Chike", role: "Documentary directors", personIds: ["coodie", "chike"] }] },
  ];
  assert.deepEqual(creditRolesForPerson(records, "coodie"), [
    { key: "camera", label: "Camera", count: 1 },
    { key: "direction", label: "Direction", count: 2 },
  ]);
});
