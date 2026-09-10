# Decisions

Reread before major changes. Newest first.

## 2026-09-09 — `/world` stays one R3F sculpture; globe.gl is out

**Decision:** Keep Three + React Three Fiber + drei on `/world`. Deepen *this* globe: authored coasts, night-side, gold limb/haze, Chicago as an additive glow, GSAP fly-to (Chicago r≈4.52, others r≈4.85), in-canvas grain + vignette. No `@react-three/postprocessing` composer this pass. YEAR · MAP stays fallback only (`useIsNarrow` / reduced-motion / failed WebGL). Compact is width-only.

**Rejected:** globe.gl, three-globe, react-globe.gl. They are Three.js under the hood but own their own renderer, scene, camera, and animation loop. Dropping one next to the house canvas is two WebGL contexts or a painful adapter. Their default layers (arcs, hexbins, pins, HUD) would make `/world` a dashboard. James already rejected YEAR · MAP as the desktop take.

**Why:** House rule is one 3D engine. World already owns WebGL. The archive wants a sculpture, not a data-viz globe.

## 2026-09-09 — James’s static logo is the house mark

**Decision:** The house mark is the file James provided (`unnamed-3.jpg`): white knot / infinity lockup over CREATIVE CONTROL on black. First-party copies: `public/brand/creative-control-mark.jpg` (exact) and `creative-control-mark.png` (same still, black knocked out so it can sit on the living field). It is standardized on `/`, the rail mast, `/?present=1` marks, the mobile dock, and the favicon. YouTube banner/avatar PNGs we saved earlier and the invented coil SVGs are gone. The jeen-yuhs loading film stays a muted field on `/` only. Reduced motion is this still — no video.

**Rejected:** Keeping a reconstructed coil or the YouTube wordmark we treated as “close enough.”

**Why:** James handed us the official static logo. That ends the guess.

## 2026-09-09 — Stray `.next-*` trees are not the cache

**Decision:** The only local Next cache in the project root is gitignored `.next`. Parallel agents had been setting `CC_DIST=.next-<task>` and leaving ~30 extra build trees in the root (`.next-tapes-walk`, `.next-mobile-390`, `.next-keys-build`, …). Those copies were deleted. `.gitignore` / `.vercelignore` already ignore `.next-*`. Do not commit build output. Do not multiply `.next` in the root.

**Rejected:** Checking extra `distDir` trees into the repo. Treating them as a second app.

**Why:** `.next` is build output. Extra copies were leftover agent caches, not product.

## 2026-09-09 — Official YouTube still is the house mark; loading film is the field

**Decision:** James authorized the official `@cctelevisionchannel` stills as the house mark, and `Jeenyuhs_loading.mp4` as a muted living field on `/` — not a reconstructed coil, not the Framer reel, not a jeen-yuhs.com clone. First-party files live in `public/brand/`: `creative-control-lockup.png` (channel banner lockup), `creative-control-emblem.png` (channel avatar), `jeenyuhs-loading.mp4`. The invented coil / lockup SVGs are gone. The same still is on home, the rail mast, presentation chrome (mast during `/?present=1`), and the mobile dock. Reduced motion is the still only — no video, no sheen. Video stays muted. ENTER still advances. Beat 1 stays `/`.

**Rejected:** Keeping the faithful-vector coil we drew. Scraping a watch page or ripping the live reel. Auto-sound. Cloning jeen-yuhs.com.

**Why:** James said we invented a mark they do not use. The official YouTube lockup is CREATIV[knot]CONTROL, not CREATIVE + a four-wrap coil + CONTROL.

## 2026-09-09 — Tape aisle camera stays in the page

**Decision:** `/tapes` still opens in the aisle (CSS, no R3F). The dossier sheet sits *outside* the 3D camera so it is not double-transformed. Camera walk is a modest settle (no bay-index Z doll). Later bays do not pinch. Compact / reduced-motion: no camera. Beat 9 `/tapes?open=t-0217` still opens CC-0217.

**Rejected:** A second R3F scene. A scale doll that throws the cassette off-screen.

**Why:** The walk-to-cassette camera and an in-camera sheet were clipping, overflowing, and losing CC-0217.

## 2026-09-09 — SPAN is a year field, not year type

**Decision:** SPAN’s room is the years themselves. 1994—2026 run as one horizon through the official lockup (edges and decades read; the rest is duration, and the line leaves the frame). Title is THE SPAN. EXPLORE still opens `/timeline`. The other door is THE ARCHIVE, not THE WORLD. The lockup GSAP does not remount. Reduced motion keeps the year field still.

**Rejected:** Year ticks as wallpaper. Giant condensed “1994 — PRESENT” as a type change of ARCHIVE. Cloning the timeline sprocket, jeen-yuhs year-as-channel, or the Framer reel. Printing an hour-count.

