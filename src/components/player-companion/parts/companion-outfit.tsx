"use client";

import { RoundedBox } from "@react-three/drei";
import type { RefObject } from "react";
import type { Group } from "three";
import {
  getCompanionColour,
  getCompanionSkinColour,
} from "@/components/player-companion/config/player-companion-catalogue";
import type { PlayerCompanionConfig } from "@/components/player-companion/config/player-companion-types";
import {
  CompanionMaterial,
  shiftCompanionColour,
} from "@/components/player-companion/materials/companion-material";

function Rib({
  position,
  scale,
  colour,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  colour: string;
}) {
  return (
    <mesh position={position} scale={scale}>
      <torusGeometry args={[1, 0.16, 8, 24]} />
      <CompanionMaterial colour={colour} roughness={0.9} />
    </mesh>
  );
}

function Arm({
  side,
  config,
  armRef,
}: {
  side: -1 | 1;
  config: PlayerCompanionConfig;
  armRef: RefObject<Group | null>;
}) {
  const skin = getCompanionSkinColour(config.skinToneId);
  const top = getCompanionColour(config.topColourId);
  const shadow = shiftCompanionColour(top, -0.075);
  const longSleeve = config.topStyleId !== "fitted-tee";
  const varsity = config.topStyleId === "varsity-jacket";
  const sleeveColour = varsity
    ? shiftCompanionColour(top, 0.18, -0.1)
    : top;

  return (
    <group
      ref={armRef}
      position={[side * 0.49, 0.82, 0]}
      rotation={[0, 0, side * -0.08]}
    >
      <mesh position={[0, -0.27, 0]} scale={[0.145, 0.37, 0.15]} castShadow>
        <capsuleGeometry args={[1, 1, 8, 20]} />
        <CompanionMaterial colour={skin} roughness={0.82} />
      </mesh>
      <mesh position={[0, -0.7, 0]} scale={[0.13, 0.29, 0.14]} castShadow>
        <capsuleGeometry args={[1, 1, 8, 20]} />
        <CompanionMaterial colour={skin} roughness={0.82} />
      </mesh>
      <mesh position={[0, -0.99, 0.02]} scale={[0.145, 0.18, 0.145]} castShadow>
        <sphereGeometry args={[1, 24, 18]} />
        <CompanionMaterial colour={skin} roughness={0.82} />
      </mesh>

      <mesh
        position={[0, longSleeve ? -0.39 : -0.16, 0]}
        scale={[
          longSleeve ? 0.17 : 0.185,
          longSleeve ? 0.62 : 0.27,
          longSleeve ? 0.175 : 0.19,
        ]}
        castShadow
      >
        <capsuleGeometry args={[1, 1, 10, 24]} />
        <CompanionMaterial
          colour={sleeveColour}
          roughness={config.topStyleId === "knit-sweater" ? 0.96 : 0.8}
        />
      </mesh>
      {longSleeve ? (
        <mesh position={[0, -0.78, 0]} scale={[0.175, 0.1, 0.18]}>
          <cylinderGeometry args={[1, 1, 1, 24]} />
          <CompanionMaterial colour={shadow} roughness={0.9} />
        </mesh>
      ) : null}
    </group>
  );
}

