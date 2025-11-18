"use client";

import { useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import { useCallback, useMemo } from "react";
import { Euler, Quaternion, Vector3 } from "three";
import type { PlayerTransformSnapshot } from "@/components/spatial/player/Player";
import { useColyseusRoom } from "@/utils/colyseus";
import {
  addHandData,
  createDesktopMoveData,
  sendMoveUpdate,
} from "@/utils/colyseus-helpers";

export type HandPoseRefValue = {
  pos: Vector3;
  euler: Euler;
  has: boolean;
};

type Params = {
  mode: "desktop" | "xr";
  handRefs?: {
    left: RefObject<HandPoseRefValue>;
    right: RefObject<HandPoseRefValue>;
  };
  onPoseUpdate?: (pose: PlayerTransformSnapshot) => void;
  poseUpdateIntervalMs?: number;
};

export const useLocalPoseSender = ({
  mode,
  handRefs,
  onPoseUpdate,
  poseUpdateIntervalMs,
}: Params) => {
  const room = useColyseusRoom();
  const { camera } = useThree();

  const getCameraWorldTransform = useCallback(() => {
    const position = camera.getWorldPosition(new Vector3());
    const quaternion = camera.getWorldQuaternion(new Quaternion());
    const rotation = new Euler().setFromQuaternion(quaternion, "YXZ");
    return { position, quaternion, rotation };
  }, [camera]);

  const leftHandRef = handRefs?.left;
  const rightHandRef = handRefs?.right;

  const handlePoseUpdate = useCallback(
    (pose: PlayerTransformSnapshot) => {
      onPoseUpdate?.(pose);

      const { position, quaternion, rotation } = getCameraWorldTransform();
      let moveData = createDesktopMoveData(position, rotation);

      if (mode === "xr" && leftHandRef?.current && rightHandRef?.current) {
        moveData = addHandData(
          moveData,
          leftHandRef.current,
          rightHandRef.current,
          position,
          quaternion,
          rotation,
        );
      }

      sendMoveUpdate(room, moveData);
    },
    [
      onPoseUpdate,
      getCameraWorldTransform,
      mode,
      room,
      leftHandRef,
      rightHandRef,
    ],
  );

  const interval = useMemo(
    () => poseUpdateIntervalMs ?? 50,
    [poseUpdateIntervalMs],
  );

  return { handlePoseUpdate, interval };
};
