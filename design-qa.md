# Design QA: archive lens refinement

final result: passed

## Comparison target and evidence

- Source visual truth: `/Users/jamesdombro/.codex/generated_images/01a08922-c227-7bb2-8e73-fd8c2dc28007/exec-cf6e2ee1-cc50-4b76-b6f9-021e80855b5f.png` (option 1, World).
- Implementation: `http://localhost:3261/world`, Chicago selected, records through 2026. Raw browser capture: `/private/tmp/creativecontrol-ux-qa/world-desktop-final.png`; normalized capture: `/private/tmp/creativecontrol-ux-qa/world-desktop-normalized.png`.
- Full-view comparison: [World side by side](docs/design-qa/world-comparison.webp).
- Focused records comparison: [Right-hand records side by side](docs/design-qa/world-records-comparison.webp).
- CSS viewport: 1440 × 1024; browser device scale factor reported as 1.2. Source raster: 1487 × 1058. Browser raster: 1440 × 1024, with a 1200 × 853 rendered-content region due to the in-app capture scaling. Both content regions were normalized to 1440 × 1024 before the side-by-side comparison. The right-rail comparison uses the same 420 × 840 crop at x=1010, y=40 from those normalized images.
- Additional implementation captures: `/private/tmp/creativecontrol-ux-qa/{archive,tv,tapes,timeline}-desktop-final.png` and `/private/tmp/creativecontrol-ux-qa/{world,archive,tv,tapes,timeline}-mobile-final.png`. Mobile CSS viewport: 390 × 844. These four other lenses had no selected source mock; they were checked for hierarchy, honesty, usability, and responsive integrity, not pixel fidelity to the World mock.

## Findings

No actionable P0, P1, or P2 difference remains in the selected World state. The three-column composition, large globe, legible place selection, selected-place action, and six connected records reproduce the chosen concept's hierarchy. On mobile, the columns become place controls, map, then records without horizontal overflow.

Intentional difference: the mock used invented, cohesive sepia scenes and titles. The implementation shows real public-source thumbnails where available, keeps the catalog's source wording, and stamps concept-only entries `EXAMPLE ENTRY`. This is less tonally uniform, but it avoids representing fictional footage as Coodie's archive. The catalog retains verbatim upload titles; two unusually long ones receive shorter screen labels.

Required fidelity surfaces:

- Typography: existing Instrument Serif, Barlow Condensed, IBM Plex Sans, and IBM Plex Mono maintain the project's editorial hierarchy. The six-story rail is readable at desktop and long source titles wrap; shorter screen labels remove the worst wrapping.
- Spacing and layout: left place rail, central globe, and right record rail follow the source's proportions. The globe is slightly larger and lower than the mock, but its controls and records remain visible. The mobile grid uses `minmax(0, 1fr)` to prevent track overflow.
- Color and tokens: near-black base, warm cream type, restrained brass highlights, and fine dividers are consistent with the source and existing product.
- Image quality and assets: the globe is the existing live WebGL asset, not a static imitation. Public records use their YouTube thumbnails; the one illustrative Chicago record uses the project's existing prototype treatment and is labeled. Final thumbnail art and archive footage require Coodie's approved media.
- Copy and content: the copy says what each lens does, labels concept material, and never claims that illustrative tapes or frames are cleared archival footage.

## Comparison history

1. The first desktop World capture showed a cropped globe and a weaker relationship between location and record list. Camera radius and the three-column composition were adjusted; the final full-view comparison above shows the globe fitting the stage with six records visible.
2. The first mobile World pass let the map grid's intrinsic width exceed its viewport. The grid tracks and stage min-width were corrected; the final mobile pass measured 390 CSS px viewport and 382 CSS px document width.
3. The first focused record comparison showed two raw public upload titles dominating their rows. Display-only title shortening was added for the NYC CMJ and *Benji* entries; the final focused comparison above shows the revised wrapping while preserving the original catalog data.
4. The first mobile Timeline capture had adjacent long moment titles colliding. Its <=600px moment list became one column; the final mobile capture has separate, readable rows.

## Interaction and technical checks

- World city selection updates the map, action, and six related records; the place list includes all available locations behind `MORE PLACES`.
- Index search resolved Chicago to 21 filtered records. TV channel switching and search returned the expected single Wiki result from 366 broadcast titles. Tape selection updated the URL and scrolled the selected file into view; type and place filters worked. Timeline moment selection opened its year and related public holdings.
- All five mobile lens routes measured no horizontal document overflow at the 390px CSS viewport. Browser console error check returned no errors after the final capture.
- `tsc --noEmit`, changed-file ESLint, and `npm run build` passed. The build reports one pre-existing `<img>` lint warning in `BroadcastPlayer.tsx`, outside this change.

## Follow-up polish

- [P3] Replace or supplement the concept tape labels and remaining prototype fields only when actual inventory, metadata, and media are approved.
- [P3] Consider color-grading or a consistent thumbnail treatment for public uploads once permission and a visual direction are agreed; retain source attribution.
- [P3] Validate the World globe and TV playback on a second physical phone and lower-power laptop before a wider release.
