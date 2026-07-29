"use client";

import {
  getCompanionHairColour,
} from "@/components/player-companion/config/player-companion-catalogue";
import type { PlayerCompanionConfig } from "@/components/player-companion/config/player-companion-types";
import {
  CompanionMaterial,
  shiftCompanionColour,
} from "@/components/player-companion/materials/companion-material";

function HairClump({
  position,
  scale,
  rotation = [0, 0, 0],
  colour,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  colour: string;
}) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow>
      <capsuleGeometry args={[0.6, 1.15, 8, 18]} />
      <CompanionMaterial colour={colour} roughness={0.62} clearcoat={0.04} />
    </mesh>
  );
}

function Curl({
  position,
  scale,
  colour,
}: {
  position: [number, number, number];
  scale: number;
  colour: string;
}) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <sphereGeometry args={[1, 22, 18]} />
      <CompanionMaterial colour={colour} roughness={0.66} clearcoat={0.03} />
    </mesh>
  );
}

export function CompanionHair({ config }: { config: PlayerCompanionConfig }) {
  const base = getCompanionHairColour(config.hairColourId);
  const shadow = shiftCompanionColour(base, -0.075);
  const highlight = shiftCompanionColour(base, 0.055, -0.02);
  const style = config.hairStyleId;

  return (
    <group>
      <mesh
        position={[0, 1.68, -0.035]}
        scale={[0.735, 0.79, 0.66]}
        castShadow
      >
        <sphereGeometry
          args={[1, 36, 28, 0, Math.PI * 2, 0, Math.PI * 0.68]}
        />
        <CompanionMaterial colour={base} roughness={0.64} clearcoat={0.04} />
      </mesh>

      {style === "textured-crop" ? (
        <group>
          {[-0.42, -0.2, 0.03, 0.26, 0.46].map((x, index) => (
            <HairClump
              key={x}
              position={[x, 2.18 - Math.abs(x) * 0.08, 0.12 + (index % 2) * 0.03]}
              scale={[0.15, 0.25 + (index % 2) * 0.05, 0.15]}
              rotation={[0.08, 0, x * -0.42]}
              colour={index % 2 ? highlight : shadow}
            />
          ))}
          <HairClump
            position={[-0.28, 1.98, 0.51]}
            scale={[0.16, 0.28, 0.12]}
            rotation={[0.18, 0.05, -0.55]}
            colour={highlight}
          />
        </group>
      ) : null}

      {style === "side-sweep" ? (
        <group>
          <HairClump
            position={[-0.25, 2.08, 0.37]}
            scale={[0.24, 0.49, 0.13]}
            rotation={[0.2, -0.06, -0.68]}
            colour={highlight}
          />
          <HairClump
            position={[0.1, 2.08, 0.45]}
            scale={[0.22, 0.45, 0.12]}
            rotation={[0.16, 0.04, -0.38]}
            colour={base}
          />
          <HairClump
            position={[0.48, 1.75, 0.17]}
            scale={[0.17, 0.42, 0.15]}
            rotation={[0.02, 0, 0.2]}
            colour={shadow}
          />
        </group>
      ) : null}

      {style === "soft-bob" ? (
        <group>
          {([-1, 1] as const).map((side) => (
            <group key={side}>
              <HairClump
                position={[side * 0.57, 1.48, -0.02]}
                scale={[0.22, 0.55, 0.22]}
                rotation={[0.02, 0, side * -0.08]}
                colour={side < 0 ? base : shadow}
              />
              <HairClump
                position={[side * 0.52, 1.82, 0.24]}
                scale={[0.19, 0.42, 0.16]}
                rotation={[0.08, side * 0.05, side * -0.2]}
                colour={highlight}
              />
            </group>
          ))}
          <HairClump
            position={[-0.12, 2.02, 0.48]}
            scale={[0.28, 0.4, 0.13]}
            rotation={[0.12, 0, -0.44]}
            colour={highlight}
          />
        </group>
      ) : null}

      {style === "double-buns" ? (
        <group>
          {([-1, 1] as const).map((side) => (
            <group key={side}>
              <Curl
                position={[side * 0.58, 2.18, -0.02]}
                scale={0.28}
                colour={side < 0 ? highlight : shadow}
              />
              <Curl
                position={[side * 0.72, 2.12, -0.03]}
                scale={0.19}
                colour={base}
              />
            </group>
          ))}
          <HairClump
            position={[0, 2.03, 0.5]}
            scale={[0.38, 0.28, 0.12]}
            rotation={[0.14, 0, 0]}
            colour={highlight}
          />
        </group>
      ) : null}

      {style === "curly-cloud" ? (
        <group>
          {[
            [-0.58, 1.92, 0.06, 0.27],
            [-0.44, 2.17, 0.02, 0.3],
            [-0.18, 2.27, 0.05, 0.29],
            [0.11, 2.28, 0.04, 0.3],
            [0.4, 2.18, 0.01, 0.31],
            [0.59, 1.95, 0.04, 0.27],
            [-0.53, 1.69, -0.2, 0.25],
            [0.54, 1.68, -0.18, 0.25],
            [0, 2.1, 0.48, 0.25],
          ].map(([x, y, z, scale], index) => (
            <Curl
              key={`${x}-${y}`}
              position={[x, y, z]}
              scale={scale}
              colour={index % 3 === 0 ? highlight : index % 2 ? base : shadow}
            />
          ))}
        </group>
      ) : null}

      {style === "high-pony" ? (
        <group>
          <HairClump
            position={[-0.2, 2.05, 0.46]}
            scale={[0.29, 0.4, 0.13]}
            rotation={[0.14, 0, -0.45]}
            colour={highlight}
          />
          <Curl position={[0, 2.27, -0.5]} scale={0.19} colour={shadow} />
          <HairClump
            position={[0, 1.78, -0.72]}
            scale={[0.22, 0.72, 0.22]}
            rotation={[-0.16, 0, 0]}
            colour={base}
          />
          <HairClump
            position={[0.08, 1.28, -0.63]}
            scale={[0.18, 0.48, 0.18]}
            rotation={[0.25, 0.05, -0.08]}
            colour={highlight}
          />
        </group>
      ) : null}
    </group>
  );
}
