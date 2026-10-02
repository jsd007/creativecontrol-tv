import type { ArchiveClip, Project } from "./types";

/**
 * Selected public portfolio references, verified against their publishers on 2026-10-01.
 * These are not camera originals and do not expand @cctelevisionchannel's 366 uploads.
 * A trailer date is kept separate from its feature's premiere/release date.
 */
export const PORTFOLIO_BLOCK = "PROJECTS & FILMS";

export const portfolioProjects: Project[] = [
  {
    id: "katrina-babies",
    slug: "katrina-babies",
    title: "Katrina Babies",
    year: 2022,
    kind: "film",
    description: "Edward Buckles Jr.'s documentary about New Orleans youth after Hurricane Katrina. Coodie & Chike are executive producers for Creative Control, not the film's directors.",
    releaseStatus: "released",
    dateNote: "HBO premiere: 24 August 2022. Official trailer: 15 August 2022.",
    sourceUrls: [
      "https://static.hbo.com/2022-08/Katrina%20Babies%20-%20Discussion%20Guide%20-%20Designed_08232022SGJ_0.pdf",
      "https://www.youtube.com/watch?v=NjteP4qBqn4",
    ],
  },
  {
    id: "meal-ticket",
    slug: "meal-ticket",
    title: "Meal Ticket",
    year: 2026,
    kind: "film",
    description: "The history of the McDonald's All American Games. Directed by Carlton Gerard Sabbs and Corey Colvin; Creative Control is a production company and Coodie & Chike are executive producers.",
    releaseStatus: "released",
    dateNote: "Prime Video premiere: 19 March 2026. Official trailer: 26 February 2026.",
    sourceUrls: [
      "https://tribecafilm.com/tribecax/official-selections/meal-ticket-2026",
      "https://www.youtube.com/watch?v=QWB_iPFa2OE",
    ],
  },
  {
    id: "old-school-love",
    slug: "old-school-love",
    title: "Old School Love",
    year: 2013,
    kind: "video",
    description: "Lupe Fiasco featuring Ed Sheeran. The official artist upload credits direction to Coodie & Chike.",
    releaseStatus: "released",
    dateNote: "Official artist video upload: 10 December 2013. Single release: 14 October 2013.",
    sourceUrls: [
      "https://www.youtube.com/watch?v=wVnu7zi0daY",
      "https://music.apple.com/us/album/old-school-love-feat-ed-sheeran-single/721844002",
    ],
  },
  {
    id: "ernie-barnes",
    slug: "who-is-ernie-barnes",
    title: "Who Is Ernie Barnes?",
    year: 2026,
    kind: "film",
    description: "A documentary and three-act immersive experience directed by Coodie & Chike. This is a public project reference only; no film footage is available in this proof.",
    releaseStatus: "announced",
    dateNote: "Publicly announced in 2026. The official site describes a forthcoming immersive rollout, not a confirmed film-release date.",
    sourceUrls: ["https://www.whoiserniebarnes.com/about"],
  },
];

type PublicRecord = Pick<ArchiveClip,
  "id" | "slug" | "title" | "description" | "year" | "era" | "locationId" |
  "peopleIds" | "projectIds" | "themes" | "hue"
> & Partial<ArchiveClip>;

function publicRecord(record: PublicRecord): ArchiveClip {
  return {
    trackIds: [],
    albumIds: [],
    eventIds: [],
    collectionIds: ["portfolio"],
    tags: ["public-portfolio", "broadcast"],
    // No invented camera cassette. Provenance is publicSource, above the player.
    sourceTapeId: "",
    startTimecode: "00:00:00:00",
    endTimecode: "00:00:00:00",
    duration: 0,
    thumbnail: "",
    poster: "",
    featured: false,
    visibility: "PUBLIC",
    rightsStatus: "UNCLEAR",
    editorialStatus: "APPROVED",
    sensitivityStatus: "NONE",
    relatedClipIds: [],
    type: "Title",
    mediaKind: "LEADER",
    formatHint: "DIGITAL",
    cameraCredit: "PUBLIC SOURCE",
    contentState: "public-source",
    programBlock: PORTFOLIO_BLOCK,
    ...record,
  };
}

