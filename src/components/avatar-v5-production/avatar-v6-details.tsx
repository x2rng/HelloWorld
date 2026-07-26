"use client";

import { RoundedBox } from "@react-three/drei";
import { Color, MathUtils } from "three";
import {
  getAvatarV5PaletteColour,
  getAvatarV5SkinColour,
} from "@/components/avatar-v5-production/config/avatar-v5-catalogue";
import type { AvatarV5Config } from "@/components/avatar-v5-production/config/avatar-v5-types";
import { AvatarV6ModernTop } from "@/components/avatar-v5-production/avatar-v6-garments";

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

function darker(colour: string, amount = 0.08) {
  return new Color(colour).offsetHSL(0, 0, -amount).getStyle();
}

function BottomDetails({ config }: { config: AvatarV5Config }) {
  const colour = getAvatarV5PaletteColour(config.bottomColourId);
  const trim = darker(colour, 0.12);
  const z = 0.19;
  const modern =
    config.bottomStyleId !== "heritage-trousers" &&
    config.bottomStyleId !== "ranger-trousers";
  const slim =
    config.bottomStyleId === "slim-trousers" ||
    config.bottomStyleId === "sport-trousers";
  const relaxed =
    config.bottomStyleId === "relaxed-trousers" ||
    config.bottomStyleId === "utility-trousers";
  const topRadius = relaxed ? 0.175 : slim ? 0.15 : 0.16;
  const ankleRadius = relaxed ? 0.112 : slim ? 0.082 : 0.097;

  const shell = modern ? (
    <group>
      <RoundedBox
        args={[0.52, 0.2, 0.24]}
        radius={0.055}
        smoothness={7}
        position={[0, 0.84, 0]}
        renderOrder={2}
      >
        <meshStandardMaterial
          color={colour}
          roughness={config.bottomStyleId === "jeans" ? 0.96 : 0.84}
          depthTest={false}
        />
      </RoundedBox>
      {[-0.13, 0.13].map((x) => (
        <mesh key={x} position={[x, 0.53, 0]} renderOrder={2}>
          <cylinderGeometry
            args={[ankleRadius, topRadius, 0.58, 28, 5, false]}
          />
          <meshStandardMaterial
            color={colour}
            roughness={config.bottomStyleId === "jeans" ? 0.96 : 0.84}
            depthTest={false}
          />
        </mesh>
      ))}
      <RoundedBox
        args={[0.39, 0.035, 0.215]}
        radius={0.012}
        smoothness={5}
        position={[0, 0.94, 0]}
        renderOrder={2}
      >
        <meshStandardMaterial color={trim} roughness={0.9} depthTest={false} />
      </RoundedBox>
    </group>
  ) : null;

  if (config.bottomStyleId === "jeans") {
    return (
      <group>
        {shell}
        <RoundedBox
          args={[0.19, 0.018, 0.012]}
          radius={0.005}
          smoothness={3}
          position={[0, 0.82, z]}
        >
          <Material colour={trim} roughness={0.96} />
        </RoundedBox>
        {[-0.055, 0.055].map((x) => (
          <mesh key={x} position={[x, 0.73, z + 0.008]} rotation-z={x < 0 ? -0.35 : 0.35}>
            <torusGeometry args={[0.025, 0.003, 8, 22, Math.PI]} />
            <Material colour="#b7a678" roughness={0.9} />
          </mesh>
        ))}
      </group>
    );
  }

  if (config.bottomStyleId === "utility-trousers") {
    return (
      <group>
        {shell}
        {[-0.18, 0.18].map((x) => (
          <RoundedBox
            key={x}
            args={[0.065, 0.105, 0.025]}
            radius={0.008}
            smoothness={4}
            position={[x, 0.68, 0.2]}
            renderOrder={3}
          >
            <Material colour={darker(colour, 0.065)} roughness={0.88} />
          </RoundedBox>
        ))}
      </group>
    );
  }

  if (config.bottomStyleId === "sport-trousers") {
    return (
      <group>
        {shell}
        {[-0.086, 0.086].map((x) => (
          <RoundedBox
            key={x}
            args={[0.007, 0.55, 0.008]}
            radius={0.003}
            smoothness={3}
            position={[x, 0.45, z]}
          >
            <Material colour="#d7dbe1" roughness={0.82} />
          </RoundedBox>
        ))}
      </group>
    );
  }

  return shell;
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
      <AvatarV6ModernTop config={config} />
      <BottomDetails config={config} />
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
