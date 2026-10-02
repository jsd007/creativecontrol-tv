/** Short editorial paths through released videos, not a publisher playlist or private archive. */
export type ViewingJourney = {
  id: "homecoming" | "early-chicago" | "studio-connections";
  title: string;
  label: string;
  description: string;
  note: string;
  clipIds: readonly string[];
};

export const VIEWING_JOURNEYS: readonly ViewingJourney[] = [
  {
    id: "homecoming",
    title: "Making of Homecoming",
    label: "A three-part shoot",
    description: "Follow the music-video shoot in the three parts released by Channel Zero.",
    note: "Channel Zero credits this footage to Danny Joe Sorge. Parts are ordered by the publisher's titles.",
    clipIds: ["c-cz-homecoming-1", "c-cz-homecoming-2", "c-cz-homecoming-3"],
  },
  {
    id: "early-chicago",
    title: "Before the debut",
    label: "Interviews, music, style",
    description: "Cam’ron, Ma$e and Kanye, then Chicago Hip Hop 101. A path through early Channel Zero.",
    note: "The first two videos identify 1998 footage. Chicago Hip Hop 101 combines an early-career conversation and a later gallery visit. This is not one recording year or city.",
    clipIds: ["c-cz-camron-1998", "c-cz-mase-1998", "c-cz-chicago-hip-hop-101"],
  },
  {
    id: "studio-connections",
    title: "Creative encounters",
    label: "Four creative encounters",
    description: "Jamie Foxx in the studio, an improvisation with Angie Stone, then sessions with Nipsey Hussle and Teyana Taylor.",
    note: "An editorial sequence of separate public recordings, not one session or a chronology. Each file retains its publisher and credits.",
    clipIds: ["c-public-netflix-studio", "c-cz-jamie-angie", "c-cz-nipsey-session", "c-public-teyana"],
  },
];
