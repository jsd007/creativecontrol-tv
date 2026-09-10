# Archive Model

Local structured mock data. Designed to grow. Not a backend.

The user should feel that a documentary is a cut from something much larger. We do **not** display a hardcoded hour count as fact.

## Entities

| Entity | Role |
| --- | --- |
| `ArchiveAsset` | Digitized media object (placeholder in prototype) |
| `ArchiveClip` | Canonical editorial unit — what people watch |
| `SourceTape` | Physical origin. A person held a camera. |
| `Person` | Subject, camera, or related figure |
| `Location` | Place with geography |
| `Event` | Concert, session, broadcast, premiere |
| `Track` | Song |
| `Album` | Recorded work |
| `Project` | Film, video, series, or initiative |
| `Era` | Named time band (not just a year) |
| `Collection` | Editorial grouping |
| `Organization` | Channel Zero, Creative Control, DD172, networks |
| `Transcript` / `TranscriptSegment` | Discovery surface — a few prototype rows now; ASR later |
| `Annotation` | Editorial note on a clip or tape |
| `Theme` | Cross-cutting idea |
| `Relationship` | Typed edge between entities |

## ArchiveClip

Required conceptual fields:

`id`, `slug`, `title`, `description`, `dateExact`, `dateApproximate`, `year`, `era`, `locationId`, `peopleIds[]`, `trackIds[]`, `albumIds[]`, `projectIds[]`, `eventIds[]`, `collectionIds[]`, `themes[]`, `tags[]`, `sourceTapeId`, `startTimecode`, `endTimecode`, `duration`, `thumbnail`, `poster`, `previewVideo`, `youtubeId`, `transcriptId`, `featured`, `visibility`, `rightsStatus`, `editorialStatus`, `sensitivityStatus`, `relatedClipIds[]`

Plus prototype-only: `mediaKind`, `formatHint`, `cameraCredit`.

## SourceTape

Original label, format (`MINIDV` / `HI8` / `VHS` / `DIGITAL` / `PHONE`), camera, recorded date, ingest date, duration, physical location, digitization status, notes, provenance.

## Visibility and rights (conceptual only)

`PUBLIC` · `UNLISTED` · `PRIVATE` · `COMING SOON` · `MEMBERS ONLY` · `RESTRICTED` · `PENDING CLEARANCE`

Plus conceptual flags: rights holder, music clearance, appearance release, territory, expiration, editorial approval, sensitivity.

The prototype shows status as metadata. It does **not** implement a rights system. It does **not** assume every tape can be public.

Visitor-facing: PUBLIC is the open stage. A direct URL to any other visibility is a held destination that names that status. The unfiltered index and DISCOVER stay PUBLIC. No auth, no payments, no clearance workflow.

## Editorial collections (seed)

These ten cuts are stories at `/collections` and `/collections/[slug]`. They do not add rows. A story holds the house editorial PUBLIC frames already in that collection as a film — not the official CH 07 upload file. `/archive?collection=` films that same public cut. Held leftover stays named in the house file and opens the clip sleeve. An empty public story does not send leftover to an empty Index.

- Coodie's Picks — `coodies-picks`
- The Road to The College Dropout — `road-to-the-college-dropout`
- Chicago Before the World Was Watching — `chicago-before`
- First Times — `first-times`
- Studio Nights — `studio-nights`
- New York — `new-york`
- Channel Zero — `channel-zero`
- Through the Wire — `through-the-wire`
- Unseen — `unseen`
- Creative Control Classics — `creative-control-classics`

## Eras (seed)

- Channel Zero (1994–1999)
- The Long Shoot (1998–2004)
- Through the Wire (2002–2004)
- The Network (2007–2013)
- Documents (2012–2019)
- jeen-yuhs (2019–2022)
- After the Cut (2023– )

## How the mock is shown (2026-09-09)

Presentation only. The entities above do not change.

