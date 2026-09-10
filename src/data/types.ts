export type TapeFormat = "MINIDV" | "HI8" | "VHS" | "DIGITAL" | "PHONE";

export type Visibility =
  | "PUBLIC"
  | "UNLISTED"
  | "PRIVATE"
  | "COMING_SOON"
  | "MEMBERS_ONLY"
  | "RESTRICTED"
  | "PENDING_CLEARANCE";

export type RightsStatus =
  | "CLEARED"
  | "MUSIC_PENDING"
  | "APPEARANCE_PENDING"
  | "TERRITORY_LIMITED"
  | "EXPIRED_WINDOW"
  | "UNCLEAR";

export type EditorialStatus = "FEATURED" | "APPROVED" | "CUT" | "ROUGH" | "HOLD";

export type SensitivityStatus = "NONE" | "CONTEXT_REQUIRED" | "RESTRICTED";

export type DigitizationStatus = "INGESTED" | "PARTIAL" | "QUEUED" | "UNKNOWN";

export type ClipType =
  | "Broadcast"
  | "Interview"
  | "Studio"
  | "Performance"
  | "Travel"
  | "Street"
  | "Conversation"
  | "BTS"
  | "Title"
  | "Unseen";

export type MediaKind = "FIELD" | "LEADER" | "MAP" | "CONTACT" | "STATIC";

export type PersonRole = "camera" | "subject" | "director" | "artist" | "producer" | "related";

export interface Person {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  aka?: string[];
  bornYear?: number;
  origin?: string;
  roles: PersonRole[];
  bio: string;
  featured?: boolean;
}

export interface Location {
  id: string;
  slug: string;
  name: string;
  city: string;
  region?: string;
  country: string;
  lat: number;
  lon: number;
  glow: number;
  description: string;
}

export interface Era {
  id: string;
  slug: string;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  dek: string;
  editorial: boolean;
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface Track {
  id: string;
  slug: string;
  title: string;
  artist: string;
  year?: number;
}

export interface Album {
  id: string;
  slug: string;
  title: string;
  artist: string;
  year: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  year: number;
  kind: "film" | "series" | "video" | "network" | "show";
  description: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  year: number;
  locationId?: string;
  description: string;
}

export interface SourceTape {
  id: string;
  code: string;
  originalLabel: string;
  format: TapeFormat;
  camera: string;
  recordedDate: string;
  recordedApproximate?: string;
  ingestDate?: string;
  durationMinutes: number;
  physicalLocation: string;
  digitizationStatus: DigitizationStatus;
  notes: string;
  provenance: string;
  locationId: string;
  year: number;
}

export type TranscriptStatus = "none" | "stub" | "partial" | "prototype";

export type TranscriptOrigin = "editorial-inference" | "asr" | "human";

export interface TranscriptSegment {
  id: string;
  /** Seconds from the clip start. */
  start: number;
  end: number;
  speaker?: string;
  text: string;
}

export interface Transcript {
  id: string;
  clipId: string;
  status: TranscriptStatus;
  /** How the text was produced. Mock rows are editorial inference, never ASR. */
  origin: TranscriptOrigin;
  note: string;
  segments: TranscriptSegment[];
}

export interface Annotation {
  id: string;
  clipId?: string;
  tapeId?: string;
  author: string;
  text: string;
}

export interface Relationship {
  id: string;
  fromType: string;
  fromId: string;
  toType: string;
  toId: string;
  kind: string;
}

export interface ArchiveClip {
  id: string;
  slug: string;
  title: string;
  description: string;
  dateExact?: string;
  dateApproximate?: string;
  year: number;
  era: string;
  locationId: string;
  peopleIds: string[];
  trackIds: string[];
  albumIds: string[];
  projectIds: string[];
  eventIds: string[];
  collectionIds: string[];
  themes: string[];
  tags: string[];
  sourceTapeId: string;
  startTimecode: string;
  endTimecode: string;
  duration: number;
  thumbnail: string;
  poster: string;
  previewVideo?: string;
  /** Official YouTube upload id on @cctelevisionchannel. Never a ripped file. */
  youtubeId?: string;
  transcriptId?: string;
  featured: boolean;
  visibility: Visibility;
  rightsStatus: RightsStatus;
  editorialStatus: EditorialStatus;
  sensitivityStatus: SensitivityStatus;
  relatedClipIds: string[];
  type: ClipType;
  mediaKind: MediaKind;
  formatHint: TapeFormat;
  cameraCredit: string;
  hue: number;
}
