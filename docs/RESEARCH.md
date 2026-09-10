# Research

Evidence classes used throughout this project:

- **CONFIRMED FACT** — multiple reliable public sources, or a primary public statement we can attribute
- **PUBLICLY REPORTED INFORMATION** — journalism, interviews, or reference pages that we have not independently verified against primary records
- **COMMUNITY INTERPRETATION** — blogs, fan memory, secondary encyclopedias
- **OUR CREATIVE INFERENCE** — design and product judgment, not a claim about what Coodie or Chike said

We do not invent Coodie quotes. Quoted material below is taken from named public interviews.

---

## Sources consulted this session

| Source | Status |
| --- | --- |
| https://www.creativecontrol.tv/ | Fetched then visually inspected 2026-09-09. Study screenshots in `docs/research/`. See below. |
| Local file `creative control reel.mp4` | Analyzed technically and by extracted frames. |
| https://jeen-yuhs.com/ | Fetched; returned almost no text (likely JS-only). Do not copy. |
| Wikipedia: Coodie & Chike | Search synthesis + secondary corroboration. Full page fetch timed out. |
| Netflix Tudum: Channel Zero explained | Fetched. |
| Netflix Tudum: Coodie & Chike interview | Fetched. |
| Newsweek, Feb 2022, jeen-yuhs creators | Fetched. |
| Variety, Jan 2022, directors on Creative Control | Fetched. |
| Evening Standard, Feb 2022 interview | Fetched. |
| Fake Shore Drive, 14 Apr 2010, NJ 2002 Channel Zero clip | Fetched. |
| IndieWire, Feb 2022, archival documentaries / ~400 hours | Search synthesis. |
| Accel.com Origins Series posts, 15 Apr 2017 | Fetched (Qualtrics, Cloudera). |
| IMDb: *Good Morning* (2013 short) | Search synthesis. |
| Wikipedia: Coodie & Chike | Search synthesis; full page fetch 404/timeout. |
| WØRKS / works.studio jeen-yuhs film identity | Fetched. |
| danferro.studio jeen-yuhs case study | Fetched. |
| Awwwards jeen-yuhs page | Search synthesis (color notes only). |
| Hypebeast, 14 Nov 2009, Creative Control trailer | Search synthesis. |
| Academic Dictionaries copy of “Creative Control TV” | Fetched (Wikipedia mirror; treat as secondary). |
| Cocky Gold / Imaginary Circus, Nov 2009, DD172 launch copy | Fetched. |
| Fake Shore Drive, 9 Mar 2010, Coodie & Chike interview | Fetched. |
| Hollywood Reporter, May 2022, jeen-yuhs directors | Search synthesis. |
| Business Insider, Feb 2022 | Search synthesis. |
| Evening Standard interview | Search synthesis. |
| Rolling Stone Music Now coverage | Search synthesis. |
| IMVDb Creative Control / Coodie & Chike videographies | Search synthesis. |
| Creative Control Substack archive / podcast index | Fetched (house titles and dates). |
| Wikipedia: DD172 | Search synthesis. |
| @creativecntrl on X | Not accessed — X MCP requires auth. |
| Coodie Instagram | Not accessed this session. |
| Creative Control YouTube / CC Television | Official channel + RSS + public playlists reviewed 2026-09-09. See below. |
| Repo `unnamed-3.jpg` (James) | **Mark source.** Official static house mark: white knot over CREATIVE CONTROL, black field. Copied to `public/brand/creative-control-mark.jpg`. See House mark source below. |
| Repo `Jeenyuhs_loading.mp4` (James) | Authorized muted living field on `/` only. Served as `public/brand/jeenyuhs-loading.mp4`. |

### 2026-09-09 public refresh

| Source | Status |
| --- | --- |
| https://www.creativecontrol.tv/ | Visual inspect 2026-09-09 (below). Study screenshots in `docs/research/`. Do not ship those frames. |
| https://creativecontrol.substack.com/ + `/about` + `/archive` | Fetched. Same April–May 2025 house index. Full episodes paid. No public episode after **17 May 2025**. Footer © 2026 Creative Control. |
| https://www.youtube.com/@cctelevisionchannel | CONFIRMED. Title **Creative Control**. `externalId` **UCGOXZwQw4InmSTtxDmfZMpw**. Vanity `@cctelevisionchannel`. About: official YouTube of Creative Control. Full public listing from uploads playlist + videos tab + RSS (IDs/titles/dates/thumbnails only). |
| Complex, 11 Feb 2022, Lei Takanashi — jeen-yuhs interview | Fetched. New attributed lines and scene language below. |
| Wikipedia: Coodie & Chike | Earlier refresh 404/timeout. Full raw page fetched in the lineage pass below. Do not treat Grokipedia as a source. |
| YouTube watch pages / auto-transcripts | Not used. Do not invent quotes from garbled captions. |

### 2026-09-09 research lineage (no James, no footage)

Public, automatable pass. No media rips. No Data API key. No X login. No new catalog objects.

