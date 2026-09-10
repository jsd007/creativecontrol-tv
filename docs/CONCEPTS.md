# Concepts

One archive. Many interfaces. These are lenses, not separate products.

**How the archive should feel** — after jeen-yuhs.com, what the vault itself is — is written from the live product in `docs/NORTH_STAR.md`. This file is the surface inventory. The walk is `docs/PRESENTATION.md`.

Development-only opening switcher lives on `/`. It must never say “Concept 1 / Concept 2” in public UI.

## Presentation (James → Coodie)

A show path, not a public product. `/?present=1` or OPENING → SHOW (development). Seven unlabeled hairlines, desktop only. The visitor should feel they are inside the real archive, not a slide deck. James: `docs/PRESENTATION.md`.

Story beats — one idea each, defined in `src/lib/present.ts`, which is authoritative:

1. The door — `/`
2. The world — `/world`
3. Chicago — `/world?city=chicago&fly=1`
4. One record — `/archive?person=ye&location=chicago&year=2002&type=Studio` (**1** record)
5. Public air — `/tv?ch=7`, CH 07 ident first, PLAY · MUTED
6. The tape — `/tapes?open=t-0217`
7. The span — `/timeline`

The cut from ten to seven was deliberate: the leftover clip, the redundant person-only filter pass, and the CH 03 Studio variation each repeated an idea the walk had already made. They stay in the product and out of the show. Do not invent an eighth.

Space / `.` / `n` next. `,` / `p` back. `x` or Shift+Escape leave. Escape alone still closes a tape. Space on SOUND toggles and does not hop. Cross-lens hops are film cuts (View Transition gate; same-path beats keep fly / acquire). A top hairline draws; the seven marks widen. Reduced motion is an instant cut. SOUND stays off. Show marks are desktop only; the mobile dock is house chrome, not a beat.

Stills of all seven, captured from live, are in `docs/coodie-proof/`. Re-capture after any visible change so they never promise something the show does not do.

## `/` — Threshold

Restrained Creative Control entry. The visitor is not dropped into a catalog.

Four openings. Each is a **room** — not disposable type under one lockup. Development switcher lists ARCHIVE / HISTORY / DOCUMENT / SPAN — never “Concept.”

1. ARCHIVE — house door: museum gold/blue, leader strip. THE ARCHIVE / ENTER → `/archive`. THE WORLD → `/world`.
2. HISTORY — screening room: dark house, a lit 4:3 screen, a throw from the booth, a watching line through the picture. The official mark is the picture. YOU ARE WATCHING HISTORY. / BEGIN → `/tv`. THE ARCHIVE → `/archive`. Not CRT. Not the Framer Ali card.
3. DOCUMENT — leftover / mandate room. Unused Channel Zero yellow holds after a leftover checker that leaves the frame (ancestor materials, not a title card, not CRT). DOCUMENT EVERYTHING. Credits: CHANNEL ZERO · THE LONG SHOOT · THE NETWORK. WATCH → leftover `/clip/channel-zero-never-aired`. THE NETWORK → `/tv`.
4. SPAN — year horizon room. Years 1994—2026 run as one horizon through the mark (edges and decades read; the rest is duration, and the line leaves the frame). THE SPAN. EXPLORE → `/timeline`. THE ARCHIVE → `/archive`. Not ticks as wallpaper. Not THE WORLD.

The room is light, field, copy, and the door pair around the same mark. The house mark lands first and stays mounted: the official YouTube lockup still, with a muted living field (jeen-yuhs loading film) behind it. Then the opening’s register and its own doors. Switching takes does not remount the lockup. During `/?present=1` the primary verb still advances the show; beat 1 stays `/`. Lens hops are cuts, not a Next.js blink. Not a quiet watermark, not a template hero, not the live Framer reel (no Ali card, no full-bleed ident loop). No hour-count. Never print 3,000 hours. Reduced motion is the still official mark — no video, no sheen. The fields stay still.

The live site is a Framer reel splash. This `/` is still an archive door. The logo is their mark; the page is ours.

