# Mobile layout audit

Verdict: **responsive, not fully mobile-optimized**. The main screens reflow and primary actions work, but several controls and browsing flows still feel desktop-first. This screenshot-led audit did not change those broader layouts.

Scope: current local production build; 390 × 844 phone-sized viewport and 768 × 1024 narrow-tablet viewport in the Codex in-app browser. Client widths were 382px and 760px after scrollbar space. This is not a physical-device, Safari, screen-reader, network, or performance certification.

## 1. TV: usable, secondary controls need polish

Playback intent, native mute synchronization, channel switching, and journey/next controls work. Player comes before the guide, and the phone layout does not overflow. The horizontal tuner and story strip show only part of their choices; small action text and 12–13px inputs/selects still need a touch/readability pass. The blocked-playback retry was made compact with a 44px target as part of the playback change.

![Phone TV](/Users/jamesdombro/Documents/Cursor/CreativeControl.tv/docs/mobile-audit/2026-10-02/01-tv.jpg)

## 2. World: good visual fit, gesture risk

The globe fits the screen and selecting Dallas updates the heading and connected records. No page-width overflow was measured. Secondary globe controls are small. Source review confirms OrbitControls owns one-finger drag, so scrolling from inside the globe can compete with rotation; a real touch-device check is still needed. Consider an explicit Rotate mode and a larger time-slider hit area.

![Phone World](/Users/jamesdombro/Documents/Cursor/CreativeControl.tv/docs/mobile-audit/2026-10-02/02-world.jpg)

## 3. Index: good phone reflow, too much browsing depth

Search works and results stack on phones without width overflow. The opening six records are clear, but the portfolio and year sections put substantial scrolling between entry and deep browsing. Give search/filter/results a more compact hierarchy and expand title-link hit areas.

![Phone Index](/Users/jamesdombro/Documents/Cursor/CreativeControl.tv/docs/mobile-audit/2026-10-02/03-index.jpg)

## 4. Tapes: weakest mobile flow

Filtering to Digital & Phone updates the selected file and inventory. No page-width overflow was measured, but the source selector started 1331px below the page top, after the long selected-file panel. The small cassette illustration also shows crowded/cropped type. Put a compact source picker above the selected file, simplify the illustration, and provide a clearer focus handoff after selection.

![Phone Tapes](/Users/jamesdombro/Documents/Cursor/CreativeControl.tv/docs/mobile-audit/2026-10-02/04-tapes.jpg)

## 5. Timeline: functional, dense secondary navigation

The overview fits the phone width and Jump to a Year opens the selected year. The public-moment strip has an explicit scroll cue. Small through-line controls, metadata, and 13px selects need larger touch areas and type. Keep year navigation prominent when browsing a long year.

![Phone Timeline](/Users/jamesdombro/Documents/Cursor/CreativeControl.tv/docs/mobile-audit/2026-10-02/05-timeline.jpg)

## 6. Narrow-tablet Index: confirmed overflow, fix first

The seven-column table activates too early. At the tested viewport the page's scroll width was **980px against a 760px client width**; people/status columns extend off the right edge. Keep stacked rows until there is enough room for the table, or collapse nonessential columns.

![Tablet Index overflow](/Users/jamesdombro/Documents/Cursor/CreativeControl.tv/docs/mobile-audit/2026-10-02/06-index-tablet.jpg)

## Next pass

1. Fix the Index tablet breakpoint and Tapes selector order.
2. Standardize secondary controls to generous hit areas and phone inputs/selects to 16px.
3. Separate globe rotation from page scrolling; verify on real iOS Safari and Android Chrome, including orientation changes and browser-blocked audio.
4. Check small widths, landscape, text zoom, focus order, and reduced motion. Measure globe loading/frame rate on an actual lower-powered device before calling performance optimized.

Existing strengths: responsive single-column layouts, explicit public/example labels, safe-area bottom navigation, and bottom content clearance. Contrast, full keyboard/screen-reader behavior, and WCAG compliance were not comprehensively tested in this pass.
