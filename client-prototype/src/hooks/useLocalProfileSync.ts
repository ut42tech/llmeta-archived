"use client";

import { useEffect } from "react";
import { useColyseusRoom } from "@/utils/colyseus";
import { sendProfileUpdate } from "@/utils/colyseus-helpers";

type Mode = "desktop" | "xr";

export const useLocalProfileSync = (mode: Mode) => {
  const room = useColyseusRoom();

  useEffect(() => {
    if (mode === "desktop") {
      sendProfileUpdate(room, { isXR: false, isHandTracking: false });
      return;
    }

    sendProfileUpdate(room, { isXR: true });
  }, [room, mode]);
};
