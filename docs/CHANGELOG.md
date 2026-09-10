# Changelog

## 2026-09-10 — A bond states what holds it up

- The north star asks for relationships between people / places / moments to be **visible**. They were not. `/people/ye` named Chike and Coodie under a machine axis (`PROJECT · PERSON`) and never said how Ye relates to either — the endpoints were on screen, the relationship was not.
- `buildEntityGraph` already counted the frames two nodes share and then discarded the number. `StarNode` now carries `weight` (frames + first / last year), computed from the same `clipsForNode` pass that picks the proving frame.
- Entity bonds read `12 FRAMES · 1998 — 2012` then FIRST HELD BY the frame that proves the edge. Ye · Coodie (12 frames from 1998) now visibly outweighs Ye · Chike (5 from 2003) instead of looking identical.
- Constellation spoke ink ramps with the count (measured 0.27 for the heaviest against ~0.10) so density reads at a glance without becoming a weighted graph. Hover puts the count and the proving frame in the credit: Coodie · Chike is **391 FRAMES · 2003 — 2025**, the spine of the whole catalog.
- Fixed a real defect: `.hand-strip` only lays out inside the narrow media query, so on desktop the constellation spine rendered as `COODIECHIKEYEALIDONDA` with no gaps. It is a flex row at ≥768px now.
- Counts are catalog truth, not a score — no percentages, no strength bars, no invented edges. A frame carries no span, so clip nodes stay unweighted.
- Archive goal is **not complete**.

## 2026-09-10 — GUIDE shows the programming instead of guarding it

- Everything on `/tv` was behind doors. Every house channel's **whole** lineup is 1–12 titles, and you still had to click a daypart to see one of them (CH 03 held a single title behind a click). CH 07 opened as 13 identical doors, so its four named shows sat at the same depth as a 188-title year — channel → year → letter → prefix → title before a video.
- GUIDE now opens what is short enough to read and keeps only the tail behind a door. Named blocks and dayparts render as shelves with their titles listed and the count stated (`CHANNEL ZERO / 4 TITLES`); a shelf over **10** windows with MORE. Measured: CH 01 went from 0 titles visible to **8**, CH 07 from 0 to **19**.
- Years are the tail — one quiet BY YEAR rail carrying the count (2009 · 3, 2010 · 188, 2011 · 100, 2012 · 32 …), one open at a time. Fat years **2010** / **2011** keep the A–Z rail and the official-prefix nest. No new nests, no 2010 S/T via THE, all **366** embeds still reachable.
- Tuner states holdings per channel (`07 366`, `03 1`), counted as titled programs so it promises only what GUIDE can hand back. Dropped the BROADCAST restamp on CH 07 rows — the channel already said it.
- Arrow-key walk rebuilt over the new order (shelf rows → year rail → letters → prefixes → year rows). Per-shelf paging is its own key (`mp:`), so MORE on one shelf does not move another.
- Verified 1440 × 900 and 390 × 844, no overflow; `tsc`, `next lint`, `next build` clean. Re-captured `docs/coodie-proof/05-official-air.png` because the tuner now reads 366 in frame.
- Archive goal is **not complete**.

## 2026-09-10 — Coodie stills are the walk, not a tour

- `docs/coodie-proof/` held twelve stills shot before the globe / TV / tapes fixes, including four scenes deliberately outside the show (leftover clip, Ye through-line, CH 03, a second door). Its own README said not to attach them.
- Replaced with **seven** PNGs captured from live by pressing Space through `/?present=1` at 1440 × 900 — one file per scene, named for the beat. Verified each landed on its documented URL with the right mark (`01 / 07 · THE DOOR` … `07 / 07 · THE SPAN`) and **SOUND OFF** on every frame.
- The show is **seven scenes**, and code (`src/lib/present.ts`) and docs agree. Corrected one stale line in `PRESENTATION.md` that still warned against inventing an eleventh beat.
- Send the URL, not the pictures. No hour-count. Archive goal is **not complete**.

## 2026-09-09 — Globe labels, one caption per picture, docked tape file

- `/world` city labels used drei `distanceFactor={36}`, which scales HTML by camera distance: a 12px name rendered **911 × 336 px** and covered half the Earth. Labels are now fixed DOM scale — measured 70 × 26 px — and sit as a quiet tag beside the mark.
- Seven Tailwind opacity utilities were off the default scale and compiled to nothing. `bg-void/94` on the TV lower third meant the band was **fully transparent**: cream serif on the Channel Zero gold field. The band is now `.tv-third` in `globals.css`. Also snapped `bg-paper/12`, `bg-void/12`, `border-paper/8` `/12` `/14` `/22`.
- A picture carries one caption. `ArchivePicture` / `PrototypeMedia` take `chrome="stamp"`; the TV stage uses it, so the frame keeps only PROTOTYPE MEDIA and drops the format chip and the timecode / duration footer that was colliding with the lower third. Corner brackets removed. Stage meta reads `year · format · timecode`.
- `/tapes` file card no longer floats over the racks. It is docked bottom-left, opaque, gold-edged, outside the perspective ancestor, and reads one fact per line: `CC-0217 · MINIDV`, place, date, `1 LOGGED · 5 UNLOGGED`, OPEN THE FILE. Under 768px it docks above the thumb dock. Position measuring (`measureSheet`, `Sheet`, `fieldRef`) deleted.
- Verified desktop 1440 and ~390: `/world`, `/world?city=chicago&fly=1`, `/tv?ch=0`, `/tv?ch=3`, `/tapes?open=t-0217`, `/tapes?open=t-0004`, clip gate. Combo still **1 RECORD**. SOUND off. No globe.gl, no second R3F canvas, no commit.
- Archive goal is **not complete**. Tape camera is still CSS.

## 2026-09-09 — `/timeline` is a through-line, not a hue poster wall

- Live span was empty HSL year cards (rainbow dashboard) plus text-only `through` names. Drill lived only in React state — `/timeline` could not open 2002 or YE.
- Year / month / day cells are now proving stills (quiet prototype field, paper hold if closed) with the file stamp under the frame: era, date, title, people · place. No YouTube remount. No `N FRAMES`.
- Shareable time: `?through=ye`, `?year=2002`, `?month=10`, `?day=12`. Hover or follow a name lights that thread on the sprocket (ticks, not a histogram). Ye / Coodie / Chike / Chicago doors land on the path.
- Combo **1 RECORD**. Beat 4 leftover. CH 07 PLAY · MUTED. SOUND off. `/world` / `/tapes` / TV year books not touched.
- Redeployed hobby `creativecontrol-tv`: https://creativecontrol-tv.vercel.app/timeline
- No commit. Archive goal is **not complete**. Tape camera is still CSS.

## 2026-09-09 — Tapes aisle is holdings, not a dashboard

- `/tapes` aisle restored after the overlay cut: spines read as physical holdings (code + year; MiniDV / HI8 / VHS / phone / digital as bodies). Format strip is quiet type. Lintel is the bay name only — no CAMERA ORIGINALS inventory notes, no well placard, no 1·5 density stamp, no invented CC-···· codes.
- Optical CSS aisle deepened (wall angle, well, floor, bay Z without scale pinch). Desktop camera is width-only (`useIsNarrow`); reduced-motion stays `transform: none`. No second R3F canvas.
- Walk: arrows step the rack; click the same; Escape closes; Enter on the file opens `/tapes/[id]`. Open dossier is still one opaque void file: 1 LOGGED · 5 UNLOGGED, CC-0217 · CHICAGO · 2002-10-12, OPEN THE FILE. No contact sheet in the aisle. Combo basement stays on the tape file.
- UNOPENED is a longer mute rack + fading empty lip. SOUND off. No commit.
- Archive goal is **not complete**. Tape camera is still CSS.

## 2026-09-09 — House palette + contrast

- Small palette that earns its keep: void `#080706`, ink `#141210`, paper `#f2ead9`, bone `#d8cfb8`, dust `#c2b68e`, leader `#d4b05a`, hold/signal `#d05642`, night `#7eaaa3`, tungsten `#c17a42` (fields only), chicago `#e2b85c`.
- Contrast: opaque plates under type on `/` (copy over the living field), `/world` HUD + city names, archive mast, tape lintel / open file, timeline film captions, clip file. 12px floor. Tracking no longer smashes OPEN THE FILE, LOGGED · UNLOGGED, SOUND OFF, ENTER / THE WORLD.
- `/tapes?open=t-0217` stays one opaque file — not a contact sheet. Combo **1**. SOUND off. No globe.gl. No second R3F canvas. World stays the sculpture, not MAP.
- TV GUIDE interaction, year-book nesting, and tuner UX left to the sibling. Shared tokens only (`night` house accent already on house channels).
- Redeployed hobby `creativecontrol-tv`: https://creativecontrol-tv.vercel.app
- No commit. Archive goal is **not complete**.

## 2026-09-09 — `/tv` GUIDE is a board you tune

- 2010 / 2011 were stacked A–Z menus that opened into title novels (and leftover prefix rundowns). James: too busy, too long, hard to use.
- CH 07 GUIDE is now one compact strip of the **13** tunables. A fat year opens as a short letter rail. A fat letter still uses the official prefix already on the file (2011 C → CREATIVE CONTROL; 2010 C → CURREN$Y). No new nests. No 2010 S/T via THE.
- Any leftover list windows **10** titles + MORE / PREV. House 00–06 / 08 window the day the same way. Ident first on CH 07. PLAY · MUTED. STAGE keeps a GUIDE jump. Digits and arrows still work.
- Color tokens already landed stay. No second canvas. No commit. Archive goal is **not complete**.

## 2026-09-09 — Tape open is a file, not a contact sheet

- `/tapes` open dossier was an opaque box still dumping six PROTOTYPE / UNLOGGED cells plus the MEMBERS ONLY basement card. Type (OPEN THE FILE, 1 LOGGED · 5 UNLOGGED) smashed under condensed tracking.
- Open is now a void file stamp outside the CSS camera: hold, code · place · date, OPEN THE FILE. No frame grid. No viewfinder chrome. Beat 9 `/tapes?open=t-0217` is CC-0217 · 1 LOGGED · 5 UNLOGGED. Basement stays gated on the tape file, not the aisle mosaic.
- Reduced motion / compact: no camera. SOUND off. Combo **1**. `/world` and YouTube ingest not touched. No commit.
- Archive goal is **not complete**. Tape camera is still CSS.

## 2026-09-09 — `/world` sculpture deepened; globe.gl rejected

- globe.gl / three-globe / react-globe.gl stay out. They own a second Three renderer, scene, camera, and loop. Tone is data-viz (arcs, hexbins, pins). Worse for this archive. One R3F canvas remains.
- Desktop `/world` keeps idle mid-Atlantic orbit, authored coasts, Chicago-weighted fly-to (r≈4.52 / 4.85), year as `2004`. MAP is still fallback only (narrow / reduced-motion / failed WebGL).
- Shipped on the existing sculpture: night-side terminator, gold limb + haze, Chicago as a glow in the dark (not a pin), GSAP fly-to, in-canvas grain/vignette. No postprocessing composer. No second canvas. `/tapes` not touched.
- Combo Ye+Chicago+2002+Studio stays **1 RECORD**. SOUND off. Presentation beat 2 = `/world`, beat 3 = Chicago fly.
- Local 1440: idle + Chicago fly measured ~100fps (rAF, one canvas). Reduced-motion and ~390 stay **YEAR · MAP**.
- Redeployed hobby `creativecontrol-tv`: https://creativecontrol-tv.vercel.app/world
- Archive goal is **not complete**. Coasts stay authored. No commit.

## 2026-09-09 — Share-path smoke after mark / film / globe / contrast

- Verify-only on live `https://creativecontrol-tv.vercel.app`. No app UI. No commit. No redeploy. Archive goal is **not complete**.
- Desktop 1440: `/` is James’s still over muted `jeenyuhs-loading.mp4` (volume 0), ENTER → `/archive`. `/?present=1` beats 1–8 via Space: ENTER is a button, DISCOVER hidden, ten marks, SOUND OFF. Beat 2 / standalone `/world` is the R3F globe (year `2004`, not YEAR · MAP). Beat 3 Chicago fly stays a sphere. Beat 4 leftover `/clip/channel-zero-never-aired`. Beat 5 combo **1 RECORD**. Beat 7 `/tv?ch=7` ident PLAY · MUTED. Beat 8 `/tv?ch=3` Studio. `/tapes?open=t-0217` is CC-0217 · 1 LOGGED · 5 UNLOGGED, sheet in frame.
- Contrast floor still dust `#b8b29f` / 12px labels. ~390 (844 and 667): official still reads; ENTER / THE WORLD sit above DISCOVER + SOUND.
- No regressions in the named set (unmuted film, missing mark, desktop MAP, flown tapes, reverted contrast).
- Remaining for James before the Coodie paste: walk `/?present=1` himself on desktop; leave SOUND off; do not print hours or claim the quality bar. Weakest unblocked stays CSS tape, missing unlisted / private, fat leftover CH 07 letters.

## 2026-09-09 — Archive: still, field, globe, contrast

- Docs-only. No app UI. No commit. Archive goal is **not complete**.
- House mark is James’s still `unnamed-3.jpg` (white knot over CREATIVE CONTROL). First-party: `public/brand/creative-control-mark.jpg` (exact) and `.png` (same still, black knocked out). Used on `/`, rail, present marks, mobile dock, favicon. Invented coil SVGs gone. Not a reconstructed **CREATIVE [coil] CONTROL** draw-on.
- Home field: `jeenyuhs-loading.mp4` muted behind the still. Reduced motion = still only.
- Desktop `/world` is the R3F globe again. Compact was wrongly `pointer: coarse` (`useIsCompact`); World compact is width-only (`useIsNarrow`). Chicago fly was too close (r=2.9 + persistent CHICAGO HUD). MAP is fallback only (narrow / reduced-motion / failed WebGL).
- Contrast: dust `#b8b29f` / leader `#d4b66a` / bone `#e6ddd0`; 12px floor.
- Tapes dossier sits outside the CSS camera. Stray `.next-*` leftover caches deleted.
- James gates unchanged. Never print 3,000 hours.
- Corrected stale door language in DESIGN_LANGUAGE / TODO / NORTH_STAR. RESEARCH marks the still source.
- Remaining for Coodie share: hours, years, naming, shot-log, show names, footage, splash vs archive, unlisted / private.

