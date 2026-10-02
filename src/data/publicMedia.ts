import type { ArchiveClip } from "./types";

/** Public publisher references checked 2026-10-01. Never private tapes or transcripts. */
type PublicMedia = Pick<ArchiveClip, "id" | "slug" | "title" | "description" | "year" | "youtubeId" | "publicSource"> & Partial<ArchiveClip>;

function publicMedia(record: PublicMedia): ArchiveClip {
  return {
    era: "network",
    locationId: "",
    peopleIds: [],
    trackIds: [],
    albumIds: [],
    projectIds: [],
    eventIds: [],
    collectionIds: ["classics"],
    themes: ["authorship"],
    tags: ["public-source", "broadcast"],
    sourceTapeId: "",
    startTimecode: "00:00:00:00",
    endTimecode: "00:00:00:00",
    duration: 0, // Unknown runtime is not an invented duration.
    thumbnail: "",
    poster: "",
    featured: false,
    visibility: "PUBLIC",
    rightsStatus: "UNCLEAR",
    editorialStatus: "APPROVED",
    sensitivityStatus: "NONE",
    relatedClipIds: [],
    type: "Performance",
    mediaKind: "FIELD",
    formatHint: "DIGITAL",
    cameraCredit: "PUBLIC SOURCE",
    contentState: "public-source",
    hue: 38,
    ...record,
  };
}

function source(publisher: string, id: string, published: string, kind: NonNullable<ArchiveClip["publicSource"]>["kind"]) {
  return { publisher, url: `https://www.youtube.com/watch?v=${id}`, published, kind };
}

/** Replace vague work cards in place, preserving old links but none of their fictional tape metadata. */
export const publicMediaReplacements: ArchiveClip[] = [
  publicMedia({
    id: "c-20", slug: "window-seat-one-take", title: "Erykah Badu | Window Seat",
    description: "The finished music video from Erykah Badu's official artist channel. Directed by Coodie & Chike and filmed in Dallas. This replaces the illustrative production card; it is the public release, not behind-the-scenes footage.",
    dateExact: "2010-04-02", year: 2010, locationId: "dallas", peopleIds: ["badu"],
    trackIds: ["window-seat"], albumIds: ["newamerykah"], projectIds: ["window"],
    youtubeId: "9hVp47f5YZg", publicSource: source("Erykah Badu", "9hVp47f5YZg", "2010-04-02", "music-video"),
    credits: [{ name: "Coodie & Chike", role: "Directors" }],
    relatedClipIds: ["c-51", "c-34", "c-public-children"], featured: true,
    programBlock: "MUSIC VIDEOS", hue: 40,
  }),
  publicMedia({
    id: "c-25", slug: "a-cut-from-the-vault", title: "jeen-yuhs: A Kanye Trilogy | Official Trailer",
    description: "Netflix's official trailer for the three-part documentary directed by Coodie & Chike. A public introduction to the series, not a private tape or the full archive.",
    dateExact: "2022-02-04", year: 2022, era: "jeen-yuhs", peopleIds: ["ye"], projectIds: ["jeenyuhs"],
    collectionIds: ["public-previews"], type: "Title", mediaKind: "LEADER", featured: true,
    youtubeId: "X3d5rT7FGLE", publicSource: source("Netflix", "X3d5rT7FGLE", "2022-02-04", "trailer"),
    credits: [{ name: "Coodie & Chike", role: "Documentary directors" }],
    relatedClipIds: ["c-public-first-look", "c-public-slow-jamz", "c-public-teyana"], programBlock: "JEEN-YUHS", hue: 30,
  }),
  publicMedia({
    id: "c-27", slug: "joey-brooklyn-daylight", title: "Joey Bada$$ & Capital STEEZ | Survival Tactics",
    description: "PRO ERA's public music video. The publisher credits the shoot to Creative Control. The artists' Brooklyn roots connect this work to New York; no camera-original tape or precise shoot address is claimed.",
    dateExact: "2012-02-23", year: 2012, locationId: "new-york", peopleIds: ["joey", "steez"],
    trackIds: ["survival"], projectIds: ["survival-tactics"], collectionIds: ["classics", "new-york"],
    youtubeId: "DDWAk8-leVA", publicSource: source("PRO ERA", "DDWAk8-leVA", "2012-02-23", "music-video"),
    credits: [{ name: "Creative Control", role: "Shot by" }], relatedClipIds: ["c-59", "c-99", "c-100"],
    programBlock: "MUSIC VIDEOS", featured: true, hue: 215,
  }),
  publicMedia({
    id: "c-46", slug: "jesus-walks-third", title: "Kanye West | Jesus Walks, Part 3",
    description: "Channel Zero's public upload of the third Jesus Walks video. The publisher credits Coodie & Chike and identifies Chicago as the filming location. The video belongs to 2004; its public upload is from 2006.",
    dateApproximate: "Video released 2004", dateBasis: "release-year", dateNote: "Music video: 2004. Channel Zero upload: 2 October 2006. No exact recording day is assigned.",
    year: 2004, era: "through-the-wire", locationId: "chicago", peopleIds: ["ye"],
    trackIds: ["jesus-walks"], albumIds: ["dropout"], projectIds: ["jesus-walks"],
    collectionIds: ["through-the-wire", "road-dropout", "first-times", "chicago-before"],
    youtubeId: "_AXbK-i45TU", publicSource: source("Channel Zero / channelzerotv", "_AXbK-i45TU", "2006-10-02", "music-video"),
    credits: [{ name: "Coodie & Chike", role: "Directors" }], relatedClipIds: ["c-public-through-wire", "c-47", "c-public-slow-jamz"],
    programBlock: "MUSIC VIDEOS", featured: true, hue: 48,
  }),
  publicMedia({
    id: "c-47", slug: "two-words-card", title: "Kanye West | Two Words",
    description: "The official artist video featuring Mos Def, Freeway and the Boys Choir of Harlem. Apple Music dates the music video to 2005; the song appears on the 2004 album. This is the finished public video, not the former prototype title card.",
    dateApproximate: "Music video 2005", dateBasis: "release-year", dateNote: "Apple Music lists the video as 2005. Artist-channel upload: 16 June 2009. Song/album year: 2004.",
    year: 2005, era: "through-the-wire", peopleIds: ["ye", "yasiin"], trackIds: ["two-words"],
    albumIds: ["dropout"], projectIds: ["two-words"], collectionIds: ["through-the-wire", "road-dropout", "first-times"],
    youtubeId: "tkFOBx6j0l8", publicSource: source("KanyeWestVEVO", "tkFOBx6j0l8", "2009-06-16", "music-video"),
    relatedClipIds: ["c-public-through-wire", "c-46", "c-public-first-look"], programBlock: "MUSIC VIDEOS", hue: 42,
  }),
];

