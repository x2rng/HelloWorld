"use client";

import { ContactShadows } from "@react-three/drei";
import { Color } from "three";
import { AvatarCameraControls, type AvatarViewRequest } from "@/components/avatar-3d/avatar-camera-controls";
import type {
  AvatarQualityTier,
  AvatarV4Config,
} from "@/components/avatar-3d/config/avatar-v4-types";
import { ProceduralAvatarModel } from "@/components/avatar-3d/procedural-avatar-model";

type ProceduralAvatarSceneProps = {
  config: AvatarV4Config;
  quality: AvatarQualityTier;
  shadowSize: number;
  reducedMotion: boolean;
  autoRotate: boolean;
  onInteraction: () => void;
  viewRequest: AvatarViewRequest;
};

export function ProceduralAvatarScene({
  config,
  quality,
  shadowSize,
  reducedMotion,
  autoRotate,
  onInteraction,
  viewRequest,
}: ProceduralAvatarSceneProps) {
  return (
    <>
      <color attach="background" args={["#0a0e15"]} />
      <fog attach="fog" args={["#0a0e15", 11, 18]} />
      <ambientLight intensity={0.58} color={new Color("#dce7ff")} />
      <hemisphereLight
        intensity={0.72}
        color={new Color("#e8efff")}
        groundColor={new Color("#171b24")}
      />
      <directionalLight
        position={[-4.8, 7.8, 6.2]}
        intensity={3.1}
        color={new Color("#fff0df")}
        castShadow
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-near={1}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.00014}
      />
      <directionalLight
        position={[4.4, 4.2, 4.6]}
        intensity={1.15}
        color={new Color("#bdd2ff")}
      />
      <spotLight
        position={[1.6, 6.8, -5.5]}
        intensity={2}
        angle={0.52}
        penumbra={0.84}
        color={new Color("#b4c8ff")}
      />

      <ProceduralAvatarModel
        config={config}
        quality={quality}
        reducedMotion={reducedMotion}
      />

      <mesh position={[0, -3.17, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[4.7, 64]} />
        <meshStandardMaterial color="#111722" roughness={0.94} />
      </mesh>
      <ContactShadows
        position={[0, -3.145, 0]}
        opacity={quality === "low" ? 0.34 : 0.48}
        scale={5.5}
        blur={quality === "high" ? 2.5 : 3.4}
        far={5}
        resolution={quality === "high" ? 1024 : quality === "medium" ? 512 : 256}
        frames={1}
        color="#02040a"
      />

      <AvatarCameraControls
        autoRotate={autoRotate && !reducedMotion && quality !== "low"}
        onInteraction={onInteraction}
        viewRequest={viewRequest}
      />
    </>
  );
}
