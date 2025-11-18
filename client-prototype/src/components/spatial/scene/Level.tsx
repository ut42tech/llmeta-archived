import { BakeShadows, Environment, Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { BvhPhysicsBody } from "@react-three/viverse";
import { TeleportTarget } from "@react-three/xr";
import type { Vector3 } from "three";
import { SceneMap } from "@/components/spatial/scene/SceneMap";

type LevelProps = {
  onTeleport?: (position: Vector3) => void;
};

export const Level = (props: LevelProps) => {
  return (
    <>
      <BakeShadows />
      <Environment preset="sunset" />
      <Sky />

      <directionalLight
        castShadow
        position={[50, 80, 50]}
        intensity={2}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.001}
        shadow-normalBias={0.02}
        shadow-camera-near={1}
        shadow-camera-far={400}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-camera-left={-150}
        shadow-camera-right={150}
      />
      <ambientLight intensity={0.35} />

      <TeleportTarget onTeleport={props.onTeleport}>
        <BvhPhysicsBody>
          <Physics>
            <SceneMap
              scale={[2, 2, 2]}
              position={[-2, -0.7, -16]}
              model={"models/city_scene_tokyo.glb"}
            />
          </Physics>
        </BvhPhysicsBody>
      </TeleportTarget>
    </>
  );
};