| Surface | What the visitor sees |
| --- | --- |
| `/archive` | Finding-aid ledger, year-grouped. Official uploads are holdings (`year · official title · BROADCAST · place`). Unfiltered = house rows + one official through-line per year. A query stamps N RECORD(S). Combo Ye+Chicago+2002+Studio = 1. |
| `/tapes` | Vault shelves by `physicalLocation`: STORAGE / DIGITAL VAULT / PHONE / STUDIO / BROADCAST / UNOPENED (mute aisle + GROWABLE empty). BROADCAST is year cassettes of official holdings on `t-broadcast`. |
| `/clip/[slug]` | Cassette beside a sprocketed gate. `youtubeId` → official muted embed. Closed visibility → sleeve. |
| `/tv` | Programmed network. CH 07 airs official public blocks / year books, then a mute NOT IN THIS MOCK remainder. UNLOGGED is never a title. |
| `/timeline` | Through-line, not path tabs. Decade film is era time. Official titles can be the year through-line. Never title UNLOGGED. Month / day film does not print `N FRAMES`. |
| `/constellation` | Derived spokes. Desktop void; ~390 pocket. Not a `Relationship[]` dump. |
| Person / place / project | A file of bonds. Remainder in the index. |
| SOUND | OFF. Four verbs. WAVs not in the tree; procedural fallback. |

## Graph pages (same catalog)

These are not new sites. They are canonical nodes that every lens can open:

| Entity | Route |
| --- | --- |
| Person | `/people/[slug]` |
| Place | `/places/[slug]` |
| Project | `/projects/[slug]` |
| Collection | `/collections/[slug]` |

City-root places (Chicago, New York, …) gather every clip in that city. Neighborhoods stay exact.

`/constellation` is a derived view of the same entities. It does not add rows. Edges follow `relationScore` ethic (tape / project / song / day / subject / specific place / house work). There is no seeded `Relationship[]` dump in the mock yet — the type exists for later ingest.

Entity pages do not list the full set when it would become a dump. They hold a compact field of a few true spokes and send the rest to `/archive` with the same filter. Date grouping uses `clipWhen`: exact date, else tape recorded-date when it matches the clip year, else the clip year.

## Discovery

Search, facets, and serendipity all query the same catalog:

- RANDOM TAPE
- TAKE ME SOMEWHERE
- WATCH SOMETHING UNSEEN
- ON THIS DAY
- FROM CHICAGO
- COODIE'S PICK

## Transcripts / future AI

A clip may carry `transcriptId`. The `Transcript` lives beside the catalog (`src/data/transcripts.ts`), not inside `catalog.ts`. Each row has `status`, `origin`, `note`, and `TranscriptSegment[]` (`id`, `start`, `end` seconds from clip start, optional `speaker`, `text`).

**Now (prototype):** a few authored clips have `status: "prototype"` and `origin: "editorial-inference"`. The lines are labeled inference — room / camera / tape roles, not recovered speech. The dossier lists timecode + speaker + line. A segment is a deep-link (`/clip/[slug]?seg=…#seg-…`). Archive `q` matches segment speaker + text in the same haystack as title and tags.

**Do not** build a fake chatbot. Discovery is search and a timestamped link.

### How later speech systems plug in

Same objects. New origin. No new product surface required.

| Layer | Writes | Lands on |
| --- | --- | --- |
| **ASR** | `origin: "asr"`, `status: "partial"` then a later complete status, `text` + `start`/`end` | Replace or version the prototype rows. Search already reads `text`. |
| **Speaker ID** | `speaker` (and later a person id if we add one) | Same segment list. Do not invent names until the roster is real. |
| **Embeddings** | A vector index keyed by `TranscriptSegment.id` (not stored on the mock) | Semantic `q` can retrieve segment ids, then the same deep-link. Keyword `q` stays as the fallback. |

Ingest path when real media exists: digitized asset → ASR → optional speaker ID → optional embed → write `Transcript` / segments → `ArchiveClip.transcriptId`. The clip page and archive search do not change shape. A later player may seek to `start`; this prototype does not.

Do **not** scrape YouTube captions or ship 3,000 hours of speech. House-approved transcripts or an in-house ASR pass are the only honest inputs.

## Scale assumption

The schema must remain coherent if the catalog later grows by orders of magnitude — hundreds of hours, tens of thousands of clips, or a living ingest. Those figures are **architecture**, not a confirmed catalog size. Prototype volume is a few dozen authored tapes (~30) plus authored clips (including the **366** official public embeds) and generated UNLOGGED density — enough to make filters feel real, not a production ingest. Do not print 3,000 hours, 330, 267, 400, or the first-page badge 268 as fact.