| Source | Status | Date | Confidence |
| --- | --- | --- | --- |
| https://www.youtube.com/@cctelevisionchannel + `/about` + `/videos` + `/playlists` | Fetched. Title **Creative Control**. `externalId` **UCGOXZwQw4InmSTtxDmfZMpw**. Videos-tab badge this pass **367**. About earlier the same day: **31.8K** subscribers, **10,992,706** views, **Joined Oct 22, 2009**, country United States. JSON-LD `sameAs`: `creativectrl.tv`, `twitter.com/creativecntrl`, `instagram.com/creativecontroltv/`. | 2026-09-09 | CONFIRMED FACT |
| Channel RSS `feeds/videos.xml?channel_id=UCGOXZwQw4InmSTtxDmfZMpw` | 15 entries (RSS cap). Newest still **2025-05-17** `nkqvZXkp07M`. Feed `<published>` **2009-10-23T06:08:22+00:00** (About says Oct 22 — timezone, not a second join). | 2026-09-09 | CONFIRMED FACT |
| Playlist RSS (this channel only) | Still **Creative Control TV**, **TEAR UP**, **BENT**, **Eckō Studio Sessions**. Same four IDs as `src/data/youtube.ts`. BENT RSS still 1 foreign-channel item. | 2026-09-09 | CONFIRMED FACT |
| `src/data/youtube.ts` listed set | Full public listing this pass: **366** unique house IDs (uploads playlist `UUGOXZwQw4InmSTtxDmfZMpw` + videos-tab pagination; `yt-dlp --flat-playlist --skip-download`). Videos-tab badge **367**. Gap of **1** not on the public listing (unlisted / private / count drift). No Shorts tab. No Streams tab. Newest RSS still **2025-05-17**. No Data API key. No watch-page scrape. | 2026-09-09 | CONFIRMED FACT |
| https://www.creativecontrol.tv/ | Still live. Title **Creative Control**. Framer splash. No body catalog. | 2026-09-09 | CONFIRMED FACT |
| https://creativecontrol.substack.com/archive + `/about` + `/podcast` | Same April–May 2025 house index. Last public item **17 May 2025**. Footer © 2026. No new episode. | 2026-09-09 | CONFIRMED FACT |
| YouTube JSON-LD + https://jeen-yuhs.com/ + https://creativectrl.tv/ | `creativectrl.tv` is an official YouTube link. When reachable, it served the same JS email-gate chrome as jeen-yuhs.com (same GTM `GTM-MLK5J6N`, ENTER EMAIL, Terms / Privacy). Later curls 500/502. **Reference notes only. Do not copy.** | 2026-09-09 | CONFIRMED FACT (link + reachability) / flaky host |
| https://x.com/creativecntrl and twitter.com | **403**. X MCP needs auth. xcancel / nitter also blocked. Handle is official *as listed on YouTube*. Posts unread. | 2026-09-09 | CONFIRMED FACT (listing) / unread (posts) |
| https://www.instagram.com/creativecontroltv/ | YouTube lists it. Public page: **Profile isn't available**. | 2026-09-09 | CONFIRMED FACT |
| https://www.instagram.com/officialcoodieandchike/ | Public profile (no login). **10.6K** followers. Bio: directing duo `@coodierock` & `@cozah`; Substack; link-in-bio = Variety 10 Jul 2026 Ernie Barnes piece. Grid includes that 10 Jul post plus 2025 Substack/podcast clips. Tagged 13 Aug 2026: Coodie as panelist, Surrounded By Stories / SVA Theatre, Sat 9/5. No archive-size number on the public grid. | 2026-09-09 | CONFIRMED FACT (profile) / PUBLICLY REPORTED (captions) |
| https://www.instagram.com/cozah/ | Public, verified. Bio: “1/2 of the directing duo Coodie & Chike.” ~19.3K. Link includes NYT Styles 18 Apr 2025 wedding piece. Grid is personal / tagged; shares the duo’s Ernie Barnes post. No archive-size number. | 2026-09-09 | CONFIRMED FACT |
| https://www.instagram.com/coodierock/ | Handle exists (Sway + duo bio). Fetch this pass was login/locale-thin. Full grid not reviewed. | 2026-09-09 | PUBLICLY REPORTED handle / unread grid |
| Variety, 10 Jul 2026, Jazz Tangcay — *Who Is Ernie Barnes?* | Fetched. Exclusive announcement. Attributed Simmons / Ozah / Luz Rodriguez lines below. | 2026-09-09 | PUBLICLY REPORTED INFORMATION |
| Official duo IG `p/Dan5kvbkdh5` (10 Jul 2026) | Public caption fetched (text only). House copy amplifying Variety. Tags include `@deoncole`. | 2026-09-09 | PUBLICLY REPORTED house copy |
| Sway In The Morning / Sway’s Universe, dated **7 Aug 2025** on open.video | Third-party page + auto-transcript. Official Sway YouTube watch page not confirmed this pass. Caption quality is poor. **Do not invent a cleaned quote.** | 2026-09-09 | PUBLICLY REPORTED INFORMATION (appearance) / caption-quality speech |
| Wikipedia `Coodie & Chike` raw | Full page fetched (prior passes 404/timeout). Still `{{More footnotes\|date=October 2014}}`. Access-dates on some refs run to 2026-01-11. | 2026-09-09 | PUBLICLY REPORTED INFORMATION / COMMUNITY INTERPRETATION |
| BWNC / Black With No Cream, “Coodie & Chike” | Show-notes page fetched (thin). Castbox lists **2024-07-14**. No public transcript. | 2026-09-09 | PUBLICLY REPORTED INFORMATION |
| Overshare podcast show notes | Older (Coney Island–era). Lists `@officialcoodieandchike` / `@coodierock` / `@cozah`. Not new. | 2026-09-09 | PUBLICLY REPORTED INFORMATION |

---

## Live `creativecontrol.tv` — visual inspect 2026-09-09

Study screenshots (do **not** ship into the product):

| File | Viewport |
| --- | --- |
| `docs/research/live-creativecontrol-tv-desktop.png` | Desktop ~1488×871 — ident / mark |
| `docs/research/live-creativecontrol-tv-desktop-later.png` | Desktop, later in the loop — work title card |
| `docs/research/live-creativecontrol-tv-mobile.png` | 390×844 — 4:3 inset |

**CONFIRMED** (browser + DOM; no file download)

