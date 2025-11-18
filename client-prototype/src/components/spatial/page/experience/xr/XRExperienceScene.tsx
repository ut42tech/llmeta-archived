"use client";

import { useXRControllerInput } from "@react-three/viverse";
import { useCallback, useRef } from "react";
import type { Vector3 } from "three";
import type { PlayerHandle } from "@/components/spatial/player/Player";
import { Players } from "@/components/spatial/player/Players";
import { XRLocalPlayer } from "@/components/spatial/player/xr/XRLocalPlayer";
import { Level } from "@/components/spatial/scene/Level";
import { useColyseusRoom } from "@/utils/colyseus";

export const XRExperienceScene = () => {
  const room = useColyseusRoom();
  const name = room?.sessionId ?? "接続中...";
  const playerRef = useRef<PlayerHandle>(null);
  const controllerInput = useXRControllerInput();

  const handleTeleport = useCallback((destination: Vector3) => {
    playerRef.current?.setPosition(destination);
  }, []);

  return (
    <>
      <XRLocalPlayer
        name={name}
        input={controllerInput}
        playerRef={playerRef}
      />
      <Players />
      <Level onTeleport={handleTeleport} />
    </>
  );
};
