# Work, process, and viewing journeys

## What this pass adds

1. **The Work / The Process:** Window Seat and the filmmakers' explanation; Jesus Walks Part 3 and its making-of footage; the jeen-yuhs trailer with public studio and video-set excerpts. These are independently sourced public videos, not invented private holdings or full documentary access.
2. **Short viewing journeys in TV:** Making of Homecoming (3 numbered parts), Before the debut (3 interviews/style pieces), and Creative encounters (4 separate recordings). Journey links preserve the selected part through clip details. Previous/next and the guide use the same editorial order. Search, channel changes, or choosing a program block leave the journey. Playback remains click-to-start.
3. **Clickable credits and Made By:** Explicit credit identities lead to filmographies with role filters. Camera, editing, direction, commentary, and executive production are kept distinct from on-screen appearances. Coodie, Chike, and Danny Sorge have substantial public selections; J. Ivy currently has one specifically supported camera credit.
4. **12 curated Channel Zero additions:** Approximately 78 minutes of public embeds, including Homecoming, Cam'ron, Ma$e, Chicago Hip Hop 101, Jesus Walks, Slow Jamz, Nipsey/Curren$y/Wiz, Jamie Foxx/Angie Stone, and Culo. The total playable catalog is now 393 unique YouTube videos. This is an editorial selection of strong starting points, not a claimed all-time view-count ranking.

## Demo paths

Use these paths on the latest preview deployment. Production has not been promoted by this pass.

- `/tv?ch=07&journey=homecoming`
- `/tv?ch=07&journey=early-chicago`
- `/tv?ch=07&journey=studio-connections`
- `/tv?ch=07&clip=window-seat-one-take&block=__all__`
- `/clip/channel-zero-jesus-walks-making`
- `/people/chike-ozah#made-by`
- `/people/coodie-simmons#made-by`
- `/people/danny-sorge?role=camera-and-editing#made-by`

The new journey and work/process controls are hidden in the existing presentation-only mode. Share normal demo links without `present=1` to let someone explore them.

## Content integrity

- Channel Zero source links and date/credit notes are in [CHANNEL_ZERO_SOURCES_2026-10-02.md](CHANNEL_ZERO_SOURCES_2026-10-02.md).
- Publication dates do not become filming dates. Matching upload dates no longer create a false "same filming day" relationship.
- Homecoming follows the publisher's part numbers, not upload-date order.
- Slow Jamz is making-of footage for an unreleased version, not a substitute for the finished commercial video.
- Rights remain `UNCLEAR`. A public embed does not establish archive ownership or permission to redistribute the original media.
- No camera-original tape IDs, transcripts, chapters, or in-video timestamps were fabricated.
- House Picks is explicitly our editorial curation, not a claimed endorsement by Coodie.
- Real public video cards use source thumbnails and a PUBLIC SOURCE label; actual illustrative media keeps the PROTOTYPE MEDIA label.

## Verification

- 43 automated tests passing, including credit identity, catalog provenance, journey ordering, and safe return links.
- TypeScript and ESLint passing.
- Production build passing, 706 generated pages.
- Browser: all 12 new Channel Zero embeds start playing; the Window Seat commentary also plays.
- Browser: all Homecoming steps, terminal next/previous behavior, clip-detail round trip, leave-journey selection, search reset, paired-program guide pagination, Chike's commentary filter, Danny's camera/editing filter, and J. Ivy's credit route checked.
- Responsive checks at 390 × 844 show no document-level horizontal overflow on TV and filmmaker pages. Internal horizontal channel/journey navigation is intentional.
- Playback checks verify that videos start in this browser, not full-length viewing, all regions, or every future third-party availability change.

## Next steps

1. Review the preview with Coodie and Chike. Confirm the strongest first journey and which credits/context they want emphasized before expanding the interface.
2. Confirm rights, archive scope, source metadata, and approved language with the team. Keep the proof of concept visibly separate from an official archive launch.
3. Add verified credits incrementally. Never infer a director/camera role from the channel uploader or from being on screen.
4. Add a small number of fully sourced journeys with 3–8 useful parts. Prefer clear narrative order over a large playlist menu.
5. If useful after review, add optional local "continue watching" state. Do not imply playback completion based only on a click; use real player events and a clear reset/privacy control.
6. Add chapters or quotations only from reviewed transcripts with confirmed timestamps. Coordinate original media ingestion, captioning, access control, and rights workflows separately.
7. Continue replacing illustrative records as source material becomes available, especially connected-content proof cards and timeline examples. Preserve honest placeholder labels for remaining models.
8. Check embeds again before an external presentation. Videos can become unavailable or change region restrictions without a code change.

## Implementation map

- Content: `src/data/channelZero.ts`, `journeys.ts`, `workProcess.ts`.
- Resolvers: `src/lib/credits.ts`, `viewingJourneys.ts`, `workProcess.ts`.
- TV: `ViewingJourneys`, `ChannelStage`, `Television`, `Guide`.
- Clip details: `WorkProcess`, `FilmCredits`, `ClipJourneys`.
- Profiles: `FilmmakerWork` and role-query handling on person pages.
- Screenshots: `docs/coodie-proof/2026-10-02-work-and-process/`.
