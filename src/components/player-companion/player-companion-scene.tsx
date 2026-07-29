"use client";

import { ContactShadows } from "@react-three/drei";
import { Color } from "three";
import type {
  CompanionReactionState,
  CompanionRenderQuality,
  PlayerCompanionConfig,
} from "@/components/player-companion/config/player-companion-types";
import {
  PlayerCompanionCamera,
  type CompanionViewRequest,
} from "@/components/player-companion/player-companion-camera";
import { PlayerCompanionModel } from "@/components/player-companion/player-companion-model";

export function PlayerCompanionScene({
  config,
  reaction,
  reducedMotion,
  quality,
  compact = false,
  modelScale = 1,
  autoRotate = false,
  viewRequest,
  onInteraction = () => undefined,
}: {
  config: PlayerCompanionConfig;
  reaction: CompanionReactionState;
  reducedMotion: boolean;
  quality: CompanionRenderQuality;
  compact?: boolean;
  modelScale?: number;
  autoRotate?: boolean;
  viewRequest?: CompanionViewRequest;
  onInteraction?: () => void;
}) {
  return (
    <>
      {!compact ? (
        <>
          <color attach="background" args={["#0b0d16"]} />
          <fog attach="fog" args={["#0b0d16", 8.5, 13]} />
        </>
      ) : null}
      <ambientLight intensity={compact ? 1.15 : 0.72} color={new Color("#eef2ff")} />
      <hemisphereLight
        intensity={compact ? 1.25 : 0.92}
        color={new Color("#fff4e6")}
        groundColor={new Color("#1a1b2b")}
      />
      <directionalLight
        position={[-3.8, 6.5, 5.2]}
        intensity={compact ? 2.7 : 3.25}
        color={new Color("#fff0dd")}
        castShadow={!compact}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={14}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.00016}
      />
      <directionalLight
        position={[4.2, 3.4, 4.8]}
        intensity={compact ? 1.6 : 1.35}
        color={new Color("#b9c9ff")}
      />
      <pointLight
        position={[0, 2.7, -3]}
        intensity={compact ? 1.2 : 1.7}
        color={new Color("#b28cff")}
      />

      <group
        scale={compact ? 0.76 : modelScale}
        position={compact ? [0, 0.03, 0] : [0, 0, 0]}
      >
        <PlayerCompanionModel
          config={config}
          reaction={reaction}
          reducedMotion={reducedMotion}
          quality={quality}
        />
      </group>

      {!compact ? (
        <>
          <mesh position={[0, -1.42, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[3.4, 64]} />
            <meshStandardMaterial color="#151827" roughness={0.94} />
          </mesh>
          <ContactShadows
            position={[0, -1.405, 0]}
            opacity={0.5}
            scale={4.2}
            blur={2.6}
            far={4}
            resolution={quality === "full" ? 768 : 256}
            frames={1}
            color="#02030a"
          />
        </>
      ) : null}

      {!compact && viewRequest ? (
        <PlayerCompanionCamera
          viewRequest={viewRequest}
          autoRotate={autoRotate && !reducedMotion}
          onInteraction={onInteraction}
        />
      ) : null}
    </>
  );
}