**Why:** A span room has to be time you can stand in, not ARCHIVE with different type.

## 2026-09-09 — Memory must match 366 official house uploads

**Decision:** Persistent docs record the official `@cctelevisionchannel` public listing as **366** unique house IDs. Videos-tab badge **367**. Method (no Data API key): official uploads playlist `UUGOXZwQw4InmSTtxDmfZMpw` + videos-tab pagination (`yt-dlp --flat-playlist --skip-download`, IDs / titles only) + channel RSS (15 newest exact dates) + house playlist membership where `channel_id` matches. No watch-page scrape. No file download. The extra **1** is not on the public UU / videos listing (unlisted / private / count drift). Earlier same-day first-page badge **268** was not the paginated set — never print 268 as the catalog. Never print 3,000 hours as fact. Mid-day **35** was the first authored board, not the full public file.

**Rejected:** Treating 35, 268, or ~233 as the current public set. Waiting on a Data API key to list what the uploads playlist already gives. Printing 3,000 / 330 / 267 / 400 as a catalog size.

**Why:** A later reader should not re-collect the channel from a first-page badge or an earlier changelog.

## 2026-09-09 — Official uploads are holdings and year cassettes

**Decision:** Official PUBLIC embeds read in the archive as holdings: **year · official title · BROADCAST · place**. `/archive` unfiltered keeps house rows plus one official through-line per listing year; a year or a search opens that year’s titles. `/tapes` BROADCAST is year cassettes of those holdings (typed lines), not one CC-TV dump and not a thumbnail wall. `/timeline` may use an official title as the year through-line; year-only uploads sit as holdings, not `N UNDATED`.

**Rejected:** A 366-card wall. One CC-TV cassette of every upload. A LOGGED stamp on a broadcast year.

**Why:** Broadcast is a file the house already published. It is not a camera original.

## 2026-09-09 — Collections stay editorial; the Index facet matches the reel