## 2026-09-09 — James’s official mark, living field, tapes, deploy

- House mark is the static logo James provided (white knot over CREATIVE CONTROL). Lives at `public/brand/creative-control-mark.jpg` (exact) and `.png` (same still, transparent). Used on `/`, rail, present marks, mobile dock, favicon. Invented coil SVGs and earlier YouTube stand-in PNGs removed.
- Home still blends `Jeenyuhs_loading.mp4` (muted). Reduced motion = James’s still only.
- `/tapes` aisle fixed: sheet outside the CSS camera; modest walk; no pinch; compact / reduced = no camera. Beat 9 CC-0217.
- Stray `.next-*` agent caches removed again. `tsconfig` no longer lists them. No commit.
- Combo **1**. Beat 4 leftover. Beat 7 CH 07 PLAY · MUTED. SOUND off.
- Archive goal is **not complete**.

## 2026-09-09 — Desktop `/world` is the globe again

- YEAR · MAP was leaking onto wide viewports: World used `useIsCompact` (`max-width: 767px` **or** `pointer: coarse`), so a touch-primary desktop (iPad-as-desktop, some 2-in-1s) never mounted the R3F canvas. WebGL probe could also false-fail (`webgl2` then `webgl` on one canvas).
- Chicago fly landed at r=2.9 with a persistent Html **CHICAGO** label — the sphere read as a flat North America map plus a HUD. Not the idle sculpture.
- Desktop 1440 again: idle mid-Atlantic orbit, authored coasts, Chicago glow, fly-to that keeps the limb, city marks, year as `2004` (not YEAR · MAP), no city-chip HUD. World compact is width-only (`useIsNarrow`). Labels stay pointer-first. Keyboard CHICAGO / THE PLACE unchanged.
- YEAR · MAP stays the fallback for `prefers-reduced-motion`, failed WebGL, and ~390. Combo unchanged. Home / tapes not touched.
- Local 1440 (`:3230`): canvas; present beat 2 idle globe; beat 3 `/world?city=chicago&fly=1` still a sphere, no giant type. ~390 and reduced-motion: **YEAR 2004 · MAP**, PREV/NEXT.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Coasts stay authored. Tape zoom is still CSS.

## 2026-09-09 — Official still, living field, tapes aisle, stray `.next`

- House mark is the official `@cctelevisionchannel` still (banner lockup + avatar), first-party in `public/brand/`. Invented coil / lockup SVGs removed. Same still on `/`, rail mast, `/?present=1` chrome, mobile dock.
- Home field is James’s `Jeenyuhs_loading.mp4` (copied to `public/brand/jeenyuhs-loading.mp4`), muted, blended behind the still. Not the Framer reel. Not jeen-yuhs.com. Reduced motion = still only.
- `/tapes` aisle: sheet is outside the CSS camera; walk no longer dolls off-screen; later bays do not pinch; compact / reduced = no camera. Beat 9 `/tapes?open=t-0217` still CC-0217 · 1 LOGGED · 5 UNLOGGED.
- Removed ~30 stray `.next-*` agent caches from the repo root. Normal gitignored `.next` stays. No commit.
- Combo Ye+Chicago+2002+Studio stays **1**. Beat 4 leftover. Beat 7 CH 07 ident PLAY · MUTED. Beat 8 Studio. Classics **19**. Studio Nights **0**. SOUND off. Four openings remain rooms around the still.
- Archive goal is **not complete**. Prototype stills. CSS tape. No real footage.

## 2026-09-09 — Tape open walks to the cassette

- `/tapes` open is a CSS walk, not a scale doll: camera travels in Z to the spine, the cassette pulls off the rack, then the gate registers (LOGGED · UNLOGGED). Reduced motion stays `transform: none`. No R3F.
- Beat 9 `/tapes?open=t-0217` still opens CC-0217 — **1 LOGGED · 5 UNLOGGED**. No fake shot-log titles. Mobile aisle overflow left alone. SOUND off. Combo unchanged.
- Archive goal is **not complete**. Still CSS, not an optical / R3F camera.

## 2026-09-09 — Completion audit (live)

- Docs-only. No app UI. No commit. Archive goal is **not complete**. Filmmaker quality bar **not** claimed.
- Scored each goal requirement against live `https://creativecontrol-tv.vercel.app` (1440 + ~390) plus the docs/catalog tree. Full table at the top of `docs/TODO.md`.
- **Proven:** research + decisions docs; shared archive model; routes `/` `/world` `/archive` `/tv` `/tapes` `/timeline` + clip; discreet `?opening=` switcher (never Concept); prototype media as a limit; SOUND OFF; reduced-motion / compact world **YEAR · MAP**; mobile dock; combo **1 RECORD**; beat 4 leftover; beat 7 CH 07 ident PLAY · MUTED; **366** official IDs wired; north-star answer written.
- **Not proven:** quality bar *“I didn’t know our archive could feel like this”* — prototype stills, CSS tape, no real show names, James-gated facts.
- James gates unchanged. Never print a working hour-count as fact.
- Remaining unblocked weakest: tape zoom is still CSS. Unlisted / private still missing. Fat leftover letters (opened prefixes, 2010 S/T) are still rundowns.

## 2026-09-09 — Keyboard smoke after rooms / lockup / books / beat 7

- Verify-only. No app UI. No commit. No redeploy. Archive goal is **not complete**.
- Desktop 1440 on local `:3225` and live `https://creativecontrol-tv.vercel.app`. Tab is skip → mark → rails → DISCOVER → SOUND → the room. During `/?present=1` DISCOVER is hidden; Tab is skip → mark → rails → SOUND → ENTER.
- Enter on ENTER opens `/archive`. During the show ENTER is a button and advances to `/world`. `d` opens DISCOVER on RANDOM TAPE (house cassette, not the official dump); FROM CHICAGO stays house. Escape closes the veil. SOUND Space toggles and does not hop the show. `d` is ignored while showing.
- `/?present=1` Space next: beat 7 is `/tv?ch=7` (CH 07 BROADCAST ident, PLAY · MUTED). Beat 8 is `/tv?ch=3` (STUDIO). Escape on `CC-0217` closes the cassette and leaves the ten marks. `x` still leaves the show.
- Opening switcher arrows when present (`?opening=` on live; always in development): ARCHIVE → HISTORY → DOCUMENT, focus follows the lit take. GUIDE year books and letters are keyboard: Tab reaches **2009**; Enter **2010** opens A–Z; arrows enter the letter bar; **2010 C** nests CURREN$Y / C; **2011 C** nests CREATIVE CONTROL / C.
- Combo Ye+Chicago+2002+Studio stays **1 RECORD** (Basement · MEMBERS ONLY). SOUND off by default. 366 official IDs unchanged.
- Remaining unblocked weakest: tape zoom is still CSS. Unlisted / private still missing. Fat leftover letters (opened prefixes, 2010 S/T) are still rundowns.

## 2026-09-09 — Memory: the experience answer

- Docs-only. No app UI. No commit. Archive goal is **not complete**.
- Wrote the central-question answer into `docs/NORTH_STAR.md` from the live product, not a wish list: one archive, many lenses; threshold rooms ARCHIVE / HISTORY / DOCUMENT / SPAN; Index as finding aid; World as Chicago-weighted sculpture; Television as programmed CC-TV (**366** official on CH 07, house on 00–06 / 08); Tapes as vault aisle; Timeline as through-lines; Clip as a frame in the gate; Collections as editorial cuts; DISCOVER house-first; SOUND OFF; ten-beat show (beat 4 leftover, beat 7 official air, combo **1**).
- Honest limits stay in the answer: prototype media, CSS tape camera, no surveyed GIS, no invented show names, no printed 3,000 hours, no Barnes / Ghetto Rock in the product, filmmaker quality bar **not** claimed. Short pointers in `docs/CONCEPTS.md` and `docs/PRESENTATION.md`.
- James gates unchanged (hours, years, naming, shot-log, show names, footage, Barnes not in the product). Show path unchanged.
- YouTube public listing still **366** unique house IDs. Videos-tab badge **367**. Never print 3,000 hours as fact.
- Remaining unblocked weakest: tape zoom is still CSS. Unlisted / private still missing. Fat leftover letters (opened prefixes, 2010 S/T) are still rundowns.

## 2026-09-09 — Memory: phone ~390 lockup, tuner, SPAN

- Docs-only. No app UI. No commit. Archive goal is **not complete**.
- Recorded what already shipped on ~390: official **CREATIVE [coil] CONTROL** lockup reads (not the coil emblem alone). Doors sit above DISCOVER + SOUND. Phone tuner is **00–08** on one row (hairline on the visible key; names stay on the ident). SPAN years 1994 / 2026 read at the edges through the mark. CH 07 ident is usable — ident first, PLAY · MUTED.
- Desktop rooms unchanged in intent (ARCHIVE door, HISTORY screening, DOCUMENT leftover, SPAN horizon). James gates unchanged (hours, years, naming, shot-log, show names, footage, Barnes not in the product). Show path unchanged (`docs/PRESENTATION.md`). Beat 7 stays `/tv?ch=7`.
- YouTube public listing still **366** unique house IDs (`src/data/youtube.ts` `listedHere` / `youtubeUploads`). Videos-tab badge **367**. Never print 3,000 hours as fact.
- Remaining unblocked weakest: tape zoom is still CSS. Unlisted / private still missing. Fat leftover letters (opened prefixes, 2010 S/T) are still rundowns.

## 2026-09-09 — Mobile ~390: lockup, tuner, dock, overflow

- Phone chrome only. Desktop rooms, catalog, and the show path left alone. No commit. Archive goal is **not complete**.
- `/` was clipping the official lockup to the coil emblem and seating a 322px mark over the dock. ~390 now draws **CREATIVE [coil] CONTROL** at a size that fits, with room under the doors for DISCOVER + SOUND.
- `/tv?ch=7` tuner was a 915px name strip: CH 07 sat off-screen on ident. Phone tuner is the number row (00–08), hairline on the visible key, names stay on the ident. Year books unchanged.
- SPAN year rail no longer runs 58rem wide; 1994 / 2026 read at the edges through the mark. Leftover checker stays in frame on the phone. Tape aisle drops the depth scale that pinched later bays.
- Combo Ye+Chicago+2002+Studio stays **1**. Beat 4 leftover. SOUND off. 366 official IDs unchanged.
- Local ~390 (`:3220`): official lockup reads; doors clear the dock at 844 and 667; CH 07 ident first, PLAY · MUTED, 00–08 on one row, 2010 book opens A–Z; tapes aisle no page overflow; combo **1 RECORD**; leftover clip intact; world YEAR · MAP; Studio Nights NO PUBLIC FRAMES / HELD IN THE HOUSE FILE; DISCOVER house serendipity; SOUND OFF.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app Goal is **not complete**.

## 2026-09-09 — Memory: beat 7 is CH 07

- Docs-only. No app UI. No commit. Archive goal is **not complete**.
- Recorded what already shipped: presentation beat 7 is `/tv?ch=7` — CH 07 ident first, then the official programmed network, PLAY · MUTED. Not a 366-row dump. Not a YouTube tour. Beat 8 remains Studio (`/tv?ch=3`). Beat 4 remains `/clip/channel-zero-never-aired`. Combo Ye+Chicago+2002+Studio stays **1**. Ten beats. Coodie paste left in James’s voice.
- YouTube public listing still **366** unique house IDs (`src/data/youtube.ts` `listedHere` / `youtubeUploads`). Videos-tab badge **367**. Never print 3,000 hours as fact.
- James gates unchanged (hours, years, naming, shot-log, show names, footage, Barnes not in the product).
- Remaining unblocked weakest: tape zoom is still CSS. Unlisted / private still missing. Fat leftover letters (opened prefixes, 2010 S/T) are still rundowns.

## 2026-09-09 — Memory: CH 07 letter prefixes

- Docs-only. No app UI. No commit. Archive goal is **not complete**.
- Recorded what already shipped: fat CH 07 letters nest official title prefixes already on the file. **2011 C** is CREATIVE CONTROL (29) vs the rest of C (7). **2010 C** is CURREN$Y (18) vs the rest of C (13). Do not nest **2010 S** or **T** via THE or invented shows; those stay letter rundowns. Prefix lists are not split into episodes. Ident first. House 00–06 / 08 stay house-only. All **366** public embeds stay reachable. Mute remainder after.
- YouTube public listing still **366** unique house IDs (`src/data/youtube.ts` `listedHere` / `youtubeUploads`). Videos-tab badge **367**. Never print 3,000 hours as fact.
- James gates unchanged (hours, years, naming, shot-log, show names, footage, Barnes not in the product). Show path unchanged (`docs/PRESENTATION.md`).
- Remaining unblocked weakest: tape zoom is still CSS. Unlisted / private still missing. Fat leftover letters (opened prefixes, 2010 S/T) are still rundowns.

## 2026-09-09 — Long CH 07 letters nest under the year bar

- `/tv` CH 07 GUIDE letter bar only (24, not the year 36). **2010 C** (31) nests the official lead already on the file — **CURREN$Y** (18) vs the rest of C (13). **2011 C** still **CREATIVE CONTROL** (29) vs C. Prefix lists are not split into episodes. Ident first. PLAY · MUTED. House channels house-only. Combo **1**. Beat 4 unchanged. All **366** reachable. Redeployed hobby `creativecontrol-tv`: https://creativecontrol-tv.vercel.app Goal is **not complete**.

## 2026-09-09 — Fat CH 07 letters nest official prefixes

