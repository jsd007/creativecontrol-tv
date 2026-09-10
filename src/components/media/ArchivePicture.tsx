import { PrototypeMedia } from "@/components/media/PrototypeMedia";
import { BroadcastPlayer } from "@/components/media/BroadcastPlayer";
import type { ArchiveClip } from "@/data/types";
import { isUnlogged } from "@/lib/clipDisplay";
import type { VoiceClip } from "@/lib/mediaVoice";

type PictureClip = VoiceClip &
  Pick<ArchiveClip, "id" | "tags" | "startTimecode" | "duration" | "cameraCredit" | "youtubeId" | "title">;

type Props = {
  clip: PictureClip;
  className?: string;
  large?: boolean;
};

export function ArchivePicture({ clip, className = "", large = false }: Props) {
  if (clip.youtubeId && !isUnlogged(clip)) {
    return <BroadcastPlayer youtubeId={clip.youtubeId} title={clip.title} large={large} className={className} />;
  }
  return <PrototypeMedia clip={clip} large={large} className={className} />;
}
