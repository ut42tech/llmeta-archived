"use client";

import { Canvas } from "@react-three/fiber";
import { BvhPhysicsWorld } from "@react-three/viverse";
import { createXRStore, XR } from "@react-three/xr";
import { Suspense, useMemo } from "react";
import { DesktopExperienceScene } from "@/components/spatial/page/experience/desktop/DesktopExperienceScene";
import { XRExperienceScene } from "@/components/spatial/page/experience/xr/XRExperienceScene";

type Props = {
  mode: "desktop" | "xr";
};

export const ExperienceCanvas = ({ mode }: Props) => {
  // 常時 XR でラップするが、store は安定参照にして再作成を避ける
  const xrStore = useMemo(
    () =>
      createXRStore({
        offerSession: "immersive-vr",
        hand: {
          left: { teleportPointer: false },
          right: { teleportPointer: true },
        },
        controller: {
          left: { teleportPointer: false },
          right: { teleportPointer: true },
        },
      }),
    [],
  );

  return (
    <Canvas
      className="fixed! w-screen! h-screen! touch-none"
      shadows
      gl={{ antialias: true, localClippingEnabled: true }}
    >
      <Suspense fallback={null}>
        <BvhPhysicsWorld>
          {mode === "xr" ? (
            <XR store={xrStore}>
              <XRExperienceScene />
            </XR>
          ) : (
            <DesktopExperienceScene />
          )}
        </BvhPhysicsWorld>
      </Suspense>
    </Canvas>
  );
};