- `/tv` CH 07 GUIDE letter nesting only. Ident still signs on first. PLAY · MUTED. SOUND off. House 00–06 / 08 stay house-only.
- A fat letter (36+ official titles) no longer opens as one rundown. **2011 C** (36) nests the official title prefix already on the file — **CREATIVE CONTROL** vs the rest of C. No invented show names. Thin letters stay a letter rundown. Named blocks and year A–Z unchanged.
- Tuning the prefix airs its first official title. Every title in the letter stays reachable. All **366** public embeds stay on the board. Mute remainder after.
- Combo Ye+Chicago+2002+Studio stays **1**. Beat 4 remains `/clip/channel-zero-never-aired`.
- Desktop verified locally (`:3215`): `/tv?ch=7` ident first (Creative Control TV), PLAY · MUTED, SOUND OFF. GUIDE is **13** tunables. Open **2011** → **C**: spines **CREATIVE CONTROL** (29) and **C** (7) — not 36 in one list. Open **2010** → **C**: still a letter rundown (CAFE DU MONDE). **2009** stays a 3-title year. CH 05 Sessions at DD172 (house). Combo **1 RECORD**. Beat 4 leftover intact.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Unlisted / private still missing. 2010 C is still a letter rundown (31). The CREATIVE CONTROL prefix is still a rundown once opened (29). Tape zoom is still CSS.

## 2026-09-09 — Desktop walk: four openings + present

- Verify-only on live `https://creativecontrol-tv.vercel.app` (1440×900). No app UI. No commit. No redeploy. Archive goal is **not complete**.
- Four distinct rooms around the official **CREATIVE [coil] CONTROL** lockup (GSAP still draws; words opacity 1; coil mounted). Shared shell does not fight the switcher or the mark. No horizontal or vertical overflow.
- ARCHIVE is the house door: leader, **THE ARCHIVE**, ENTER → `/archive`, THE WORLD → `/world`. Default `/` is this room (no switcher).
- HISTORY is a screening room: throw / 4:3 aperture / watching line / rake. **YOU ARE WATCHING HISTORY.** BEGIN → `/tv`. THE ARCHIVE → `/archive`.
- DOCUMENT is leftover / mandate: unused / sheet / checker leaving the frame / hold. **DOCUMENT EVERYTHING.** Credits CHANNEL ZERO · THE LONG SHOOT · THE NETWORK. WATCH → leftover `/clip/channel-zero-never-aired`. THE NETWORK → `/tv`.
- SPAN is a year horizon: 1994—2026 through the mark (1994 / 2000 / 2010 / 2020 / 2026 read). **THE SPAN.** EXPLORE → `/timeline`. THE ARCHIVE → `/archive`.
- `/?present=1` intact: beat 1 is `/`, ENTER is a button and advances to `/world`, DISCOVER hidden (returns after `x`), ten marks, SOUND OFF. Beat 4 leftover (`/clip/channel-zero-never-aired`). Combo Ye+Chicago+2002+Studio stays **1 RECORD** (Basement, October 2002 · MEMBERS ONLY).
- Remaining unblocked weakest: a fat CH 07 letter (2011 C) is still a rundown once opened; tape zoom is still CSS. Unlisted / private still missing.

## 2026-09-09 — Memory: DOCUMENT leftover / mandate room

- Docs-only. No app UI. No commit. Archive goal is **not complete**.
- Recorded what already shipped: DOCUMENT is a leftover / mandate room. Unused Channel Zero yellow holds after a leftover checker that leaves the frame (ancestor materials, not a bumper reconstruction). Title is DOCUMENT EVERYTHING. Credits stay CHANNEL ZERO · THE LONG SHOOT · THE NETWORK. WATCH → leftover `/clip/channel-zero-never-aired`. THE NETWORK → `/tv`.
- All four openings are rooms around the official **CREATIVE [coil] CONTROL** lockup (GSAP left mounted): ARCHIVE the house door (ENTER / THE WORLD), HISTORY a screening room (YOU ARE WATCHING HISTORY / BEGIN → `/tv`), DOCUMENT leftover, SPAN a year horizon (THE SPAN / EXPLORE → `/timeline`). Beat 1 stays `/`.
- YouTube public listing still **366** unique house IDs (`src/data/youtube.ts` `listedHere` / `youtubeUploads`). Videos-tab badge **367**. Never print 3,000 hours as fact.
- James gates unchanged (hours, years, naming, shot-log, show names, footage, Barnes not in the product). Show path unchanged (`docs/PRESENTATION.md`).
- Remaining unblocked weakest: a fat CH 07 letter (2011 C) is still a rundown once opened; tape zoom is still CSS. Unlisted / private still missing.

## 2026-09-09 — DOCUMENT is a leftover / mandate room

- DOCUMENT opening only. Official **CREATIVE [coil] CONTROL** lockup GSAP left mounted. ARCHIVE / HISTORY / SPAN untouched except the shared opening-field class list. Beat 1 stays `/`. No hour-count. Not jeen-yuhs. Not the Framer reel. No Ali card. No CRT. No invented Channel Zero episode titles.
- Leftover / mandate room: unused Channel Zero yellow holds after a leftover checker that leaves the frame (ancestor materials, not a bumper reconstruction). Title is DOCUMENT EVERYTHING. Credits stay CHANNEL ZERO · THE LONG SHOOT · THE NETWORK. WATCH → leftover `/clip/channel-zero-never-aired`. THE NETWORK → `/tv`.
- Desktop verified locally (`:3214`): DOCUMENT leftover sheet / checker / unused / hold; lockup still CREATIVE [coil] CONTROL; WATCH → leftover clip; THE NETWORK → `/tv`. ARCHIVE leader + ENTER / THE WORLD. HISTORY screen / throw / sightline / rake. SPAN year horizon. `/?present=1` beat 1 is `/` (ENTER button, DISCOVER hidden, ten marks). SOUND OFF. Combo **1 RECORD**. Reduced motion: still mark, no sheen, no fringe, leftover still.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Remaining unblocked weakest: a fat CH 07 letter (2011 C) is still a rundown once opened; tape zoom is still CSS. Unlisted / private still missing.

## 2026-09-09 — HISTORY is a screening room

- HISTORY opening only. Official **CREATIVE [coil] CONTROL** lockup GSAP left mounted. ARCHIVE / DOCUMENT / SPAN untouched except the shared opening-field class list. Beat 1 stays `/`. No hour-count. Not jeen-yuhs. Not the Framer reel. No Ali card. No CRT.
- The 4:3 is a lit screen you sit in front of (throw from the booth, watching line through the picture and out of the frame, aisle rake in the dark). The mark is the picture. YOU ARE WATCHING HISTORY. / BEGIN → `/tv`. THE ARCHIVE → `/archive`.
- Desktop verified locally (`:3213`): HISTORY screen / throw / sightline / rake; lockup still CREATIVE [coil] CONTROL; BEGIN → `/tv`; THE ARCHIVE → `/archive`. ARCHIVE leader + ENTER / THE WORLD. DOCUMENT leftover + checker. SPAN year horizon. `/?present=1` beat 1 is `/` (ENTER button, DISCOVER hidden, ten marks). SOUND OFF. Combo **1 RECORD**. Reduced motion: still mark, no sheen, no fringe, screening still.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. DOCUMENT is now the quietest opening (leftover + checker).

## 2026-09-09 — Memory: fat years A–Z and SPAN horizon

- Docs-only. No app UI. No commit. Archive goal is **not complete**.
- Recorded what already shipped: CH 07 fat year books (**2010** / **2011**) nest an A–Z of official titles (letters that exist, digits as 0–9). Thin years stay a year rundown. Named blocks unchanged. All **366** public embeds stay reachable. Mute remainder after. Sibling channels stay house-only.
- SPAN is a year horizon room: 1994—2026 through the mark. Title is THE SPAN. EXPLORE → `/timeline`. Second door is THE ARCHIVE, not THE WORLD. ARCHIVE / HISTORY / DOCUMENT stay their rooms. James lockup on `/` unchanged.
- YouTube public listing still **366** unique house IDs (`src/data/youtube.ts` `listedHere` / `youtubeUploads`). Videos-tab badge **367**. Never print 3,000 hours as fact.
- James gates unchanged (hours, years, naming, shot-log, show names, footage, Barnes not in the product). Show path unchanged (`docs/PRESENTATION.md`).
- Remaining unblocked weakest: a fat CH 07 letter (2011 C) is still a rundown once opened; DOCUMENT is the quietest opening; tape zoom is still CSS. Unlisted / private still missing.

## 2026-09-09 — SPAN is a year field

- SPAN opening only. Official **CREATIVE [coil] CONTROL** lockup GSAP left mounted. ARCHIVE / HISTORY / DOCUMENT untouched. Beat 1 stays `/`. No hour-count. Not jeen-yuhs. Not the Framer reel.
- Years 1994—2026 occupy the room as one horizon through the mark (1994 / 2000 / 2010 / 2020 / 2026 read; the rest is duration, and the line leaves the frame). Not tick wallpaper. Title is THE SPAN, not giant year type.
- EXPLORE still opens `/timeline`. Second door is THE ARCHIVE, not THE WORLD.
- Desktop verified locally (`:3212`): SPAN years 1994—2026 run through the mark and leave the frame; THE SPAN; EXPLORE → `/timeline`; THE ARCHIVE → `/archive`. ARCHIVE / HISTORY / DOCUMENT unchanged. `/?present=1` beat 1 is `/` (ENTER button, DISCOVER hidden, ten marks). SOUND OFF. Combo **1 RECORD**. Reduced motion: still mark, no sheen, no fringe, year field still.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. HISTORY is now the quietest opening (watching line + aperture).

## 2026-09-09 — Fat CH 07 year books nest A–Z

- `/tv` CH 07 GUIDE is still **13** tunables (Creative Control TV / Channel Zero / TEAR UP / Eckō / 2009–2016 / 2025). Ident still signs on first. PLAY · MUTED. SOUND off.
- A fat year book (36+ official titles) no longer opens as one rundown. **2010** (188) and **2011** (100) nest an A–Z of official titles — letters that exist, digits as 0–9. No invented show names. No quarters (those years are listing-year only). Thin years stay a year rundown. Named blocks unchanged.
- Tuning a letter airs its first official title and opens that chapter. Every title in the year stays reachable. All **366** public embeds stay on the board. Mute remainder after. Sibling channels stay house-only.
- Combo Ye+Chicago+2002+Studio stays **1**. Beat 4 remains `/clip/channel-zero-never-aired`. Catalog IDs, tapes aisle, and home openings left alone. Production typecheck needed a dead `opening.id === "span"` kicker branch removed (SPAN has no kicker; openings unchanged).
- Desktop verified locally (`:3205`): `/tv?ch=7` ident first (Creative Control TV), PLAY · MUTED, SOUND OFF. GUIDE is **13** tunables. Open **2010**: A–Z spines (0–9 open with 6 titles, not 188). Letter C opens official C titles (CAFE DU MONDE). Open **2011**: A–Z (G open — Glass Blowing, not 100). **2009** stays a 3-title year including last public id. CH 05 Sessions at DD172 (house). Combo **1 RECORD**. Beat 4 leftover intact.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Unlisted / private still missing. A fat letter (2011 **C**) is still a rundown once opened.

## 2026-09-09 — DISCOVER stays house serendipity

- DISCOVER (`d`) was treating official `@cctelevisionchannel` uploads as authored PUBLIC house. FROM CHICAGO offered Channel Zero, KRS-ONE (2016). RANDOM TAPE could open the CC-TV dump. Official stay on Index / timeline / BROADCAST / CH 07 — the sleeves prefer the PUBLIC house mock, official only as fallback.
- Sibling TV channels (00–06, 08) were the same leak: CH 05 signed on with a Woodstock upload title. Those tuners are house cuts again. CH 07 still signs on ident first, year books, all **366** reachable, PLAY · MUTED.
- Same catalog. No invented clips. Combo Ye+Chicago+2002+Studio stays **1**. Beat 4 remains `/clip/channel-zero-never-aired`. SOUND off.
- Desktop verified locally (`:3201`): `d` FROM CHICAGO is Cottage Grove sidewalk · 1996 (not KRS-ONE); RANDOM TAPE is a house cassette; UNSEEN / COODIE'S PICK house. CH 03 Auerbach, CH 05 Sessions at DD172. CH 07 ident first, 2009 book includes last public id, PLAY · MUTED. Combo **1 RECORD**. Beat 4 leftover intact. `/?present=1` ten marks, DISCOVER hidden, SOUND OFF. Classics **19**. Studio Nights 0 / HELD IN THE HOUSE FILE. Ali related no Paris, no hospital. Tape aisle CC-0217. Four openings.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Unlisted / private still missing. A fat letter in a year book is still a rundown once opened.

## 2026-09-09 — Persistent memory matches 366 official house uploads

