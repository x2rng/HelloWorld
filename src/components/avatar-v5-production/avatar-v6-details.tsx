"use client";

import { MathUtils } from "three";
import { getAvatarV5SkinColour } from "@/components/avatar-v5-production/config/avatar-v5-catalogue";
import type { AvatarV5Config } from "@/components/avatar-v5-production/config/avatar-v5-types";

function Material({
  colour,
  roughness = 0.72,
  metalness = 0,
}: {
  colour: string;
  roughness?: number;
  metalness?: number;
}) {
  return (
    <meshStandardMaterial
      color={colour}
      roughness={roughness}
      metalness={metalness}
    />
  );
}

export function AvatarV6Details({ config }: { config: AvatarV5Config }) {
  const skin = getAvatarV5SkinColour(config.skinToneId);
  const earScale =
    config.earPresetId === "compact"
      ? 0.72
      : config.earPresetId === "defined"
        ? 1.08
        : 0.9;
  const earX = config.frameId === "structured" ? 0.072 : 0.064;
  const glasses = config.glassesStyleId;
  const round = glasses === "round";
  const sunglasses = glasses === "sunglasses";

  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * earX, 1.59, 0]} scale={earScale}>
          <mesh scale={[0.014, 0.035, 0.011]}>
            <sphereGeometry args={[1, 24, 18]} />
            <Material colour={skin} roughness={0.86} />
          </mesh>
          <mesh
            position={[side * -0.002, 0.004, 0.01]}
            scale={[0.004, 0.018, 0.003]}
          >
            <capsuleGeometry args={[1, 1, 8, 14]} />
            <Material colour="#7f5542" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {glasses !== "none" ? (
        <group position={[0, 1.575, 0.205]} scale={0.34}>
          {[-0.095, 0.095].map((x) => (
            <mesh
              key={x}
              position={[x, 0, 0]}
              scale={round ? [1, 1, 1] : [1.18, 0.78, 1]}
            >
              <torusGeometry args={[0.064, 0.009, 10, 30]} />
              <meshPhysicalMaterial
                color={sunglasses ? "#1a2532" : "#20242b"}
                roughness={0.28}
                metalness={0.55}
                transmission={sunglasses ? 0.08 : 0}
              />
            </mesh>
          ))}
          <mesh scale={[0.035, 0.006, 0.006]}>
            <boxGeometry args={[1, 1, 1]} />
            <Material colour="#20242b" roughness={0.28} metalness={0.55} />
          </mesh>
          {sunglasses &&
            [-0.095, 0.095].map((x) => (
              <mesh key={x} position={[x, 0, -0.002]}>
                <circleGeometry args={[0.055, 28]} />
                <meshPhysicalMaterial
                  color="#162131"
                  transparent
                  opacity={0.72}
                  roughness={0.22}
                />
              </mesh>
            ))}
        </group>
      ) : null}

      {config.accessoryIds.includes("necklace") ? (
        <group position={[0, 1.37, 0.12]} scale={0.48}>
          <mesh rotation-z={Math.PI}>
            <torusGeometry args={[0.11, 0.006, 8, 36, Math.PI]} />
            <Material colour="#d0b46f" roughness={0.24} metalness={0.78} />
          </mesh>
          <mesh position={[0, -0.105, 0]}>
            <sphereGeometry args={[0.018, 14, 10]} />
            <Material colour="#d0b46f" roughness={0.24} metalness={0.78} />
          </mesh>
        </group>
      ) : null}

      {config.accessoryIds.includes("watch") ? (
        <group
          position={[-0.16, 0.9, 0]}
          rotation-z={MathUtils.degToRad(-8)}
          scale={0.55}
        >
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.045, 0.012, 8, 24]} />
            <Material colour="#1e2834" roughness={0.58} />
          </mesh>
          <mesh position={[0, 0, 0.045]} scale={[0.03, 0.038, 0.012]}>
            <boxGeometry args={[1, 1, 1]} />
            <Material colour="#b8c2cd" roughness={0.2} metalness={0.75} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