- URL `https://www.creativecontrol.tv/`. Document / og:title **Creative Control**. Meta description empty. Generator: **Framer**.
- No body text. No `<a>` links. No nav, search, channels, or catalog.
- One `<video>`: 960×540, autoplay, muted, loop, playing. Duration **~207.15s** (~3:27). Hosted on Framer CDN (URL recorded in session notes only — do not rehost).
- Page ground `rgb(10, 0, 0)`.
- Desktop picture fills the viewport (letterboxed). No chrome over the picture.
- Desktop first capture: centered lockup **CREATIVE** + a pinched/coil mark + **CONTROL**, condensed white caps, grain, RGB fringe (red left / cyan right), faint amber/violet wash. No other type.
- Desktop later capture: a work card — slab **MUHAMMAD / ALI**, sans **THE PEOPLE'S CHAMP**, **DIRECTED BY COODIE & CHIKE**. Grain. Letterbox.
- Mobile (390×844): black field. Small ~4:3 picture upper-left. One small white icon under it (two rectangles / arrows). No wordmark, no type.

**INFERENCE** (not fact)

- This is a **holding splash**: the company reel as the whole site, not a network and not an archive UI.
- Duration matches the local `creative control reel.mp4` probe (3:27). We did not hash files. Do not treat them as proven identical.
- The live mark exists. James later asked to use it on the archive home — see CONFIRMED FACT below.

**Screenshot read (same files, 2026-09-09 analysis)**

**CONFIRMED**

- Desktop ident: condensed caps **CREATIVE** / **CONTROL** split by a three-loop coil / pinched-X mark. Heavy grain. RGB fringe (red left, cyan right) on type and mark. Soft glow. Faint amber wash left, violet right. Centered. No UI.
- Desktop later: analog motion, letterbox. Slab **MUHAMMAD / ALI**, sans **THE PEOPLE'S CHAMP**, **DIRECTED BY COODIE & CHIKE**. Grain and RGB fringe on the card. Matches the local reel’s Ali title language already studied — we did not re-extract frames.
- Mobile: black field. Small 4:3 inset, upper left. One rotate-device icon under it. No wordmark.

**INFERENCE**

- Materials we may inherit as *clues*: grain, RGB fringe, analog ident, 4:3 mobile inset.
- Identity we must not take from the splash: the Framer full-bleed reel as homepage, their title cards as product chrome.

### House mark source

**CONFIRMED FACT** (James handed the file, 2026-09-09 — this tree)

| | |
| --- | --- |
| **Source** | James. Repo root `unnamed-3.jpg`. White knot / infinity lockup over CREATIVE CONTROL, black field, 160×160. |
| **Product copies** | `public/brand/creative-control-mark.jpg` (byte copy). `public/brand/creative-control-mark.png` (same still, black knocked out for the void / living field). |
| **Where it sits** | `/`, rail mast, `/?present=1` marks, mobile dock, favicon. |
| **Not the source** | Invented coil / lockup SVGs (gone). Wide CREATIV[knot]CONTROL banner we saved as a stand-in (gone). Live Framer reel (mark lives inside that video; we did not ship it). |
| **Corroboration only** | YouTube `@cctelevisionchannel` / `UCGOXZwQw4InmSTtxDmfZMpw` avatar matches this composition. Do not treat channel art as the file we ship. |
| **Living field** | James authorized `Jeenyuhs_loading.mp4` as a muted field on `/` only → `public/brand/jeenyuhs-loading.mp4`. Not the Framer reel. Not jeen-yuhs.com. Reduced motion = James’s still only. SOUND stays off. |

**OUR CREATIVE INFERENCE**

The live domain does not disprove the prototype. It also does not give us an IA to inherit. `/` in this repo is a threshold into an archive. The official mark may land; the page must not become their ident loop.

---

## Creative Control as two related things

**CONFIRMED FACT / PUBLICLY REPORTED INFORMATION**

There are at least two public uses of the name that this project must not collapse:

1. **Creative Control, the production company** — Wikipedia and multiple interviews say Coodie and Chike founded it in **2007**.
2. **CreativeControl.tv, the online network** — contemporary 2009 coverage and a Wikipedia-derived entry say it launched **27 November 2009 (Black Friday)** in New York, in partnership with Damon Dash, from the DD172 space, coinciding with the Blakroc / Sessions at DD172 moment.

**OUR CREATIVE INFERENCE**

The prototype should treat CreativeControl.tv as the public-facing cultural destination and Creative Control as the authorship/production identity behind it — unless Coodie and Chike later define a different relationship.

---

## Channel Zero

**PUBLICLY REPORTED INFORMATION** (Netflix Tudum; corroborated across jeen-yuhs press)

- Coodie (Clarence Simmons) was a South Side Chicago stand-up, close with Bernie Mac, before becoming a filmmaker.
- Friend Danny Sorge, who worked at a barbershop, approached him about hosting a Chicago public-access show called Channel Zero.
- Coodie pushed to interview artists inside concerts rather than only fans outside.
- Tudum’s directors interview dates Channel Zero to **1994**; the Channel Zero explainer dates the scene to **1995**. Wikipedia (fetched 2026-09-09) also uses **1994**. Other public bios use either year. Treat the start year as publicly reported, **not settled**.
- The show documented Chicago hip-hop when the coasts dominated the narrative: Twista, Crucial Conflict, Da Brat, Common, and others appear in public accounts.
- Opening memory reported by Tudum: a blank yellow screen and a voice announcing “She watch Channel Zero!”
- The camera went to L trains, Blue Line tunnels, sidewalks, and backstage — informal access, not credentials.
- Tudum’s Channel Zero explainer recounts a **63rd & Cottage Grove** concert night: promoters cut the set; the group **Mad Infinite Styles (M.I.S.)** wait, then sit on the sidewalk in the cold and perform for the camera; a police car interrupts as an attendee is removed. Record as PUBLICLY REPORTED scene language. **Do not add M.I.S. as a product catalog entity** unless James approves.
- Chike, in Tudum: “When I see Coodie’s camera, it represents empathy.”
- Fake Shore Drive (14 Apr 2010) posted unreleased **New Jersey home-studio** footage “circa 2002,” attributed to **Danny Sorge**, as a Channel Zero episode. The same post names **Tittyhead Ted** alongside Sorge as operators of the show in the late ’90s / early ’00s. Record both as PUBLICLY REPORTED. **Do not add Tittyhead Ted, or a Rhymefest NJ studio card, to the product catalog** unless they already exist or James approves. Danny Sorge is already in the mock people table.