export const portfolioClips: ArchiveClip[] = [
  publicRecord({
    id: "c-portfolio-katrina",
    slug: "katrina-babies-official-trailer",
    title: "Katrina Babies | Official Trailer",
    description: "HBO's public trailer for Edward Buckles Jr.'s film about the young people of New Orleans after Hurricane Katrina. Coodie & Chike executive produced for Creative Control. New Orleans is the film's subject; this is not a private archive tape.",
    dateExact: "2022-08-15",
    year: 2022,
    era: "jeen-yuhs",
    locationId: "new-orleans",
    peopleIds: ["coodie", "chike"],
    projectIds: ["katrina-babies"],
    themes: ["memory", "authorship"],
    youtubeId: "NjteP4qBqn4",
    publicSource: {
      publisher: "HBO",
      url: "https://www.youtube.com/watch?v=NjteP4qBqn4",
      published: "2022-08-15",
      kind: "trailer",
    },
    credits: [
      { name: "Edward Buckles Jr.", role: "Director" },
      { name: "Coodie & Chike / Creative Control", role: "Executive producers", personIds: ["coodie", "chike"] },
    ],
    relatedClipIds: ["c-portfolio-coney", "c-104"],
    hue: 34,
  }),
  publicRecord({
    id: "c-portfolio-meal-ticket",
    slug: "meal-ticket-official-trailer",
    title: "Meal Ticket | Official Trailer",
    description: "Sports On Prime's public trailer for the story of the McDonald's All American Games. Creative Control is a production company; Coodie & Chike executive produced. The directors are Carlton Gerard Sabbs and Corey Colvin. No single filming location is assigned to this record.",
    dateExact: "2026-02-26",
    year: 2026,
    era: "after",
    locationId: "",
    peopleIds: ["coodie", "chike"],
    projectIds: ["meal-ticket"],
    themes: ["sports", "memory"],
    youtubeId: "QWB_iPFa2OE",
    publicSource: {
      publisher: "Sports On Prime",
      url: "https://www.youtube.com/watch?v=QWB_iPFa2OE",
      published: "2026-02-26",
      kind: "trailer",
    },
    credits: [
      { name: "Carlton Gerard Sabbs & Corey Colvin", role: "Directors" },
      { name: "Coodie & Chike", role: "Executive producers", personIds: ["coodie", "chike"] },
      { name: "Creative Control", role: "Production company" },
    ],
    relatedClipIds: ["c-104", "c-portfolio-coney"],
    hue: 43,
  }),
  publicRecord({
    id: "c-portfolio-coney",
    slug: "a-kid-from-coney-island-official-trailer",
    title: "A Kid from Coney Island | Official Trailer",
    description: "Boardroom's public trailer for the Stephon Marbury documentary directed by Coodie & Chike. The film premiered at Tribeca in 2019; this trailer accompanied its 2020 rollout. Coney Island is the story's origin, not a claim about this upload's filming date.",
    dateExact: "2020-01-30",
    year: 2020,
    era: "jeen-yuhs",
    locationId: "coney",
    peopleIds: ["coodie", "chike", "marbury"],
    projectIds: ["coney"],
    themes: ["sports", "memory"],
    youtubeId: "3UNVA-W_z6Q",
    publicSource: {
      publisher: "Boardroom",
      url: "https://www.youtube.com/watch?v=3UNVA-W_z6Q",
      published: "2020-01-30",
      kind: "trailer",
    },
    credits: [{ name: "Coodie & Chike", role: "Directors", personIds: ["coodie", "chike"] }],
    relatedClipIds: ["c-104", "c-portfolio-meal-ticket"],
    hue: 212,
  }),
  publicRecord({
    id: "c-portfolio-ernie",
    slug: "who-is-ernie-barnes-project",
    title: "Who Is Ernie Barnes?",
    description: "Public project reference for the documentary and immersive experience directed by Coodie & Chike. The official project site says Coodie began filming Barnes in 2003. No trailer or private footage is included here; the 2026 date marks its public announcement.",
    dateApproximate: "Announced 2026",
    year: 2026,
    era: "after",
    locationId: "",
    peopleIds: ["coodie", "chike"],
    projectIds: ["ernie-barnes"],
    themes: ["authorship", "memory"],
    tags: ["public-portfolio", "project-reference"],
    type: "Title",
    contentState: "project-reference",
    visibility: "COMING_SOON",
    publicSource: {
      publisher: "Who Is Ernie Barnes? official project",
      url: "https://www.whoiserniebarnes.com/about",
      kind: "project-page",
    },
    credits: [{ name: "Coodie & Chike", role: "Directors", personIds: ["coodie", "chike"] }],
    relatedClipIds: ["c-104", "c-portfolio-meal-ticket"],
    hue: 30,
  }),
];

/** Shelf order includes existing house Benji and the upgraded Old School Love record. */
export const PUBLIC_PORTFOLIO_CLIP_IDS = [
  "c-104",
  "c-portfolio-katrina",
  "c-portfolio-coney",
  "c-portfolio-meal-ticket",
  "c-34",
] as const;

export const PORTFOLIO_CLIP_IDS = [...PUBLIC_PORTFOLIO_CLIP_IDS, "c-portfolio-ernie"] as const;
