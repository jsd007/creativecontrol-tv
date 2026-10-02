/** Editorial connections between real released works and their public process material. */
export type WorkProcess = {
  id: string;
  title: string;
  note: string;
  parts: { clipId: string; label: string }[];
};

export const WORK_PROCESS: WorkProcess[] = [
  {
    id: "window-seat",
    title: "Window Seat",
    note: "The finished video, then Coodie & Chike's explanation of the idea.",
    parts: [
      { clipId: "c-20", label: "Watch the work" },
      { clipId: "c-51", label: "Hear the story" },
    ],
  },
  {
    id: "jesus-walks",
    title: "Jesus Walks, Part 3",
    note: "The finished video and Channel Zero's behind-the-scenes footage, filmed by Coodie and J. Ivy.",
    parts: [
      { clipId: "c-46", label: "Watch the work" },
      { clipId: "c-cz-jesus-walks-making", label: "See the making" },
    ],
  },
  {
    id: "jeen-yuhs",
    title: "jeen-yuhs",
    note: "A public trailer and released scenes from the creative process. These excerpts are not the full film.",
    parts: [
      { clipId: "c-25", label: "Watch the trailer" },
      { clipId: "c-public-netflix-studio", label: "In the studio" },
      { clipId: "c-public-slow-jamz", label: "On the video set" },
    ],
  },
];