## `/archive` — The Index

Primary surface after foundation.

A finding-aid ledger, not a thumbnail mosaic and not a sortable table. Year is a beat. Each row is when · tape · type · title · place · people · a hold if the picture is closed. Official house uploads are holdings: year · official title · BROADCAST · place — not a card wall. Unfiltered keeps one official through-line per listing year; a year or a search opens the titles. Extreme type. A person, a tape code, a street, a year — not “search the archive.” Facets are editorial rails, not a dropdown dashboard and not a phonebook of every name. Unfiltered PUBLIC cut has no record-count inventory. A query stamps N RECORD(S). `/archive?collection=` films the same public house cut as `/collections/[slug]` — Classics is **19** house titles, not 366 official uploads. Studio Nights is **0** public frames.

ERA · SPAN (decade, then year) · PLACE (gravity) · PERSON (spine) · TYPE (Studio, Interview, Performance, Broadcast, Unseen) · COLLECTION (Channel Zero, Through the Wire, Coodie's Picks, Unseen, Classics, College Dropout road)

The field binds a unique year, person, place, type, or collection. Unfiltered sheet holds authored frames. Unlabelled density stays on the tapes until a query asks for it. A selected place, person, type, or collection that is not on the spine still appears. BTS, Travel, Street, Conversation, and Title are real kinds — they do not wrap the index. First Times, Studio Nights, New York, and Chicago Before are real cuts — they do not wrap the index.

A query should read as a sentence:

**PERSON** Kanye + **LOCATION** Chicago + **YEAR** 2002 + **TYPE** Studio → **N** results.

## `/world` — The World

Memory mapped onto Earth. Not a museum wall about geography.

Chicago glows heavily. Also: New York, Los Angeles, Atlanta, Tokyo, Paris, Accra, New Orleans, London, Dallas.

Land is original authored coastlines — denser than blobs, still sculptural. Americas, Eurasia, Africa, Australia should read as Earth from mid-Atlantic idle. Florida / Gulf / Yucatan, Brazil, West Africa, Iberia, Italy. Cuts for Hudson Bay, the Lakes, Baja, Baltic, inland seas. Chicago glow. Not a GIS toy or a game globe. The globe does not spin as a group while the camera flies. Orbit auto-rotates slowly until a city is chosen; then the camera eases in (Chicago closer) and user drag cancels the fly. Hover names the city; selected city opens THE PLACE. Compact / reduced-motion / weak WebGL becomes a dark cultural map — **YEAR · MAP**, one selected label, PREV/NEXT, not a HUD of every name. Desktop globe has no city-chip row and no explanatory H1.

Year is time on the sculpture — a hairline timestamp, not a boxed card. No city description essay. Subtle arcs. Idle orbit is slow; a fly-to anticipates (pull back) then eases in, Chicago closer. Tab reaches the selected city, THE PLACE, then other facing marks (clipped until focus). Arrows still travel. Sculpture labels stay pointer-first. Mysterious, cinematic, precise. Not a game menu. Reduced motion is MAP — no orbit, no fly ease. The dock is the door.

## `/tv` — Creative Control Television

Contemporary network identity. Not fake CRT nostalgia.

Channels (seed):

| Ch | Name |
| --- | --- |
| 00 | Channel Zero |
| 01 | Origins |
| 02 | Chicago |
| 03 | Studio |
| 04 | New York |
| 05 | Performances |
| 06 | Unseen |
| 07 | Broadcast |
| 08 | Conversations |

The page is the network, not a page about a network. Ident is CC-TV + a giant channel number + name + a thin voice line + ON AIR + a crawl of official programmed titles — not a slogan. The picture carries a hairline lower-third (authored title only). When the on-air clip has a `youtubeId`, the stage is an official muted / click-to-play YouTube embed — not a thumbnail grid. Tuner is a graphic strip of channel numbers; a Flip hairline rides the selected one, and each number states what that channel holds (`07 366`, `03 1`) so scale reads before you tune — counted as titled programs, never raw holdings. `/tv` opens on **CH 07**: the channel with the content is the front door, not a house cut holding four titles. GUIDE is **one list**. Every title on the channel is in it, in air order, with the block name as a quiet sticky marker that rides the scroll. No shelves, no BY YEAR rail, no letter or prefix nest, no MORE, no paging — nothing on a channel is behind a door, and scrolling is the only skill required. CH 07 is all **366** rows on one scroll (CREATIVE CONTROL TV, CHANNEL ZERO, TEAR UP, ECKŌ STUDIO SESSIONS, then upload years 2009-2025 as markers); a house channel is its whole 1-12 title lineup. A FIND A TITLE field filters that same list in place and states `N OF 366`. A row tunes that slot. No NOW / NEXT / LATER / ARCHIVE tabs, no record count. CH 07 BROADCAST signs on with the house ident, then official public blocks (playlist names already on the channel, Channel Zero, upload-year markers). A row on CH 07 does not restamp BROADCAST — the channel already said it. After those official titles the GUIDE does not stop as if the channel were the mock: a mute remainder (NOT IN THIS MOCK / HELD / UNOPENED / growable empty) — no invented show names, no upload count. Surfing (0-8, arrows, SURF, GUIDE) is broadcast acquisition (~150ms): a black, an accent wipe, the channel number stamps — yellow on Channel Zero, signal on Broadcast, not VHS snow. Reduced motion is an instant cut: no acquire, no crawl, no Flip, no flourish. Channel Zero is an ancestor in the programming, not a fake-1990s skin. UNLOGGED is never a show title.

## `/tapes` — The Tapes

Physical provenance. Vault aisle of facing spines, not a card mosaic. Cassettes sit as facing spines on provenance lips: STORAGE (camera originals), DIGITAL VAULT (ingested files), PHONE (backup), STUDIO (later work), BROADCAST (not camera originals — year cassettes of official holdings, typed lines, not a thumbnail wall), then UNOPENED mute spines (honest labels only, including HELD paper), then a GROWABLE empty lip that fades. Scale is that mute remainder, not a count. The mute rack is longer than any one authored bay and stays when a cassette opens (it recedes). Format rails stay. The aisle is the page — no museum essay. No hour totals. Never print 3,000 hours.

Zoom: a CSS camera through the aisle — not a second WebGL scene. Opening walks in Z toward the spine (no scale doll); the cassette then pulls off the rack; frames register in a gate as LOGGED vs UNLOGGED. Other shelves recede. Logged frames keep titles; UNLOGGED stays mute (tape time, duration). A BROADCAST year opens as typed holdings, not a contact-sheet grid. Escape closes. `/tapes/[id]` is the cassette beside a paper file; camera originals keep a contact sheet (LOGGED · UNLOGGED, not a clip count). Reduced motion is `transform: none`.

## `/timeline` — The Timeline

1994–2026. The page is the span and the film — not a museum essay and not a record count. At a distance: a film sprocket rail (equal ticks, not a count chart) and decade film strips (an era beat + year frames, perforations). Decade copy is era time (rooms, a city, a work, after the cut) — not a narrator about the camera or the catalog. Year cells prefer an authored title or cassette label; they never title UNLOGGED and they never lecture about the vault or the camera. Year / month / day film does not print `N FRAMES`. Landed-day reel slugs keep the tape code and original label — not `MINIDV · N FRAMES`. A selected year locks in the sprocket. Lighting a path advances the decade film. A year is a month sprocket (equal ticks; empty dim) plus month film (lead title, never UNLOGGED). A month is a day sprocket plus day film. A landed day is that day’s film: the date, a lead title (never UNLOGGED — cassette label if the day is only density), the picture in the gate, frames in time. Not a cassette grid and a mute list. Empty days stay empty. Dates from `dateExact`, else the tape `recordedDate`, else an UNDATED year bucket. No native year `<select>`. Reduced motion holds the strip still.

Paths are a through-line, not ALL / COODIE / CHIKE tabs. The span is the story until a name is followed; then the name is the title and THE SPAN · 1994 — 2026 returns. Connections sit as a `through` sentence on each decade, and in the header once a year or a thread is open. Same path query (Coodie / Chike / Ye / College Dropout / Chicago / Creative Control). No ALL facet.

## `/constellation` — The Constellation

Optional. Same catalog. Not a seventh product and not in the show path yet.

Default person: Coodie. The deep field can also recenter on a place or a project (`?place=` / `?project=`). Spine recenters people (Coodie / Chike / Ye / Ali / Donda). The field holds a few true spokes — a couple of people, one song, one place, one project, a couple of frames — not every valid edge. Axes stay tape / project / song / day / subject / specific place / house. Year-alone and city-alone do not draw.

The field is type and hairline spokes on void — not a force graph, not a clock, not LinkedIn, not neon. People sit closer; a project, a song, a place, and frames sit at different distances. GSAP registers the name; spokes draw; labels travel out. Hover names the axis, states what holds the bond up (`391 FRAMES · 2003 — 2025` for Coodie · Chike), and shows the authored frame that proves it. Spoke ink ramps with that count so a dense bond reads dense at a glance — a ramp, never a weighted graph, never a score or a percentage. A single frame carries no span, so frame spokes stay unweighted. A person, place, or project in the field recenters the field. A frame or song opens the record. The name still OPENs the node. On a phone the same spokes sit in a handheld pocket — larger type, thumb hits — not a squashed desktop and not a Wikipedia list. Reach it from a person / place / project page (`THE FIELD`) or from the DISCOVER door WHO ELSE WAS THERE — not from the lens rail, not as “Concept 7.” Not in the show path. Reduced motion is the field already drawn — JS never attaches spoke draw.

## Graph — person / place / project

`/people/[slug]` · `/places/[slug]` · `/projects/[slug]`

Same catalog, one entity. Linked from clip metadata, archive facet sentences, world “THE PLACE”, and timeline day rows. Not a second product.

The page is a file, not a profile. The short name is the tab. Connections are a stack of bonds: the proving still in a gate, the axis, the name, then the evidence — `12 FRAMES · 1998 — 2012` and FIRST HELD BY the authored frame that proves the edge. A bond names the relationship, not only its two ends; a name with no count is an assertion. Ye · Coodie (12 frames from 1998) must not look identical to Ye · Chike (5 from 2003). Axes stay tape / project / song / day / subject / place / house. Not a year film. Not a card directory. Not a construction circle. The rest of the node lives in the index. `/constellation` is the deep field — full-bleed, same catalog. Compact is the file. No museum essay about the decade. No “this page holds a cut” tutorial. Ali’s graph does not open Paris or the hospital tape.

## `/collections` — Stories

Editorial cuts of the same catalog. Not a seventh lens and not on the rail.

`/collections` is the contents of a book of stories: chapter number, catalog name, catalog dek, era span, and a still from the cut — or no still when the cut has nothing on air. `/collections/[slug]` is one held story: the name, the dek, then a film of house editorial PUBLIC frames already in that collection — not the official CH 07 upload file. Classics is **19** house titles (Polaroid → Kendall's Cross), not 366 official uploads. Year is an intertitle when the cut crosses years. Each beat is a still in the gate, the title as the line, place and people as credits. Not a card grid. Not a contact sheet. Not a museum index. `/archive?collection=` binds that same public reel.

Restricted and members-only leftover stays in the house file and opens the clip sleeve. Unlabelled density stays on the tapes. Studio Nights is **0** public frames — a gate with no picture. Leftover is HELD IN THE HOUSE FILE (basement MEMBERS ONLY, unused COMING SOON), not `{n} IN THE INDEX` on a public collection facet that is 0. Do not invent frames.

The ten cuts already in the catalog:

- Coodie's Picks
- The Road to The College Dropout
- Chicago Before the World Was Watching
- First Times
- Studio Nights
- New York
- Channel Zero
- Through the Wire
- Unseen
- Creative Control Classics

Reach them from the archive COLLECTION rail and from a clip dossier. Not a blog. Not a YouTube playlist.

## `/clip/[slug]` — Canonical clip

Every lens ends here. The object is a **frame pulled from a labeled cassette**, not a streaming episode page.

The stage is the cassette beside the extracted picture. It opens through a gate. Authored frames keep titles. Unlogged frames show tape id + timecode, not a fake scene name. A chronological contact strip of that cassette sits under the stage (logged titles beside UNLOGGED density); the current cell is in-gate. Before / after stay on the tape. An official public embed may sit in the picture; the gate must not remount that player. People, music, project, rights sit as dossier. A few authored frames also hold a prototype transcript in the dossier — timecode, speaker, line. The lines are editorial inference. A segment is a deep-link, not a bot. Related is leftover frames labeled by axis (LEFTOVER / TITLE CARD / project) — not numbered up-next cards. Ranking prefers named leftovers, then authored Unseen, then other authored. Same-tape UNLOGGED stays on the cassette strip. They reveal as a hairline, not a bounce.

Prototype media on the stage is per-work for authored PUBLIC frames (Ali ≠ Coney ≠ basement ≠ Channel Zero). Unlogged frames are mute: timecode, tape, duration — no invented scene title. Stamp remains PROTOTYPE MEDIA. A closed visibility (UNLISTED, PRIVATE, COMING SOON, MEMBERS ONLY, RESTRICTED, PENDING CLEARANCE) is a held sleeve in catalog language — not a 404, not “access denied.” The cassette is still there. The picture is not on air.

Rabbit hole with no special “end of content” marketing.

## Serendipity

DISCOVER (or `d`) is the archive offering a tape — a veil and sleeves, not a settings drawer and not a chip menu. RANDOM TAPE is the cassette in the hand. The other five are other offerings. Each sleeve names the kind of offer and the landing. The field is the sleeves — not an essay about serendipity. Public footage only. Hidden while `/?present=1`.

| Door | Lands |
| --- | --- |
| RANDOM TAPE | `/tapes?open=` — aisle camera on a tape that has PUBLIC frames |
| TAKE ME SOMEWHERE | `/world?city=&fly=1` — not Chicago |
| UNSEEN | `/clip/` — PUBLIC + type/collection unseen; prefers authored Unseen leftovers |
| ON THIS DAY | clip if one PUBLIC hit; else `/archive?month=` / `day=` |
| FROM CHICAGO | `/clip/` — PUBLIC Chicago frame |
| COODIE'S PICK | `/clip/` — PUBLIC in Coodie's Picks |
| WHO ELSE WAS THERE | `/constellation?person=` — a real bond, stated as `COODIE · YE · 12 FRAMES` |

Restricted, private, coming-soon, members-only, and pending-clearance stay in the index. They are not a surprise.

WHO ELSE WAS THERE is the only door that offers a *relationship* rather than a record, and it is how the deep field becomes findable without putting it on the lens rail. It reads the same graph the fields do, so authored-only and Ali's refusals are inherited rather than re-implemented. It varies across the five heaviest bonds — serendipity, not a leaderboard.

## Keyboard

Tab order is the house: skip, mark, rails, DISCOVER, SOUND, then the room. One skip link. Focus is a hairline of leader gold. SOUND is a real button; Space on it toggles, even during the show. `d` opens DISCOVER; Escape closes the veil. Enter/Space take doors (threshold, DISCOVER sleeves, rails, THE FIELD). Escape on an open cassette closes the tape only. `x` / Shift+Escape still leave the show. GUIDE is one title per row. Constellation spokes are in the tab order; Enter recenters a person / place / project. World Tab walks the selected city → THE PLACE → other facing marks.

## Mobile dock

Below `md`, house chrome is a bottom dock (`lens-mobile`): DISCOVER + SOUND, then ARCHIVE / WORLD / TV / TAPES / TIMELINE. On `/` the lens row hides; the acts stay. Safe-area padding. Not a hamburger. Not the desktop rail shrunk. Show marks stay off. Constellation at ~390 is the pocket, not this dock.
