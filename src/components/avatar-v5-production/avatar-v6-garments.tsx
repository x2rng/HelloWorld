"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Quaternion,
  Vector3,
} from "three";
import {
  getAvatarV5PaletteColour,
  getAvatarV5SkinColour,
} from "@/components/avatar-v5-production/config/avatar-v5-catalogue";
import type {
  AvatarV5Config,
  AvatarV5TopStyleId,
} from "@/components/avatar-v5-production/config/avatar-v5-types";

type TorsoRing = {
  y: number;
  xRadius: number;
  zRadius: number;
  zOffset?: number;
};

const MODERN_TOPS: ReadonlySet<AvatarV5TopStyleId> = new Set([
  "fitted-tee",
  "relaxed-tee",
  "oxford-shirt",
  "polo-shirt",
  "crew-sweater",
  "hoodie",
  "blazer",
  "bomber",
]);

export function isAvatarV6ModernTop(style: AvatarV5TopStyleId) {
  return MODERN_TOPS.has(style);
}

function darker(colour: string, amount = 0.08) {
  return new Color(colour).offsetHSL(0, 0, -amount).getStyle();
}

function lighter(colour: string, amount = 0.07) {
  return new Color(colour).offsetHSL(0, 0, amount).getStyle();
}

function createTorsoShellGeometry(rings: TorsoRing[]) {
  const geometry = new BufferGeometry();
  const segments = 32;
  const vertices: number[] = [];
  const indices: number[] = [];

  rings.forEach((ring) => {
    for (let segment = 0; segment < segments; segment += 1) {
      const angle = (segment / segments) * Math.PI * 2;
      const frontShaping = Math.max(0, Math.sin(angle)) * 0.012;
      vertices.push(
        Math.cos(angle) * ring.xRadius,
        ring.y,
        (ring.zOffset ?? 0) +
          Math.sin(angle) * ring.zRadius +
          frontShaping,
      );
    }
  });

  for (let ring = 0; ring < rings.length - 1; ring += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const next = (segment + 1) % segments;
      const currentRing = ring * segments;
      const nextRing = (ring + 1) * segments;
      indices.push(
        currentRing + segment,
        nextRing + segment,
        nextRing + next,
        currentRing + segment,
        nextRing + next,
        currentRing + next,
      );
    }
  }

  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function GarmentMaterial({
  colour,
  roughness = 0.86,
}: {
  colour: string;
  roughness?: number;
}) {
  return (
    <meshStandardMaterial
      color={colour}
      roughness={roughness}
      metalness={0.01}
      polygonOffset
      polygonOffsetFactor={-2}
      polygonOffsetUnits={-2}
    />
  );
}

function TorsoShell({
  rings,
  colour,
  roughness,
}: {
  rings: TorsoRing[];
  colour: string;
  roughness?: number;
}) {
  const geometry = useMemo(() => createTorsoShellGeometry(rings), [rings]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <GarmentMaterial colour={colour} roughness={roughness} />
    </mesh>
  );
}

function SleeveSegment({
  start,
  end,
  startRadius,
  endRadius,
  colour,
  roughness,
  depthScale = 1.1,
}: {
  start: [number, number, number];
  end: [number, number, number];
  startRadius: number;
  endRadius: number;
  colour: string;
  roughness?: number;
  depthScale?: number;
}) {
  const transform = useMemo(() => {
    const from = new Vector3(...start);
    const to = new Vector3(...end);
    const direction = to.clone().sub(from);
    const midpoint = from.clone().add(to).multiplyScalar(0.5);
    const quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      direction.clone().normalize(),
    );
    return { midpoint, quaternion, length: direction.length() };
  }, [end, start]);

  return (
    <mesh
      position={transform.midpoint}
      quaternion={transform.quaternion}
      scale={[1, 1, depthScale]}
      castShadow
      receiveShadow
    >
      <cylinderGeometry
        args={[endRadius, startRadius, transform.length, 24, 5, false]}
      />
      <GarmentMaterial colour={colour} roughness={roughness} />
    </mesh>
  );
}