- Docs-only. No app UI. No commit. Archive goal is **not complete**.
- Synced TODO / RESEARCH / RESEARCH_NEEDED / CONCEPTS / DESIGN_LANGUAGE / DECISIONS / CHANGELOG / PRESENTATION / OPEN_QUESTIONS (and the stale ARCHIVE_MODEL scale line) to the official `@cctelevisionchannel` public listing and the later editorial guards.
- YouTube: **366** public house IDs. Videos-tab badge **367**. Method without a Data API key (uploads playlist `UUGOXZwQw4InmSTtxDmfZMpw` + videos-tab pagination + RSS + house playlist membership). CH 07 GUIDE is official blocks and year books, not a 366-line list. Earlier same-day first-page badge **268** was not the paginated set. Mid-day **35** was the first authored board, not the full public file. Never print 3,000 hours as fact.
- Official uploads read as Index holdings (`year · official title · BROADCAST · place`) and as BROADCAST year cassettes — not a card wall, not one CC-TV dump.
- Collections stay editorial. Classics is **19** house titles (Polaroid → Kendall's Cross). `/archive?collection=` matches that reel. Studio Nights is **0** public; leftover is held sleeves, not `{n} IN THE INDEX`.
- Openings are rooms around the lockup. `/tapes` is a facing-spine aisle. Scale is mute remainder, not a count.
- James gates unchanged (hours, years, naming, shot-log, show names, footage, Barnes not in the product). Show path unchanged (`docs/PRESENTATION.md`).
- Corrected stale “35 official titles / 35 official uploads” lines in DECISIONS so later readers do not treat the mid-day board as current.
- Remaining unblocked weakest: a fat CH 07 letter (2011 C) is still a rundown once opened; tape zoom is still CSS.

## 2026-09-09 — Empty stories do not send leftover to an empty Index

- Collection leftover is no longer `{n} IN THE INDEX` when `/archive?collection=` films the public house cut only. Empty public stories (Studio Nights, 0 frames) name leftover as **HELD IN THE HOUSE FILE** and open the clip sleeves — basement MEMBERS ONLY, unused COMING SOON. They do not claim a collection Index that is empty.
- Stories that have a public cut still open that cut in the Index. Their leftover is the same house file / sleeve list, not a count dumped onto the public facet.
- Same ten collections. No invented public frames. Combo Ye+Chicago+2002+Studio stays **1**. Beat 4 remains `/clip/channel-zero-never-aired`. SOUND off.
- Desktop verified locally (`:3198`): `/collections` Studio Nights **NO PUBLIC FRAMES** + HELD IN THE HOUSE FILE (only empty public story). `/collections/studio-nights` empty gate, no OPEN IN THE INDEX, no `2 IN THE INDEX` — leftover is **Basement, October 2002 · MEMBERS ONLY** and **Never used in a cut · COMING SOON** to the clip sleeves. Through the Wire still opens the public cut in the Index; leftover is Los Angeles · RESTRICTED, not `1 IN THE INDEX`. Combo **1 RECORD**. Beat 4 leftover intact. SOUND OFF.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Unlisted / private still missing.

## 2026-09-09 — Archive collection facet films the house cut

- `/archive?collection=` binds the same editorial PUBLIC house cut as `/collections/[slug]`. Official `@cctelevisionchannel` membership stays on the unfiltered Index / timeline / BROADCAST — not a Classics (or Channel Zero / New York) finding-aid of the CH 07 file.
- Collection id or slug both resolve (`classics` and `creative-control-classics`). Classics is the 19 house titles (Polaroid → Kendall's Cross), not 366 official uploads. Studio Nights stays 0 public frames.
- Same ten collections. No official dumps added to any reel. Combo Ye+Chicago+2002+Studio stays **1**. Beat 4 remains `/clip/channel-zero-never-aired`. SOUND off.
- Desktop verified locally (`:3197`): `/archive?collection=classics` **19 RECORDS** (Polaroid → Kendall's Cross, no TEAR UP / ident dump); slug `creative-control-classics` the same 19; Studio Nights **0 RECORDS** / NO RECORDS; Through the Wire **4 RECORDS**; unfiltered Index still has official year through-lines (TEAR UP, Creative Control TV). Combo **1 RECORD** (Basement, MEMBERS ONLY). Beat 4 leftover intact. SOUND OFF.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Empty stories still send held leftover to a collection URL that films the public cut only. Unlisted / private still missing.

## 2026-09-09 — Collection stories stay house cuts

- `/collections` stories no longer bind every official PUBLIC upload. The reel is the original house editorial PUBLIC frames already in each cut. Official `@cctelevisionchannel` holdings stay on Index / timeline / BROADCAST — not a Classics (or New York / Channel Zero) film of the CH 07 file.
- Classics films the authored house year reel (19 frames, 2003 — 2025): Polaroid through Accel Origins. Not 362 official titles.
- Studio Nights stays honest empty (0 public frames). Official studio sessions are not stamped onto that cut. Held basement / unused stay in the index.
- Same ten collections. No Barnes. No new collection objects. Combo Ye+Chicago+2002+Studio stays **1**. Beat 4 remains `/clip/channel-zero-never-aired`. SOUND off.
- Desktop verified locally (`:3194`): `/collections` contents — Studio Nights **NO PUBLIC FRAMES**; Classics **2003 — 2025** (not the CH 07 file); Channel Zero **1995 — 1998**. Classics reel is the 19 house titles (Polaroid → Kendall's Cross), no TEAR UP / ident dump. Studio Nights empty gate + 2 IN THE INDEX. Through the Wire 4 house beats. Combo **1 RECORD** (Basement, MEMBERS ONLY). Beat 4 leftover intact. SOUND OFF.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. `/archive?collection=classics` can still list official membership. Unlisted / private still missing.

## 2026-09-09 — Official uploads live as archive holdings

- Official `@cctelevisionchannel` PUBLIC embeds now read in the archive, not only on Television. Index / timeline / tapes use finding-aid typed lines: **year · official title · BROADCAST · place** (place already on the record). Not a thumbnail grid. Not a card wall. No hour-count. No upload-count trophy.
- `/archive` unfiltered keeps house rows and one official through-line per listing year. A year (or a search) opens that year’s official titles as holdings. Combo Ye+Chicago+2002+Studio stays **1 RECORD** (Basement, October 2002, MEMBERS ONLY, no `youtubeId`).
- `/timeline` year film still prefers a house title when one exists; otherwise the official title is the through-line. Year-only uploads sit as holdings under the year — not `N UNDATED`, not UNLOGGED as a title. Month / day film unchanged in voice.
- `/tapes` BROADCAST bay is year cassettes (listing years on the record), not one CC-TV dump. Opening a year is typed holdings. `/tapes/t-broadcast` is the same ledger. CSS aisle camera left in place. CH 07 / `present.ts` / youtube IDs left alone.
- Desktop verified locally (`:3191`): combo **1 RECORD** (Basement, October 2002, MEMBERS ONLY). Unfiltered Index is THE FULL INDEX with **9** official through-lines (`year · official title · BROADCAST · New York`) — not a card wall, no record-count. `?year=2013` opens typed holdings including PRO ERA OVERSEAS plus house Good Morning, 2013. Timeline through-lines stay house-first (2002 basement, 2013 Good Morning) with official titles where that is the year (TEAR UP, Creative Control TV). Year 2013 drill lists official holdings, not `N UNDATED`. Aisle `?open=broadcast-2013` is PUBLIC BROADCAST + holdings + OPEN THE FILE — no LOGGED stamp. `/tapes/t-broadcast` is HOLDINGS by year. SOUND OFF. Beat 4 leftover intact.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Unlisted / private still missing. Most listing years are still years, not days. The full CC-TV file is still a long ledger once opened.

## 2026-09-09 — CH 07 GUIDE is a programmed board

- `/tv` CH 07 GUIDE is no longer a 366-line title dump. Official blocks and upload-year books are the tunables (Creative Control TV, Channel Zero, TEAR UP, Eckō, then year). Ident still signs on first. Tuning a book opens that book’s official titles — all **366** public embeds stay reachable. Mute remainder (NOT IN THIS MOCK / HELD / UNOPENED) stays after the official set.
- Ident crawl on CH 07 is the same board (blocks / years), not every title. PLAY · MUTED, `youtube-nocookie`, existing BroadcastPlayer. SOUND off. Combo Ye+Chicago+2002+Studio stays **1**. Beat 4 stays `/clip/channel-zero-never-aired`. No invented show names. No Barnes / Ghetto Rock / Culo / Ted. Catalog IDs, tapes aisle, and home openings left alone.
- Desktop verified locally (`:3188`): `/tv?ch=7` signs on ident first (Creative Control TV), PLAY · MUTED, SOUND OFF. GUIDE is **13** tunables (Creative Control TV / Channel Zero / TEAR UP / Eckō / 2009–2016 / 2025) — not 366 title rows. Open book: CC-TV 3, TEAR UP 6, 2009 3 including last public id, 2010 188. Tune book and title both air. Mute remainder after. Combo **1 RECORD**. Beat 4 leftover intact.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Unlisted / private still missing. A fat year book (2010) is still a long rundown once opened.

## 2026-09-09 — Official channel uploads on CH 07

- Collected the public `@cctelevisionchannel` (`UCGOXZwQw4InmSTtxDmfZMpw`) listing **without a Data API key**: official uploads playlist `UUGOXZwQw4InmSTtxDmfZMpw` + videos-tab pagination (`yt-dlp --flat-playlist --skip-download`, IDs / titles only) + channel RSS (15 newest exact dates) + house playlist membership. No watch-page scrape. No file download. VEVO / other channels unwired.
- Videos-tab badge **367**. Public listing **366** unique house IDs (all `channel_id` match). Gap of **1** (unlisted / private / count drift). Earlier same-day first-page badge **268** was not the paginated set. No Shorts tab. No Streams tab.
- Authored the remaining **331** as PUBLIC catalog clips (`c-85`–`c-415`) from official titles only. Existing `c-50`–`c-84` kept. No new people / projects. Basement October 2002 still has no `youtubeId`. Combo Ye+Chicago+2002+Studio stays **1**.
- CH 07 still signs on with the house ident, then official blocks (Creative Control TV / Channel Zero / TEAR UP / Eckō / upload year). New uploads join those blocks. Sibling mute remainder stays after the official public titles (now unlisted / private — not the public set). SOUND off. Player still PLAY · MUTED, `youtube-nocookie`, existing BroadcastPlayer.
- Home openings / tapes aisle / scale left to siblings. `present.ts` beat 4 still `/clip/channel-zero-never-aired`.
- Desktop verified live: `/tv?ch=7` ident first (Creative Control TV), PLAY · MUTED, **366** GUIDE rows, official blocks then year, mute remainder unlisted/private; `/clip/pro-era-overseas` official title + PLAY · MUTED; combo **1 RECORD**; SOUND OFF; beat 4 leftover intact.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Unlisted / private still missing. Durations not stored. Most dates are listing years, not watch-page days.

## 2026-09-09 — Home openings are four thresholds

- `/` lockup stays the official **CREATIVE [coil] CONTROL** GSAP draw-on and does not remount when the switcher changes takes. ARCHIVE / HISTORY / DOCUMENT / SPAN now change the room around the mark: light, a field behind the lockup, copy, and a different door pair. Not type-only. Not the live Framer reel. No Ali card. No invented catalog.
- ARCHIVE: leader + museum wash. THE ARCHIVE / ENTER → `/archive`. THE WORLD → `/world`.
- HISTORY: cooler screening light, 4:3 aperture. YOU ARE WATCHING HISTORY. / BEGIN → `/tv`. THE ARCHIVE → `/archive`.
- DOCUMENT: Channel Zero leftover yellow + checker band (materials). DOCUMENT EVERYTHING. / WATCH → leftover `/clip/channel-zero-never-aired`. THE NETWORK → `/tv`.
- SPAN: long cool ticks behind the mark. 1994 — PRESENT / EXPLORE → `/timeline`. THE WORLD → `/world`.
- Cut / GSAP bootstrap, catalog, and `present.ts` left alone. Beat 1 stays `/`. During the show the primary verb still advances. SOUND off. Reduced motion is the still mark; fields stay still. Combo Ye+Chicago+2002+Studio unchanged (1).
- Desktop verified locally: openings switch (ARCHIVE / HISTORY / DOCUMENT / SPAN) without remounting the lockup; ARCHIVE ENTER → `/archive`; `/?present=1` ENTER → `/world`; combo **1 RECORD**; SOUND OFF; reduced motion is the still mark (no fringe, no sheen).
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. SPAN is still the quietest room — ticks behind the mark, second door still THE WORLD.

## 2026-09-09 — Mute remainder after the public cut

- Scale pass on two thin surfaces. Goal still **not complete**. No commit.
- `/tapes` UNOPENED is a longer mute rack of facing spines (honest labels only — UNOPENED / HELD paper / NOT IN THIS MOCK / queued / closed / label only), then a GROWABLE empty lip that fades. Larger than any one authored bay. Stays when a cassette opens (recedes). No invented tape codes. No hour totals.
- `/tv` CH 07 GUIDE still airs the official public titles. After them a mute strip: NOT IN THIS MOCK / HELD / UNOPENED / growable empty. No invented show names. No hour-count.
- Catalog / `present.ts` / combo / beat 4 / index / timeline / world left alone. Combo Ye+Chicago+2002+Studio stays **1**. Beat 4 remains `/clip/channel-zero-never-aired`. SOUND off.
- Desktop verified locally (`:3177`): `/tapes` UNOPENED mute rack + GROWABLE empty stay when a cassette is open. `/tv?ch=7` GUIDE ends with NOT IN THIS MOCK / HELD / UNOPENED — no 3,000 / 268 / 233, no UNLOGGED show title. Combo **1 RECORD**. Beat 4 leftover intact. SOUND off.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Index later years and the timeline mute strip are still the weakest scale reads.

## 2026-09-09 — Persistent memory matches the tree

- Docs-only. No app UI. No commit. Archive goal is **not complete**.
- Checked working tree + live hobby `https://creativecontrol-tv.vercel.app` (home lockup + SOUND OFF; combo **1 RECORD** finding-aid row; `/tapes` shelves STORAGE / DIGITAL VAULT / PHONE / STUDIO / BROADCAST **35 LOGGED** / UNOPENED).
- Recorded what shipped: official lockup, GSAP+VT, TV 35 official, vault shelves, finding-aid index, clip gate, constellation void + phone pocket, SOUND OFF verbs, present 10 beats, through-line timeline, keyboard house walk, mobile dock, world Tab.
- James-blocked gates moved to the **top** of `TODO.md`. Unblocked weakest left honest (CSS tape camera, thin TV names, authored coasts, short constellation, procedural sound, prototype transcripts).
- **Correction (CONFIRMED FACT, this tree):** `public/` holds `brand/creative-control-coil.svg` and `creative-control-lockup.svg` only. Brand PNGs named earlier are not on disk. `public/sound/*.wav` is not on disk — `sound.ts` still fetches those paths and falls back to procedural verbs. Do not invent that files were deleted.
- Evidence classes held. No hour-count printed as fact.

## 2026-09-09 — Timeline month / day film drops inventory

- `/timeline` month and day cells match the year strip: era, the month or day, and the lead title or cassette label. Dropped `N FRAMES` on the month / day film and `MINIDV · N FRAMES` on landed-day reel slugs. Tape codes and original labels stay. Year / month / day still never title UNLOGGED.
- Paths stay through-lines (no ALL tab). Catalog / home / world / tv / tapes / archive / `present.ts` left alone.
- Combo Ye+Chicago+2002+Studio unchanged (1). SOUND off. Reduced motion still holds the strip still.
- Desktop verified: `/timeline` span is through-lines (no ALL tab); 2002 month film reads era / OCTOBER / **Basement, October 2002** (no `12 FRAMES`); day film Oct 12 is the same title (no `6 FRAMES`); landed Oct 12 is OCTOBER 12 · 2002 · the basement · CC-0217 **CHI OCT 02 / YE BASEMENT** (no `MINIDV · N FRAMES`). UNLOGGED stays mute on density, never the day title. Combo **1 RECORD**. SOUND off.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Month / day film is time, not a vault inventory.

## 2026-09-09 — World cities take a quiet Tab

- `/world` keeps arrows for travel. Tab now reaches the selected city, THE PLACE, then Chicago and other facing marks. The list is clipped until focus — condensed type, not a chip HUD, not PREV/NEXT on the globe.
- Reduced motion stays YEAR · MAP. Same city path, plus the existing PREV/NEXT. Sculpture labels stay pointer-first; their THE PLACE is out of the tab order so the dock is the door.
- Idle orbit and fly-to left alone. Combo Ye+Chicago+2002+Studio unchanged (1). Catalog / timeline / constellation / present.ts left alone.
- Desktop verified: Tab from the year → CHICAGO → THE PLACE → `/places/chicago`. Arrows New York and back. YEAR · MAP same path. Fly `?city=chicago&fly=1` still arrives. SOUND off.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Marks on the ball are still a pointer; the keyboard walks a quiet proxy.

## 2026-09-09 — Constellation on a phone is a pocket, not a list

- `/constellation` at ~390 is a handheld field: the name in the palm, hairline spokes, thumb-sized labels. Not a Wikipedia section list and not the desktop 1440 void squashed down. Desktop GSAP spokes stay the deep field. Spine still recenters. Ali still refuses Paris and the hospital tape. Still off the rail and the show walk.
- Reduced motion is the pocket already drawn (CSS spoke-draw / star-register collapse). SOUND off. Catalog / home / timeline / world / `present.ts` left alone.
- Verified: `?person=coodie` at 390 (Coodie in the palm; Ye / Badu / Chike / Channel Zero / Through the Wire / Cottage Grove / two frames; no overflow; spine Ye and the Coodie spoke both recenter). Ali: Coney + house frames, no Paris, no hospital. Desktop 1440 still the void. SOUND OFF.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. The pocket is still a short cut of true spokes.

## 2026-09-09 — Timeline paths are connections, not tabs

- `/timeline` dropped the ALL / COODIE / CHIKE / YE / COLLEGE DROPOUT / CHICAGO / CREATIVE CONTROL tab bar. The span is the story until you follow a name; then the name is the title and THE SPAN · 1994 — 2026 returns. Connections sit as a `through` sentence on each decade (who actually runs that film), and in the header once a year or a thread is open — so span → 2002 → October → 12 can still follow YE. Same path query. No ALL facet.
- Decade voice unchanged (era time). Year / month / day still never title UNLOGGED. No museum dek. No record-count inventory on the path. Catalog / home / world / tv / tapes / archive / `present.ts` left alone.
- Combo Ye+Chicago+2002+Studio unchanged (1). Beat 4 remains `/clip/channel-zero-never-aired`. SOUND off. Reduced motion still holds the strip still.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Paths are a through-line, not the vault on a person.

## 2026-09-09 — Keyboard can walk the house

- Tab order is the house: skip, mark, rails, DISCOVER, SOUND, then the room. One skip link. Focus is a hairline of leader gold — not a government ring. SOUND is a real button; Space on it toggles, even during the show. `d` still opens DISCOVER; Escape closes the veil. Enter/Space take doors (threshold, DISCOVER sleeves, rails, THE FIELD).
- Escape on an open cassette closes the tape only. `x` / Shift+Escape still leave the show. GUIDE is one title per row; arrows move between rows without stealing the tuner. Constellation spokes are in the tab order (`role=group`); Enter recenters a person / place / project.
- Combo Ye+Chicago+2002+Studio unchanged (1). Reduced-motion rules left in place. Catalog / lockup / world coasts / tape camera / TV programming left alone. Sibling mobile chrome kept.
- Desktop verified: `/` ENTER → `/archive`; combo **1 RECORD**; `/?present=1` Space → `/world`; SOUND Space does not hop; `d` focuses RANDOM TAPE; Escape closes a tape (`CC-0217`) without leaving the page; constellation Coodie → Ye by keyboard.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Keyboard can enter. The globe cities are still mostly a pointer.

## 2026-09-09 — A person is a file, not a profile

- `/people`, `/places`, `/projects` dropped the Wikipedia nameplate and the construction-circle clock. The short name is the tab. Legal name / origin / span are stamps. Bonds are a stack: proving still in a gate, axis, name, the authored frame that proves the edge. Hover racks one bond. MEMBERS ONLY proving frames stay paper (Through the Wire → basement). No YouTube remount on the file.
- Same catalog. Same spokes. Ali still refuses Paris and the hospital tape. THE FIELD still opens the void. Clock SVG (`StarField` page ring) is gone. Deep field / lockup / TV / vault / index / clip gate / sound / present left alone.
- Combo Ye+Chicago+2002+Studio unchanged (1). Beat 4 remains `/clip/channel-zero-never-aired`. SOUND off.
- Desktop verified: Coodie file (tab + bonds; Through the Wire is paper MEMBERS ONLY); Ali (Coney, no Paris, no hospital); Chicago + Through the Wire files; THE FIELD still the void; combo 1 RECORD; SOUND off.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. The file is still a short cut of true bonds, not the vault on a person.

## 2026-09-09 — The index is a finding aid, not a card grid

- `/archive` sheet is a year-grouped ledger: when, tape, type, title, place, people, and a hold if the picture is closed. Not a 4:3 thumbnail mosaic. Not a sortable table. Unfiltered PUBLIC cut has no record-count inventory. A query still stamps N RECORD(S).
- Editorial rails unchanged (era, decade then year, gravity places, spine people, type, collection cuts). Search still binds a unique person / place / year / type / collection, or `?q=` against prototype transcript text.
- Combo Ye+Chicago+2002+Studio stays **1 RECORD** — Basement, October 2002, MEMBERS ONLY. Catalog / home / world / tv / tapes / timeline / clip / constellation / collections / present / sound left alone.
- Desktop + ~390 verified: combo 1 (year 2002, OCT 12, CC-0217, STUDIO, paper MEMBERS ONLY); unfiltered THE FULL INDEX from 1995 with no record inventory; PERSON Ye rail → 10 RECORDS including the basement hold; `?q=radiator knocks` → 1 (prototype transcript). SOUND off.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. The sheet is still typed catalog, not a room of paper.

## 2026-09-09 — House sound is analog, still off

- SOUND stays **OFF** until the visitor turns it on. No session restore. A refresh is silent. Reduced-motion skips room tone and hop cuts. Official embeds stay PLAY · MUTED.
- Placeholder square / saw tones are gone. House verbs: **threshold** (door), **acquire** (tuner lock), **cut** (splice / hop / DISCOVER), **tape** (MiniDV engage). Original short WAVs in `public/sound/` plus a gated WebAudio bus. Quiet analog room tone while ON — not a music bed.
- Existing call sites kept (`playSwitch` / `playEngage` / `playStatic`). Chrome plays cut / threshold on hops. Home lockup GSAP, world, tapes shelves, tv programming, BroadcastPlayer, constellation, collections, catalog, `present.ts` left alone.
- Combo Ye+Chicago+2002+Studio unchanged (1).
- Desktop verified: `/`, `/tv`, `/clip/channel-zero-never-aired` all read SOUND OFF on first paint; no `/sound/*.wav` fetch until ON; combo 1.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Sound is still four short verbs, not a scored house.

## 2026-09-09 — The constellation is a field, not a clock

- `/constellation` is the archive’s graph: a name on void, hairline spokes, labels at different distances (people closer; project / song / place / frames farther). Not a d3 ring, not a construction circle, not a museum diagram. Still not on the rail. Still not in the show.
- GSAP registers the name, draws the spokes, and lets labels travel out. Hover rack-focuses one spoke and names the axis plus the authored frame that proves the edge. A person, place, or project in the field recenters; a frame or song opens the record; the name still OPENs the node.
- Same catalog. No invented people, places, projects, or quotes. Compact entity spokes on person / place / project pages left alone. Ali still refuses Paris and the hospital tape.
- Reduced motion is the field already drawn — JS drops spoke draw. SOUND off. Combo Ye+Chicago+2002+Studio unchanged (1).
- Desktop verified: `/constellation?person=coodie` (Ye / Badu / Chike / Channel Zero / Through the Wire / Cottage Grove / two frames); click-recenter to 63rd & Cottage Grove and Channel Zero; Chicago and Through the Wire fields; Ali (Coney, no Paris, no hospital); Ye hover credit; reduced already drawn (no spoke-draw); combo 1; SOUND off; person page compact ring + THE FIELD intact.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. The field is still a short cut of true spokes, not the whole house.

## 2026-09-09 — The clip is a frame in the gate

- `/clip/[slug]` opens as an extraction: labeled cassette beside a sprocketed gate. GSAP registers the aperture, settles the cassette, draws a leader hairline, then the title. Not a YouTube watch page. Not a metadata sheet with a player on top.
- Official embeds stay the existing click-to-play, muted, `youtube-nocookie` player — wrapped, not rewritten, not remounted. Closed visibilities are physical sleeves in the gate (MEMBERS ONLY is paper). Prototype transcript is stamped editorial inference. A broadcast clip does not reprint the 35-block shelf as an up-next grid; the cassette stamp and OPEN THE SHELF hold that density.
- Related is leftover frames with an axis (LEFTOVER / TITLE CARD / project), not numbered up-next cards. Ranking unchanged: no year-alone / city-alone / same-tape unlogged reprints. Ali still refuses Paris and the hospital year. UNLOGGED is never a title.
- Cassette strip, BroadcastPlayer internals, catalog / youtube / present, home, world, tapes, tv, collections left alone. Reduced motion is the still register. SOUND off. Combo Ye+Chicago+2002+Studio unchanged (1). Beat 4 remains `/clip/channel-zero-never-aired`.
- Desktop verified: leftover Channel Zero; a PUBLIC broadcast PLAY · MUTED; basement MEMBERS ONLY sleeve; Ali related (Coney, no Paris, no hospital). SOUND off.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. The gate is still a page around a picture — not an optical pull from a cassette.

## 2026-09-09 — Openings are thresholds; DISCOVER offers a tape

- `/` lockup stays the official **CREATIVE [coil] CONTROL** draw-on. Opening switcher (dev, or `?opening=`) is ARCHIVE / HISTORY / DOCUMENT / SPAN — never “Concept.” Each take is a different register after the mark: house door, watching line, Channel Zero mandate, span. Switching takes does not remount the lockup.
- DISCOVER (`d`) is a veil and sleeves, not a right-rail settings panel. RANDOM TAPE is the cassette in the hand. TAKE ME SOMEWHERE / UNSEEN / ON THIS DAY / FROM CHICAGO / COODIE’S PICK stay PUBLIC-only. No inventory counts. Hidden while presenting.
- Cut / GSAP bootstrap, world, tapes, tv, clip, constellation, collections, catalog, and `present.ts` left alone. SOUND off. Combo unchanged.
- Desktop verified locally: lockup still the official mark; openings switch (ARCHIVE / HISTORY / DOCUMENT / SPAN); `d` offers a tape; `/?present=1` hides DISCOVER; combo Ye+Chicago+2002+Studio = 1; SOUND off. Reduced motion: still mark, watching line, DISCOVER with no offer slide.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**.

## 2026-09-09 — Television is on, not a page about TV

- `/tv` is a programmed network: live ident strap (giant channel, voice, ON AIR clock, crawl of official titles), graphic tuner strip with a Flip hairline, stage with GSAP lower-third, acquire that stamps the channel number, GUIDE that tunes the slot. Not CRT. Not a YouTube grid. No invented show titles.
- CH 07 still signs on with the house ident, then the **35** official `@cctelevisionchannel` PUBLIC blocks (c-50–c-84). GUIDE groups by official playlist names / Channel Zero / upload year. BENT still has no house upload.
- Acquire, crawl, Flip, ident lock, and the lower-third flourish collapse when reduced. SOUND off. Combo Ye+Chicago+2002+Studio unchanged (1). Catalog / youtube wiring / BroadcastPlayer internals / present.ts / world / tapes / home lockup left alone.
- Desktop verified: `/tv` CH 00 → 03 → 07 (PLAY · MUTED, ident first), GUIDE rundown, `?ch=3` Studio first paint, combo 1, SOUND off.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Most real CC Television show names remain unknown.

## 2026-09-09 — World flies around Earth, not through it

- `/world` globe only (R3F already here). Idle starts farther over the mid-Atlantic — slow orbit, drifting light, gold limb, star drift. Chicago still glows; names stay off until you approach or hover a facing city. No count. No city-chip HUD.
- Fly-to pulls back, then great-circles around the sphere, then eases in (Chicago closer). A short hold before orbit resumes. Drag cancels the fly. Far-side marks fade so they do not punch through the ball.
- Compact / reduced-motion / weak WebGL is still YEAR · MAP, one selected label, PREV/NEXT — snap, no orbit. Coasts stay authored. No second 3D engine. Layout / GSAP / View Transitions / catalog / rails / tapes / tv / BroadcastPlayer left alone.
- Desktop verified: idle orbit (~100fps, unlabeled Earth, Chicago weight); `/world?city=chicago&fly=1` arrives on the Lakes with CHICAGO + THE PLACE. Reduced motion: MAP, no canvas. SOUND off. Combo unchanged.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Coasts are still authored rings, not surveyed Earth.

## 2026-09-09 — Tapes are shelves of source cassettes

- `/tapes` is a vault aisle, not a card mosaic. Cassettes sit on provenance lips: STORAGE (camera originals), DIGITAL VAULT, PHONE, STUDIO, BROADCAST (not camera originals), then UNOPENED mute shells.
- Opening a tape is still a CSS film-gate camera (perspective, doll-in, other shelves recede in Z). The cassette stays on the shelf; frames register in a gate as LOGGED vs UNLOGGED — no invented shot-log titles. No second R3F scene.
- `/tapes/[id]` cassette now stamps LOGGED · UNLOGGED instead of a clip count. Paper file and contact sheet unchanged.
- Beat 9 still opens CC-0217 via `/tapes?open=t-0217`. Reduced motion is `transform: none`. SOUND off. Combo unchanged.
- Desktop verified: `/tapes` shelves (STORAGE first, CC-0217 on the lip); `/tapes?open=t-0217` dolls the CSS camera and registers 1 LOGGED · 5 UNLOGGED in the gate; `/tapes/t-0217` cassette stamps the same density. SOUND off.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Tape zoom is still CSS, not optical.

## 2026-09-09 — Archive motion is a cut, not a blink

- House stack: **GSAP + Flip** (lockup, lens hairline) + **View Transitions** (route cuts) + **Framer Motion kept** on tape / clip / opening type. R3F stays on `/world`. No Lenis, Lottie, Theatre, anime, Barba, or ScrollTrigger.
- `/` lockup is live **CREATIVE [coil] CONTROL** — house type + SVG coil draw-on, wraps lock, fringe settle, one sheen. Working tree had no lockup PNGs; we did not animate missing bitmaps. Not the Framer reel. ENTER / THE WORLD still the doors.
- Lens hops (rail, ENTER, DISCOVER, constellation anchors, `/?present=1` Space across pathnames) are a film-gate cut. Same-path beats keep fly-to / TV acquire. Removed the Framer `key={pathname}` remount that made hops blink.
- Micro-life only: Flip hairline on the desktop rail, GUIDE ON hairline, existing sprocket / tape camera / clip gate / spokes. Collections files untouched.
- Reduced motion collapses draw-on, cuts, Flip, grain, fringe, sheen. SOUND off.
- Catalog, rails, timeline dek, BroadcastPlayer, `/tv` show names, combo, beat 4 untouched.
- Desktop verified locally: lockup draw-on; ENTER / WORLD cuts; Flip rail; TV GUIDE ON; tapes mosaic; timeline era film; beat 4 leftover; combo 1; present Space 1–4; SOUND off. Home + ENTER cut held 60fps (no frames >22ms). Reduced motion: still mark, 24ms instant cut.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Combo Ye+Chicago+2002+Studio unchanged (1). Beat 4 remains `/clip/channel-zero-never-aired`.

## 2026-09-09 — Remaining listed CC Television IDs are on air

- Wired the **18** already-listed official `@cctelevisionchannel` uploads that were still listings-only (`c-67`–`c-84`). Titles from the official RSS / videos-tab / playlist pages. No new people, projects, or show names. No watch-page scrape. No fake shot-log.
- CH 07 still programs ident first, then official blocks (Creative Control TV, Channel Zero, TEAR UP, Eckō Studio Sessions, upload year). Not a YouTube grid. BENT still has no house upload — only other-channel playlist items, still unwired.
- Basement October 2002 still has no `youtubeId`. Combo Ye+Chicago+2002+Studio unchanged (1). SOUND off. Goal not complete: channel reports **268**; **35** listed and authored; ~233 need a Data API key.
- Catalog / `youtube.ts` / research notes only. Home hero, motion stack, `/collections` pages, globe, tapes mosaic, BroadcastPlayer, `/archive` rails, timeline dek, and present beat 4 untouched.

## 2026-09-09 — Collections are a film, not a contact sheet

- `/collections` is contents: chapter number, catalog name, catalog dek, era span, and a still — or no still. Dropped the thumbnail-and-frame-count list.
- `/collections/[slug]` is one editorial cut: title, dek, then a reel of authored PUBLIC frames already in that collection. Year is an intertitle when the cut crosses years. Each beat is a still in the gate plus the title as the line — not a `ClipCard` grid, not 001 / PUBLIC inventory.
- Studio Nights stays an honest empty (empty gate, no invented picture). Authored held frames can open in the index. Unlabelled density stays in the index and is not counted as the story leftover.
- Same ten cuts. No new collection objects. Catalog, rails, BroadcastPlayer, tape camera, `/tv`, `/timeline`, and the home lockup untouched.
- World fly-to used `Vector3.slerp`, which Three does not have. Unit-direction slerp so Chicago fly still works. Coasts and authored rings untouched.
- Desktop verified: `/collections` contents; Through the Wire film; Studio Nights empty gate; Classics year reel; combo 1; beat 4 leftover; CH 07 PUBLIC; SOUND off; home still the official lockup door.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Combo Ye+Chicago+2002+Studio unchanged (1). Beat 4 remains `/clip/channel-zero-never-aired`. SOUND off.

## 2026-09-09 — Official lockup lands on the archive home

- James asked for the real Creative Control logo as an animated `/` hero. Home now seats the official **CREATIVE [coil] CONTROL** lockup in a film gate: register, RGB fringe, page grain, one light sheen. Then THE ARCHIVE / ENTER / THE WORLD. Desktop uses the banner lockup; mobile uses the channel emblem so the coil can read.
- **CONFIRMED FACT:** official mark used on home. Source is official YouTube channel art (`@cctelevisionchannel` banner lockup + avatar emblem), checked against the live `creativecontrol.tv` ident. Assets in `public/brand/`. Coil/lockup SVGs are reconstructions of those stills — not a reel rip, not a watch-page scrape.
- Not the live Framer splash: no reel, no Ali card, no full-bleed ident loop. Opening switcher, DISCOVER, and `/?present=1` (beat 1 = `/`) stay. Reduced motion is the still official mark — no crawl, no fringe, no sheen.
- Catalog, rails, BroadcastPlayer, tape camera, `/tv`, `/timeline`, person / place / project / constellation untouched.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Combo Ye+Chicago+2002+Studio unchanged (1). Beat 4 remains `/clip/channel-zero-never-aired`. SOUND off.

## 2026-09-09 — Person / place / project are a graph, not a card sheet

- `/people/[slug]`, `/places/[slug]`, `/projects/[slug]` dropped the year-film posters and the featured card grid. A node is a compact field (same tape / project / song / day / subject / place / house ethic as `/constellation`) plus a rundown: axis, destination, the authored frame that proves the edge.
- `/constellation` stays the deep field. It can recenter on a place or a project. Reach it from a node as THE FIELD. Not on the rail. Not in the show.
- Same catalog. No invented people, places, projects, or quotes. Ali’s graph still refuses Paris and the hospital tape.
- Archive rails, timeline dek, BroadcastPlayer, tape camera, and `/tv` untouched.
- Desktop verified: Coodie / Ali / Chicago / Through the Wire graphs; `/constellation` (person + place); combo 1; beat 4 leftover; CH 07 PUBLIC; SOUND off. Ali graph has Coney and house frames — not Paris, not the hospital tape.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Combo Ye+Chicago+2002+Studio unchanged (1). Beat 4 remains `/clip/channel-zero-never-aired`. SOUND off.

## 2026-09-09 — Television is a network, not a daypart page

- `/tv` is the network: each channel has a thin voice line (not a slogan), the tuner names what is on, and GUIDE is the day’s rundown with ON marked. Dropped NOW / NEXT / LATER / ARCHIVE tabs and the lineup count.
- Channels 00–06 and 08 keep the editorial day. CH 07 BROADCAST signs on with the house ident, then official public blocks (Creative Control TV, Channel Zero, TEAR UP, upload year). No invented show titles.
- Wired seven already-listed official uploads as authored PUBLIC: TEAR UP Rounds 1–5 and the two 2025 house teasers. No new people or projects. No watch-page scrape. BroadcastPlayer internals untouched.
- Acquire keeps the film-gate wipe; Channel Zero wipes yellow, Broadcast wipes signal. Reduced motion still cuts. SOUND off.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Combo Ye+Chicago+2002+Studio unchanged (1). Beat 4 remains `/clip/channel-zero-never-aired`.

## 2026-09-09 — Decade lines drop the camera narrator

- `/timeline` 1990s is **Public access. Informal rooms. Chicago.** — not “The camera learns Chicago.” 2000s is **The long shoot, then a network. New York.** — not “New York enters the frame.” 2010s / 2020s unchanged.
- Year cells that name “the camera” fall back to cassette label / work / era (1998 reads **TWISTA / GREEN ROOM**). Clip title “A cut from the vault” left in the catalog; it still does not print as a year beat.
- Catalog, rails, BroadcastPlayer, tape camera, CC-TV names, hour-count, and coil mark untouched.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Combo Ye+Chicago+2002+Studio unchanged (1). SOUND off.

## 2026-09-09 — Decade film is era time, not a catalog lecture

- `/timeline` decade lines are era beats. 2020s is **jeen-yuhs. Then after the cut.** — not “A cut exists. The catalog continues after it.”
- Year cells that lectured about the vault fall back to cassette label / work / era (2022 reads **LONDON PRESS**, never UNLOGGED). Decade year cells dropped `N FRAMES` so the strip is title and era, not inventory. Month / day film can still name frames. Entity year cells follow the same beat.
- Catalog, rails, BroadcastPlayer, tape camera, CC-TV names, hour-count, and coil mark untouched.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Combo Ye+Chicago+2002+Studio unchanged (1). SOUND off.

## 2026-09-09 — Timeline chrome is time, not inventory

- `/timeline` dropped the museum dek (“Year, then month, then day…”) and the record-count inventory (`FULL SPAN · N RECORDS`, decade `N RECORDS`). The header is the span (1994—2026) and the path. The sprocket and the film follow. Paths, year / month / day beats, and the landed day stage unchanged. Year / month / day still never title UNLOGGED.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Combo Ye+Chicago+2002+Studio unchanged (1). SOUND off.

## 2026-09-09 — Timeline day stage is a day of film

- `/timeline` landed day dropped “THAT DAY,” the cassette-object grid, and the mute title list. A day opens as film time: the date, a lead title (never UNLOGGED), the picture in the gate (prototype or held — no broadcast remount), slim reel slugs, then that day’s frames in time. Empty days stay empty. Year / month / day rails and paths unchanged.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Combo Ye+Chicago+2002+Studio unchanged (1). SOUND off.

## 2026-09-09 — Timeline months are film, not a chart

- `/timeline` year drill dropped the count-height month histogram. A year is a 12-tick sprocket (equal months; empty dim; selected in leader) plus a month film strip (era, month, lead title, frames). A month is a day sprocket plus day film — not a record-count card grid. Empty months stay on the rail. Paths unchanged. Year and month beats still never title UNLOGGED.
- Redeployed hobby `creativecontrol-tv` (clean build): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**. Combo Ye+Chicago+2002+Studio unchanged (1). SOUND off.

## 2026-09-09 — Closed destinations are held, not denied

- Clip / tape destinations read `visibility` / `rightsStatus` / `sensitivityStatus`. Non-PUBLIC authored frames render a held sleeve (UNLISTED, PRIVATE, COMING SOON, MEMBERS ONLY, RESTRICTED, PENDING CLEARANCE) instead of the open stage. No “Access denied.” No lock icon. No auth. Unlogged density stays mute.
- Unfiltered `/archive` is authored PUBLIC only. Filtered queries and direct URLs still reach closed records. DISCOVER unchanged. Catalog untouched. Cards stay prototype or held — not a YouTube grid.
- Cassette files stamp HELD when authored frames are closed. Closed clips do not open the prototype transcript dossier.
- Goal still incomplete. Combo Ye+Chicago+2002+Studio unchanged (1). SOUND off.

## 2026-09-09 — Collections are stories, not a playlist

- `/collections` and `/collections/[slug]` are held editorial cuts of the same catalog: type plus a contact sheet of authored PUBLIC frames already in those ten collections. Restricted and unlabelled density stay in the index.
- Archive COLLECTION rail label opens `/collections`. A selected cut links to its story. Clip dossier collections open the story, not a filter URL. Rails themselves are unchanged.
- Studio Nights has no authored PUBLIC frames yet — the page says so and sends the rest to the index. No new catalog rows. No hour-count. Goal still incomplete.

## 2026-09-09 — Film-gate motion (goal still incomplete)

- Motion language is a film gate: register, acquire, travel. Not bounce, not a template fade-up, not the live coil.
- `/` — leader crawls, grain drifts, title registers, fringe settles, ENTER draws.
- `/world` — slower idle orbit; fly-to pulls back then eases in (Chicago closer). MAP / reduced still snaps.
- `/tv` — ~150ms broadcast acquire (black + leader wipe + ident lock). Did not remount the sibling embed.
- `/tapes` — stronger CSS camera (perspective, recede in Z). Blur tax removed. Still not a second R3F scene.
- `/timeline` — sprocket locks the year; path change advances decade film with perforations.
- Clip stage opens through a gate; current strip cell is in-gate; related is a hairline reveal.
- `/constellation` — spokes draw; labels travel out from the name.
- Presentation: pathname gate + top hairline + wider marks. Ten beats unchanged.
- Reduced motion collapses all of the above. SOUND still off by default. Combo / Ali related / UNLOGGED-on-TV invariants left alone.
- Redeployed hobby `creativecontrol-tv` (clean build; sibling embeds left intact): https://creativecontrol-tv.vercel.app
- Archive goal is **not complete**.

## 2026-09-09 — Official CC Television embeds

- Confirmed `@cctelevisionchannel` (`UCGOXZwQw4InmSTtxDmfZMpw`). Listed **35** public uploads from official RSS + channel/playlist pages. No files downloaded. No watch-page scrape.
- `src/data/youtube.ts` plus optional `youtubeId` on ArchiveClip. Ten authored PUBLIC broadcasts. Prototype tapes stay prototype. Basement 2002 has no YouTube match.
- Shared muted / click-to-play player on `/clip/[slug]` and `/tv` ON AIR. Cards, home, world, tape sheets stay house fields. CH 07 is BROADCAST.
- Combo Ye+Chicago+2002+Studio still 1. Goal incomplete.

## 2026-09-09 — Collections are stories, not a playlist

- `/collections` and `/collections/[slug]` are held editorial cuts of the same catalog: type plus a contact sheet of authored PUBLIC frames already in those ten collections. Restricted and unlabelled density stay in the index.
- Archive COLLECTION rail label opens `/collections`. A selected cut links to its story. Clip dossier collections open the story, not a filter URL. Rails themselves are unchanged.
- Studio Nights has no authored PUBLIC frames yet — the page says so and sends the rest to the index. No new catalog rows. No hour-count. Goal still incomplete.

## 2026-09-09 — Prototype transcripts on a few clips

- Structured mock `Transcript` / `TranscriptSegment` on basement (`c-08`), a conversation (`c-13`), and Channel Zero leftovers (`c-35`, `c-36`). Editorial inference, not quotes. Not a chatbot.
- Clip dossier lists timecode + speaker + line. A segment is a deep-link (`?seg=`). Archive search `q` can match transcript text. Rails unchanged. Catalog file untouched.
- `ARCHIVE_MODEL.md` records the ASR / speaker ID / embeddings plug-in. `RESEARCH.md` labels the lines as OUR CREATIVE INFERENCE. Archive goal still incomplete.

## 2026-09-09 — Public show URL, no Vercel login

- Vercel Authentication turned off for hobby project `creativecontrol-tv` only. Coodie can open https://creativecontrol-tv.vercel.app/?present=1 without a share token. Combo still 1.

## 2026-09-09 — Live show walk on Vercel

- Walked https://creativecontrol-tv.vercel.app/?present=1 desktop ten Space beats + ~390 (threshold, World MAP, combo, CC-0217). Combo still 1. WebGL on desktop. No production-only bug; no redeploy.

## 2026-09-09 — Shareable preview on Vercel

- Hobby preview at [https://creativecontrol-tv.vercel.app/?present=1](https://creativecontrol-tv.vercel.app/?present=1). No git, no domain buy. Reel not uploaded. Vercel Auth may still gate visitors who are not on the team.

## 2026-09-09 — Splash teaches materials; title takes fringe

- Screenshot read: live site is a Framer reel splash (coil ident, Ali card, 4:3 mobile inset). Docs updated. Home title gets a faint RGB fringe only — no coil, no Framer restyle. Combo unchanged.

## 2026-09-09 — Live site seen, not copied

- Visual inspect of `https://www.creativecontrol.tv/`: Framer reel splash, no UI. Desktop ident then work cards; mobile 4:3 inset. Study screenshots in `docs/research/`. RESEARCH / DESIGN_LANGUAGE / OPEN_QUESTIONS updated. Prototype unchanged.

## 2026-09-09 — Public research refresh

- Re-fetched `creativecontrol.tv` (title only; motion picture; no text). Substack still ends May 2025. YouTube handle `@cctelevisionchannel` noted, not scraped. Complex 2022 interview ingested in RESEARCH / HISTORY. No product change. No 3,000 hours. Ted / M.I.S. / Ghetto Rock / Culo stay docs-only.

## 2026-09-09 — Entity deks drop leftover lecture

- Person / place / project deks no longer explain the product (“not the whole archive,” “in the catalog,” “later geography,” “cultural geography,” prototype disclaimers). Empty constellation is NO FRAMES. Index empty stays NO RECORDS. Combo unchanged.

## 2026-09-09 — Completion audit; Accra dek

- Audit against the original brief. Remaining gaps are James-blocked catalog truth plus thin TV language, CSS tape camera, prototype media, constellation as a first field. Goal still incomplete.
- Accra place copy dropped the leftover lecture “Cultural geography, not tourism.” Now: “A later horizon. Ghana in the travel years.” Combo invariant unchanged.
- `TODO.md` and `OPEN_QUESTIONS.md` rewritten as the honest gate list.

## 2026-09-09 — Show path is written for James

- `docs/PRESENTATION.md`: how to start (`npm run dev`, `/?present=1`), keys, the ten beats, SOUND off, DISCOVER / CONSTELLATION beside the show, what not to claim, what to ask Coodie. README points at it.
- Production `next build` is clean (278 pages). Type-narrowing only in `constellationSpine` — no catalog or voice change.

## 2026-09-09 — Constellation holds a few spokes

- `/constellation` no longer dumps every valid edge. A person holds a short cut: a few people, one song, one place, one project, two frames. Ranking ethic unchanged. Events stay off the field. Desktop is one quiet ring. ~390 stays a list. Still not on the rail or in the show.
- Combo and Ali related unchanged.

## 2026-09-09 — Constellation is a field of relations

- `/constellation` (default Coodie) is the same catalog as a quiet star field: people, songs, places, projects, frames, events. Edges are tape / project / song / day / subject / specific place / house — not year-alone or city-alone. Click lands on the person, place, project, or clip.
- Reach it from a person page (`CONSTELLATION`). Not on the lens rail. Not in the show path. Compact is a stacked list. SOUND off.
- Combo and Ali related unchanged.

## 2026-09-09 — Presentation does not fight the archive

- Show path: DISCOVER waits until present state is known (no flash on Space hops). Tape Escape closes the cassette only; `x` / Shift+Escape still exit the show. Search / fields keep Space. Show marks stay off below `md` and on compact.
- Keyboard: skip-to-content, existing focus-visible, TV 0–8 unchanged. Sound stays off by default.
- Reduced motion: media query is live on first client paint. Globe uses MAP (no idle orbit / star drift / damping). TV switch flash, tape camera, and threshold fade collapse.
- One leftover: timeline 2010s no longer says “a vault that has not yet been named.” Combo and Ali related unchanged.

## 2026-09-09 — The index is the sheet, not a tagline

- `/archive` dropped the museum H1 “Held. Labeled. Dated.,” the vault essay, the empty-state mock line, and the “STILL IN BOXES” footer. Rails, search bind, authored unfiltered sheet, and Ye+Chicago+2002+Studio = 1 unchanged. No `<select>`s.
- Walked the combo, one presentation hop, and the other lenses. SOUND off.

## 2026-09-09 — Nodes are a cut, not a page about a node

- Person / place / project dropped decade essays, “SAME CATALOG,” and “this page holds a cut, not the vault.” The node is year film + featured cut; remainder is `{n} IN THE INDEX`. Bios stay catalog, not tutorial.
- Clip related is RELATED — not a ranking legend. Empty music/project rows gone. Unlogged kicker is UNLOGGED. Cassette + picture unchanged.
- DISCOVER is the doors. No “another door into the same vault” essay.
- Walked Coodie, Chicago, Through the Wire, basement + Ali clips, DISCOVER, presentation hop. Combo still 1. SOUND off.

## 2026-09-09 — Tapes are a field, then a paper file

- `/tapes` dropped the museum H1 “A person held a camera” and the essay. The mosaic is the page. Format rails stay. Unopened density is mute cassette shells, not dashed cards. Opening a tape is still the CSS camera; the overlay is cassette + logged/unlogged frames + OPEN THE FILE — no notes essay, no ESC caption.
- `/tapes/[id]` is the cassette beside a paper file (original label, typed fields). Contact sheet: authored titles vs mute UNLOGGED + duration. No invented scene names.
- Walked `/tapes` and `/tapes/t-0217` desktop + ~390. Combo still 1. SOUND off.

## 2026-09-09 — World is memory on Earth, not a geography page

- `/world` dropped the museum H1 “Cultural geography,” the boxed year/city card, the description essay, INDEX / FIRST CLIP, and tutorial copy. Year sits as a hairline timestamp on the sculpture. Selected city on the globe (or the one MAP label) opens THE PLACE. Desktop still has no city-chip HUD. Mobile is YEAR · MAP, one label, PREV/NEXT.
- Home threshold left alone. Chicago weight, authored coasts, idle orbit vs fly-to unchanged.
- Walked `/world` desktop + ~390 MAP, presentation hop, combo still 1. SOUND off.

## 2026-09-09 — Threshold is held, not quiet

- `/` was the weaker of home and world: THE ARCHIVE read as a watermark, the leader was a faint costume, and an empty rectangle sat as wallpaper. Type is paper. A leader strip labels the frame. Local grain and viewfinder corners hold the field. The empty box and “OR START IN THE WORLD” are gone; the second door is THE WORLD. Openings unchanged. No hour-count, no fabricated quotes.
- World left as the sculptural globe / one-city MAP. Walked `/` and `/world` desktop + ~390. Combo still 1. SOUND off.

## 2026-09-09 — TV is an ident, not a slogan

- `/tv` dropped the product H1 “A contemporary network.” The page opens as CC-TV + channel number + name + ON AIR. The picture has viewfinder corners and a hairline lower-third (authored PUBLIC title only). The channel box became a tuner list. GUIDE rows are a rundown (slot / title / timecode), never UNLOGGED.
- Walked `/`, `/world`, `/tv`, `/tapes` on desktop + ~390. TV was the weakest of those four. Combo still 1. SOUND off.

## 2026-09-09 — Timeline span is film, not a chart

- `/timeline` dropped the count-height year histogram and the compact year `<select>`. The span is a sprocket rail (equal ticks; populated brighter; selected in leader) plus the existing decade film strips. Empty years stay on the rail without becoming a bar chart. Path lights (Coodie / Chike / Ye / College Dropout / Chicago / Creative Control) unchanged. Year beats still never title UNLOGGED.
- Walked `/`, `/world`, `/tv`, `/tapes`, `/timeline`, clip, presentation on desktop + ~390. Index rails left alone. Ye+Chicago+2002+Studio still 1. SOUND off.
- Timeline was the weakest non-index screen: dashboard bars + a native select sitting above film that already told the span.

## 2026-09-09 — TYPE is a spine, not every kind

- `/archive` TYPE rail is five kinds already in the catalog: Studio, Interview, Performance, Broadcast, Unseen. BTS / Travel / Street / Conversation / Title no longer wrap the page. A selected type off the spine still appears. Search still binds a unique type. Studio stays on the spine so Ye+Chicago+2002+Studio remains 1.
- Unfiltered sheet stays authored. No `<select>`s. Index rails now read as a catalog, not a dashboard.
- Browser-verified desktop + ~390: TYPE spine; combo = 1; one presentation hop. SOUND off.

## 2026-09-09 — Collections are a spine, not a wrap

- `/archive` collection rail is six named cuts already in the catalog: Channel Zero, Through the Wire, Coodie's Picks, Unseen, Classics, College Dropout road. First Times / Studio Nights / New York / Chicago Before no longer wrap the page. A selected collection off the spine still appears. Search binds a unique collection name.
- Unfiltered sheet stays authored. Ye+Chicago+2002+Studio still 1. No `<select>`s.
- Browser-verified desktop + ~390: collection spine; combo = 1; one presentation hop. SOUND off.

## 2026-09-09 — Index rails are a cut, not a phonebook

- `/archive` rails are editorial: era, decade span (years only after a decade or era), gravity places (Chicago / Cottage Grove / South Side / New York / DD172 / Coney), spine people (Coodie / Chike / Ye / Ali / Donda), type, collections. No year-by-year dump. No full people/place catalog. A selected place or person that is not on the spine still appears. Search binds a unique year, person, place, or type.
- Unfiltered sheet stays authored. Ye+Chicago+2002+Studio still 1 via URL, rails, or search-bind. No native `<select>`s.
- Browser-verified desktop + ~390: index rails; combo = 1; one presentation hop. SOUND off.

## 2026-09-09 — Index is a contact sheet, not a dashboard

- `/archive` dropped the 11-select facet grid. Filters are type rails (era / year / place / person / type / project…). Unfiltered index holds authored frames; unlabelled density stays on the tapes until a query asks. Ye+Chicago+2002+Studio still returns 1.
- Authored PUBLIC house works (title cards, named films, CZ leftovers already in the catalog) can relate to each other without sharing a city or a year. Ali related: Coney, Jesus Walks, Good Morning, Accel Origins, Two Words, Window Seat leftover — not hospital, not Paris, not CC-0515 unlogged.
- Person / place year beats no longer title a year UNLOGGED. Coodie 2000 reads TIME STUDIOS DROP, same rule as the timeline.
- CONCEPTS: index voice is tape-code / street / year — not “search the archive.”
- Browser-verified desktop + ~390: home, archive rails, Ali + basement, Coodie, TV CH 00, presentation hop. SOUND off.

## 2026-09-09 — Related is not the cassette strip

- `/clip/[slug]` related cards no longer reprint same-tape UNLOGGED. That density stays on the chronological cassette strip. Authored related remains (Coney next to *The People’s Champ*; Donda / Izzo / *Never used in a cut* next to the basement).
- Ali related is Coney only — no CC-0515 unlogged reprints, no 2002 hospital, no Paris. Basement strip still shows CC-0217 unlogged.
- Browser-verified: Ali + basement clips; archive Ye+Chicago+2002+Studio → 1; `/tv` CH 00 authored *She watch Channel Zero*; SOUND off.

## 2026-09-09 — City-scale place is not a cut

- Related scoring: a whole city (Los Angeles, Chicago, New York, Paris) cannot start a relation by itself. Same-place still counts when another axis already agrees (tape, project, song, day, subjects beyond crew, specific collection) or when the place is specific (63rd & Cottage Grove, DD172, Coney Island, Time Studios, South Side).
- *The People’s Champ* (2015, LA) no longer pulls *Los Angeles, that year* (2002 hospital / Through the Wire). Same tape on CC-0515 and the named Coney card remain. Basement October 2002 still relates to Donda kitchen, the Izzo beat room, *Never used in a cut*, and CC-0217 density.
- Timeline year/day story lines prefer an authored title. If a year is only unlogged density, the cassette label shows — never UNLOGGED as the decade-film caption. 2000 reads TIME STUDIOS DROP, not a fake shot-log.
- Browser-verified: Ali related without hospital 2002 or Paris; basement related still real; archive Ye+Chicago+2002+Studio → 1; `/tv` CH 00 authored *She watch Channel Zero*; SOUND off.

## 2026-09-09 — Related ranking is not year-alone

- Related cards (clip rabbit hole) rank same tape, project, song, day, subject people, place, specific collection. Year boosts only after another axis already relates the frames. Year + Coodie/Chike only is not a relationship. Catalog auto-links no longer inject year + any shared person into `relatedClipIds`.
- *The People’s Champ* no longer pulls Paris room tone / CC-0444. Basement October 2002 still relates to other Chicago/Ye studio material (named leftovers + same place/people).
- Browser-verified: Ali related without Paris; basement related still meaningful; archive Ye+Chicago+2002+Studio → 1; `/tv` CH 00 still authored titles.

## 2026-09-09 — TV airs named leftovers; Ali off Paris

- `/tv` programs authored PUBLIC records only. ON AIR, SURF, and GUIDE NOW / NEXT / LATER / ARCHIVE never treat UNLOGGED as a show title. Generated density stays on tapes and clips, not in the lineup.
- *The People’s Champ* left Paris tape `CC-0444` (hotel travel, `Paris, room tone` stays). It sits on new prototype cassette `CC-0515` — digital vault, 2015, title card / metadata only. Not a reconstructed fight. Not a European shoot.
- Unlogged contact cells share one mute tape-interior field (no map / static / contact lottery).
- Browser-verified: `/tv` CH 00 and CH 06 plus a surf — no UNLOGGED program names; `/clip/the-peoples-champ-card` tape adjacency is CC-0515; `/tapes/t-0217` still logged + unlogged; archive Ye+Chicago+2002+Studio → 1; one presentation hop. SOUND off.

## 2026-09-09 — Unlogged density, clip as cassette

- Generated `expand.ts` chapters no longer invent scene titles. They are UNLOGGED: tape id, timecode, duration, mute prototype frame. Authored frames keep titles. Contact sheets and `/tapes/[id]` mark logged vs unlogged. Scale stays; the shot-log does not.
- `/clip/[slug]` is a frame on a labeled cassette: tape object, picture, chronological strip of that tape, before/after on the strip. Dossier sits under the cassette. Not a streaming detail page. Per-work fields unchanged on authored pictures.
- Browser-verified desktop + ~390: generated-heavy tape vs authored tape, basement + Ali clips, archive Ye+Chicago+2002+Studio → 1, DISCOVER unseen, one presentation hop. SOUND still off.

## 2026-09-09 — Per-work fields, sourced research, spine metadata

- `PrototypeMedia` is no longer one hue-field. Public works already in the catalog get distinct title-card / field treatments (Ali, Kendall’s Cross, Coney, Channel Zero open vs field, DD172, Window Seat, jeen-yuhs ingest, basement / Through the Wire, sports, later MAP architecture). Materials stay leader / 4:3 / viewfinder / paper / timestamp / grain. Stamp remains PROTOTYPE MEDIA. Not jeen-yuhs.com, not WØRKS Act III.
- Authored leftovers preferred for featured related cards, TV OPENING/LATE, and tape contact-sheet first frames. Generated `expand.ts` density remains for scale. DISCOVER unseen already preferred authored PUBLIC Unseen (c-35–c-45).
- Catalog: prototype metadata only for Jesus Walks (third), Two Words, *Good Morning* (2013), Accel Origins (2017). No fake quotes. Ghetto Rock / Culo documented, not carded. No Tittyhead Ted / M.I.S. / Rhymefest NJ product entities.
- Research ingested (Newsweek, Tudum, Variety, Evening Standard, FSD 2010 NJ, IndieWire ~400h, Substack 2025 house copy) with evidence classes. Footage scatter stays 267 / 330 / ~400 / 8h assembly / ~9h RS — no 3,000 as fact. Interview lines stay in docs, not on `/`.
- Browser-verified desktop: home, Ali vs Coney vs basement vs Channel Zero, archive Ye+Chicago+2002+Studio → 1, DISCOVER unseen, presentation. Spot-check ~390.

## 2026-09-09 — Serendipity, gated sound, vault scale

- DISCOVER is a field, not a link menu: six doors with lens + landing note. `d` opens it. Public footage only — restricted / private / coming-soon / members-only / pending-clearance are never a surprise landing. RANDOM TAPE opens the mosaic (`/tapes?open=`). TAKE ME SOMEWHERE flies the globe. ON THIS DAY lands on the index (month/day) when more than one public hit.
- SOUND is off until the visitor turns it on. Tape engage, channel switch, and soft static only play when ON. Quiet room tone starts with ON and stops with OFF / reduced-motion. Opening a tape no longer secretly resumes audio.
- Scale without a fake hour-count: unopened/queued ghosts in the tape field; “still in boxes” after the index; world year bumps when a city has no records yet at 2004 (New Orleans fly was 0 — now 2013 / 6 records).
- Browser-verified desktop (Discover doors, archive 1-record, clip, world fly, TV, tapes + Escape, timeline, Coodie entity, full presentation Space path) + ~390 (Discover, archive 1, world MAP). Catalog query unchanged.

## 2026-09-09 — Presentation mode for James

- Discreet show path for demonstrating the archive to Coodie as if each lens were the product. Start at `/?present=1` or development OPENING → SHOW. Space / `.` / `n` next; `,` / `p` back; `x` or Shift+Escape exit. Plain Escape still closes a tape. Session keeps the show across client navigations; `?present` is not required on every beat.
- Ten hairline marks, bottom-right, desktop only, no labels, no “Concept” chrome. DISCOVER and OPENING hide while showing. ENTER on the threshold advances into World. Reduced-motion skips the longer cross-lens fade.
- Beats (same catalog): `/` → `/world` → Chicago fly → `/clip/basement-october-2002` → Ye+Chicago+2002+Studio → PERSON Ye → `/tv` → Studio ch 3 → `/tapes?open=t-0217` → `/timeline`.
- Did not add an R3F tape camera. CSS mosaic camera stays; Framer + 60fps still fight a second WebGL scene.
- Browser-verified desktop full sequence + ~390 spot-check. Archive Ye+Chicago+2002+Studio → 1. Presentation marks do not leak when not showing. Catalog unchanged.

## 2026-09-09 — Denser coasts, editorial TV day

- `/world` coastlines are original denser rings: Florida / Gulf / Yucatan, Brazil, West Africa, Iberia, Italy, Japan, Australia, plus Hudson Bay, Great Lakes, Baja, Baltic, Caspian, Black Sea, Persian Gulf cuts. Same sculptural paint (no NASA texture). Chicago glow. Idle mid-Atlantic; orbit vs fly-to unchanged. Desktop: no city-chip HUD. Mobile: YEAR · MAP, one label, PREV/NEXT.
- `/tv` programs each channel as an editorial day from the same catalog (OPENING / DAY / STUDIO / NIGHT / LATE). GUIDE LATER uses dayparts, not fake `+Xm` times.
- Browser-verified desktop + ~390: `/world` WebGL + MAP, `/tapes` CC-0217 in-field, `/tv` editorial day + GUIDE, `/archive` Ye+Chicago+2002+Studio → 1, `/clip/basement-october-2002`, `/timeline` decade film, `/places/chicago`. Catalog unchanged.

## 2026-09-09 — Tape camera through the field, broadcast identity

- `/tapes` open is a CSS camera through the mosaic: the field dolls toward the selected cell (scale + pan from the cassette), neighbors recede in Z/blur, the lit cassette stays in the box with frames. Grid cells do not col-span. Escape closes (capture). Not an R3F camera — that still fights Framer and 60fps. `/tapes/[id]` remains opened file + contact sheet.
- `/tv` is a contemporary network, not CRT/VHS novelty and not YouTube: ident (CC-TV / CH / name + live clock), ON AIR stage, lower-third, 140–160ms leader flash on switch, channel strip with leader rule, GUIDE rundown NOW / NEXT / LATER (`+Xm`) / ARCHIVE. Same catalog. 0–8 and arrows. Sound off by default.
- Browser-verified desktop + ~390: `/tapes` CC-0217 camera + Escape, `/tapes/t-0217`, `/tv` surf + 0–8 + GUIDE, `/archive` Ye+Chicago+2002+Studio → 1, `/clip/basement-october-2002`, `/world` WebGL + MAP (one label), `/timeline` decade film + 2002→October, `/people/coodie-simmons`, `/places/chicago`, `/projects/through-the-wire`. Catalog unchanged.

## 2026-09-09 — Recognizable land, tape depth, clip-voiced years

- `/world` land is original simplified coastlines (Americas, Eurasia, Africa, Australia, islands, Antarctica) with Hudson Bay / Great Lakes / inland-sea cuts and Chicago glow. Mid-Atlantic idle so Earth reads at a distance; fly-to still owns Chicago. Same rings on the SVG map.
- `/tapes` open uses CSS perspective: neighbors recede in Z + blur; selected cassette stays in the mosaic. Not a true R3F camera (would fight the grid).
- Large entity year frames now match the timeline film voice: era, year, lead title, frame count — not year chips.
- Browser-verified: `/world` desktop WebGL + 390 MAP (one label), `/tapes` CC-0217 in-field, `/archive` Ye+Chicago+2002+Studio → 1, clip, people/places/projects, timeline, tv.

## 2026-09-09 — Entity lenses, map without HUD, date honesty

- Entity pages hold a cut, not the vault: decade year frames + up to six featured records; the rest open in the index. Neighborhoods still show every exact clip and link up to the city. Year frames open `/archive` with the same person/place/project filter.
- Mobile / weak-WebGL `/world` map: one selected city + PREV/NEXT. No city-chip HUD. Dots stay on the map; only the chosen name is labeled.
- `clipWhen` uses tape recorded-date only when it matches the clip year, so a 2019 Time Studios meeting on a 2000 tape no longer lands in 2000. Timeline 2000 is The Long Shoot; Shoeboxes sits in 2019.
- Browser-verified desktop + ~390: `/`, `/archive` (Ye + Chicago + 2002 + Studio → 1; Coodie + 2002 → 24), `/clip/basement-october-2002`, `/world` (globe + MAP), `/tv`, `/tapes` in-field CC-0217, `/tapes/t-0217`, `/timeline` span + year select, `/people/coodie-simmons`, `/places/chicago`, `/places/63rd-cottage-grove`, `/projects/through-the-wire`. Catalog unchanged.

## 2026-09-09 — Geography, span film, in-field tapes, graph pages

- `/world`: simplified continents (Great Lakes, Chicago glow) on globe texture and map. Hover label is offset with a count. Desktop globe has no city-chip HUD. `THE PLACE` opens `/places/[slug]`.
- `/timeline` undrilled span is decade film strips (sentence + year frames), then the existing year → month → day → tape/clip drill. Day rows link people and places.
- `/tapes`: zoom stays in the mosaic — neighbors recede (blur/scale), selected cassette expands, frames pull into focus. No modal overlay.
- Graph pages on the same catalog: `/people/[slug]`, `/places/[slug]`, `/projects/[slug]`. Linked from clip, archive facet sentence, world, timeline.
- Catalog query layer unchanged.

## 2026-09-09 — Quality pass (world, tapes, timeline)

- Fixed grain stacking (z-index 1) and entry title contrast (void wash + paper shadow). Next.js “1 Issue” overlay is gone in this session; remaining N badge is the normal collapsed Dev Tools, not a hydration error. Discovery seed is stable on first paint.
- `/world`: no group spin vs fly fight. Orbit auto-rotates only when not flying; user orbit cancels fly. Chicago approach is closer. Hover labels on the globe. Compact / reduced-motion / no-WebGL uses a dark SVG map (selected city labeled only). Keyboard city step skips form fields.
- `/tapes`: mosaic → cassette → frames overlay (`layoutId` zoom, Escape out). `/tapes/[id]` is an opened cassette + contact sheet. Shared `TapeObject`.
- `/timeline`: year → month → day → tape/clip. Path filters still thin the same catalog (ALL 146 → YE 8 on 2002-10-12). Mobile year select + larger rail hits.
- `/tv`: 0–8 direct channel, arrows skip inputs, reduced-motion skips switch tone.
- Mobile + reduced-motion + keyboard: bottom nav, focus-visible gold, grain off when reduced, DISCOVER Escape, opening switcher collapsed behind OPENING.
- Browser-verified desktop + 390 mobile: `/`, `/archive` (Ye + Chicago + 2002 + Studio → 1 record), `/clip/basement-october-2002`, `/world` (WebGL + MAP fallback), `/tv` channel 03, `/tapes` zoom CC-0217, `/tapes/t-0217`, `/timeline` 2002 → October → 12 → YE path. Shared catalog unchanged.

## 2026-09-09 — Foundation session

- Documented north star, research, history, design language, archive model, concepts, decisions, open questions.
- Started a Next.js App Router prototype from an empty repo (only `creative control reel.mp4` existed).
- Authored a local mock catalog (~146 clips, 24 tapes, shared query/discovery) and a shared media layer. Prototype media only.
- Built routes: `/`, `/archive`, `/world`, `/tv`, `/tapes`, `/tapes/[id]`, `/timeline`, `/clip/[slug]`.
- Shared clip experience; development-only opening switcher (OPENING, never “Concept 1”).
- Browser-verified (desktop, localhost:3000): entry, archive facets (incl. PERSON Ye + LOCATION Chicago + YEAR 2002 + TYPE Studio → 1 record; LOCATION Chicago → 56), clip rabbit hole, world city panel + canvas, TV channel surf, tapes mosaic + CC-0217, timeline span/paths. World WebGL screenshot timed out; canvas confirmed present. Mobile layout not fully exercised (bottom nav exists). Next.js “1 Issue” portal present in dev; production `next build` succeeded (179 pages).
