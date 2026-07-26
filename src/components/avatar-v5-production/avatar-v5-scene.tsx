"use client";

import { ContactShadows } from "@react-three/drei";
import { Color } from "three";
import {
  AvatarCameraControls,
  type AvatarViewRequest,
} from "@/components/avatar-3d/avatar-camera-controls";
import type { AvatarQualityTier } from "@/components/avatar-3d/config/avatar-v4-types";
import { AvatarV5ProductionModel } from "@/components/avatar-v5-production/avatar-v5-model";
import type { AvatarV5Config } from "@/components/avatar-v5-production/config/avatar-v5-types";

export function AvatarV5ProductionScene({
  config,
  quality,
  shadowSize,
  reducedMotion,
  autoRotate,
  onInteraction,
  viewRequest,
}: {
  config: AvatarV5Config;
  quality: AvatarQualityTier;
  shadowSize: number;
  reducedMotion: boolean;
  autoRotate: boolean;
  onInteraction: () => void;
  viewRequest: AvatarViewRequest;
}) {
  return (
    <>
      <color attach="background" args={["#0b1018"]} />
      <fog attach="fog" args={["#0b1018", 12, 19]} />

      <ambientLight intensity={0.48} color={new Color("#e1e9f6")} />
      <hemisphereLight
        intensity={0.65}
        color={new Color("#eef3ff")}
        groundColor={new Color("#171d28")}
      />
      <directionalLight
        position={[-4.5, 7.6, 5.8]}
        intensity={2.8}
        color={new Color("#fff1e2")}
        castShadow
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-camera-near={1}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.00012}
      />
      <directionalLight
        position={[4.2, 3.8, 4.4]}
        intensity={0.9}
        color={new Color("#c8d9ff")}
      />
      <spotLight
        position={[1.8, 6.5, -5.2]}
        intensity={1.45}
        angle={0.55}
        penumbra={0.86}
        color={new Color("#c3d3ff")}
      />

      <AvatarV5ProductionModel
        config={config}
        animate={!reducedMotion && quality !== "low"}
      />

      <mesh position={[0, -3.17, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[4.7, 64]} />
        <meshStandardMaterial color="#141b27" roughness={0.96} />
      </mesh>
      <ContactShadows
        position={[0, -3.145, 0]}
        opacity={quality === "low" ? 0.32 : 0.46}
        scale={5.5}
        blur={quality === "high" ? 2.5 : 3.4}
        far={5}
        resolution={
          quality === "high" ? 1024 : quality === "medium" ? 512 : 256
        }
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
