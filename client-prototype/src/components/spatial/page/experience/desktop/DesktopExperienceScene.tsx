"use client";

import { DesktopLocalPlayer } from "@/components/spatial/player/desktop/DesktopLocalPlayer";
import { Players } from "@/components/spatial/player/Players";
import { Level } from "@/components/spatial/scene/Level";
import { useColyseusRoom } from "@/utils/colyseus";

export const DesktopExperienceScene = () => {
  const room = useColyseusRoom();
  const name = room?.sessionId ?? "接続中...";

  return (
    <>
      <DesktopLocalPlayer name={name} />
      <Players />
      <Level />
    </>
  );
};