function Top({ config }: { config: PlayerCompanionConfig }) {
  const colour = getCompanionColour(config.topColourId);
  const shadow = shiftCompanionColour(colour, -0.09);
  const highlight = shiftCompanionColour(colour, 0.09, -0.04);
  const hoodie = config.topStyleId === "soft-hoodie";
  const sweater = config.topStyleId === "knit-sweater";
  const varsity = config.topStyleId === "varsity-jacket";
  const torsoScale: [number, number, number] = hoodie
    ? [0.41, 0.57, 0.31]
    : sweater
      ? [0.4, 0.55, 0.3]
      : varsity
        ? [0.425, 0.56, 0.315]
        : [0.38, 0.52, 0.285];

  return (
    <group>
      <mesh position={[0, 0.53, 0]} scale={torsoScale} castShadow>
        <capsuleGeometry args={[1, 1, 12, 32]} />
        <CompanionMaterial
          colour={colour}
          roughness={sweater ? 0.96 : hoodie ? 0.9 : 0.78}
        />
      </mesh>

      <mesh
        position={[0, 1.02, 0.015]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.18, 0.13, 0.07]}
      >
        <torusGeometry args={[1, 0.22, 10, 28]} />
        <CompanionMaterial colour={shadow} roughness={0.9} />
      </mesh>

      {sweater ? (
        <>
          <Rib
            position={[0, 0.03, 0]}
            scale={[0.33, 0.09, 0.24]}
            colour={shadow}
          />
          <mesh position={[0, 0.55, 0.292]} scale={[0.25, 0.006, 0.006]}>
            <boxGeometry args={[1, 1, 1]} />
            <CompanionMaterial colour={highlight} roughness={0.94} />
          </mesh>
        </>
      ) : null}

      {hoodie ? (
        <>
          <mesh position={[0, 1.14, -0.12]} scale={[0.37, 0.43, 0.22]} castShadow>
            <torusGeometry args={[0.66, 0.28, 16, 36]} />
            <CompanionMaterial colour={shadow} roughness={0.9} />
          </mesh>
          {([-1, 1] as const).map((side) => (
            <group key={side}>
              <mesh
                position={[side * 0.085, 0.86, 0.3]}
                scale={[0.012, 0.28, 0.012]}
              >
                <cylinderGeometry args={[1, 1, 1, 12]} />
                <CompanionMaterial colour={highlight} roughness={0.82} />
              </mesh>
              <mesh position={[side * 0.085, 0.7, 0.31]} scale={0.025}>
                <sphereGeometry args={[1, 14, 10]} />
                <CompanionMaterial colour={highlight} roughness={0.8} />
              </mesh>
            </group>
          ))}
          <RoundedBox
            args={[0.42, 0.2, 0.06]}
            radius={0.055}
            smoothness={6}
            position={[0, 0.27, 0.286]}
          >
            <CompanionMaterial colour={shiftCompanionColour(colour, -0.035)} roughness={0.92} />
          </RoundedBox>
        </>
      ) : null}

      {varsity ? (
        <>
          {([-1, 1] as const).map((side) => (
            <RoundedBox
              key={side}
              args={[0.19, 0.72, 0.075]}
              radius={0.045}
              smoothness={6}
              position={[side * 0.105, 0.55, 0.292]}
            >
              <CompanionMaterial
                colour={side < 0 ? highlight : colour}
                roughness={0.76}
              />
            </RoundedBox>
          ))}
          <mesh position={[0, 0.56, 0.342]} scale={[0.012, 0.39, 0.012]}>
            <cylinderGeometry args={[1, 1, 1, 12]} />
            <CompanionMaterial colour="#d8dce3" roughness={0.72} />
          </mesh>
          {[0.34, 0.55, 0.76].map((y) => (
            <mesh key={y} position={[0, y, 0.355]} scale={0.022}>
              <sphereGeometry args={[1, 14, 10]} />
              <CompanionMaterial colour="#d8dce3" roughness={0.62} />
            </mesh>
          ))}
          <Rib
            position={[0, 0.03, 0]}
            scale={[0.34, 0.09, 0.24]}
            colour={shadow}
          />
        </>
      ) : null}

      {config.topStyleId === "fitted-tee" ? (
        <>
          <mesh position={[0, 0.05, 0]} scale={[0.33, 0.045, 0.24]}>
            <torusGeometry args={[1, 0.18, 8, 24]} />
            <CompanionMaterial colour={shadow} roughness={0.86} />
          </mesh>
          <mesh position={[0.24, 0.55, 0.27]} scale={[0.065, 0.035, 0.012]}>
            <sphereGeometry args={[1, 16, 10]} />
            <CompanionMaterial colour={highlight} roughness={0.74} />
          </mesh>
        </>
      ) : null}
    </group>
  );
}

