# Design Language

## Inheritance, not costume

jeen-yuhs left a useful DNA: black, off-white, paper, film leader, MiniDV, timestamp, handwriting, marker, broadcast type, viewfinder, frame edges, projection, light leaks, film burns, contact sheets, tape labels, technical metadata, maps, archival dates, grain.

We inherit the **materials**, not the **identity**.

What comes after jeen-yuhs.com is not another remote-controlled television. It is a place that can hold many stories.

## Principle

**Raw material + precise software.**

Footage (even our placeholders) should feel held, labeled, dated, and incomplete. The interface should feel exact: type, metadata, motion, silence.

## What this is not

Startup template. Streaming clone. Webflow portfolio. AI landing page. Component-library demo.

No giant pills, endless rounded cards, purple gradients, blur blobs, generic hero copy, fake testimonials, dashboards, or SaaS pricing language.

No fake-1990s Channel Zero theme park. No CoD / cyberpunk / metaverse / Web3 globe. No copyrighted Ye stage art.

## Color

Small house palette. Gold, paper, rust, one teal. Not a rainbow dashboard.

| Token | Value | Use |
| --- | --- | --- |
| `void` | `#080706` | Primary ground |
| `ink` / `panel` | `#141210` | Raised opaque plates when type sits on video or shelves |
| `paper` | `#f2ead9` | Type, museum light |
| `bone` | `#d8cfb8` | Secondary type on dark — distinct from paper |
| `dust` | `#c2b68e` | Metadata, quiet labels — mute, readable at 12px |
| `leader` | `#d4b05a` | Film leader, selected time |
| `hold` / `signal` | `#d05642` | Rust — holds, MEMBERS ONLY, broadcast wipe |
| `night` | `#7eaaa3` | The one teal — house TV, world night, SPAN heat |
| `tungsten` | `#c17a42` | Warm lamp in fields and tape heat only — not chrome |
| `chicago` | `#e2b85c` | Geography: Chicago glow only |
| `tape` | `#2a2418` | Physical objects |
| `hairline` | paper at 34% | Rules that separate lines, not wallpaper |

Paper on void. Do not invert the whole product into a light app.

Type on void must read. When type sits on living video, the globe, or a shelf, put it on an opaque `void` / `ink` plate — not a glass card. Shared classes: `.type-label` `.type-meta` `.type-nav` `.type-code` `.type-title`. Type floor is 12px for labels, 13px for desktop nav. Tracking stays open enough to read phrases (OPEN THE FILE, LOGGED · UNLOGGED, SOUND OFF). Do not solve contrast with chips or a light theme.

Tailwind opacity modifiers only exist on the default scale (…/85, /90, /95, /100). An off-scale value like `bg-void/94` compiles to nothing and the plate renders fully transparent — that is how the TV lower third became gold-on-gold. Reach for a house class in `globals.css` when a plate needs an exact alpha.

A picture carries at most one caption. When a stage prints its own lower third (TV) or file (clip), the frame inside it runs `chrome="stamp"` — the PROTOTYPE MEDIA label only. Timecode, duration, and format live in one place, never twice on the same picture.

## Type

- **Display / threshold:** Instrument Serif — restraint, museum, not gym-poster
- **Broadcast / index labels:** Barlow Condensed — channel IDs, facet names, tape IDs
- **Interface / reading:** IBM Plex Sans
- **Technical:** IBM Plex Mono — timecode, IDs, rights, ingest
- **Readable floor:** `.type-label` / `.type-meta` / `.type-nav` / `.type-code` / `.type-title` — 12px labels, 13px desktop nav. Do not drop metadata to 11px dust.

Handwriting appears only on tape labels and occasional editorial marks — never as UI chrome.

## Surfaces

