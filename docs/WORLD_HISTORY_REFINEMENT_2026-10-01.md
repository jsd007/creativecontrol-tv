# World and history refinement, October 1

## Working-pass status

This document describes the review pass on `codex/world-history-refinement`. It is not a production release record. The pass has not been promoted to production; deployment evidence belongs in the pull request before the main production link is shared as this version.

Local preview: [World](http://localhost:3261/world), [Index](http://localhost:3261/archive), [Timeline year example](http://localhost:3261/timeline?year=2012).

## What changed

- **World:** The globe stays the primary experience. Natural Earth's public-domain 1:50m coastlines, inland lakes, and rivers replace the approximate softened geography. A subtle geographic grid, restrained atmosphere, star drift, and catalog-location lights add detail without pretending to be satellite imagery or population data. Ambient animation has a pause control and respects reduced motion. The same geographic data supports the WebGL fallback. See [Earth data and preparation](EARTH_DATA.md).
- **Timeline:** A year now opens into up to six varied records rather than a stack of month/day rails and an entire holdings dump. Public videos use source thumbnails. Month and day refinement lists only populated dates; the full period index is collapsed and reveals 12 records at a time. Labels distinguish upload dates, project years, and illustrative example dates. Upload dates are not filming dates.
- **Return paths:** World, Index, Tapes, and Timeline can open a record and return to their selected query or source context. Related records and source-file links retain that origin. Return URLs are restricted to recognized local lenses. This preserves browsing context, not playback position or a saved account history.
- **Index:** An unfiltered index groups records into collapsible years and adds a six-project portfolio shelf. Search and filters still reach the full listing. The entrance remains unchanged.
- **Source honesty:** Publisher names, project credits, source links, and public-source labels distinguish playable public media from project references and placeholder studies. No private source cassette is invented for the new external publisher records. Illustrative source files now explicitly identify their labels, dates, durations, and inventory as concept data.
- **Navigation reliability:** Animated route changes use the existing film-cut overlay against the live page. Native snapshot transitions were removed after reproducing dropped rapid return clicks. The latest queued destination is retained and navigation waits settle safely.

## Portfolio breadth

The shelf includes five playable public sources and one non-playable project reference. Two existing records were promoted or corrected rather than duplicated.

| Project | Coodie & Chike's role | Material in the proof |
| --- | --- | --- |
| Benji | Directors | Existing Creative Control trailer, now highlighted; 2012 film |
| Katrina Babies | Executive producers for Creative Control; Edward Buckles Jr. directed | HBO trailer; 2022 film |
| A Kid from Coney Island | Directors | Boardroom trailer uploaded in 2020; film premiered in 2019 |
| Meal Ticket | Executive producers; Creative Control production credit. Carlton Gerard Sabbs and Corey Colvin directed | Sports On Prime trailer; 2026 film |
| Old School Love | Directors | Lupe Fiasco's official video featuring Ed Sheeran; corrected to 2013 |
| Who Is Ernie Barnes? | Directors | Official project information only; announced in 2026, no player |

Primary evidence and date distinctions are recorded in [Creative Control history](CREATIVE_CONTROL_HISTORY.md). These publisher sources do not increase the independently listed 366-upload CC Television catalog.

## Known limits

- Actual private archive inventory, dates, locations, camera credits, rights, and editorial permissions remain unconfirmed. Public embeds do not establish clearance.
- **Who Is Ernie Barnes?** is a project reference, not playable footage or a confirmed general-release date.
- Unknown runtimes stay unknown. No new footage was ingested, downloaded, or rehosted.
- Some older catalog relationships and people/place metadata are inferred. Placeholder tapes, transcripts, dates, and statuses remain demonstration data.
- The globe is a geographic browsing interface, not a reconstruction of travel routes or shoot locations. Ambient lights identify catalog locations.
- This is still a proof of concept, not a complete accessibility, device, slow-network, ingest, or preservation system.

## Verification

- `node --experimental-strip-types --test tests/*.test.mjs`: all 24 tests pass, covering catalog provenance, cross-lens returns, and TV navigation.
- `npm run lint`: no warnings or errors. `npm run build`: types, lint, and all 666 generated pages pass. `git diff --check` passes.
- Production-build browser review: detailed desktop globe, pause/resume ambience, selected place and story return, filtered Index return including an immediate mouse click, timeline date context, source scope/search/selection return, five-title Projects & Films TV block, and the non-playable Ernie Barnes project page.
- HBO's Katrina Babies trailer played in its embedded YouTube player. The other new publisher embeds were not separately playback-tested in this pass.
- At 390 × 844, World, Index, and the selected-year timeline have no horizontal page overflow. The globe remains 3D and timeline selectors share one compact row. The temporary viewport override was reset.
- React review checked query-owned selection, event-listener cleanup, safe local return URLs, and optional cassette animation targets.
- This is not a full accessibility or device matrix. Reduced-motion and WebGL fallback behavior were inspected in code, not separately exercised through browser emulation; touch dragging and slow-network behavior still need device checks.

Updated, visually reviewed screenshots: [attachment guide](coodie-share/2026-10-01/world-history/README.md).

## Next steps

1. Review the branch preview, then approve promotion to main/production. Confirm the live link before sending an update; do not present a protected preview URL as a public share link.
2. Complete physical-device touch, reduced-motion, WebGL fallback, and slow-network checks. Prioritize the globe's loading feedback and graphics cost: the current World route is about 695 kB first-load JavaScript, including its 3D stack and geographic data.
3. Ask Coodie's team for a small approved sample with actual titles, dates, people, places, provenance, and rights decisions. Replace the strongest placeholder demonstrations first.
4. Review inferred metadata and editorial groupings with the team. Give sparse TV channels distinct approved material instead of padding the guide with invented footage.
5. Once the sample is agreed, plan ingest, storage, transcription, rights review, and preservation. Keep those systems separate from this presentation proof.
