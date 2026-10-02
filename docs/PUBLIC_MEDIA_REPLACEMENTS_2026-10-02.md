# Public media replacements

Date: 2026-10-02

This pass replaces several illustrative cards with public publisher videos and adds real documentary scenes. It documents the records currently authored in `src/data/publicMedia.ts` and integrated by `src/data/index.ts`. These are public references, not access to Creative Control's private archive. Source research took place on 2026-10-01 and 2026-10-02.

## Eleven public YouTube references

Dates in the upload column describe publication on the linked publisher channel. They are not recording dates, festival premieres, or the first release of every work. Titles below are the proof's display labels; the linked publisher retains its original title and player.

| Catalog record | Public publisher / source | Upload date stored | Work or recording date used |
| --- | --- | --- | --- |
| `c-20`, Erykah Badu / Window Seat | **Erykah Badu**, [official artist video](https://www.youtube.com/watch?v=9hVp47f5YZg), `9hVp47f5YZg` | 2010-04-02 | Work year 2010. Exact date is publication, not a shoot day. |
| `c-25`, jeen-yuhs / Official Trailer | **Netflix**, [official trailer](https://www.youtube.com/watch?v=X3d5rT7FGLE), `X3d5rT7FGLE` | 2022-02-04 | Trailer publication 2022; series release is separate. |
| `c-27`, Joey Bada$$ & Capital STEEZ / Survival Tactics | **PRO ERA**, [official video](https://www.youtube.com/watch?v=DDWAk8-leVA), `DDWAk8-leVA` | 2012-02-23 | Public video year 2012; no exact filming day. |
| `c-46`, Kanye West / Jesus Walks, Part 3 | **channelzerotv**, [third video](https://www.youtube.com/watch?v=_AXbK-i45TU), `_AXbK-i45TU` | 2006-10-02 | Video release year 2004, not 2006. |
| `c-47`, Kanye West / Two Words | **KanyeWestVEVO**, [official artist video](https://www.youtube.com/watch?v=tkFOBx6j0l8), `tkFOBx6j0l8` | 2009-06-16 | Music video year 2005; song/album year 2004. |
| `c-public-through-wire`, Kanye West / Through the Wire | **channelzerotv**, [finished video](https://www.youtube.com/watch?v=uvb-1wjAtk4), `uvb-1wjAtk4` | 2006-10-03 | Video release year 2003, not 2006. |
| `c-public-children`, Big K.R.I.T. / Children of the World | **BIG K.R.I.T.**, [official artist video](https://www.youtube.com/watch?v=wbG7tMyhjJQ), `wbG7tMyhjJQ` | 2010-04-02 | Public video year 2010; no exact filming day. |
| `c-public-first-look`, jeen-yuhs / First Look | **Netflix**, [first-look excerpt](https://www.youtube.com/watch?v=WPDAbEVCSTU), `WPDAbEVCSTU` | 2021-09-25 | Publication year 2021; archival scene's recording date is unassigned. |
| `c-public-teyana`, Kanye & Teyana Taylor / Making a Beat | **TIME**, [documentary outtake](https://www.youtube.com/watch?v=yhOsxMhe8eo), `yhOsxMhe8eo` | 2022-03-07 | Recorded summer 2017, per the producer's article. |
| `c-public-slow-jamz`, Slow Jamz / On the Video Set | **TIME**, [documentary outtake](https://www.youtube.com/watch?v=0nc1agwE1sQ), `0nc1agwE1sQ` | 2022-02-28 | Recorded 2004, per the producer's article. |
| `c-public-netflix-studio`, Kanye & Jamie Foxx / Recording Slow Jamz | **Netflix**, [act-two studio excerpt](https://www.youtube.com/watch?v=MGZ8LR0bSYc), `MGZ8LR0bSYc` | 2022-02-23 | Publication year 2022; no recording day or place is inferred. |

`publicSource.publisher` uses the readable label `Channel Zero / channelzerotv` for the two Channel Zero uploads. Their actual uploader name is `channelzerotv`, not `@cctelevisionchannel`.

## Date and role evidence

- Coodie's [ESPN interview](https://www.espn.com/blog/music/post/_/id/4151/coodie-breaks-down-his-music-videos) supports Through the Wire (2003), Jesus Walks (2004), and Window Seat (2010).
- The [Through the Wire publisher description](https://www.youtube.com/watch?v=uvb-1wjAtk4) credits Coodie & Chike. Its stored 2006-10-03 upload date comes from the repository's previously captured publisher playlist feed. The [official court PDF](https://www.govinfo.gov/content/pkg/USCOURTS-ilnd-1_23-cv-02392/pdf/USCOURTS-ilnd-1_23-cv-02392-0.pdf) independently cites that same YouTube ID and date. Search listings show 2006-10-02; a timezone difference is plausible, but not proven. Preserve the feed date and the uncertainty note rather than calling this a 2006 production.
- The [Jesus Walks Part 3 publisher description](https://www.youtube.com/watch?v=_AXbK-i45TU) explicitly names Coodie & Chike as directors and Chicago as the filming location. It identifies the third version, not either of the other directors' versions. No exact recording day is assigned.
- [Apple Music's Two Words music-video page](https://music.apple.com/us/music-video/two-words/1445705924) labels the video 2005. The 2009-06-16 upload date was already captured in `youtubePlaylistForeign`. This record intentionally has no newly asserted director credit because that role was not independently confirmed from the accessible artist upload in this pass. The separately published [Channel Zero making-of](https://www.dailymotion.com/video/x1st9j) credits its own camera work; that is not interchangeable with finished-video direction.
- [Survival Tactics on PRO ERA](https://www.youtube.com/watch?v=DDWAk8-leVA) credits **Shot by: Creative Control**. Retain that role, not an inferred individual director. Its description supports the performers' Brooklyn roots; the New York association is not a precise shoot address.
- [Children of the World on the artist channel](https://www.youtube.com/watch?v=wbG7tMyhjJQ) credits Creative Control as director in the publisher's title. No filming location is assigned.
- Window Seat's individual director attribution is interview-backed, not stated in the artist upload's short copyright description. The proof also links the existing [Creative Control discussion of the work](https://www.youtube.com/watch?v=kgSY_jxKLnU); that 2025 discussion is not the 2010 music video or a camera original.
- The [TIME Studios project credits](https://studios.time.com/film-tv/jeen-yuhs-a-kanye-trilogy/) identify Coodie Simmons and Chike Ozah as documentary directors. This is the role used on the Netflix and TIME documentary records, not an assertion that they directed every music video shown inside the documentary.
- TIME's [Teyana Taylor producer article](https://time.com/6148658/kanye-west-jeen-yuhs-exclusive-clip-teyana-taylor/) places the outtake in summer 2017. It describes West reworking a beat with Taylor. The 2022 public release is separate; no recording location is assigned.
- TIME's [Slow Jamz producer article](https://time.com/6148010/kanye-west-slow-jamz-jeen-yuhs/) dates the video-set scene to 2004. The public excerpt was released in 2022. Credit the documentary directors, not direction of the finished Slow Jamz video.
- The [Netflix Slow Jamz studio upload](https://www.youtube.com/watch?v=MGZ8LR0bSYc) identifies the act-two excerpt, Jamie Foxx session, and Coodie's camera. The confirmed 2022-02-23 date is publication. [Netflix's companion page](https://www.netflix.com/tudum/videos/kanye-x-jamie-foxx-slow-jamz-jeen-yuhs-a-kanye-trilogy-act-2) supplies an additional primary reference.
- Netflix's [First Look](https://www.youtube.com/watch?v=WPDAbEVCSTU) identifies Kanye West and Mos Def in a documentary scene. It is not the Two Words music video, and its 2021 upload does not date the recorded performance. The [official trailer](https://www.youtube.com/watch?v=X3d5rT7FGLE) is a separate 2022 publication.

## Five in-place replacements

The integration replaces entire records by ID. It does not add a public YouTube ID to a fictional tape record and retain the old inventory claims.

| ID | Previous illustrative card | Current public record |
| --- | --- | --- |
| `c-20` | Window Seat production/BTS example | Finished artist music video; explicitly not BTS. |
| `c-25` | A cut from the vault / press example | Netflix trailer; not the former imagined press scene. |
| `c-27` | Joey, Brooklyn daylight / BTS example | Finished Survival Tactics video; not the former imagined shoot. |
| `c-46` | Jesus Walks third-video title card | Public release of the same finished work. |
| `c-47` | Two Words title card | Public release of the same finished work; video year corrected to 2005. |

The other six records are new public references. Through the Wire and Two Words were already listed as foreign publisher playlist entries, but were not playable catalog records. They remain separate from the Creative Control channel's own upload inventory.

## TV curation and inventory boundary

`PUBLIC_CHANNEL_SELECTIONS` now supplies eight curated public-video selections: Channel Zero, Origins, Chicago, Studio, New York, Performances, Previews, and Conversations. Broadcast remains the broader public-video catalog. These are the proof's editorial selections, not official publisher playlists or a real television schedule.

Channel 06 retains the legacy internal ID `unseen` for saved links, but displays **PREVIEWS** and describes public trailers. It no longer suggests that its contents are unreleased private tapes. Channel 00 uses the four existing public Channel Zero uploads (`c-52`, `c-53`, `c-55`, `c-54`); the illustrative Twista green room is not passed off as a newly discovered public interview. Existing `c-104` remains the single Benji trailer record.

The implemented source tally is **366 Creative Control channel uploads + 15 external publisher references = 381 catalog records with YouTube IDs**. The 11 references in this pass are additional to the four external portfolio references. The official 366 count is unchanged. These are record counts, not a count of hours, unique productions, private holdings, or successfully played videos.

## Limits and follow-up

- No private footage was obtained, reconstructed, downloaded, or represented as an authenticated holding.
- Public records use `contentState: public-source`, `visibility: PUBLIC`, and `rightsStatus: UNCLEAR`. A public publisher link is not clearance for rehosting, a rights grant, or proof of ownership.
- Each new/replacement record has an empty `sourceTapeId`, zero timecodes, and `duration: 0` for unknown runtime. These zero values are sentinels, not claims about a video's length or a source tape.
- The transcript attachment path skips records with a public source or YouTube ID. No illustrative transcript is attached to these real videos. Do not add fabricated dialogue, chapter marks, transcripts, inventory numbers, camera formats, filming dates, or recording places.
- Work/recorded years are supplied only where supported. Elsewhere `dateExact` and `year` identify publication, and the description makes that limit explicit. Unknown recording geography stays empty; filmmaker credits do not imply on-screen appearances.
- Watch-page research is not playback QA. Publisher embedding policies, age restrictions, region limits, deletion, or player errors can still affect availability. This document makes no deployment or end-to-end QA claim.

Backlog sources, not embedded or added as new records in this pass:

- [Channel Zero / making of Slow Jamz pt. 2](https://www.dailymotion.com/video/x1stif), published 2007-04-24: the publisher identifies Twista, Jamie Foxx, Chicago, and Danny Joe Sorge's camera. This is a different work from the illustrative 1998 Twista green-room card.
- [Channel Zero / Malik Yusef with Kanye West & Common, Like To Ride?](https://www.dailymotion.com/video/x1t4do), published 2007-04-25: a finished music video, not the illustrative mid-1990s Common green room.
- [Channel Zero / Through the Wire making-of](https://www.dailymotion.com/video/x1st46) and [Two Words making-of](https://www.dailymotion.com/video/x1st9j): genuine public companion sources; do not substitute their camera credit for finished-video direction.
- [BET / Inside Ali: The People's Champ](https://www.bet.com/bet-awards/video-clips/dii152/inside-ali-the-people-s-champ), published 2015-09-23: a filmmaker interview. [Paramount's original festival announcement](https://ir.paramount.com/static-files/467f19b8-af04-46bb-bb31-a6cb25c0a1a4) supports the film's date and director/executive-producer roles. Verify outbound playback or add a supported player before promising an embedded Ali clip.

Keep remaining concept inventory visibly marked. An unsupported scene should remain an example or disappear from a public viewing selection; it should never borrow a real video's provenance just because the artist or project matches.