**Decision:** `/collections` films the original house editorial PUBLIC frames already in each cut. Classics is **19** house titles (Polaroid → Kendall's Cross), not 366 official uploads. `/archive?collection=` binds that same public house cut (`inHouseCut`). Official holdings stay on Index / timeline / BROADCAST — not a Classics (or Channel Zero / New York) finding-aid of the CH 07 file. Collection id or slug both resolve (`classics` / `creative-control-classics`).

**Rejected:** Binding every official PUBLIC upload into a story. Counting leftover as if it lived on the public facet.

**Why:** A collection is a story. The CH 07 file is a holding.

## 2026-09-09 — CH 07 GUIDE is official blocks and year books

**Decision:** `/tv` CH 07 GUIDE is a programmed board: house ident first, then official playlist names already on the channel (Creative Control TV, Channel Zero, TEAR UP, Eckō), then upload-year books. Tuning a book opens that book. A fat year (2010 / 2011) nests an A–Z of official titles — not one rundown. A fat letter nests an official title prefix already on the file — not a show name. 2011 C is CREATIVE CONTROL (29) vs the rest of C (7). 2010 C is CURREN$Y (18) vs the rest of C (13). Do not nest 2010 S or T via THE or invented shows. All **366** public embeds stay reachable. After the official set: mute remainder (NOT IN THIS MOCK / HELD / UNOPENED / growable empty). No invented show names. No upload-count trophy.

**Rejected:** A 366-line title dump as the GUIDE. Inventing show names to fill the board. Nesting 2010 S/T under THE. Treating the mid-day **35** as the current board.

**Why:** Almost every public upload is type Broadcast. A fake clock and a YouTube list are both wrong.

## 2026-09-09 — Openings are rooms around the lockup

**Decision:** ARCHIVE / HISTORY / DOCUMENT / SPAN change the room around the official **CREATIVE [coil] CONTROL** mark: light, field, copy, and the door pair. The lockup does not remount. ARCHIVE keeps ENTER / THE WORLD. HISTORY is a screening room (lit 4:3, throw, watching line through the picture) — BEGIN still opens `/tv`. Not type-only under one lockup. Not the live Framer reel. No Ali card. No CRT. No hour-count. Reduced motion is the still mark; fields stay still.

**Rejected:** Four type takes. Copying the Framer ident loop. Remounting the mark on each switch.

**Why:** Each opening is a different threshold into the same place.

## 2026-09-09 — Empty collection leftover is a sleeve, not an Index

**Decision:** `/archive?collection=` films the public house cut. A story with 0 public frames must not say `{n} IN THE INDEX` or open that empty facet. Held leftover is named **HELD IN THE HOUSE FILE** and links to the clip sleeves (MEMBERS ONLY, COMING SOON, …). Stories that have a public cut may still open that cut in the Index; their leftover uses the same house-file list.

**Rejected:** Inventing public Studio Nights frames. Sending basement / unused to `/archive?collection=studio-nights` (0 RECORDS). Counting leftover as if it lived on the public facet.

**Why:** The collection URL is the public reel. A held sleeve is a held sleeve.

## 2026-09-09 — Scale is mute remainder, not a count

**Decision:** The house must feel larger than the authored PUBLIC cut without printing a working hour-count or inventing catalog. `/tapes` is a corridor of facing spines. UNOPENED is a longer mute rack than any one authored bay (honest labels only: UNOPENED, QUEUED INGEST, SHOEBOX STILL CLOSED, NOT IN THIS MOCK, LABEL ONLY, HELD paper) plus a GROWABLE empty lip that fades. It stays when a cassette opens — it recedes, it does not vanish. CH 07 GUIDE programs official blocks and year books of the **366** public titles; after them a mute strip says NOT IN THIS MOCK / HELD / UNOPENED / empty. No invented show names. No 3,000 / 268 / 233 / 35 printed as the catalog.

**Rejected:** Fake hour totals, fake tape codes, fake show names, Ernie Barnes, scraping the rest of the channel.

**Why:** Generated UNLOGGED density already lives on authored cassettes. Thinness was the aisle ending after six ghosts and the network ending after thirty-five titles. Mute remainder is honest scale.

## 2026-09-09 — Memory must match the tree

**Decision:** Persistent docs record what is on disk and live, not what an earlier changelog hoped. Working tree `public/brand/` holds James’s official mark (`creative-control-mark.jpg` / `.png`) and `jeenyuhs-loading.mp4`. Invented coil/lockup SVGs and earlier YouTube stand-in PNGs are gone. No `public/sound/*.wav`. SOUND still OFF.

**Why:** A later reader should not hunt for files that are not there. Do not invent that the WAVs were deleted — they are simply not in this tree.

## 2026-09-09 — Keyboard walks the house; phone holds a dock

**Decision:** Tab order is skip → mark → rails → DISCOVER → SOUND → the room. One skip link. Focus is a hairline of leader gold. SOUND is a real button; Space on it toggles, even during the show. `d` still opens DISCOVER. Escape closes a tape or the veil, not the show. Below `md`, chrome is a bottom dock (`lens-mobile`): DISCOVER + SOUND, then the five lenses. On `/` the lens row hides. Constellation at ~390 is a separate palm pocket, not this dock.

**Rejected:** Native focus rings, a hamburger, squashing the desktop rail, putting constellation on the dock.

**Why:** The house has to be walkable without a pointer. A phone is a handheld, not a shrunk 1440.

## 2026-09-09 — Timeline month / day film is time, not inventory

**Decision:** Month and day cells match the year strip: era, the month or day, and the lead title or cassette label. No `N FRAMES` on month / day film. No `MINIDV · N FRAMES` on landed-day reel slugs. Tape codes and original labels stay. Year / month / day still never title UNLOGGED.

**Why:** A day of film is a title in time. A frame count is a vault inventory.

## 2026-09-09 — Timeline paths are a through-line

**Decision:** `/timeline` has no ALL / COODIE / CHIKE / YE / COLLEGE DROPOUT / CHICAGO / CREATIVE CONTROL tab bar. The span is the story until a name is followed; then the name is the title and THE SPAN · 1994 — 2026 returns. Connections sit as a `through` sentence on each decade, and in the header once a year or a thread is open. Same path query. No ALL facet.

**Why:** Tabs read as software. A through-line is how a person actually moves through years.

## 2026-09-09 — The index is a finding aid

**Decision:** `/archive` is a year-grouped ledger: when, tape, type, title, place, people, and a hold if the picture is closed. Not a 4:3 thumbnail mosaic. Not a sortable table. Unfiltered PUBLIC cut has no record-count inventory. A query still stamps N RECORD(S). Combo Ye+Chicago+2002+Studio stays **1 RECORD**.

**Why:** ENTER lands on the index. Cards pretend we have pictures we do not have. A finding aid can be honest.

## 2026-09-09 — Tapes sit on vault shelves

**Decision:** `/tapes` is a vault aisle of facing spines. Cassettes sit on provenance lips: STORAGE (camera originals), DIGITAL VAULT (ingested files), PHONE (backup), STUDIO (later work), BROADCAST (not camera originals — year cassettes of official holdings, typed lines, not a thumbnail wall), then UNOPENED mute shells. Opening a tape is still a CSS film-gate camera. `/tapes/[id]` stamps LOGGED · UNLOGGED, not a clip count. Live BROADCAST shelf holds year cassettes of the **366** official public holdings, not one CC-TV dump of **35**.

**Rejected:** Card mosaic as the page. Second R3F scene. Invented shot-log titles.

**Why:** Provenance is physical before it is a file. Broadcast uploads are not camera originals.

## 2026-09-09 — World Tab is a quiet proxy

**Decision:** `/world` keeps arrows for travel. Tab reaches the selected city, THE PLACE, then other facing marks. The list is clipped until focus — condensed type, not a chip HUD, not PREV/NEXT on the globe. Sculpture labels stay pointer-first. Compact / reduced stays YEAR · MAP.

**Why:** Marks on the ball are still a pointer. The keyboard needs a door that does not become a game menu.

## 2026-09-09 — Constellation on a phone is a pocket

**Decision:** `/constellation` desktop stays the void (GSAP spokes). At ~390 the same spokes sit in a handheld pocket (`HandField`) — name in the palm, thumb-sized labels. Not a Wikipedia list and not the 1440 field squashed. Still off the rail. Still not in the show.

**Why:** A phone cannot hold the deep field. A list would be a different product.

## 2026-09-09 — House sound is analog verbs, still off

**Decision:** SOUND stays **OFF** until the visitor turns it on. No session restore. A refresh is silent. The layer is four original short textures (`threshold`, `acquire`, `cut`, `tape`) plus a quiet analog room tone — synthesized in-house, played through a gated WebAudio bus. Placeholder square / saw beeps are gone. No music bed. No stock UI chirps. No Coodie voice. No reel rip. Official embeds stay muted; SOUND does not unmute footage.

**When:** Threshold on `/` (toggle on, or a return to the door). Acquire on `/tv` channel lock (existing `playSwitch`). Cut on a cross-lens hop from chrome, and on a DISCOVER door (`playStatic`). Tape when a cassette opens (`playEngage`). Room tone only while ON and not reduced-motion.

**Rejected:** Autoplay, localStorage ON, looping music, library SFX, oscillator “UI beeps,” wiring sound through BroadcastPlayer / GSAP lockup / globe / shelves / programming.

**Why:** The archive should be able to sound like a room and a gate — not a SaaS product and not a trailer. Default silence is the respectful cut.

## 2026-09-09 — Cinematic motion is a house stack, not a kitchen sink

**Decision:** The archive owns a small motion stack: **GSAP + Flip** for authored register (home lockup draw-on, desktop lens hairline), **native View Transitions API** for cross-route film cuts (house `Cut` — ENTER, rail, DISCOVER, constellation `<a>`, presentation Space hops), **Framer Motion kept** where it already owns presence (tape `layoutId` / mosaic camera, clip gate, opening type), **R3F kept** on `/world` only. SOUND stays off.

**Added:** `gsap`, `@gsap/react`.

**Rejected this pass:**
- **ScrollTrigger** — timeline is a sprocket drill, not a scroll-jacked story. Registering it unused would be kitchen sink.
- **Lenis** — cinematic inertia here reads as a luxury-brand landing, not an archive.
- **next-view-transitions** — the primitive we need is `document.startViewTransition`. A house Cut can wrap `router.push` *and* capture internal links (including collections, without editing those files) and Present hops. A third-party Link swap would be two systems.
- **Theatre.js / Lottie / anime.js / Barba** — Lottie reads SaaS; Barba fights App Router; Theatre is a second timeline editor we would not author in.
- **Second R3F scene / tape camera** — still rejected. CSS mosaic stays.

**Why:** The last film-gate pass was CSS + a Framer pathname fade. That fade remounted `{children}` on every hop and felt like a Next.js blink. PNGs for the lockup were not in the tree; filtered fringe copies would have been the jank. SVG coil + GSAP draw-on is sharp and 60fps (transform / opacity / stroke-dashoffset). Reduced motion skips GSAP, Flip, and View Transitions — instant cuts, still mark.

## 2026-09-09 — Official lockup on `/`; page stays the archive

**Decision:** James asked for the real Creative Control logo as an animated home hero. `/` now seats the official **CREATIVE [coil] CONTROL** lockup in a film gate (register, RGB fringe, grain, one light sheen). ENTER / THE WORLD / opening switcher / `/?present=1` stay. We do **not** copy the live Framer reel splash (ident then Ali card).

**Source:** official YouTube channel art for `@cctelevisionchannel` (banner lockup + avatar emblem). Confirmed against the live `creativecontrol.tv` ident and `docs/research/live-creativecontrol-tv-desktop.png`. First-party vectors in `public/brand/` (`creative-control-coil.svg`, `creative-control-lockup.svg`). Home mark is live type + inline SVG coil — not a PNG bitmap. Brand PNGs named in an earlier research note are not in this tree.

**Why:** The prior title-only threshold was too plain. The mark is theirs; the door is still the archive. Reduced motion is the still official mark (SVG + house type; lockup PNGs were not in the tree).

## 2026-09-09 — Person / place / project are a graph you can read

**Decision:** `/people/[slug]`, `/places/[slug]`, `/projects/[slug]` are files, not profiles and not construction-circle clocks. The short name is the tab. Bonds are a stack: proving still (prototype or held sleeve — never a YouTube remount), axis, name, the authored frame that proves the edge. Same spokes as `/constellation`. Remainder stays in the index. `/constellation` is the deep field. Not on the rail. Not in the show. Year-alone and city-alone still do not draw. Ali’s graph still refuses Paris and the hospital tape.

**Why:** After jeen-yuhs.com the archive has to make relationships visible. A directory of cards is a museum sheet. The constellation already knew how to draw a few true spokes — the node pages were still a film of years.

## 2026-09-09 — CH 07 programs official blocks, not type-as-OPENING

**Decision:** `/tv` GUIDE is one rundown. A GUIDE row tunes that slot on the channel (acquire); OPEN CLIP stays on the stage. Channels 00–06 and 08 still sort as an editorial day (OPENING / DAY / STUDIO / NIGHT / LATE). CH 07 BROADCAST signs on with the house ident, then groups by official public playlist names (and Channel Zero / upload year). The ident crawls official programmed titles. The tuner is a graphic number strip. Voice lines are thin network language, not slogans and not invented show titles.

**Why:** Almost every public upload is type Broadcast, so dayparts collapsed CH 07 into OPENING. Official playlist names already exist. A fake clock and a YouTube grid are both wrong.

## 2026-09-09 — Public broadcast is not a basement tape

**Decision:** Official YouTube embeds (`youtube-nocookie.com/embed/ID`, muted / click-to-play) are the picture on `/clip/[slug]` and `/tv` ON AIR when a clip has `youtubeId`. Cards, home, world, and tape contact sheets stay prototype (or held) — not a YouTube grid. Listings live in `src/data/youtube.ts` from the official uploads playlist, videos tab, channel RSS, and house playlist pages — no Data API key. The **366** listed official uploads are authored PUBLIC on existing entities. Upload year is the catalog year. Channel Zero 2016 uploads are public broadcasts, not 1990s cassettes. Through the Wire / Two Words on the house playlist are other channels — not wired. Basement October 2002 stays prototype. CH 07 is BROADCAST (ident, then official playlist / Channel Zero / year blocks). SOUND stays off; the player starts muted. No files downloaded. No watch-page scrape. No 3,000 hours. No Ted / M.I.S. entities. Unlisted / private (badge **367** vs listing **366**) stay off air.

**Why:** James asked to embed the real channel. The north star is still one catalog, many lenses — not a YouTube wrapper.

## 2026-09-09 — Closed records speak catalog language

**Decision:** A URL that reaches a non-PUBLIC clip or an all-held cassette is a held destination, not a 404 and not an access-denied / lock-icon page. The visitor sees `UNLISTED`, `PRIVATE`, `COMING SOON`, `MEMBERS ONLY`, `RESTRICTED`, or `PENDING CLEARANCE` — plus the existing rights / sensitivity fields. No auth, payments, or clearance workflow. PUBLIC keeps the open stage. The unfiltered index stays authored PUBLIC; DISCOVER stays PUBLIC-only. Closed records remain reachable by URL and by a filtered query.

**Why:** Creative Control means not every tape is on air. The catalog already has the statuses. The destination has to feel held.

## 2026-09-09 — Prototype transcripts are inference, not quotes

**Decision:** A few authored clips carry structured `Transcript` / `TranscriptSegment` rows (`status: "prototype"`, `origin: "editorial-inference"`). The dossier shows timecode + speaker + line. A segment deep-links (`?seg=`). Archive `q` matches segment text. No chatbot. No YouTube captions. Speakers are tape roles, not attributed quotations.

**Why:** Future search-over-speech needs a place to land. Invented Coodie speech presented as real would be a filmmaker-facing lie.

## 2026-09-09 — Live splash: materials, not the reel

**Decision:** `creativecontrol.tv` is a Framer reel splash (ident + work cards). We inherit grain, RGB fringe, analog ident, 4:3 inset as *materials*. We do not play their reel on `/` or restyle the product to Framer. James later approved the official lockup on the archive home (see newest decision).

**Why:** The splash teaches how they hold a frame. It is not an IA. The archive door is not their ident loop.

## 2026-09-09 — Constellation is a field, not a graph toy

**Decision:** `/constellation` is typographic: a selected person, hairline spokes, labeled nodes. No force layout, no Web3, no seventh nav item. Edges reuse the related-ranking ethic. Nodes open canonical pages. The show path does not include it yet.

**Why:** The six lenses hold enough to try relationships. A neon network chart would be a different product.

## 2026-09-09 — Escape closes the object, not the show

**Decision:** During presentation, Escape closes Discover or a tape overlay, or pops the timeline drill. It does not exit the show. Exit is `x` or Shift+Escape.

**Why:** A show in the room should not die when someone closes a cassette.

## 2026-09-09 — DISCOVER is not part of the show

**Decision:** DISCOVER is omitted until present state has been read (`?present=1` or session flag). It stays omitted while presenting.

**Why:** After the first hop the URL drops `present`; a first paint that still thought the show was over flashed DISCOVER over the world.

## 2026-09-09 — The index is rails, not a facet dashboard

**Decision:** `/archive` filters are condensed type rails. The unfiltered sheet is authored frames. Generated UNLOGGED stays offstage until a query (person, tape code, type, …) asks for it.

**Why:** ENTER lands on the index. Eleven native `<select>`s plus 185 mixed cards read as software, not a contact sheet.

## 2026-09-09 — House works may relate without a city

**Decision:** Two authored PUBLIC clips that are house works (type Title, or a named Creative Control project already in the catalog) score as related. City and year still cannot start that cut.

**Why:** Ali’s rabbit hole was one named Coney card. Sharing a house catalog is a real axis; sharing Los Angeles is not.

## 2026-09-09 — Same-tape UNLOGGED is the strip, not related

**Decision:** `relatedCards` refuses generated / unlogged siblings that share `sourceTapeId` with the open clip. Those frames already sit on the cassette contact strip. Authored leftovers (named or scored) still fill the rabbit hole.

**Why:** *The People’s Champ* was reprinting CC-0515 mute density as if it were a cut to another work.

## 2026-09-09 — City-scale place needs a second axis

**Decision:** Same city is not a relationship. `relationScore` treats a location as city-scale when `name === city` (Los Angeles, Chicago, New York, Paris, …). City-scale adds points only after tape / project / song / day / subjects / specific collection already scored. A specific place (name ≠ city: 63rd & Cottage Grove, DD172 / Tribeca, Coney Island, Time Studios, South Side) may start a relation by place alone.

**Why:** 2015 People’s Champ and 2002 hospital recovery both sit in Los Angeles. Sharing a metro dump is not a cut.

## 2026-09-09 — Timeline years are not UNLOGGED chapters

**Decision:** The span film and month-day beats prefer an authored featured title, then any authored title. If a year only has generated density, show the cassette `originalLabel`. Never print UNLOGGED as the year’s story line.

**Why:** Television already refuses UNLOGGED as a show title. The timeline was still using `lead.title` and captioning 2000 as UNLOGGED.

## 2026-09-09 — Related is not year-alone

**Decision:** Related cards rank same tape, same project, same song, same day, shared subjects (not only Coodie/Chike), same place, specific collections. Year is a boost after another axis already relates the two frames. Year alone — or year + camera crew only — scores 0. Catalog `linkRelations` no longer injects year + any shared person into `relatedClipIds`.

**Why:** 2015 glued *The People’s Champ* to Paris hotel room tone. Sharing a calendar is not a cut.

## 2026-09-09 — Television airs authored PUBLIC only

**Decision:** `/tv` lineups (ON AIR, SURF, GUIDE NOW / NEXT / LATER / ARCHIVE) are authored `c-*` records with `visibility === PUBLIC`. Generated unlogged density is not programmed. It must never appear as a show titled UNLOGGED.

**Why:** A network does not air unlabeled tape interiors as if they were the cut.

## 2026-09-09 — Ali is not on the Paris cassette

**Decision:** *The People’s Champ* title card lives on prototype tape `CC-0515` (digital vault, 2015, metadata only). `CC-0444` remains the Paris hotel travel tape (`Paris, room tone`). No reconstructed fight. No invented European Ali shoot.

**Why:** Sharing a year is not provenance. The BET film is a public work, not a Paris room.

## 2026-09-09 — Unlogged cells share one mute field

**Decision:** Generated frames render one dark tape-interior field. They do not cycle map / static / contact / leader as if those were logged materials.

**Why:** Random mediaKind made unlabeled density look like different kinds of logged pictures.

## 2026-09-09 — Generated density is unlogged, not a shot-log

**Decision:** `expand.ts` chapters stay for scale. They display as UNLOGGED — tape id, timecode, duration, mute prototype frame. No invented scene titles (“Hallway · CC-0217”). Authored `c-*` frames keep titles. Contact sheets mark logged vs unlogged.

**Why:** Fake chapter names pretended we had a shot-log we do not have.

## 2026-09-09 — The clip is a frame on a cassette

**Decision:** `/clip/[slug]` leads with the labeled tape object, the picture, and a chronological contact strip of that cassette. People / music / project sit as dossier, not as a streaming detail page.

**Why:** The object is footage pulled from a tape someone held.

## 2026-09-09 — Per-work prototype fields

**Decision:** `PrototypeMedia` resolves a visual voice from project, place, tags, and era. Public works already in the catalog (Ali, Kendall’s Cross, Coney, Channel Zero, DD172, Window Seat, ingest, basement, sports, later MAP) no longer share one hue wash.

**Why:** The 2025 reel’s lesson was project-specific title language. One field made every object the same tape.

## 2026-09-09 — Authored leftovers before generated density

**Decision:** Featured related cards, TV OPENING/LATE, and tape contact-sheet first frames prefer authored `c-*` leftovers. `expand.ts` stays for scale. DISCOVER unseen already preferred authored PUBLIC Unseen.

**Why:** Generated chapters are density, not the cut you show first.

## 2026-09-09 — Spine cards, not reconstructed videos

**Decision:** After Unseen PUBLIC cards landed, add prototype metadata for Jesus Walks (third), Two Words, *Good Morning* (2013), Accel Origins (2017). Ghetto Rock and Culo stay in research only. No Tittyhead Ted / M.I.S. / Rhymefest NJ product entities. No Newsweek or Tudum lines on `/`.

**Why:** The archive should name public CC work. It must not invent quotes or performances.

## 2026-09-09 — Surprise doors are PUBLIC only

**Decision:** DISCOVER landings use `visibility === PUBLIC`. UNLISTED and closed statuses remain in the index.

**Why:** “Random” must not pretend a restricted tape is on air.

## 2026-09-09 — Sound is opt-in and globally gated

**Decision:** SOUND starts OFF. Engage / switch / static / room tone no-op unless enabled. Reduced-motion skips room tone. No session restore of ON (a refresh is silent).

**Why:** Opening a tape used to `resume()` the AudioContext. That is autoplay.

## 2026-09-09 — World year follows the city if the year is empty

**Decision:** If the selected city has zero clips at the current year, bump to that city’s latest year.

**Why:** TAKE ME SOMEWHERE to New Orleans at 2004 read as an empty planet.

## 2026-09-09 — Presentation is a hidden show path

**Decision:** James demonstrates the archive with `/?present=1` (or development OPENING → SHOW). Chrome is ten hairline marks and hidden DISCOVER / OPENING. No “Concept 1/2.” Keys: Space next, comma back, `x` / Shift+Escape exit. SessionStorage keeps the show; URLs stay clean after start.

**Why:** Coodie should see each lens as if it could be the product. A labeled deck breaks that.

## 2026-09-09 — Still no R3F tape camera this pass

**Decision:** Do not deepen tape zoom into a WebGL camera. Keep the CSS mosaic dollie.

**Why:** A second Three scene still fights Framer `layoutId` and the 60fps target. Profiling would only confirm the earlier rejection. Documented, not deferred as “maybe this week.”

## 2026-09-09 — Coasts stay authored, just denser

**Decision:** Raise coastline vertex count and add inland cuts (Baja, Baltic, Persian Gulf) without a satellite texture or a public-domain GIS import.

**Why:** Mid-Atlantic idle has to read as Earth. NASA / game Earth would become a toy. Quadratic smoothing keeps the sculpture.

## 2026-09-09 — TV day is editorial, not a clock

**Decision:** Channel lineups are sorted into OPENING / DAY / STUDIO / NIGHT / LATE from clip type. GUIDE LATER names the daypart, not `+30m`.

**Why:** A fake schedule is a gimmick. A programmed day is how a filmmaker would air the vault.

## 2026-09-09 — Tape zoom is a CSS camera, not R3F

**Decision:** Opening a tape dolls the mosaic toward the selected cell (transform origin + scale + modest pan). Neighbors recede in perspective. The sheet is an in-field overlay from the cell, not a modal and not a col-span.

**Why:** A second WebGL camera through the grid fights Framer `layoutId` and the 60fps target. Physical focus should still feel like looking through the box.

## 2026-09-09 — TV is a contemporary network

**Decision:** `/tv` uses broadcast ident, ON AIR stage, lower-third, and a GUIDE rundown (NOW / NEXT / LATER / ARCHIVE). Switch is a short leader flash. No CRT chrome, no YouTube cards.

**Why:** Channel Zero is a spiritual ancestor in the programming, not a costume.

## 2026-09-09 — Land is authored outlines, idle is far

**Decision:** Continents are original lon/lat rings with inland cuts. Idle camera starts mid-Atlantic so Earth reads; fly-to still owns Chicago.

**Why:** Close Chicago-only framing hid the planet. Blobs were not cultural geography. A satellite texture would become a toy.

## 2026-09-09 — Tape depth is CSS, not an R3F camera

**Decision:** Opened tape uses perspective + Z recession on neighbors. No second WebGL scene in the mosaic.

**Why:** A true camera through the grid fights Framer layout and 60fps.

## 2026-09-09 — Entity year frames match the timeline film

**Decision:** Large nodes use era / year / lead title / frame count, then a short featured cut.

**Why:** Year chips were still a list.

## 2026-09-09 — Entity pages hold a cut

**Decision:** Large person/place nodes show decade year frames and up to six featured records. The remainder is the index.

**Why:** Dumping every Coodie or Chicago clip is a list, not a lens.

## 2026-09-09 — Map fallback names one city

**Decision:** Compact / reduced-motion / no-WebGL map uses PREV/NEXT, not a chip row of every city. The SVG still only labels the selected city.

**Why:** A name HUD is a game menu.

## 2026-09-09 — Tape date does not override a later clip year

**Decision:** `clipWhen` uses `dateExact`, then the tape recorded-date only if that year matches `clip.year`, else the clip year.

**Why:** A 2019 meeting about a 2000 tape is 2019.

## 2026-09-09 — Entity pages are graph nodes

**Decision:** `/people/[slug]`, `/places/[slug]`, `/projects/[slug]` read the same catalog. City-root places aggregate by city; neighborhoods stay exact.

**Why:** Relationships should be visible without inventing a second site or a constellation yet.

## 2026-09-09 — Timeline span is film, drill is time

**Decision:** Undrilled view is decade strips with year frames. Lists appear after you enter a year.

**Why:** History should be readable at a distance.

## 2026-09-09 — Tape zoom stays in the mosaic

**Decision:** No modal overlay. Selected tape expands in-grid; neighbors recede (scale, blur, opacity).

**Why:** Opening a tape should feel like a focus pull, not a dialog.

## 2026-09-09 — World land is simplified continents

**Decision:** Canvas + SVG share the same lon/lat rings. Chicago glow and Great Lakes are the only special geography.

**Why:** Blobs were not cultural geography. A textured Earth globe would become a toy.

## 2026-09-09 — World camera owns travel; orbit owns rest

**Decision:** Do not rotate a globe group. Fly the camera on select, then release. `OrbitControls.autoRotate` only while not flying. `onStart` cancels fly. Compact / reduced-motion / missing WebGL → SVG map, not a broken canvas.

**Why:** Previous lerp vs orbit made cities drift. The world has to feel sculptural, not like a fighting HUD.

## 2026-09-09 — Tape zoom is an overlay, then a dossier

**Decision:** Mosaic click expands a shared `TapeObject` into a frames overlay; “OPEN THE FILE” is `/tapes/[id]`.

**Why:** Provenance should feel physical before it becomes a page.

## 2026-09-09 — Timeline is a drill, not only a rail

**Decision:** Year / month / day / tape-clip. Path tabs re-filter the same catalog in place.

**Why:** A year stack cannot hold thousands of hours later.

## 2026-09-09 — Greenfield local Next.js app

**Decision:** Build in this repo with Next.js (App Router), React, TypeScript, Tailwind, Framer Motion, React Three Fiber. No Lovable rewrite — the directory had no existing app, only the reel.

**Why:** Parent stack preference; empty repo; Lovable workflow is for a cloud sandbox we do not have.

## 2026-09-09 — One catalog module

**Decision:** All lenses read from `src/data` + `src/lib/archiveQuery.ts`. No per-route fake datasets.

**Why:** One archive, many interfaces.

## 2026-09-09 — Prototype media only

**Decision:** Generated visual fields, leaders, grain, type. The local reel is research, not a source asset.

**Why:** Do not redistribute copyrighted footage.

## 2026-09-09 — No public hour-count

**Decision:** UI may say the archive is larger than a documentary. It will not print “3,000 hours” or “330 hours” as a product statistic.

**Why:** Public figures disagree; 3,000 is a working assumption, not a confirmed catalog size.

## 2026-09-09 — Archive first, World second for “extraordinary”

**Decision:** Make `/archive` and `/clip/[slug]` excellent, then push `/world` as the second deep lens. `/tv`, `/tapes`, `/timeline` must be real, not empty.

**Why:** Parent quality tradeoff.

## 2026-09-09 — Opening switcher is development-only

**Decision:** Discreet control labeled by opening name (ARCHIVE / HISTORY / DOCUMENT / SPAN), visible when `NODE_ENV === 'development'` or `?opening=` / `?lens=`. Never “Concept 1.” Each take is a different threshold (light, field behind the mark, copy, door pair). The official lockup does not remount. `/?present=1` still starts on `/`; the primary verb advances the show. No Ali card. No invented catalog.

## 2026-09-09 — Sound off by default

**Decision:** Optional Web Audio bed. Mute is the default and is obvious.

## 2026-09-09 — Rights as metadata

**Decision:** Show visibility/rights/sensitivity on clips and tapes. Do not build clearance workflows.

## 2026-09-09 — Evidence labels in docs

**Decision:** Research files use CONFIRMED FACT / PUBLICLY REPORTED INFORMATION / COMMUNITY INTERPRETATION / OUR CREATIVE INFERENCE.

**Why:** Do not fabricate Coodie.