function SkinExtremities({
  skin,
  longSleeves,
}: {
  skin: string;
  longSleeves: boolean;
}) {
  return (
    <group>
      <mesh position={[0, 1.485, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.043, 0.06, 10, 24]} />
        <GarmentMaterial colour={skin} roughness={0.9} />
      </mesh>
      {[-1, 1].map((side) => {
        const direction = side as -1 | 1;
        const elbow: [number, number, number] = [
          direction * 0.285,
          1.01,
          0.006,
        ];
        const wrist: [number, number, number] = [
          direction * 0.255,
          0.79,
          0.02,
        ];
        const handX = direction * 0.25;

        return (
          <group key={side}>
            {!longSleeves ? (
              <>
                <SleeveSegment
                  start={[direction * 0.275, 1.19, 0]}
                  end={elbow}
                  startRadius={0.057}
                  endRadius={0.05}
                  colour={skin}
                  roughness={0.9}
                  depthScale={1.05}
                />
                <SleeveSegment
                  start={elbow}
                  end={wrist}
                  startRadius={0.05}
                  endRadius={0.038}
                  colour={skin}
                  roughness={0.9}
                  depthScale={1.05}
                />
              </>
            ) : (
              <SleeveSegment
                start={[direction * 0.255, 0.83, 0.018]}
                end={wrist}
                startRadius={0.047}
                endRadius={0.041}
                colour={skin}
                roughness={0.9}
                depthScale={1.05}
              />
            )}
            {!longSleeves ? (
              <mesh
                position={elbow}
                scale={[0.052, 0.047, 0.05]}
                castShadow
                receiveShadow
              >
                <sphereGeometry args={[1, 20, 14]} />
                <GarmentMaterial colour={skin} roughness={0.9} />
              </mesh>
            ) : null}
            <mesh
              position={wrist}
              scale={[0.04, 0.042, 0.037]}
              castShadow
              receiveShadow
            >
              <sphereGeometry args={[1, 20, 14]} />
              <GarmentMaterial colour={skin} roughness={0.9} />
            </mesh>
            <mesh
              position={[handX, 0.72, 0.026]}
              scale={[0.038, 0.06, 0.032]}
              castShadow
              receiveShadow
            >
              <sphereGeometry args={[1, 22, 16]} />
              <GarmentMaterial colour={skin} roughness={0.9} />
            </mesh>
            <mesh
              position={[
                handX - direction * 0.038,
                0.73,
                0.036,
              ]}
              scale={[0.024, 0.042, 0.025]}
              rotation-z={direction * 0.38}
              castShadow
              receiveShadow
            >
              <sphereGeometry args={[1, 18, 12]} />
              <GarmentMaterial colour={skin} roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Sleeves({
  colour,
  long,
  relaxed,
  cuffed,
}: {
  colour: string;
  long: boolean;
  relaxed?: boolean;
  cuffed?: boolean;
}) {
  const shoulderRadius = relaxed ? 0.105 : 0.09;
  const upperRadius = relaxed ? 0.086 : 0.074;
  const forearmRadius = relaxed ? 0.075 : 0.062;

  return (
    <group>
      {[-1, 1].map((side) => {
        const direction = side as -1 | 1;
        const shoulder: [number, number, number] = [
          direction * 0.18,
          1.34,
          0,
        ];
        const elbow: [number, number, number] = [
          direction * 0.275,
          long ? 1.08 : 1.19,
          0.002,
        ];
        const wrist: [number, number, number] = [
          direction * 0.255,
          0.82,
          0.018,
        ];

        return (
          <group key={side}>
            <mesh
              position={shoulder}
              scale={[1, 0.72, 1.1]}
              castShadow
              receiveShadow
            >
              <sphereGeometry args={[shoulderRadius, 22, 16]} />
              <GarmentMaterial
                colour={colour}
                roughness={relaxed ? 0.94 : 0.84}
              />
            </mesh>
            <SleeveSegment
              start={shoulder}
              end={elbow}
              startRadius={shoulderRadius}
              endRadius={upperRadius}
              colour={colour}
              roughness={relaxed ? 0.94 : 0.84}
            />
            {long ? (
              <>
                <mesh
                  position={elbow}
                  scale={[1, 0.84, 1.1]}
                  castShadow
                  receiveShadow
                >
                  <sphereGeometry args={[upperRadius, 22, 16]} />
                  <GarmentMaterial
                    colour={colour}
                    roughness={relaxed ? 0.94 : 0.84}
                  />
                </mesh>
                <SleeveSegment
                  start={elbow}
                  end={wrist}
                  startRadius={upperRadius}
                  endRadius={forearmRadius}
                  colour={colour}
                  roughness={relaxed ? 0.94 : 0.84}
                />
                {cuffed ? (
                  <mesh position={wrist} scale={[1, 0.6, 1]}>
                    <torusGeometry args={[forearmRadius, 0.011, 10, 28]} />
                    <GarmentMaterial
                      colour={darker(colour, 0.12)}
                      roughness={0.95}
                    />
                  </mesh>
                ) : null}
              </>
            ) : null}
          </group>
        );
      })}
    </group>
  );
}

function Collar({
  colour,
  open = false,
  thick = false,
}: {
  colour: string;
  open?: boolean;
  thick?: boolean;
}) {
  if (open) {
    return (
      <group>
        {[-1, 1].map((side) => (
          <RoundedBox
            key={side}
            args={[0.085, 0.055, 0.02]}
            radius={0.012}
            smoothness={5}
            position={[side * 0.042, 1.415, 0.178]}
            rotation={[0.05, 0, side * 0.42]}
          >
            <GarmentMaterial colour={colour} roughness={0.76} />
          </RoundedBox>
        ))}
      </group>
    );
  }

  return (
    <mesh
      position={[0, 1.405, 0.015]}
      rotation={[Math.PI / 2, 0, 0]}
      scale={[1.35, 1, 0.72]}
    >
      <torusGeometry args={[0.058, thick ? 0.015 : 0.009, 14, 44]} />
      <GarmentMaterial colour={colour} roughness={thick ? 0.96 : 0.86} />
    </mesh>
  );
}

function Placket({
  colour,
  short = false,
  buttons = true,
}: {
  colour: string;
  short?: boolean;
  buttons?: boolean;
}) {
  const top = 1.36;
  const height = short ? 0.16 : 0.43;
  const center = top - height / 2;
  const buttonCount = short ? 2 : 5;

  return (
    <group>
      <RoundedBox
        args={[0.012, height, 0.014]}
        radius={0.005}
        smoothness={4}
        position={[0, center, 0.182]}
      >
        <GarmentMaterial colour={darker(colour, 0.09)} roughness={0.72} />
      </RoundedBox>
      {buttons
        ? Array.from({ length: buttonCount }, (_, index) => (
            <mesh
              key={index}
              position={[
                0.008,
                top - 0.045 - index * (short ? 0.055 : 0.078),
                0.202,
              ]}
            >
              <sphereGeometry args={[0.008, 14, 10]} />
              <meshStandardMaterial
                color="#e4e7eb"
                roughness={0.32}
                metalness={0.15}
              />
            </mesh>
          ))
        : null}
    </group>
  );
}

function RibbedHem({
  colour,
  y,
  width,
}: {
  colour: string;
  y: number;
  width: number;
}) {
  return (
    <RoundedBox
      args={[width, 0.045, 0.32]}
      radius={0.018}
      smoothness={6}
      position={[0, y, 0]}
    >
      <GarmentMaterial colour={darker(colour, 0.11)} roughness={0.97} />
    </RoundedBox>
  );
}

export function AvatarV6ModernTop({ config }: { config: AvatarV5Config }) {
  const colour = getAvatarV5PaletteColour(config.topColourId);
  const skin = getAvatarV5SkinColour(config.skinToneId);
  const style = config.topStyleId;
  const relaxed =
    style === "relaxed-tee" || style === "hoodie" || style === "bomber";
  const structured = style === "blazer";
  const cropped = style === "bomber";
  const hemY = cropped ? 0.98 : relaxed ? 0.91 : 0.93;
  const shoulderWidth = structured ? 0.235 : relaxed ? 0.22 : 0.205;
  const chestWidth = structured ? 0.205 : relaxed ? 0.2 : 0.185;
  const waistWidth = structured ? 0.16 : relaxed ? 0.18 : 0.15;
  const hemWidth = cropped ? 0.19 : relaxed ? 0.19 : 0.17;
  const depth = relaxed ? 0.23 : structured ? 0.21 : 0.2;
  const long =
    style !== "fitted-tee" &&
    style !== "relaxed-tee" &&
    style !== "polo-shirt";
  const thick =
    style === "crew-sweater" ||
    style === "hoodie" ||
    style === "bomber";
  const rings = useMemo<TorsoRing[]>(
    () => [
      { y: hemY, xRadius: hemWidth, zRadius: depth * 0.88 },
      { y: 1.08, xRadius: waistWidth, zRadius: depth * 0.92 },
      { y: 1.25, xRadius: chestWidth, zRadius: depth },
      { y: 1.36, xRadius: shoulderWidth, zRadius: depth * 0.9 },
      { y: 1.405, xRadius: shoulderWidth, zRadius: depth * 0.92 },
      { y: 1.43, xRadius: 0.075, zRadius: 0.09, zOffset: -0.005 },
    ],
    [chestWidth, depth, hemWidth, hemY, shoulderWidth, waistWidth],
  );

  if (!isAvatarV6ModernTop(config.topStyleId)) return null;

  return (
    <group>
      <TorsoShell
        rings={rings}
        colour={colour}
        roughness={thick ? 0.95 : structured ? 0.68 : 0.86}
      />
      <Sleeves
        colour={colour}
        long={long}
        relaxed={relaxed || thick}
        cuffed={thick || style === "oxford-shirt" || structured}
      />
      <SkinExtremities skin={skin} longSleeves={long} />

      {style === "fitted-tee" || style === "relaxed-tee" ? (
        <Collar colour={darker(colour, 0.04)} />
      ) : null}

      {style === "oxford-shirt" || style === "polo-shirt" ? (
        <>
          <Collar colour={lighter(colour, 0.035)} open />
          <Placket
            colour={colour}
            short={style === "polo-shirt"}
          />
        </>
      ) : null}

      {style === "crew-sweater" ? (
        <>
          <Collar colour={darker(colour, 0.07)} thick />
          <RibbedHem colour={colour} y={0.935} width={0.34} />
        </>
      ) : null}

      {style === "hoodie" ? (
        <>
          <mesh
            position={[0, 1.46, -0.055]}
            scale={[1.16, 1.36, 0.8]}
            castShadow
          >
            <torusGeometry args={[0.088, 0.035, 18, 52]} />
            <GarmentMaterial colour={colour} roughness={0.96} />
          </mesh>
          {[-0.032, 0.032].map((x) => (
            <group key={x}>
              <RoundedBox
                args={[0.006, 0.16, 0.006]}
                radius={0.003}
                smoothness={3}
                position={[x, 1.31, 0.182]}
              >
                <GarmentMaterial
                  colour={darker(colour, 0.16)}
                  roughness={0.8}
                />
              </RoundedBox>
              <mesh position={[x, 1.225, 0.194]}>
                <sphereGeometry args={[0.008, 14, 10]} />
                <meshStandardMaterial
                  color="#d8dce1"
                  roughness={0.28}
                  metalness={0.52}
                />
              </mesh>
            </group>
          ))}
          <RoundedBox
            args={[0.2, 0.1, 0.025]}
            radius={0.028}
            smoothness={6}
            position={[0, 1.04, 0.182]}
          >
            <GarmentMaterial colour={colour} roughness={0.96} />
          </RoundedBox>
          <RibbedHem colour={colour} y={0.92} width={0.38} />
        </>
      ) : null}

      {style === "blazer" ? (
        <>
          {[-1, 1].map((side) => (
            <RoundedBox
              key={side}
              args={[0.065, 0.3, 0.022]}
              radius={0.012}
              smoothness={5}
              position={[side * 0.052, 1.245, 0.185]}
              rotation={[0.04, 0, side * 0.38]}
            >
              <GarmentMaterial
                colour={lighter(colour, 0.025)}
                roughness={0.66}
              />
            </RoundedBox>
          ))}
          <Placket colour={colour} buttons={false} />
          {[1.08, 0.99].map((y) => (
            <mesh key={y} position={[0.015, y, 0.207]}>
              <sphereGeometry args={[0.01, 16, 12]} />
              <meshStandardMaterial
                color="#252a31"
                roughness={0.34}
                metalness={0.18}
              />
            </mesh>
          ))}
        </>
      ) : null}

      {style === "bomber" ? (
        <>
          <Collar colour={darker(colour, 0.07)} thick />
          <Placket colour={colour} buttons={false} />
          <RibbedHem colour={colour} y={0.99} width={0.39} />
        </>
      ) : null}
    </group>
  );
}
