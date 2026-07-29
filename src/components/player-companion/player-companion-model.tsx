"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, MathUtils } from "three";
import { getCompanionSkinColour } from "@/components/player-companion/config/player-companion-catalogue";
import type {
  CompanionReactionState,
  CompanionRenderQuality,
  PlayerCompanionConfig,
} from "@/components/player-companion/config/player-companion-types";
import {
  CompanionMaterial,
  shiftCompanionColour,
} from "@/components/player-companion/materials/companion-material";
import { CompanionFace } from "@/components/player-companion/parts/companion-face";
import { CompanionHair } from "@/components/player-companion/parts/companion-hair";
import { CompanionBodyAndOutfit } from "@/components/player-companion/parts/companion-outfit";

function bodyScale(config: PlayerCompanionConfig): [number, number, number] {
  if (config.bodyTypeId === "petite") return [0.9, 0.94, 0.91];
  if (config.bodyTypeId === "athletic") return [1.09, 1.04, 1.03];
  if (config.bodyTypeId === "soft") return [1.1, 0.98, 1.1];
  return [1, 1, 1];
}

function headScale(config: PlayerCompanionConfig): [number, number, number] {
  if (config.bodyTypeId === "petite") return [1.02, 1.04, 1.01];
  if (config.bodyTypeId === "athletic") return [0.98, 0.99, 0.99];
  if (config.bodyTypeId === "soft") return [1.04, 1.01, 1.04];
  return [1, 1, 1];
}

function ReactionAura({
  reaction,
}: {
  reaction: CompanionReactionState;
}) {
  if (reaction !== "celebrate" && reaction !== "level-up") return null;
  const colour = reaction === "level-up" ? "#f3c86a" : "#8ea7ff";

  return (
    <group>
      <mesh position={[0, -1.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.025, 12, 56]} />
        <meshBasicMaterial color={colour} transparent opacity={0.7} />
      </mesh>
      {[
        [-0.95, 0.7, 0.1],
        [0.9, 1.1, -0.05],
        [-0.72, 1.8, -0.08],
        [0.72, 2.05, 0.04],
        [0, 2.5, -0.12],
      ].map(([x, y, z], index) => (
        <mesh key={`${x}-${y}`} position={[x, y, z]} scale={0.045 + index * 0.006}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={colour} transparent opacity={0.78} />
        </mesh>
      ))}
    </group>
  );
}

export function PlayerCompanionModel({
  config,
  reaction = "idle",
  reducedMotion = false,
  quality = "full",
}: {
  config: PlayerCompanionConfig;
  reaction?: CompanionReactionState;
  reducedMotion?: boolean;
  quality?: CompanionRenderQuality;
}) {
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const aura = useRef<Group>(null);
  const skin = getCompanionSkinColour(config.skinToneId);
  const skinShadow = shiftCompanionColour(skin, -0.075);
  const selectedBodyScale = bodyScale(config);
  const selectedHeadScale = headScale(config);

  useFrame(({ clock }, delta) => {
    if (!root.current || !body.current || !head.current) return;
    const elapsed = clock.elapsedTime;
    const motion = reducedMotion ? 0 : 1;
    const celebration = reaction === "celebrate";
    const levelUp = reaction === "level-up";
    const focused = reaction === "focused";
    const bounce = celebration
      ? Math.abs(Math.sin(elapsed * 4.4)) * 0.12
      : levelUp
        ? Math.abs(Math.sin(elapsed * 5.2)) * 0.16
        : Math.sin(elapsed * 1.45) * 0.035;
    const targetY = motion * bounce;
    root.current.position.y = MathUtils.damp(
      root.current.position.y,
      targetY,
      7,
      delta,
    );
    root.current.rotation.y = MathUtils.damp(
      root.current.rotation.y,
      levelUp ? Math.sin(elapsed * 2.2) * 0.22 : Math.sin(elapsed * 0.52) * 0.018 * motion,
      7,
      delta,
    );
    body.current.scale.y = MathUtils.damp(
      body.current.scale.y,
      1 + Math.sin(elapsed * 1.45) * 0.012 * motion,
      6,
      delta,
    );
    head.current.rotation.z = MathUtils.damp(
      head.current.rotation.z,
      focused ? -0.055 : celebration ? Math.sin(elapsed * 2.4) * 0.055 : Math.sin(elapsed * 0.7) * 0.012 * motion,
      7,
      delta,
    );
    head.current.rotation.x = MathUtils.damp(
      head.current.rotation.x,
      focused ? -0.04 : 0,
      7,
      delta,
    );

    if (leftArm.current && rightArm.current) {
      const leftTarget = celebration || levelUp ? -2.1 : 0.08;
      const rightTarget = celebration || levelUp ? 2.1 : -0.08;
      leftArm.current.rotation.z = MathUtils.damp(
        leftArm.current.rotation.z,
        leftTarget,
        7,
        delta,
      );
      rightArm.current.rotation.z = MathUtils.damp(
        rightArm.current.rotation.z,
        rightTarget,
        7,
        delta,
      );
    }

    if (aura.current) {
      aura.current.rotation.y += delta * (levelUp ? 1.2 : 0.5) * motion;
    }
  });

  return (
    <group ref={root}>
      <group ref={body} scale={selectedBodyScale}>
        <CompanionBodyAndOutfit
          config={config}
          leftArmRef={leftArm}
          rightArmRef={rightArm}
        />
      </group>

      <group ref={head} scale={selectedHeadScale}>
        <mesh position={[0, 1.67, 0]} scale={[0.69, 0.77, 0.625]} castShadow receiveShadow>
          <sphereGeometry args={[1, quality === "compact" ? 28 : 40, quality === "compact" ? 22 : 32]} />
          <CompanionMaterial colour={skin} roughness={0.79} clearcoat={0.02} />
        </mesh>
        <mesh position={[-0.34, 1.48, 0.43]} scale={[0.31, 0.23, 0.22]}>
          <sphereGeometry args={[1, 24, 18]} />
          <CompanionMaterial colour={skin} roughness={0.81} />
        </mesh>
        <mesh position={[0.34, 1.48, 0.43]} scale={[0.31, 0.23, 0.22]}>
          <sphereGeometry args={[1, 24, 18]} />
          <CompanionMaterial colour={skin} roughness={0.81} />
        </mesh>
        <mesh position={[0, 1.24, 0.14]} scale={[0.38, 0.23, 0.36]}>
          <sphereGeometry args={[1, 26, 20]} />
          <CompanionMaterial colour={skinShadow} roughness={0.84} />
        </mesh>
        <CompanionFace
          config={config}
          reaction={reaction}
          reducedMotion={reducedMotion}
        />
        <CompanionHair config={config} />
      </group>

      <group ref={aura}>
        <ReactionAura reaction={reaction} />
      </group>
    </group>
  );
}