**OUR CREATIVE INFERENCE**

Channel Zero is the spiritual ancestor of this platform: television, presence, documentation before history is recognized. The digital descendant should feel like broadcast + archive + personality — not a fake-1990s theme park.

---

## Meeting, Through the Wire, and the long shoot

**PUBLICLY REPORTED INFORMATION**

- Coodie met Kanye West in Chicago in the late 1990s (**1998** appears often) and began filming him, inspired by Steve James’s *Hoop Dreams*. Newsweek (2022) instead dates the Channel Zero crossing to **2002**. Treat the meet year as publicly reported, **not settled**.
- Evening Standard (2022): Coodie names *Hoop Dreams* as the model — “I’m going to do a Hoop Dreams on Kanye.” James filmed Agee and Gates for “over 250 hours” in that account. Do not stamp the line on the homepage.
- Around 2000, Coodie has said he heard the beat that became Jay-Z’s “Izzo (H.O.V.A.)” and followed the story to New York.
- Coodie and Chike met through MTV’s *You Heard It First* / *You Hear It First*, where Chike was doing motion design / producing.
- Tudum: Chike — “The streets taught him how to film.” Coodie: he could not believe Chike **quit MTV** to work with him (“I’m over here eating oatmeal every day”).
- Their first video together was Kanye West’s “Through the Wire” (2003), made after hours at MTV. Coodie has publicly described a Polaroid idea and calling Chike with no money and a good idea.
- They later directed work including a **later / third** “Jesus Walks,” “Two Words,” Erykah Badu’s “Window Seat” (2010), Lupe Fiasco’s “Old School Love,” and many Creative Control–credited videos (Curren$y, Big K.R.I.T., Joey Bada$$, etc.).
- Longer films publicly associated with them include ESPN 30 for 30 *Benji* (2012), BET’s *Muhammad Ali: The People’s Champ*, *A Kid from Coney Island*, and *jeen-yuhs: A Kanye Trilogy* (2022).
- Other public works still thin in the mock until this pass: *Good Morning* (2013 short), Accel Origins (2017), plus Wikipedia-listed videos “Ghetto Rock” (Mos Def) and “Culo” (Pitbull) — documented below; Ghetto Rock / Culo stay **docs-only** (no product cards this pass).

**CONFIRMED FACT (public interviews, attributed)**

Coodie on why the company is named Creative Control, reported by Newsweek during the jeen-yuhs final-cut dispute:

> “You've got to realise too, our production company is called Creative Control and we have that for a reason… If you have any control over this, it loses its authenticity.”

That quote is about authorship of *jeen-yuhs* during a public final-cut dispute, not a slogan we should stamp on the prototype as marketing copy. Do not put it on the homepage.

**PUBLICLY REPORTED INFORMATION** (Tudum, 2022 — attributed)

Coodie on the work that led to *jeen-yuhs*:

> “We’re always saying that everything we did before this was a rehearsal… From Benji to A Kid from Coney Island, everything was leading to this moment.”

And:

> “jeen-yuhs is not really a documentary — it’s life and a movie.”

Same rule: attributed interview lines belong in research, not as product chrome.

**PUBLICLY REPORTED INFORMATION** (Variety, 2022 — attributed)

Chike: they do not want to call it a music doc. Coodie: “We don’t even want to call it a documentary… I’m narrating the whole film, so there’s no interviews. It’s all cinéma vérité footage.”

First assembly: **eight hours**, then cut toward two hours per film, then ~90 minutes per act with Netflix. Keep Rolling Stone’s **~9 hour** first-cut figure as a **second reported number**. Do not flatten 8 and ~9 into one fact.

**PUBLICLY REPORTED INFORMATION** (Evening Standard, 2022 — attributed; handle as reported speech)

Coodie says that after a six-year gap he emailed Ye footage of Donda, subject line reported as: **“Kanye, your mother wanted me to send you this.”** Record as REPORTED. Do not invent a fuller letter. Do not use it as UI copy.

---

## The footage, not a magic number

**PUBLICLY REPORTED INFORMATION** (do not flatten these into one number)

| Claim | Source class | Notes |
| --- | --- | --- |
| 330 hours of footage | Business Insider, Evening Standard, Rolling Stone, Variety | Repeated in 2022 jeen-yuhs press (Variety: “taking 330 hours… down to three feature-length”) |
| 267 hours of never-before-seen footage | Netflix Tudum | Different framing (never-before-seen vs total) |
| ~400 hours of original footage | IndieWire (2022); later interviews repeat “400 hours down to four” | Another reported starting pile — do not collapse into 330 or 267 |
| ~300 hours licensed | IndieWire quoting Time Studios’ Ian Orefice | A licensing figure, not a catalog size |
| Hundreds of hours | Tudum and others | Softer language |
| 21 years of filming | Coodie, Rolling Stone | Duration of the relationship to the camera, not hours |
| First assembly 8 hours | Variety (Coodie) | Then cut toward ~2h / film, then ~90 min / act |
| Cut from eight hours to four | Complex (2022) | Aligns with Variety’s 8h first assembly; do not flatten with ~9h |
| First cut ~9 hours | Rolling Stone Music Now | **Second reported assembly figure** — keep beside 8 hours; do not flatten |
| Shoeboxes + duffel bag of MiniDV | Business Insider; Hollywood Reporter | Physical provenance |
| Tapes brought to Time Studios, 2019 | Hollywood Reporter; IndieWire (conference room dump) | Institutional second life of the archive |
| Netflix acquisition reported at $30 million | Hollywood Reporter | Business context, not product copy |

