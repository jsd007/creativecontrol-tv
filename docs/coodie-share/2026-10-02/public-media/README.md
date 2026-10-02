# Public media proof, 2 October 2026

Screenshots from the local production build on port 3261. These show official public publisher references, not authenticated private archive tapes.

- `01-studio.jpg`: eight real Studio programs, opening with Netflix's Jamie Foxx session excerpt.
- `02-origins.jpg`: six real early-work and documentary selections, opening with Through the Wire.
- `03-timeline.jpg`: the 2004 year, with the music-video year and documentary footage year distinguished from later uploads.
- `04-studio-phone.jpg`: Studio at 390 × 844, with readable controls and guide.
- `05-world-dallas.jpg`: the globe connects Dallas to the actual Window Seat music video; no filler private footage.
- `06-index.jpg`: refreshed entry records alongside the existing portfolio shelf.

## Verification

- 30 tests passed, including unique IDs, saved replacement URLs, all eight themed channel selections, collection discovery, date provenance, and transcript suppression.
- TypeScript and ESLint passed; Next production build generated 678 pages successfully.
- All 11 new/replacement YouTube embeds showed active playback in the browser. This confirms this browser/session, not future availability or every region.
- TV detail/return navigation preserved the Origins selection. Mobile next-program navigation moved from Jamie Foxx to Teyana Taylor while staying in Studio.
- At 390px, the mobile document did not horizontally overflow and no loaded image was broken.
- The tuner selection marker is attached to its selected button; a resize observer keeps that channel in view rather than leaving a floating underline beneath another channel.
- Timeline 2004 header and full index both showed two named records; no fictional month was assigned to either real source.
- Index search for Teyana resolved the real 2017 footage record.

The complete source manifest and remaining Twista/Common/Ali follow-up are in `docs/PUBLIC_MEDIA_REPLACEMENTS_2026-10-02.md`. Remaining physical-tape examples still need actual owner-supplied inventory and footage before they can become real holdings.
