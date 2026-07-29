"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, MathUtils } from "three";
import {
  getCompanionEyeColour,
  getCompanionHairColour,
  getCompanionSkinColour,
} from "@/components/player-companion/config/player-companion-catalogue";
import type {
  CompanionReactionState,
  PlayerCompanionConfig,
} from "@/components/player-companion/config/player-companion-types";
import {
  CompanionMaterial,
  shiftCompanionColour,
} from "@/components/player-companion/materials/companion-material";

function Eye({
  side,
  config,
  eyeRef,
}: {
  side: -1 | 1;
  config: PlayerCompanionConfig;
  eyeRef: React.RefObject<Group | null>;
}) {
  const shape =
    config.eyeShapeId === "bright"
      ? [1.04, 1.12, 1]
      : config.eyeShapeId === "soft"
        ? [1.08, 0.88, 1]
        : config.eyeShapeId === "focused"
          ? [1.12, 0.68, 1]
          : [1.15, 0.84, 1];
  const iris = getCompanionEyeColour(config.eyeColourId);

  return (
    <group
      ref={eyeRef}
      position={[side * 0.245, 1.72, 0.575]}
      scale={shape as [number, number, number]}
    >
      <mesh scale={[0.13, 0.105, 0.045]} castShadow>
        <sphereGeometry args={[1, 28, 20]} />
        <CompanionMaterial colour="#f7f3ed" roughness={0.48} />
      </mesh>
      <mesh position={[side * -0.008, -0.002, 0.043]} scale={[0.066, 0.069, 0.024]}>
        <sphereGeometry args={[1, 24, 18]} />
        <CompanionMaterial colour={iris} roughness={0.34} clearcoat={0.1} />
      </mesh>
      <mesh position={[side * -0.008, -0.004, 0.061]} scale={[0.031, 0.037, 0.012]}>
        <sphereGeometry args={[1, 20, 14]} />
        <CompanionMaterial colour="#10131a" roughness={0.28} />
      </mesh>
      <mesh position={[side * -0.028, 0.025, 0.074]} scale={0.012}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh
        position={[0, 0.078, 0.037]}
        scale={[0.145, 0.023, 0.036]}
        rotation-z={side * -0.02}
      >
        <sphereGeometry args={[1, 24, 14]} />
        <CompanionMaterial
          colour={shiftCompanionColour(getCompanionSkinColour(config.skinToneId), -0.045)}
          roughness={0.82}
        />
      </mesh>
    </group>
  );
}

function Mouth({ config }: { config: PlayerCompanionConfig }) {
  const mouthColour = shiftCompanionColour(
    getCompanionSkinColour(config.skinToneId),
    -0.2,
    0.08,
  );
  const cheerful = config.expressionId === "cheerful";
  const warm = config.expressionId === "warm";
  const focused = config.expressionId === "focused";
  const width = cheerful ? 0.12 : warm ? 0.095 : 0.075;
  const y = cheerful ? 1.408 : 1.42;

  if (config.expressionId === "calm" || focused) {
    return (
      <mesh
        position={[0, y, 0.638]}
        scale={[width, 0.012, 0.012]}
        rotation-z={focused ? -0.015 : 0}
      >
        <capsuleGeometry args={[0.7, 0.9, 8, 16]} />
        <CompanionMaterial colour={mouthColour} roughness={0.78} />
      </mesh>
    );
  }

  return (
    <group position={[0, y, 0.635]} rotation-z={Math.PI}>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[width, 0.011, 10, 28, Math.PI]} />
        <CompanionMaterial colour={mouthColour} roughness={0.75} />
      </mesh>
      {cheerful ? (
        <mesh position={[0, -0.015, -0.006]} scale={[0.07, 0.02, 0.009]}>
          <sphereGeometry args={[1, 18, 12]} />
          <CompanionMaterial colour="#f0c2ba" roughness={0.82} />
        </mesh>
      ) : null}
    </group>
  );
}

export function CompanionFace({
  config,
  reaction,
  reducedMotion,
}: {
  config: PlayerCompanionConfig;
  reaction: CompanionReactionState;
  reducedMotion: boolean;
}) {
  const leftEye = useRef<Group>(null);
  const rightEye = useRef<Group>(null);
  const browColour = getCompanionHairColour(config.hairColourId);
  const skin = getCompanionSkinColour(config.skinToneId);
  const browTilt =
    config.eyebrowStyleId === "confident"
      ? 0.09
      : config.eyebrowStyleId === "soft"
        ? -0.035
        : config.eyebrowStyleId === "defined"
          ? 0.045
          : 0.01;
  const browWidth = config.eyebrowStyleId === "defined" ? 0.13 : 0.115;

  useFrame(({ clock }, delta) => {
    if (!leftEye.current || !rightEye.current) return;
    const cycle = clock.elapsedTime % 4.9;
    const blink =
      reducedMotion || reaction === "celebrate"
        ? 1
        : cycle > 4.56
          ? Math.max(0.08, Math.abs(cycle - 4.72) / 0.16)
          : 1;
    const focusedScale = reaction === "focused" ? 0.72 : 1;
    const target = blink * focusedScale;
    leftEye.current.scale.y = MathUtils.damp(
      leftEye.current.scale.y,
      target,
      28,
      delta,
    );
    rightEye.current.scale.y = MathUtils.damp(
      rightEye.current.scale.y,
      target,
      28,
      delta,
    );
  });

  return (
    <group>
      <Eye side={-1} config={config} eyeRef={leftEye} />
      <Eye side={1} config={config} eyeRef={rightEye} />

      {([-1, 1] as const).map((side) => (
        <mesh
          key={side}
          position={[side * 0.235, 1.9, 0.588]}
          scale={[browWidth, 0.018, 0.022]}
          rotation-z={side * browTilt}
        >
          <capsuleGeometry args={[0.7, 0.8, 8, 16]} />
          <CompanionMaterial colour={browColour} roughness={0.78} />
        </mesh>
      ))}

      <mesh position={[0, 1.57, 0.633]} scale={[0.055, 0.075, 0.045]}>
        <sphereGeometry args={[1, 24, 18]} />
        <CompanionMaterial
          colour={shiftCompanionColour(skin, 0.025)}
          roughness={0.84}
        />
      </mesh>
      <mesh position={[-0.023, 1.545, 0.672]} scale={[0.009, 0.006, 0.005]}>
        <sphereGeometry args={[1, 12, 8]} />
        <CompanionMaterial
          colour={shiftCompanionColour(skin, -0.18)}
          roughness={0.9}
        />
      </mesh>
      <mesh position={[0.023, 1.545, 0.672]} scale={[0.009, 0.006, 0.005]}>
        <sphereGeometry args={[1, 12, 8]} />
        <CompanionMaterial
          colour={shiftCompanionColour(skin, -0.18)}
          roughness={0.9}
        />
      </mesh>

      <Mouth config={config} />

      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 0.69, 1.61, 0]}>
          <mesh scale={[0.115, 0.175, 0.075]}>
            <sphereGeometry args={[1, 24, 18]} />
            <CompanionMaterial colour={skin} roughness={0.84} />
          </mesh>
          <mesh
            position={[side * -0.018, 0, 0.063]}
            scale={[0.043, 0.085, 0.018]}
          >
            <sphereGeometry args={[1, 20, 14]} />
            <CompanionMaterial
              colour={shiftCompanionColour(skin, -0.09)}
              roughness={0.9}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