Still **no primary Coodie statement** confirming **3,000 hours**. Official YouTube About, Substack, and the public Instagram captions reviewed 2026-09-09 also do not print a catalog size. Architecture may scale. The UI must never present 3,000 (or 330, 267, 400) as a verified catalog size. The YouTube videos-tab first-page badge **268** (same day, earlier pass) was **not** a catalog size — it was the first page, not the paginated set. Do not print 268 as fact.

**OUR CREATIVE INFERENCE**

A later public tease of a much larger online archive may exist; this session did **not** independently confirm a “~3,000 hours” figure from a primary Coodie statement. The parent brief treats ~3,000 hours as a **working assumption**. Architecture must scale. The UI must never present 3,000 — or any of the scatter figures above — as a verified catalog size.

---

## CreativeControl.tv, 2009

**PUBLICLY REPORTED INFORMATION / COMMUNITY INTERPRETATION**

Hypebeast (14 Nov 2009): launch slated for 27 Nov 2009 at CreativeControl.tv; early trailers included Mos Def, Edan, and Dan Auerbach.

Period blogs reprint launch language describing Creative Control as “the brainchild of Directors Coodie and Chike and media mogul Dame Dash,” an online media network of original web series and music, with *Sessions at DD172* as a candid exhibition of people passing through Dash’s space.

Fake Shore Drive (9 Mar 2010): Coodie called the pieces “music visuals”; the catalog already included Mos Def, Talib Kweli, Curren$y, The Cool Kids, The Black Keys. FSD also reported Coodie planned to return to Chicago and to unleash never-before-seen Channel Zero clips.

**OUR CREATIVE INFERENCE**

The 2009 site was already trying to be a network, discovery destination, and creative lab — not a portfolio. Seventeen years later, the question is what the archive of that practice feels like as a place.

---

## jeen-yuhs.com — inherit DNA, do not copy

**CONFIRMED FACT** (reachability, 2026-09-09 lineage — reference notes only)

`https://jeen-yuhs.com/` loaded once this pass as a JS page: title/heading **Jeen-Yuhs**, GTM `GTM-MLK5J6N`, **ENTER EMAIL**, Terms & Privacy. Almost no other text. Official YouTube `sameAs` still lists `http://www.creativectrl.tv`; when that host responded it showed the same email-gate chrome. Later requests 500/502. **Do not copy the site. Do not scrape assets. Do not rebuild the remote.**

**PUBLICLY REPORTED INFORMATION**

danferro.studio: Coodie and Chike asked for a launch campaign/site inspired by 21 years of documentation. The site behaved like 1990s television: mouse interaction and a phone-as-remote second screen. Credits: Dan Ferro (creative direction/design/animation), Cthdrl (agency/dev), IBRA BALOGUN (design).

WØRKS (film identity, not the site): viewfinder treatment on 4:3 MiniDV; light bleeding past the frame; custom imperfect type; hand-drawn asset library; intensity building from Act I white lines to Act III color, film burns, stop-motion. Made with Coodie and Chike over ~2 years.

Awwwards palette notes (secondary): black, white, and a red near `#D14836`.

**OUR CREATIVE INFERENCE**

If jeen-yuhs.com was one story encountered by moving around a television, the archive itself should feel like the place those stories were kept: index, geography, tapes, time, and broadcast — not another remote-control toy.

---

## Local reel: `creative control reel.mp4`

**CONFIRMED FACT** (file probe)

- Duration: 3:27
- Picture: 960×540, H.264, ~23.98 fps
- Audio: AAC stereo 48 kHz
- Container creation timestamp: 2025-08-26

**OUR CREATIVE INFERENCE** (from extracted frames; not a shot list)

The reel is a **Creative Control company reel**, not a Ye-only tape. Observed title cards and subjects include:

- Film-burn / light-leak passages (violet, magenta, white core, analog grain)
- *Muhammad Ali: The People’s Champ* — directed by Coodie & Chike
- *Kendall’s Cross* — serif + script over analog snow
- *A Kid from Coney Island* — marker title, basketball-as-O, nocturnal housing diorama
- Sports documentary collage language (including a Dereck Lively II card/montage)
- Contemporary architecture / courtyard aerials
- Picture-in-picture studio frames (city aerial + intimate interior)

Design takeaway: raw documentary frames + precise, project-specific typography. Each work gets its own title language. The platform should allow that, not flatten everything into one “archive card.”

Copyright: do not extract or redistribute reel footage into the product. Frames were used only for private visual study.

---

## Current public presence (2025–2026)

**PUBLICLY REPORTED INFORMATION**

A Substack, *CREATIVE CONTROl w/ COODIE & CHIKE*, published 2025 house programming. Treat titles and taglines as **PUBLICLY REPORTED house copy** (not interview slogans to stamp on `/`):