function Bottoms({ config }: { config: PlayerCompanionConfig }) {
  const skin = getCompanionSkinColour(config.skinToneId);
  const colour = getCompanionColour(config.bottomColourId);
  const shadow = shiftCompanionColour(colour, -0.1);
  const highlight = shiftCompanionColour(colour, 0.08, -0.04);
  const jeans = config.bottomStyleId === "straight-jeans";
  const cargos = config.bottomStyleId === "relaxed-cargos";
  const shorts = config.bottomStyleId === "smart-shorts";
  const legWidth = cargos ? 0.205 : jeans ? 0.18 : 0.165;

  return (
    <group>
      <RoundedBox
        args={[0.58, 0.19, 0.33]}
        radius={0.07}
        smoothness={7}
        position={[0, -0.03, 0]}
      >
        <CompanionMaterial colour={colour} roughness={jeans ? 0.95 : 0.84} />
      </RoundedBox>
      <RoundedBox
        args={[0.5, 0.06, 0.31]}
        radius={0.02}
        smoothness={5}
        position={[0, 0.075, 0]}
      >
        <CompanionMaterial colour={shadow} roughness={0.9} />
      </RoundedBox>

      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <mesh
            position={[side * 0.19, shorts ? -0.25 : -0.52, 0]}
            scale={[
              shorts ? 0.205 : legWidth,
              shorts ? 0.27 : 0.59,
              shorts ? 0.205 : legWidth * 0.94,
            ]}
            castShadow
          >
            <capsuleGeometry args={[1, 1, 10, 24]} />
            <CompanionMaterial
              colour={colour}
              roughness={jeans ? 0.96 : cargos ? 0.9 : 0.84}
            />
          </mesh>
          {shorts ? (
            <mesh position={[side * 0.19, -0.72, 0]} scale={[0.145, 0.4, 0.15]}>
              <capsuleGeometry args={[1, 1, 10, 22]} />
              <CompanionMaterial colour={skin} roughness={0.82} />
            </mesh>
          ) : null}
          {cargos ? (
            <RoundedBox
              args={[0.16, 0.19, 0.06]}
              radius={0.025}
              smoothness={5}
              position={[side * 0.34, -0.38, 0.15]}
            >
              <CompanionMaterial colour={shadow} roughness={0.91} />
            </RoundedBox>
          ) : null}
          {jeans ? (
            <mesh position={[side * 0.19, -0.48, 0.174]} scale={[0.008, 0.45, 0.008]}>
              <boxGeometry args={[1, 1, 1]} />
              <CompanionMaterial colour={highlight} roughness={0.94} />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  );
}

function Shoes({ config }: { config: PlayerCompanionConfig }) {
  const colour = getCompanionColour(config.shoeColourId);
  const shadow = shiftCompanionColour(colour, -0.14);
  const highlight = shiftCompanionColour(colour, 0.16, -0.06);
  const boots = config.shoeStyleId === "ankle-boots";
  const trainers = config.shoeStyleId === "retro-trainers";

  return (
    <group>
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 0.2, -1.19, 0.09]}>
          {boots ? (
            <RoundedBox args={[0.34, 0.42, 0.46]} radius={0.08} smoothness={7}>
              <CompanionMaterial colour={colour} roughness={0.76} />
            </RoundedBox>
          ) : (
            <RoundedBox
              args={[0.36, trainers ? 0.25 : 0.21, 0.55]}
              radius={0.1}
              smoothness={8}
              position={[0, -0.07, 0.08]}
            >
              <CompanionMaterial colour={colour} roughness={0.7} />
            </RoundedBox>
          )}
          <RoundedBox
            args={[0.38, 0.09, 0.57]}
            radius={0.035}
            smoothness={5}
            position={[0, boots ? -0.2 : -0.18, 0.08]}
          >
            <CompanionMaterial colour={shadow} roughness={0.83} />
          </RoundedBox>
          {trainers ? (
            <>
              <RoundedBox
                args={[0.23, 0.06, 0.28]}
                radius={0.02}
                smoothness={5}
                position={[0, 0.035, 0.2]}
                rotation={[0.12, 0, 0]}
              >
                <CompanionMaterial colour={highlight} roughness={0.76} />
              </RoundedBox>
              {[-0.06, 0, 0.06].map((z) => (
                <mesh
                  key={z}
                  position={[0, 0.075, 0.17 + z]}
                  scale={[0.13, 0.008, 0.008]}
                  rotation={[0, 0, side * 0.08]}
                >
                  <boxGeometry args={[1, 1, 1]} />
                  <CompanionMaterial colour={shadow} roughness={0.82} />
                </mesh>
              ))}
            </>
          ) : null}
          {boots ? (
            <>
              <mesh position={[0, 0.08, 0.238]} scale={[0.13, 0.02, 0.012]}>
                <boxGeometry args={[1, 1, 1]} />
                <CompanionMaterial colour={highlight} roughness={0.78} />
              </mesh>
              <mesh position={[0, -0.02, 0.245]} scale={[0.13, 0.02, 0.012]}>
                <boxGeometry args={[1, 1, 1]} />
                <CompanionMaterial colour={highlight} roughness={0.78} />
              </mesh>
            </>
          ) : null}
        </group>
      ))}
    </group>
  );
}

export function CompanionBodyAndOutfit({
  config,
  leftArmRef,
  rightArmRef,
}: {
  config: PlayerCompanionConfig;
  leftArmRef: RefObject<Group | null>;
  rightArmRef: RefObject<Group | null>;
}) {
  const skin = getCompanionSkinColour(config.skinToneId);

  return (
    <group>
      <mesh position={[0, 1.02, 0]} scale={[0.17, 0.2, 0.16]} castShadow>
        <cylinderGeometry args={[1, 0.9, 1, 24]} />
        <CompanionMaterial colour={skin} roughness={0.82} />
      </mesh>
      <Top config={config} />
      <Arm side={-1} config={config} armRef={leftArmRef} />
      <Arm side={1} config={config} armRef={rightArmRef} />
      <Bottoms config={config} />
      <Shoes config={config} />
    </group>
  );
}
