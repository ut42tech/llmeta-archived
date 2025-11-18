"use client";

import { FirstPersonCharacterCameraBehavior } from "@react-three/viverse";
import type { PlayerTransformSnapshot } from "@/components/spatial/player/Player";
import { Player } from "@/components/spatial/player/Player";
import { PlayerTag } from "@/components/spatial/player/PlayerTag";
import { useLocalPoseSender } from "@/hooks/useLocalPoseSender";
import { useLocalProfileSync } from "@/hooks/useLocalProfileSync";

type DesktopLocalPlayerProps = {
  name: string;
  onPoseUpdate?: (pose: PlayerTransformSnapshot) => void;
  poseUpdateIntervalMs?: number;
};

export const DesktopLocalPlayer = ({
  name,
  onPoseUpdate,
  poseUpdateIntervalMs,
}: DesktopLocalPlayerProps) => {
  useLocalProfileSync("desktop");

  const { handlePoseUpdate, interval } = useLocalPoseSender({
    mode: "desktop",
    onPoseUpdate,
    poseUpdateIntervalMs,
  });

  return (
    <Player
      cameraBehavior={FirstPersonCharacterCameraBehavior}
      model={false}
      onPoseUpdate={handlePoseUpdate}
      poseUpdateIntervalMs={interval}
    >
      <PlayerTag name={name} />
    </Player>
  );
};