| When | What | Evidence |
| --- | --- | --- |
| 2025-04-20 | Ep. 1 “The Fight” — “How one fight defined our path.” | Substack |
| 2025-05-01 | Ep. 2 “Where the Money At?” — come-up directing music videos; teaser named Jesus Walks / budgets | Substack |
| 2025-05-08 | “The Vision Behind Window Seat” | Substack |
| 2025-05-15/17 | Ep. 3 “The Tornado” | Substack |
| 2025-05-16 | House line: “FROM MOVIE PITCHES TO HOW WE GOT OUR NAME CREATIVE CONTROL.” | Substack podcast index |

Instagram: `@officialcoodieandchike` and `@cozah` public grids reviewed 2026-09-09 (see socials above). `@coodierock` still thin. YouTube-listed `@creativecontroltv` is not available.

**PUBLICLY REPORTED INFORMATION** (Substack `/about`, 2026-09-09 refresh — house copy, not interview slogans)

The About page calls the Substack a **digital journal** and **behind-the-scenes archive**. It names stories they intend to tell (Jesus Walks, Window Seat, Dame Dash in an airport, sneaking into Busta concerts). Do not invent those scenes. Do not stamp the About pitch on `/`. Public index still ends with EP.3 “The Tornado” (16–17 May 2025) and the name-origin line. Ep.2 credits include **Kareem Johnson**. Full episodes sit behind a paywall.

**CONFIRMED FACT** (YouTube channel, 2026-09-09 — official pages + RSS; reconfirmed same day)