export const publicMediaAdditions: ArchiveClip[] = [
  publicMedia({
    id: "c-public-through-wire", slug: "through-the-wire-official-video", title: "Kanye West | Through the Wire",
    description: "Channel Zero's public upload of the finished Through the Wire video, credited to Coodie & Chike. The work dates to 2003; the upload date comes from the publisher's playlist feed. This is not an invented production cassette.",
    dateApproximate: "Video released 2003", dateBasis: "release-year", dateNote: "Work year: 2003. Publisher playlist feed: 3 October 2006; search listings may show 2 October because of timezone.",
    year: 2003, era: "through-the-wire", peopleIds: ["ye"], trackIds: ["through-the-wire"], albumIds: ["dropout"],
    projectIds: ["ttw"], collectionIds: ["through-the-wire", "road-dropout", "first-times"],
    youtubeId: "uvb-1wjAtk4", publicSource: source("Channel Zero / channelzerotv", "uvb-1wjAtk4", "2006-10-03", "music-video"),
    credits: [{ name: "Coodie & Chike", role: "Directors" }], relatedClipIds: ["c-46", "c-47", "c-public-slow-jamz"],
    programBlock: "MUSIC VIDEOS", featured: true, hue: 35,
  }),
  publicMedia({
    id: "c-public-children", slug: "big-krit-children-of-the-world", title: "Big K.R.I.T. | Children of the World",
    description: "The official artist upload credits direction to Creative Control. A finished music video from the network's early years, separate from Hometown Hero and any private production material.",
    dateExact: "2010-04-02", year: 2010, peopleIds: ["krit"], projectIds: ["children-of-the-world"],
    youtubeId: "wbG7tMyhjJQ", publicSource: source("BIG K.R.I.T.", "wbG7tMyhjJQ", "2010-04-02", "music-video"),
    credits: [{ name: "Creative Control", role: "Director" }], relatedClipIds: ["c-314", "c-27", "c-20"],
    programBlock: "MUSIC VIDEOS", hue: 28,
  }),
  publicMedia({
    id: "c-public-first-look", slug: "jeen-yuhs-netflix-first-look", title: "jeen-yuhs | First Look",
    description: "Netflix's public first-look excerpt featuring Kanye West and Mos Def. It is a documentary scene, not the Two Words music video. No exact recording date or location is assigned.",
    dateExact: "2021-09-25", year: 2021, era: "jeen-yuhs", peopleIds: ["ye", "yasiin"], projectIds: ["jeenyuhs"],
    collectionIds: ["public-previews", "road-dropout"], type: "Conversation",
    youtubeId: "WPDAbEVCSTU", publicSource: source("Netflix", "WPDAbEVCSTU", "2021-09-25", "documentary-excerpt"),
    credits: [{ name: "Coodie & Chike", role: "Documentary directors" }], relatedClipIds: ["c-47", "c-25", "c-public-netflix-studio"],
    programBlock: "JEEN-YUHS", hue: 42,
  }),
  publicMedia({
    id: "c-public-teyana", slug: "jeen-yuhs-teyana-taylor-studio-outtake", title: "Kanye & Teyana Taylor | Making a Beat",
    description: "TIME's public jeen-yuhs outtake shows West rebuilding a beat with Teyana Taylor. The producer's article dates the scene to summer 2017; the public upload followed in 2022.",
    dateApproximate: "Summer 2017", dateBasis: "recorded-year", dateNote: "TIME dates the footage to summer 2017. Public upload: 7 March 2022. Recording location unconfirmed.",
    year: 2017, era: "documents", peopleIds: ["ye", "teyana"], projectIds: ["jeenyuhs"],
    collectionIds: ["studio-nights"], themes: ["studio", "authorship"], type: "Studio",
    youtubeId: "yhOsxMhe8eo", publicSource: source("TIME", "yhOsxMhe8eo", "2022-03-07", "documentary-excerpt"),
    credits: [{ name: "Coodie & Chike", role: "Documentary directors" }], relatedClipIds: ["c-public-netflix-studio", "c-25"],
    programBlock: "JEEN-YUHS", featured: true, hue: 30,
  }),
  publicMedia({
    id: "c-public-slow-jamz", slug: "jeen-yuhs-slow-jamz-shoot-outtake", title: "Slow Jamz | On the Video Set",
    description: "TIME's public documentary outtake from the Slow Jamz shoot, dated to 2004 by the producer. Coodie & Chike directed jeen-yuhs; this record does not assign them direction of the finished Slow Jamz music video.",
    dateApproximate: "Recorded 2004", dateBasis: "recorded-year", dateNote: "Scene year: 2004, per TIME. Public upload: 28 February 2022. Exact filming date and location unconfirmed.",
    year: 2004, era: "through-the-wire", peopleIds: ["ye"], projectIds: ["jeenyuhs"], albumIds: ["dropout"],
    collectionIds: ["through-the-wire", "road-dropout", "first-times"], type: "BTS",
    youtubeId: "0nc1agwE1sQ", publicSource: source("TIME", "0nc1agwE1sQ", "2022-02-28", "documentary-excerpt"),
    credits: [{ name: "Coodie & Chike", role: "Documentary directors" }], relatedClipIds: ["c-public-netflix-studio", "c-public-through-wire", "c-25"],
    programBlock: "JEEN-YUHS", hue: 28,
  }),
  publicMedia({
    id: "c-public-netflix-studio", slug: "jeen-yuhs-slow-jamz-studio", title: "Kanye & Jamie Foxx | Recording Slow Jamz",
    description: "Netflix's public excerpt from act two of jeen-yuhs. The publisher identifies Coodie's camera and the Slow Jamz session with Jamie Foxx. The date below is publication, not a guessed recording day.",
    dateExact: "2022-02-23", year: 2022, era: "jeen-yuhs", peopleIds: ["ye", "jamie-foxx"], projectIds: ["jeenyuhs"],
    albumIds: ["dropout"], collectionIds: ["studio-nights", "road-dropout"], themes: ["studio", "authorship"], type: "Studio",
    youtubeId: "MGZ8LR0bSYc", publicSource: source("Netflix", "MGZ8LR0bSYc", "2022-02-23", "documentary-excerpt"),
    credits: [{ name: "Coodie & Chike", role: "Documentary directors" }, { name: "Coodie", role: "Camera, per publisher" }],
    relatedClipIds: ["c-public-slow-jamz", "c-public-teyana", "c-25"], programBlock: "JEEN-YUHS", hue: 38,
  }),
];

/** Ordered selections are our proof's curation, never publisher playlists or unseen holdings. */
export const PUBLIC_CHANNEL_SELECTIONS = {
  "channel-zero": ["c-52", "c-53", "c-55", "c-54"],
  origins: ["c-public-through-wire", "c-46", "c-47", "c-public-slow-jamz", "c-public-first-look", "c-57"],
  chicago: ["c-46", "c-104", "c-34", "c-52", "c-53", "c-55", "c-54"],
  studio: ["c-public-netflix-studio", "c-public-teyana", "c-74", "c-72", "c-96", "c-186", "c-212", "c-284"],
  "new-york": ["c-27", "c-76", "c-59", "c-99", "c-100", "c-415", "c-portfolio-coney"],
  performances: ["c-415", "c-126", "c-99", "c-315", "c-346", "c-407"],
  // Keep the legacy channel id/number so saved links survive; name it PREVIEWS in the UI.
  unseen: ["c-25", "c-104", "c-portfolio-coney", "c-portfolio-katrina", "c-portfolio-meal-ticket", "c-58", "c-65", "c-66"],
  conversations: ["c-51", "c-56", "c-57", "c-78", "c-340", "c-397"],
} as const;
