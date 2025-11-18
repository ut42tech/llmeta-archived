"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useXRInputSourceState, XRSpace } from "@react-three/xr";
import type { RefObject } from "react";
import { useEffect, useRef } from "react";
import { Euler, type Object3D, Quaternion, Vector3 } from "three";
import {
  Player,
  type PlayerHandle,
  type PlayerTransformSnapshot,
} from "@/components/spatial/player/Player";
import { PlayerTag } from "@/components/spatial/player/PlayerTag";
import { SnapRotateXROrigin } from "@/components/spatial/player/SnapRotateXROrigin";
import {
  type HandPoseRefValue,
  useLocalPoseSender,
} from "@/hooks/useLocalPoseSender";
import { useLocalProfileSync } from "@/hooks/useLocalProfileSync";
import { useColyseusRoom } from "@/utils/colyseus";
import { sendProfileUpdate } from "@/utils/colyseus-helpers";

type XRLocalPlayerProps = {
  name: string;
  input?: unknown;
  playerRef?: RefObject<PlayerHandle | null>;
  onPoseUpdate?: (pose: PlayerTransformSnapshot) => void;
  poseUpdateIntervalMs?: number;
};

export const XRLocalPlayer = ({
  name,
  input,
  playerRef,
  onPoseUpdate,
  poseUpdateIntervalMs,
}: XRLocalPlayerProps) => {
  useLocalProfileSync("xr");

  const leftHandRef = useRef<HandPoseRefValue>({
    pos: new Vector3(-0.3, 1.0, 0),
    euler: new Euler(),
    has: false,
  });
  const rightHandRef = useRef<HandPoseRefValue>({
    pos: new Vector3(0.3, 1.0, 0),
    euler: new Euler(),
    has: false,
  });

  const { handlePoseUpdate, interval } = useLocalPoseSender({
    mode: "xr",
    handRefs: { left: leftHandRef, right: rightHandRef },
    onPoseUpdate,
    poseUpdateIntervalMs,
  });

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[-5, 5 * Math.SQRT2, 5]}
        fov={50}
        onUpdate={(cam) => cam.lookAt(0, 2, 0)}
      />

      <Player
        ref={playerRef}
        input={input ? [input] : undefined}
        cameraBehavior={false}
        model={false}
        onPoseUpdate={handlePoseUpdate}
        poseUpdateIntervalMs={interval}
      >
        <PlayerTag name={name} />
        <XRProfileSync />
        <XRControllersProbe leftRef={leftHandRef} rightRef={rightHandRef} />
        <SnapRotateXROrigin />
      </Player>
    </>
  );
};

const XRProfileSync = () => {
  const room = useColyseusRoom();
  const leftHandState = useXRInputSourceState("hand", "left");
  const rightHandState = useXRInputSourceState("hand", "right");

  const isHandTracking = Boolean(
    leftHandState?.inputSource || rightHandState?.inputSource,
  );

  useEffect(() => {
    sendProfileUpdate(room, { isXR: true, isHandTracking });
  }, [room, isHandTracking]);

  return null;
};

type XRControllersProbeProps = {
  leftRef: RefObject<HandPoseRefValue>;
  rightRef: RefObject<HandPoseRefValue>;
};

const XRControllersProbe = ({ leftRef, rightRef }: XRControllersProbeProps) => {
  const leftControllerState = useXRInputSourceState("controller", "left");
  const rightControllerState = useXRInputSourceState("controller", "right");
  const leftHandState = useXRInputSourceState("hand", "left");
  const rightHandState = useXRInputSourceState("hand", "right");

  const leftState = leftHandState?.inputSource
    ? leftHandState
    : leftControllerState;
  const rightState = rightHandState?.inputSource
    ? rightHandState
    : rightControllerState;

  const leftSpaceRef = useRef<Object3D>(null);
  const rightSpaceRef = useRef<Object3D>(null);

  useFrame(() => {
    if (leftState?.inputSource && leftSpaceRef.current && leftRef.current) {
      const pos = leftSpaceRef.current.getWorldPosition(new Vector3());
      const rot = new Euler().setFromQuaternion(
        leftSpaceRef.current.getWorldQuaternion(new Quaternion()),
        "YXZ",
      );
      leftRef.current.pos.copy(pos);
      leftRef.current.euler.copy(rot);
      leftRef.current.has = true;
    } else if (leftRef.current) {
      leftRef.current.has = false;
    }

    if (rightState?.inputSource && rightSpaceRef.current && rightRef.current) {
      const pos = rightSpaceRef.current.getWorldPosition(new Vector3());
      const rot = new Euler().setFromQuaternion(
        rightSpaceRef.current.getWorldQuaternion(new Quaternion()),
        "YXZ",
      );
      rightRef.current.pos.copy(pos);
      rightRef.current.euler.copy(rot);
      rightRef.current.has = true;
    } else if (rightRef.current) {
      rightRef.current.has = false;
    }
  });

  const getHandJoint = (inputSource: XRInputSource | undefined) => {
    if (!inputSource?.hand) return null;
    const hand = inputSource.hand;
    if (typeof hand.get === "function") {
      return hand.get("wrist") ?? null;
    }
    return null;
  };

  const leftSpace =
    getHandJoint(leftState?.inputSource) ??
    leftState?.inputSource?.gripSpace ??
    leftState?.inputSource?.targetRaySpace;

  const rightSpace =
    getHandJoint(rightState?.inputSource) ??
    rightState?.inputSource?.gripSpace ??
    rightState?.inputSource?.targetRaySpace;

  return (
    <>
      {leftSpace && <XRSpace ref={leftSpaceRef} space={leftSpace} />}
      {rightSpace && <XRSpace ref={rightSpaceRef} space={rightSpace} />}
    </>
  );
};