- Handle **`@cctelevisionchannel`**. Title **Creative Control**. Channel ID **`UCGOXZwQw4InmSTtxDmfZMpw`**.
- RSS author URI `https://www.youtube.com/channel/UCGOXZwQw4InmSTtxDmfZMpw`.
- About (lineage pass): **31.8K** subscribers; **10,992,706** views; **Joined Oct 22, 2009**; country **United States**. RSS channel `<published>` is **2009-10-23T06:08:22+00:00**. Treat Oct 22/23 as one official join, not two dates.
- Public playlists on this channel: **Creative Control TV**, **TEAR UP**, **BENT**, **Eckō Studio Sessions**.
- **366** uploads listed in `src/data/youtube.ts` from the official uploads playlist `UUGOXZwQw4InmSTtxDmfZMpw` + videos-tab pagination (`yt-dlp --flat-playlist --skip-download`, IDs/titles only) + channel RSS (15 newest exact dates) + house playlist membership where `channel_id` matches. **No Data API key.** Videos-tab badge **367**. Public listing **366**. The extra **1** is not on the public UU / videos listing (unlisted / private / count drift). Earlier same-day first-page badge **268** was not the paginated set — never print 268 as the catalog. Mid-day **35** was the first authored board, not the full public file.
- No Shorts tab. No Streams tab. RSS newest item still **2025-05-17** `nkqvZXkp07M`.
- Exact day from RSS / prior listing where we have it (26). Other years from official title year + reverse-chronological interpolation on the uploads playlist. Duration exists on the playlist listing; not stored; not scraped from watch pages.
- All **366** listed house uploads are now authored PUBLIC catalog clips (official titles only; no new people/projects). They read as **holdings** in the Index / timeline and as **BROADCAST year cassettes** on `/tapes` — not a card wall. CH 07 GUIDE is official playlist blocks plus **year books**, not a 366-line list. House playlist items from other channels stay unwired. Unlisted / private remain missing.
- Collections stay **editorial**. Classics is **19** house titles (Polaroid → Kendall's Cross), not the 366 official uploads. Studio Nights is **0** public frames. `/archive?collection=` matches that same public reel.
- Home/playlist also curates **other channels**: Through the Wire is **channelzerotv**; Two Words is **KanyeWestVEVO**; Joey Waves is **PRO ERA**. Not treated as CC Television uploads. Not attached to archive tapes.
- Official outbound links on About / JSON-LD `sameAs` (this pass): `http://www.creativectrl.tv`, `http://www.twitter.com/creativecntrl`, `http://instagram.com/creativecontroltv/`.
- *Who Is Ernie Barnes?* (Variety 10 Jul 2026) stays **docs only**. Do not invent a person, project, or tape.

**OUR CREATIVE INFERENCE** (mapping)

2016 Channel Zero uploads are public broadcasts of Channel Zero material — not the prototype 1990s cassettes. The 2025 Window Seat talk is about the video, not the 2010 walk. Basement October 2002 has no honest YouTube match. Official uploads are a published file, not an editorial story and not camera originals.

---

## Complex, February 2022 (new this pass)

**PUBLICLY REPORTED INFORMATION** (Lei Takanashi, Complex, 11 Feb 2022)

Do not add these names as product entities unless they already exist or James approves.

- Danny Sorge originally created Channel Zero; Coodie’s first time with a camera was filming a **fight** Sorge was afraid to shoot. Episode remembered as starting with the fight and ending with **The Last Poet**.
- Public accounts in that piece also name **Run DMC**, **Kobe Bryant**, **Abstract Mindstate**, **Cap.One**, **Mikkey Halsted**, barbershop **Mellow Swings**, and a Hawaiian Punch street-team job in New York with **J. Ivy** and **Olskool Ice Gre**.
- Coodie dates the *Hoop Dreams* approach to West to the **late ’90s**; he followed West to New York around **2001**.
- They met when Coodie brought footage for West’s early MTV **You Hear It First** appearance (**2002** in this account). Chike is described as having studied at **RISD and SCAD**. They did not work together until about a year later on “Through the Wire.”
- Time Studios pitch (2019): duffel of MiniDV on a New York table; first assembly **eight hours**, cut toward **four**.
- Coodie on the Donda footage he sent Ye (wording differs from Evening Standard): **“Your mother wanted me to send this to you.”** Record as REPORTED. Do not invent a fuller letter. Do not use as UI copy.

**CONFIRMED FACT / PUBLICLY REPORTED** (attributed in Complex — keep in research, not chrome)

Coodie on the first Channel Zero episode he cut:

> “Danny was a little afraid to film it, so I said ‘Man, give me your camera.’ When we put together that episode it started with a fight, but ended with The Last Poet talking about something positive.”

Chike on jeen-yuhs:

> “I always say that pretty much everything we’ve done to this point was a rehearsal for this film.”

Same rule as Tudum / Variety: attributed lines stay in docs.

---

## Public works still easy to miss

**PUBLICLY REPORTED INFORMATION** (Wikipedia synthesis; IMDb; Accel.com; IMVDb)

| Work | Year | Notes | Product this pass |
| --- | --- | --- | --- |
| “Jesus Walks” (third video) | 2004 | Wikipedia + later interviews (Coodie: they did the third after the first two). College Dropout era. | Prototype **Title** card `c-46` — no performance reconstruction |
| “Two Words” | 2004 | Wikipedia lists it with the Dropout videos. IMVDb also lists a 2009 date — treat year as reported, not settled. | Prototype **Title** card `c-47` |
| *Good Morning* | 2013 | Short; Creative Control; American Family Insurance writers competition; American Black Film Festival debut / first place in that account. IMDb lists Coodie, Chike, Margie Lopez. | Prototype **Title** card `c-48` |
| Accel Origins Series | 2017 | Four founder shorts (Lynda.com, Arista, Qualtrics, Cloudera). Accel.com posts dated 15 Apr 2017. | Prototype **Title** card `c-49` — do not invent interview lines |
| “Ghetto Rock” (Mos Def / Yasiin) | ~2004 | Wikipedia videography. | **Docs only** — no catalog person/show invention |
| “Culo” (Pitbull) | ~2004 | Wikipedia videography. | **Docs only** |
| “Slow Jamz” | ~2003–04 | Wikipedia career section says they later directed it. No footnote on that sentence. | **Docs only** — do not invent a card |
| *Who Is Ernie Barnes?* | announced 2026 | Variety 10 Jul 2026 exclusive; official duo IG same day. Immersive three-act; Super Bowl LXI / Chicago / New York / LA28 named as the tour plan. | **Docs only** — do not invent a person, project, or tape |

Visibility on the new cards is PUBLIC metadata for known public works, rights `MUSIC_PENDING` or `UNCLEAR`. Not footage.

---

## Prototype transcripts (2026-09-09)

**OUR CREATIVE INFERENCE**

A few authored clips now carry structured `Transcript` / `TranscriptSegment` rows so search-over-speech has a place to land. The lines are **prototype editorial inference** — room tone, tape leftover, a remembered call as a situation. They are **not** recovered audio, **not** YouTube auto-captions, and **not** Coodie or Ye quotations.

Speakers are roles (`ROOM`, `CAMERA`, `TAPE`, `LINE`), not attributed names. The dossier labels the block `PROTOTYPE TRANSCRIPT · EDITORIAL INFERENCE · NOT A RECORDING`.

Unique mock lines exist only so archive `q` can prove a hit (`a radiator knocks twice then goes quiet`, `the hallway clock is the only thing talking`, `the yellow holds after the checker`, `never-aired snow under a streetlight`). Do not promote those sentences as fact.

YouTube watch-page transcripts were **not** used (see sources table above). No scrape. No caption dump.

---

## Official socials and brand domains (2026-09-09 lineage)

**CONFIRMED FACT** (YouTube About / JSON-LD, 2026-09-09)

The official channel lists three outbound identities besides YouTube itself: **`creativectrl.tv`**, **X `@creativecntrl`**, **Instagram `@creativecontroltv`**.

**CONFIRMED FACT** (public pages, 2026-09-09)

- **`creativecontrol.tv`**: still the Framer reel splash. Not a catalog.
- **`creativectrl.tv`**: official YouTube link. When it loaded this session it was the jeen-yuhs.com email-gate (same GTM, ENTER EMAIL, Terms / Privacy). Later 500/502. **Do not copy. Do not treat as IA to inherit.**
- **X `@creativecntrl`**: official listing only. Posts unread (403 / auth / captcha).
- **IG `@creativecontroltv`**: official listing; public profile unavailable.
- **IG `@officialcoodieandchike`**: live duo grid. Link-in-bio = Variety Barnes exclusive. No hour-count on the public captions reviewed.
- **IG `@cozah`**: verified Chike. Personal. Shares the Barnes post.
- **IG `@coodierock`**: named as Coodie’s Instagram. Grid not fully readable this pass.

**OUR CREATIVE INFERENCE**

Three public web faces now sit side by side: the Framer reel (`creativecontrol.tv`), the jeen-yuhs email-gate (`creativectrl.tv` / `jeen-yuhs.com` when up), and this archive prototype. That does not tell us which surface the house wants as the public face. James still has to ask.

---

## Variety, 10 July 2026 — *Who Is Ernie Barnes?*

**PUBLICLY REPORTED INFORMATION** (Jazz Tangcay, Variety, 10 Jul 2026)

Do **not** add Ernie Barnes, Deon Cole, Luz Rodriguez, or a Barnes project card to the product catalog unless they already exist or James approves.

Variety reports Coodie & Chike are making *Who Is Ernie Barnes?*, drawing on Barnes’ own words, rare archival footage, and commentary from art, music, sports, dance, and entertainment. The piece describes a **three-act immersive**: guests watch one segment in a purpose-built “theater,” then move into curated rooms, then repeat. Screening was slated to start later that month (July 2026). The show is scheduled to debut the following year in Los Angeles during **Super Bowl LXI**, then Chicago and New York, then return for the **LA28** Summer Olympics.

Barnes is reported as the first American professional athlete to win major recognition as a visual artist; NFL seasons with the New York Titans, San Diego Chargers, and Denver Broncos; *Sugar Shack* sold for over $22 million in that account.

**PUBLICLY REPORTED INFORMATION** (attributed in Variety — keep in research, not chrome)

Coodie:

> “You can’t let your imagination get in the way of God’s manifestation.”

> “I dreamed of having Ernie Barnes paintings on my walls, and then I looked up and I was documenting his artistic process in real life.”

Chike:

> “I remember looking at his work as a kid and feeling something I’d never felt before — like I had to chase that. His art set the bar for what I thought was possible. In a lot of ways, I’ve been chasing Ernie Barnes my whole life. Telling his story now feels like a full circle.”

Luz Rodriguez (Barnes’ longtime assistant / estate managing director), as quoted by Variety:

> “This film shows a glimpse of Ernie Barnes’ dedication and his remarkable journey, answering why he is the most interesting and inspirational artist of the 20th century.”

**PUBLICLY REPORTED INFORMATION** (official duo Instagram, 10 Jul 2026 — house copy, not a slogan for `/`)

Caption on `officialcoodieandchike/p/Dan5kvbkdh5` (text only; no media saved): honored that Variety featured *Who Is Ernie Barnes?*; “more than a documentary—it's an immersive journey”; “we're just getting started.” Tags include `@coodierock`, `@cozah`, `@deoncole`, `@citizenchance`, `@erniebarnesofficial`, and crew handles. Do not invent those people as catalog entities.

---

## Sway In The Morning, 7 August 2025

**PUBLICLY REPORTED INFORMATION** (Sway’s Universe / open.video page dated 7 Aug 2025; third-party auto-transcript)

Coodie appeared on Sway In The Morning. The official Sway YouTube watch URL was not confirmed this pass. The open.video auto-caption is garbled (names, titles, “Genius” for jeen-yuhs). **Do not invent a cleaned Coodie quote. Do not stamp caption lines on the product.**

Caption-quality gist, not a verified transcript:

- Coodie names Instagram as **Coodie Rock** and Creative Control as **Creative Control**.
- He says they are about to put **CreativeControl.tv** back out — the 2009–2012 network they had with Dame — and to relaunch it **not with Dame**.
- He gives a **2026 premiere** goal for the Ernie Barnes film and says the cut is pretty much finished, with more interviews still going in. Variety’s later exclusive (July 2026) is the better-dated public announcement; keep Sway’s “premiere 2026” beside Variety’s immersive / Super Bowl LXI tour plan. Do not flatten them.
- Hosts mention Cannes and a Deon Cole producing relationship. Treat those as caption-quality unless a print source repeats them. Official IG later tags `@deoncole` on the Barnes post.

This is the first public statement this project has that the house intends to **relaunch CreativeControl.tv**. It does not say the live Framer splash *is* that relaunch. It does not give an hour-count.

---

## Wikipedia full page (2026-09-09)

**PUBLICLY REPORTED INFORMATION / COMMUNITY INTERPRETATION** (en.wikipedia.org/wiki/Coodie_&_Chike, raw fetch 2026-09-09)

Prior sessions timed out or 404’d. The article exists. It still carries `{{More footnotes|date=October 2014}}`. Use it as a secondary checklist, not a primary.

New or newly confirmed-from-this-page items (docs only unless already in the catalog):

- Infobox: Coodie born **Clarence Ivy Simmons Jr.**, 18 Jan 1971, Chicago. Chike born 6 Apr 1978, New Orleans.
- Channel Zero: Wikipedia dates the co-founding with Danny Sorge to **1994**. Still not settled vs Tudum’s 1995 explainer.
- First Ye filming: Wikipedia **1998**. Still not settled vs Newsweek 2002.
- Career section also lists a **“Slow Jamz”** video, Christina Aguilera *Back to Basics* bonus BTS, and a Wale *The Gifted* music documentary. **Slow Jamz has no footnote on that sentence.** Do not invent cards.
- Personal: “Currently, Coodie & Chike live in New York” — likely stale next to later public New Orleans notes for Chike. Do not put a home city on a person file from this line.

No 3,000-hour figure. No CreativeControl.tv relaunch. No Ernie Barnes entry on the page as fetched.

---

## Other interviews since the last RESEARCH entries

**PUBLICLY REPORTED INFORMATION**

- **BWNC / Black With No Cream** (Castbox **14 Jul 2024**; show-notes page “Jul 6”). Host Ben Hagarty. Public page is a bio blurb only — philosophy, ownership, trust, music-video-to-doc path. No transcript. Description lists Instagram `@coodierock`, `@cozah`, `@officialcoodieandchike`.
- **Overshare** (Justin Gignac; Coney Island–era). Same three Instagram handles in show notes. Not new.
- **NYT Styles, 18 Apr 2025** (Kellie Brown / Chike Ozah wedding). Linked from `@cozah`. Personal; not an archive interview. Fetch timed out this pass. Do not use as product copy.
- No new official Substack episode after **17 May 2025**.

---

## What this means for the prototype

**OUR CREATIVE INFERENCE**

1. The archive is broader than *jeen-yuhs*. Channel Zero, music visuals, sports films, Ali, Brooklyn, Chicago, DD172, and future work all belong in the model.
2. Physical tapes (MiniDV in shoeboxes) are part of the myth and the IA. `/tapes` is not decoration.
3. Empathy and presence are the camera’s ethic. Interfaces should feel held, not scraped.
4. After jeen-yuhs.com: less “control the TV,” more “enter the vault / the network / the map / the years.”
5. Volume must be felt through density of records, not a hero statistic. Mute remainder and year books hold scale. Do not print 3,000 hours. Do not print 268 as the catalog.
