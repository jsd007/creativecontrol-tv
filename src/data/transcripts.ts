import type { Transcript } from "./types";

/**
 * Prototype transcripts only.
 * Editorial inference — not ASR, not YouTube captions, not recovered Coodie speech.
 * Speakers are roles on the tape, not attributed quotations.
 */
export const transcripts: Transcript[] = [
  {
    id: "tr-c-08",
    clipId: "c-08",
    status: "prototype",
    origin: "editorial-inference",
    note: "Prototype. Editorial inference of basement room tone — not a recovered recording.",
    segments: [
      {
        id: "tr-c-08-1",
        start: 0,
        end: 10,
        speaker: "ROOM",
        text: "A temporary room. Heat in the pipes. Prototype — we did not hear this tape.",
      },
      {
        id: "tr-c-08-2",
        start: 14,
        end: 26,
        speaker: "CAMERA",
        text: "The lens stays on the keys. No recovered vocal.",
      },
      {
        id: "tr-c-08-3",
        start: 32,
        end: 46,
        speaker: "TAPE",
        text: "A radiator knocks twice then goes quiet.",
      },
      {
        id: "tr-c-08-4",
        start: 58,
        end: 74,
        speaker: "ROOM",
        text: "Unfinished music, then chair legs on concrete.",
      },
      {
        id: "tr-c-08-5",
        start: 96,
        end: 118,
        speaker: "CAMERA",
        text: "The loop runs out. Someone resets it. Editorial inference.",
      },
    ],
  },
  {
    id: "tr-c-13",
    clipId: "c-13",
    status: "prototype",
    origin: "editorial-inference",
    note: "Prototype. A remembered after-hours call — not a transcription of anyone’s sentences.",
    segments: [
      {
        id: "tr-c-13-1",
        start: 0,
        end: 12,
        speaker: "ROOM",
        text: "A remembered call. Not a recovered recording.",
      },
      {
        id: "tr-c-13-2",
        start: 16,
        end: 32,
        speaker: "LINE",
        text: "The hallway clock is the only thing talking.",
      },
      {
        id: "tr-c-13-3",
        start: 40,
        end: 58,
        speaker: "ROOM",
        text: "Two people, after hours. We do not write their sentences.",
      },
      {
        id: "tr-c-13-4",
        start: 88,
        end: 112,
        speaker: "CAMERA",
        text: "The idea is in the room. The money is not. Prototype.",
      },
    ],
  },
  {
    id: "tr-c-35",
    clipId: "c-35",
    status: "prototype",
    origin: "editorial-inference",
    note: "Prototype. Leftover after a public-access open — not a reconstructed bumper line.",
    segments: [
      {
        id: "tr-c-35-1",
        start: 0,
        end: 8,
        speaker: "TAPE",
        text: "After the open, the field does not cut.",
      },
      {
        id: "tr-c-35-2",
        start: 12,
        end: 28,
        speaker: "ROOM",
        text: "The yellow holds after the checker.",
      },
      {
        id: "tr-c-35-3",
        start: 36,
        end: 54,
        speaker: "TAPE",
        text: "No reconstructed bumper line. Leftover picture only.",
      },
      {
        id: "tr-c-35-4",
        start: 70,
        end: 96,
        speaker: "ROOM",
        text: "Public-access snow, then black.",
      },
    ],
  },
  {
    id: "tr-c-36",
    clipId: "c-36",
    status: "prototype",
    origin: "editorial-inference",
    note: "Prototype. A never-aired Channel Zero leftover as catalog feeling — not the tape.",
    segments: [
      {
        id: "tr-c-36-1",
        start: 0,
        end: 14,
        speaker: "CAMERA",
        text: "The night did not make the episode. Prototype only.",
      },
      {
        id: "tr-c-36-2",
        start: 22,
        end: 40,
        speaker: "ROOM",
        text: "Never-aired snow under a streetlight.",
      },
      {
        id: "tr-c-36-3",
        start: 52,
        end: 78,
        speaker: "TAPE",
        text: "Sidewalk leftover. No reconstructed set.",
      },
      {
        id: "tr-c-36-4",
        start: 96,
        end: 124,
        speaker: "CAMERA",
        text: "The cut moves on. This frame stays unlabeled.",
      },
    ],
  },
];
