# Presentation — James → Coodie

Operational. Not a pitch. Desktop. SOUND stays **OFF**.

The seven scenes walk the north-star answer: one archive, many lenses — after jeen-yuhs.com, the place the stories were kept. The written answer is `docs/NORTH_STAR.md`. Surfaces: `docs/CONCEPTS.md`.

## Share

Show URL (send this to Coodie): [https://creativecontrol-tv.vercel.app/?present=1](https://creativecontrol-tv.vercel.app/?present=1)

Hobby project `creativecontrol-tv` on James’s Vercel team. Vercel Authentication is **off** for this project only. No share token. No Vercel login. No domain buy. The local reel was not uploaded.

### Paste to Coodie

```
Desktop:

https://creativecontrol-tv.vercel.app/?present=1

It's an archive — not the reel on the live site. The door is their YouTube mark, not a logo we drew. Hit Space to walk it. SOUND is off. The frames say PROTOTYPE MEDIA. They aren't the tapes. One hop is the official channel on air — still not the vault.

I won't put a number on the hours. That's yours.

James
```

### Room card

James, in the room. The paste above is what Coodie already has. Desktop. Space. Not a pitch. Goal is not complete.

```
Desktop. Click NEXT or use Space.

https://creativecontrol-tv.vercel.app/?present=1

This is a prototype of the archive itself — not the Framer reel on the live site, not jeen-yuhs.com.

SOUND stays OFF.
The frames say PROTOTYPE MEDIA. They aren't the tapes.
Official air is scene 5 (CH 07). Still not the vault.

I won't print hours. I won't say this vault is finished.

Ask him — don't guess:
catalog size, and what it includes
Channel Zero year — 1994 or 1995
first Ye day — 1998 or Newsweek 2002
naming — Ghetto Rock / Culo / Ted / M.I.S.
tape labels — 5–10 real ones, or a redacted shot-log. No media.
show names we can use
what's public vs never shown
footage or stills we may use

Seven scenes: door → Earth → Chicago → combo 1 → official air → CC-0217 → span
```

Stills to attach: `docs/coodie-proof/` (README + twelve desktop PNGs from live Vercel). How to send and the ask-him list live in that README. Goal is not complete.

Inspect: [deployment](https://vercel.com/james-dombros-projects/creativecontrol-tv/2miTkGLvsuQz3VZjSLH5ZjM2WREd).

The polished share path is intentionally shorter than the first prototype. It removes the empty leftover frame, the redundant person-filter pass, and the duplicate Studio channel from the presentation while leaving those routes available to explore afterward. Combo Ye + Chicago + 2002 + Studio is **1 RECORD** (Basement, October 2002 · MEMBERS ONLY). CH 07 is the one TV proof in the walk: ident first, then the programmed official network, PLAY · MUTED. Archive goal is not complete.

## Start locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000/?present=1](http://localhost:3000/?present=1).

In development only: four openings on `/` (ARCHIVE / HISTORY / DOCUMENT / SPAN). The show still starts on default ARCHIVE `/` — same as live `/?present=1`.

The first URL sets the show. After that, hops stay clean. A small desktop controller names the current scene and supports BACK / NEXT / EXPLORE. DISCOVER is hidden while showing.

## Keys

| | |
| --- | --- |
| Space / `.` / `n` | Next beat |
| `,` / `p` | Back |
| `x` or Shift+Escape | Leave the show |
| Escape | Closes a tape. Does **not** exit. |

Do not type in a field and hit Space — Space stays in the field. Space or Enter on a focused door, rail, or SOUND stays with that control. Space on SOUND toggles and does not hop. Tab order is skip → mark → rails → DISCOVER → SOUND → the room. Show marks stay desktop only; the mobile dock is house chrome, not a beat.

## Seven scenes

Same catalog. No slides. One argument, not a feature tour:

The house has a door. The archive sits on Earth. The city is Chicago. Ask Ye + Chicago + 2002 + Studio and the index returns one. Creative Control broadcasts. The record has a physical source: CC-0217. The span is the timeline.

1. Threshold `/` — the door
2. World — Earth at archive scale
3. Chicago (fly-to) — the city named in the interface
4. Index — Ye + Chicago + 2002 + Studio (**1** record), with refinement controls out of the way
5. Television — CH 07 ident (`/tv?ch=7`), then the programmed official network, PLAY · MUTED
6. Tape CC-0217 in the aisle (`/tapes?open=t-0217`)
7. Timeline — the complete 1994–2026 span

Cross-lens hops are the house Cut. Chicago fly and the CC-0217 camera keep their own motion. Space during a Cut takes the next scene when the gate opens — it does not drop.

ENTER on the threshold advances. After the last beat, stay put — do not invent an eighth.

## Beside the show (not in it)

- **SOUND** — leave OFF. House textures only if someone turns it on (threshold / acquire / cut / tape). No WAVs on disk; procedural fallback. No licensed music. No voice.
- **Mobile dock** — DISCOVER + SOUND + five lenses below `md`. Not in the show.
- **DISCOVER** (`d`) — after you exit. Public doors only. Hidden during the show.
- **CH 07 GUIDE** — after you exit the show. Official blocks and year books (fat years nest A–Z), not a 366-line list. Not a YouTube tour. Scene 5 already signed on ident first.
- **CONSTELLATION** — from a person / place / project page (`THE FIELD`). A few true spokes. Not on the lens rail. Not a show beat.

## Do not claim

- Any hour-count (not 3,000; not 330; not 268). We do not have a primary figure. 268 was a YouTube first-page badge, not the catalog.
- Invented quotes, invented CC Television show titles, invented shot-log chapters.
- Prototype frames as real footage. Stamp says PROTOTYPE MEDIA. Broadcast stamps say PUBLIC BROADCAST and play YouTube’s player — still not the vault tapes.
- Ghetto Rock / Culo / Tittyhead Ted / M.I.S. as product names. *Who Is Ernie Barnes?* stays out of the product.
- UNLOGGED as a program title. TV airs authored PUBLIC only.

If asked “how many hours?” — say we are waiting on Coodie.

## Ask Coodie

Short. Do not guess the answers in the room.

- What is the official catalog size, and what does it include (Ye, Channel Zero, house, sports, everything)?
- Channel Zero start: 1994 or 1995? First Ye day: 1998 or Newsweek 2002?
- May Ghetto Rock / Culo / Ted / M.I.S. be named in the product?
- A redacted shot-log or 5–10 real tape labels (no media).
- Real CC Television programming language / show names we may use.
- What can be public vs never shown.

Full list: `docs/RESEARCH_NEEDED.md`.