- Finding-aid index for `/archive` — year as a beat, then typed rows (when · tape · type · title · place · people · hold). Official uploads are holdings (`year · official title · BROADCAST · place`), not a card wall. Unfiltered is house rows plus one official through-line per year. A query stamps N RECORD(S). `/archive?collection=` films the same public house cut as the collection reel (Classics **19**, Studio Nights **0**). MEMBERS ONLY is a paper hold on the line. UNLOGGED stays mute.
- Sculptural dark globe for `/world` — memory on Earth, not a page about geography. Desktop is the R3F canvas again (idle mid-Atlantic orbit, authored coasts, night-side + gold limb/haze, Chicago as a glow in the dark, GSAP fly-to that keeps the limb). In-canvas grain/vignette, not a data-viz HUD. Compact was wrongly `pointer: coarse`; World compact is width-only (`useIsNarrow`). MAP is fallback only — narrow, `prefers-reduced-motion`, or failed WebGL — not the desktop take. Idle is Earth at a distance (no city type). A facing name appears on approach or hover — no count, no chip row, no persistent CHICAGO HUD. Year is a timestamp on the sculpture (`2004`), not YEAR · MAP. Tab walks a clipped city list (selected city → THE PLACE → other facing marks). No museum H1. globe.gl / three-globe stay out — they own a second renderer.
- High-end contemporary broadcast for `/tv` (not CRT cosplay, not a YouTube clone): a live ident strap (CC-TV + a giant channel number + a thin voice line + a crawl — official blocks / year books on CH 07, programmed titles on the other boards), ON AIR clock, graphic tuner strip (Flip hairline), stage with hairline lower-third. On ~390 the tuner is the number row **00-08** on one line (hairline on the visible key); names stay on the ident so CH 07 ident is usable. `/tv` opens on **CH 07** — the channel that holds the content is the front door, not a house cut with four titles. GUIDE is **one list**. Every title on the channel is in it, in air order, with the block name as a quiet sticky marker that rides the scroll so a long list always says where you are. No shelves, no year rail, no letter or prefix drill, no MORE, no paging — nothing on the channel is behind a door. CH 07 is all **366** rows on one scroll; a house channel is its whole 1-12 title lineup. A FIND A TITLE field filters the same list in place and states `N OF 366`.

The tuner states what each channel holds (`07 366`, `03 1`) so scale is legible before you tune. The count is titled programs — what GUIDE can actually hand you — not raw holdings. A row on CH 07 does not restamp BROADCAST; the channel already said it. All **366** public embeds are on the page, not merely reachable. After the official set: a mute remainder (NOT IN THIS MOCK / HELD / UNOPENED / growable empty). No invented show names. No upload count. Never print 3,000 hours or the first-page badge **268** as the catalog. A public upload may play as an official embed in the stage. Cards stay house fields. Acquire takes the channel’s accent (yellow ancestor / Chicago gold / signal / house night) and stamps the channel number. Reduced motion kills acquire, crawl, Flip, and the flourish.
- Vault aisle for `/tapes` — provenance shelves (STORAGE / DIGITAL VAULT / PHONE / STUDIO / BROADCAST / UNOPENED) as a corridor of facing spines, not a card mosaic. Spines are holdings (code + year, format as body), not inventory stamps. Arrow keys walk the rack; click opens the same way. Opening a tape is a CSS film-gate camera through the aisle, not a dialog and not a second R3F scene. Logged frames keep titles; UNLOGGED stays mute. BROADCAST is year cassettes of official holdings (typed lines, no upload-count trophy). Scale is mute remainder, not a count. UNOPENED is a longer mute rack than any one authored bay (honest spine labels only, including HELD paper), then a GROWABLE empty lip that fades. No invented tape codes or hour totals. The mute rack stays when a cassette opens (it recedes).
- Filmic strip / decade rail for `/timeline` — sprocket ticks, not a count histogram. The span (1994—2026) is the story until a connection is followed; then the name is the story and THE SPAN returns. Paths are a through-line of connections (Coodie / Chike / Ye / College Dropout / Chicago / Creative Control) written on the decade, and on the header once a year or a thread is open — not ALL / COODIE / CHIKE tabs, not a museum dek, not a record inventory. Shareable: `?through=ye`, `?year=2002`, `?month=10`, `?day=12`. Hover or follow a name lights that thread on the sprocket (leader ticks, not bar heights). Decade headings are era time (public access / informal rooms / Chicago; the long shoot then a network / New York; documents / sports; jeen-yuhs then after) — not a narrator about the camera or the catalog. Year / month / day cells are a proving still (quiet field; paper hold if closed) with era · date · title · people · place under the frame — never a rainbow hue card, never UNLOGGED, never “a cut from the vault,” never “the camera…,” no frame-count inventory. Official titles may be the year through-line; year-only uploads sit as holdings, not `N UNDATED`. A year opens as a month sprocket and month film; a month as a day sprocket and day film. A landed day opens as that day’s film (date, lead title, picture in the gate, tape labels, frames in time) — not a cassette grid, not a mute list, not format · N FRAMES. Empty ticks stay dim. Empty days stay empty.
- Canonical clip: opening a frame, not a YouTube watch page. Labeled cassette beside a sprocketed gate; the picture registers in the aperture (prototype field, muted click-to-play official embed, or a rights sleeve). Title and dossier sit under a leader hairline. Chronological cassette strip under the gate (logged titles beside mute density). A broadcast block does not dump the shelf as an up-next grid. Related is leftover frames labeled by axis — not numbered cards.
- Held frames for closed visibility: catalog language on a physical sleeve (COMING SOON, PENDING CLEARANCE, PRIVATE, MEMBERS ONLY, …), not a 404 and not a SaaS lock. Each status has its own sleeve. MEMBERS ONLY is paper in the gate. PUBLIC stays the open prototype field. A prototype transcript, when present, is labeled editorial inference — not captions.
- Constellation: a selected name, hairline spokes, condensed labels on void — not a force graph, not a network chart, not a clock. The deep field. A bond states what holds it up: how many authored frames prove the edge and the span they cover (Coodie · Chike = **391 FRAMES · 2003 — 2025**; Coodie · Ye = **12 FRAMES · 1998 — 2012**). Spoke ink ramps with that count so a dense bond reads dense at a glance — a ramp the eye takes in, never a weighted graph it has to measure, and never a score or a percentage. Hover puts the count and the proving frame in the credit. On a phone: a handheld pocket of the same spokes, not a squashed desktop and not a list.
- Person / place / project: a file, not a profile. The short name is the tab. Legal name / origin / span are stamps. The compact field is a stack of bonds — proving still in a gate (prototype or held sleeve), axis, name, then the evidence: `12 FRAMES · 1998 — 2012` and FIRST HELD BY the authored frame that proves the edge. A bond names the relationship, not just its two ends; a name with no count is an assertion. Not a construction circle. Not a three-column table. Not year-film posters. THE FIELD opens the void. Remainder stays in the index. Ali still refuses Paris and the hospital tape.
- Collections: editorial stories cut from the same catalog. `/collections` is contents (chapter type + a still, or an honest empty). `/collections/[slug]` is a reel of the house cut — year as intertitle, still in the gate, title as the line, tape and type as credits. Not the official CH 07 file. Classics is **19** house titles (Polaroid → Kendall's Cross), not 366 official uploads. Not a card grid, not a contact sheet, not a museum index. Studio Nights keeps the empty gate (**0** public). Held leftover is named in the house file and opens the clip sleeve — not `{n} IN THE INDEX` on a public collection facet that is empty. The Index collection facet matches that reel.
- Unlogged generated density is mute (tape id, timecode, duration). Authored frames keep titles. Do not invent scene names to fill a shot-log we do not have.

Frame edges, hairline rules, registration marks, and viewfinder corners are allowed when they **label**. They are not wallpaper.

## Motion

Slow confidence. Physicality. Depth. Ease. Anticipation.

The house metaphor is a **film gate**. Motion is registration, acquisition, travel — not bounce, not a template fade-up.

**Stack the house owns:** GSAP (+ Flip) for authored register / draw-on / the lens hairline / the clip gate / `/world` fly-to. Native View Transitions API for route cuts (house `Cut`, not a page blink). Framer Motion stays on React presence it already owns (tape `layoutId`, clip related reveal, opening type). R3F stays on `/world` only. No globe.gl, three-globe, or react-globe.gl (they own their own renderer / scene / loop). No Lenis, no Lottie, no second 3D engine.

| Verb | Surface | What it does |
| --- | --- | --- |
| Entering | `/` | James’s official static mark (white knot over CREATIVE CONTROL) registers in the film gate. A muted living field — the jeen-yuhs loading film, blended, not dumped — sits behind / around it. A light sheen may travel once. Four openings are rooms around that still (light, field, copy, door pair) — not a new mark. ARCHIVE is the house door (ENTER / THE WORLD). HISTORY is a screening room (lit 4:3, throw, watching line); BEGIN → `/tv`. DOCUMENT is leftover / mandate: unused Channel Zero yellow after a leftover checker; WATCH → leftover `/clip/channel-zero-never-aired`; THE NETWORK → `/tv`. SPAN is a year horizon (1994—2026 through the mark). On ~390 the official still reads; doors sit above DISCOVER + SOUND + dock emblem. Reduced motion is the still only — no video, no sheen. SOUND stays off. Not the Framer reel. Not jeen-yuhs.com. |
| Traveling | `/world` | Desktop is the R3F globe. Idle starts farther — Earth as an object — and orbits slowly. Night-side and a gold limb/haze keep it a sculpture. GSAP fly-to pulls back, travels a great-circle around the sphere, then eases in while keeping the limb (Chicago r≈4.52, others r≈4.85 — must not flatten into a North America map). A short hold before orbit resumes. Hover names a facing city; the name appears on approach. No count. Year is a timestamp, not a HUD. MAP is fallback only (narrow / reduced-motion / failed WebGL). |
| Changing channel | `/tv` | Broadcast acquire ~150ms: black + accent wipe + channel stamp lock. Ident number and name register (GSAP). Tuner Flip hairline. On ~390 the tuner is **00–08** on one row so CH 07 ident is usable. GUIDE ON is a hairline; a GUIDE row tunes that slot. Channel Zero wipes yellow; Broadcast wipes signal. Not VHS snow. |
| Opening a tape | `/tapes` | CSS camera settles toward the spine (modest, no scale doll, no R3F). The cassette pulls; the dossier sits outside the camera as an opaque void file — code, place, date, hold, OPEN THE FILE — not a contact sheet. Other shelves recede without pinching. Arrows walk holdings. Reduced motion / narrow: no camera. |
| Zooming time | `/timeline` | Selected year locks in the sprocket. Following a connection lights the thread and advances the decade film. A year opens as a month sprocket + month film; a month as a day sprocket + day film. A landed day threads that day’s film through the gate. Time is in the URL. |
| Extracting a frame | `/clip` | Cassette settles. Gate aperture opens (GSAP clip-path). A leader hairline draws. Title registers under the picture. Current cassette cell is in-gate. Related is a hairline reveal of leftover frames. Reduced motion is the still register. The official embed is not remounted. |
| Revealing a relationship | `/constellation` + person / place / project | Deep field: spokes draw, labels travel out. On the node: bonds register as a file (still + type). Hover racks one bond. Not a clock. Not a force graph. |
| Hopping lenses | Rail + ENTER + presentation | A film cut: View Transition clips the old frame closed and opens the new one in the gate. Same-path hops (Chicago fly, channel) keep their own motion. A Flip hairline rides the desktop rail. A top present hairline draws. Marks widen. Discreet. |
| Walking the house | Keyboard | Tab order is skip → mark → rails → DISCOVER → SOUND → the room. Focus is a hairline of leader gold — not a government ring. Space on SOUND toggles. `d` opens DISCOVER. Escape closes a tape or the veil, not the show. |
| Holding a phone | Mobile dock | Bottom dock: James’s still + DISCOVER + SOUND, then the five lenses. On `/` the lens row hides; the same still reads and the doors sit above that dock. Phone tuner is **00–08** on one row so CH 07 ident is usable. SPAN years 1994 / 2026 read at the edges. Constellation at ~390 is a palm pocket, not this dock and not the desktop void squashed. |

Avoid: random bounce, excessive parallax, scroll-jack everywhere, constant glitch, generic fade-ups, CRT novelty, SaaS stagger.

Respect `prefers-reduced-motion`: grain, crawl, sheen, living-field video, acquire, fly ease, tape camera, film advance, spokes, hop cut, Flip rail, and the show hairline all collapse to stills or instant cuts. Presentation may hold a longer cross-lens open; it must collapse when reduced. Show marks are hairlines, not captions. SOUND stays off unless the visitor turns it on. Reduced-motion skips room tone and hop cuts even if SOUND is on.

## Sound

Optional, **off by default**. Never a stock UI beep. Never a music bed that fights footage. Never a fabricated voice. No copyrighted music. No reel rip.

The house layer is analog and short — original textures plus WebAudio, gated until SOUND is turned on. A refresh is silent. Official embeds stay PLAY · MUTED; SOUND does not unmute picture.

| Verb | When | What it is |
| --- | --- | --- |
| Threshold | `/` when SOUND is on (toggle, or a return to the door) | Room appearing: 60 Hz hum, brown air, a gate register. Not a chime. |
| Acquire | `/tv` channel lock | Tuner snow collapsing + a contact click. No pitched beep. |
| Cut | Cross-lens hop | Film splice: muted pop + a breath of leader hiss. |
| Tape | Opening a cassette | MiniDV motor, head kiss, dying hiss. One texture, not a loop. |

Quiet analog room tone (hum + hiss) holds while ON. Reduced-motion skips the bed and the hop cut. DISCOVER doors use the cut. The header control reads SOUND OFF until the visitor turns it on.

**CONFIRMED FACT (working tree, 2026-09-09):** `src/lib/sound.ts` will fetch `/sound/{threshold,acquire,cut,tape}.wav` if those files exist. They are **not** in `public/` now. Playback falls back to in-house procedural textures. A refresh is still silent until ON.

## Prototype media

No copyrighted footage in the product.

Use generated fields, film-leader bars, type, maps, simulated thumbnails, grain, and clearly labeled **PROTOTYPE MEDIA** frames. Metadata may name real history.

Public Creative Control works that already exist as metadata get a **per-work field**, not one hue wash. Inherit materials (leader strip, 4:3 MiniDV inset, viewfinder corners, paper, timestamp, grain). Do not copy jeen-yuhs.com or WØRKS Act III frenzy.

| Voice | When | Field |
| --- | --- | --- |
| Ali | `the-peoples-champ` / People’s Champ | Slab condensed ALI, ring ropes, blown red-black |
| Kendall’s Cross | project / title | Analog snow, serif + italic lockup |
| Coney Island | project / Coney location | Night housing blocks, basketball-as-O |
| Channel Zero open | CZ bumper / yellow leftover / LEADER | Yellow field, checker band |
| Channel Zero field | other CZ | Hi8 tungsten, checker footer, CH 00 |
| DD172 / Sessions | `dd172` or Sessions | Warehouse window grid, tungsten |
| Window Seat | project / one-take / title | Dusk walk line, plaza geometry |
| jeen-yuhs ingest | jeenyuhs / ingest / duffel | 4:3 inset, tape contact, REC dot |
| Through the Wire / basement | `ttw`, Polaroid, basement | Warm 4:3, stacked stills |
| Sports | Benji / gym / basketball | Court ellipse, gym lights, collage slabs |
| Architecture | later MAP cities (reel language) | Courtyard plan, hairline grid |
| Default | everything else | Hue field + mediaKind (leader / map / contact / static) |

Stamp remains **PROTOTYPE MEDIA**. Title language is invented for the placeholder, not pulled from copyrighted cards. Generated expand chapters stay mute: no lockup, no scene title — only UNLOGGED + timecode.

## Live `creativecontrol.tv` (visual, 2026-09-09)

**CONFIRMED:** Framer reel splash. Not a network. Not an archive. Desktop: analog ident (**CREATIVE [coil] CONTROL**, grain, RGB fringe) then work cards (Ali slab lockup). Mobile: 4:3 inset, rotate icon, no type.

**Inherit as clues (materials):** grain, RGB fringe, analog ident, 4:3 mobile inset.

**Do not inherit (identity):** Framer full-bleed reel as `/`, their title cards as chrome, Ali slab as a splash.

**CONFIRMED FACT (2026-09-09, James — mark source):** `/` uses James’s still `unnamed-3.jpg` (white knot over CREATIVE CONTROL). First-party copies: `public/brand/creative-control-mark.jpg` (exact) and `.png` (same still, black knocked out). Same still on `/`, rail, present marks, mobile dock, favicon. Invented coil SVGs are gone. YouTube `@cctelevisionchannel` avatar matches this composition; we do not use a reconstructed coil or the wide banner stand-in. A muted jeen-yuhs loading film (`jeenyuhs-loading.mp4`) is the living field behind the still — not the Framer reel, not jeen-yuhs.com. The page is still an archive threshold. All four openings are rooms around that still. ARCHIVE keeps the house door (ENTER / THE WORLD). HISTORY is the screening room (YOU ARE WATCHING HISTORY / BEGIN → `/tv`). DOCUMENT is the leftover / mandate room (DOCUMENT EVERYTHING / WATCH → leftover `/clip/channel-zero-never-aired` / THE NETWORK → `/tv`). SPAN is the year horizon room (THE SPAN / EXPLORE → `/timeline` / THE ARCHIVE). On ~390 the official still reads; doors sit above DISCOVER + SOUND + dock still. Phone tuner is **00–08** on one row. CH 07 ident is usable.

Reduced motion is James’s still only — no video, no sheen.

## Local reel (study only)

The 2025 Creative Control reel shows: light leaks; project-specific title cards (*Ali*, *Kendall’s Cross*, *Coney Island*); sports-collage language; architecture; picture-in-picture. Takeaway: each work can have its own typographic voice. The platform should not force one card style onto every object.

## Performance and access

Desktop first, 60fps target, lazy media, WebGL fallback. Keyboard can walk the house (skip, rails, SOUND, DISCOVER, doors). Mobile is a bottom dock plus per-lens compact takes (WORLD MAP is fallback only — width-narrow / reduced / failed WebGL; constellation = pocket) — not the desktop sculpture shrunk. Touch-primary desktop stays the globe.
