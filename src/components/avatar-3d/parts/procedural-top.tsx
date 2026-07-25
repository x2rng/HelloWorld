"use client";

import { useMemo } from "react";
import {
  ExtrudeGeometry,
  Shape,
  Vector3,
} from "three";
import { createGarmentShell } from "@/components/avatar-3d/geometry/create-garment-shell";
import { createTaperedCurveGeometry } from "@/components/avatar-3d/geometry/geometry-utils";
import { defaultBodyAnchors } from "@/components/avatar-3d/geometry/create-torso-geometry";
import type { AvatarPartProps } from "@/components/avatar-3d/parts/avatar-part-types";
import type { TopStyleId } from "@/components/avatar-3d/config/avatar-v4-types";

function createSleeveGeometry(
  side: -1 | 1,
  style: TopStyleId,
) {
  const short =
    style === "fitted-tee" ||
    style === "relaxed-tee" ||
    style === "polo-shirt";
  const bulky =
    style === "hoodie" ||
    style === "crew-sweater" ||
    style === "bomber-jacket";
  const fitted = style === "fitted-tee" || style === "oxford-shirt";
  const endY = short ? 3.75 : 2.91;
  return createTaperedCurveGeometry(
    [
      new Vector3(side * 0.69, 4.57, 0),
      new Vector3(side * (short ? 0.83 : 0.82), 4.08, 0.025),
      new Vector3(side * 0.81, short ? endY : 3.55, 0.09),
      ...(short
        ? []
        : [new Vector3(side * 0.72, endY, 0.14)]),
    ],
    0.27 + (bulky ? 0.055 : 0),
    (short ? 0.235 : 0.165) + (bulky ? 0.035 : 0) - (fitted ? 0.015 : 0),
    short ? 19 : 28,
    14,
  );
}

function createLapelGeometry(side: -1 | 1) {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(side * 0.31, -0.26);
  shape.lineTo(side * 0.18, -0.98);
  shape.lineTo(0, -0.46);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.018,
    bevelThickness: 0.012,
  });
  return geometry;
}

function GarmentButtons({
  count,
  topY,
  materials,
}: {
  count: number;
  topY: number;
  materials: AvatarPartProps["materials"];
}) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <mesh
          key={index}
          material={materials.topDetail}
          position={[0.035, topY - index * 0.24, 0.48]}
          rotation-x={Math.PI / 2}
          castShadow
        >
          <cylinderGeometry args={[0.035, 0.035, 0.025, 18]} />
        </mesh>
      ))}
    </>
  );
}

function RibbedBand({
  y,
  radius,
  materials,
}: {
  y: number;
  radius: number;
  materials: AvatarPartProps["materials"];
}) {
  return (
    <mesh
      material={materials.topDetail}
      position-y={y}
      scale={[1.2, 0.5, 0.78]}
      rotation-x={Math.PI / 2}
      castShadow
    >
      <torusGeometry args={[radius, 0.045, 10, 42]} />
    </mesh>
  );
}

export function ProceduralTop({ config, materials }: AvatarPartProps) {
  const style = config.topStyleId;
  const shell = useMemo(
    () => createGarmentShell({ layer: "top", topStyle: style }),
    [style],
  );
  const leftSleeve = useMemo(() => createSleeveGeometry(-1, style), [style]);
  const rightSleeve = useMemo(() => createSleeveGeometry(1, style), [style]);
  const leftLapel = useMemo(() => createLapelGeometry(-1), []);
  const rightLapel = useMemo(() => createLapelGeometry(1), []);
  const torsoCentre =
    (defaultBodyAnchors.shoulderY + defaultBodyAnchors.hipY) / 2;
  const isTee = style === "fitted-tee" || style === "relaxed-tee";
  const isOxford = style === "oxford-shirt";
  const isPolo = style === "polo-shirt";
  const isSweater = style === "crew-sweater";
  const isHoodie = style === "hoodie";
  const isBlazer = style === "blazer";
  const isBomber = style === "bomber-jacket";

  return (
    <group>
      <mesh
        geometry={shell}
        material={materials.top}
        position-y={torsoCentre}
        castShadow
        receiveShadow
      />
      <mesh geometry={leftSleeve} material={materials.top} castShadow receiveShadow />
      <mesh geometry={rightSleeve} material={materials.top} castShadow receiveShadow />

      {isTee || isSweater || isHoodie ? (
        <mesh
          material={materials.topDetail}
          position={[0, 4.68, 0.1]}
          rotation-x={Math.PI / 2}
          scale={
            isHoodie
              ? [1.15, 0.92, 1]
              : isSweater
                ? [1.05, 0.78, 1]
                : [1, 0.72, 1]
          }
          castShadow
        >
          <torusGeometry args={[0.29, isSweater ? 0.06 : 0.035, 12, 44]} />
        </mesh>
      ) : null}

      {isTee ? (
        <>
          <mesh
            material={materials.topDetail}
            position={[0, 2.76, 0.02]}
            scale={[1.14, 0.45, 0.72]}
            rotation-x={Math.PI / 2}
          >
            <torusGeometry args={[0.49, 0.025, 8, 42]} />
          </mesh>
          {([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.topDetail}
              position={[side * 0.81, 3.76, 0.08]}
              scale={[1, 0.64, 1]}
            >
              <torusGeometry args={[0.22, 0.02, 8, 32]} />
            </mesh>
          ))}
        </>
      ) : null}

      {isOxford || isPolo ? (
        <>
          {([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.top}
              position={[side * 0.17, 4.55, 0.37]}
              rotation={[0.12, side * -0.12, side * 0.5]}
              scale={[0.13, 0.25, 0.035]}
              castShadow
            >
              <sphereGeometry args={[1, 24, 16]} />
            </mesh>
          ))}
          <mesh
            material={materials.topDetail}
            position={[0, isOxford ? 4.03 : 4.3, 0.44]}
          >
            <boxGeometry args={[0.055, isOxford ? 1.28 : 0.58, 0.035]} />
          </mesh>
          <GarmentButtons
            count={isOxford ? 5 : 2}
            topY={isOxford ? 4.47 : 4.43}
            materials={materials}
          />
        </>
      ) : null}

      {isOxford ? (
        <>
          {([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.topDetail}
              position={[side * 0.72, 2.97, 0.14]}
              rotation-x={Math.PI / 2}
            >
              <cylinderGeometry args={[0.185, 0.18, 0.13, 22]} />
            </mesh>
          ))}
        </>
      ) : null}

      {isSweater || isHoodie || isBomber ? (
        <>
          <RibbedBand y={2.78} radius={0.49} materials={materials} />
          {([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.topDetail}
              position={[side * 0.72, 2.96, 0.14]}
              rotation-x={Math.PI / 2}
            >
              <cylinderGeometry args={[0.18, 0.17, 0.15, 22]} />
            </mesh>
          ))}
        </>
      ) : null}

      {isHoodie ? (
        <>
          <mesh
            material={materials.top}
            position={[0, 4.88, -0.29]}
            scale={[0.68, 0.82, 0.42]}
            rotation-x={0.12}
            castShadow
          >
            <sphereGeometry
              args={[1, 32, 24, 0, Math.PI * 2, 0.08, Math.PI * 0.72]}
            />
          </mesh>
          {([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.topDetail}
              position={[side * 0.15, 4.25, 0.47]}
              rotation-z={side * -0.05}
            >
              <cylinderGeometry args={[0.013, 0.013, 0.68, 10]} />
            </mesh>
          ))}
          <mesh
            material={materials.topDetail}
            position={[0, 3.25, 0.49]}
            scale={[0.4, 0.14, 0.035]}
          >
            <sphereGeometry args={[1, 28, 16]} />
          </mesh>
        </>
      ) : null}

      {isBlazer ? (
        <>
          <mesh
            geometry={leftLapel}
            material={materials.top}
            position={[0, 4.64, 0.45]}
            rotation-x={-0.04}
            castShadow
          />
          <mesh
            geometry={rightLapel}
            material={materials.top}
            position={[0, 4.64, 0.45]}
            rotation-x={-0.04}
            castShadow
          />
          <GarmentButtons count={2} topY={3.78} materials={materials} />
          {([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.topDetail}
              position={[side * 0.43, 3.33, 0.51]}
              scale={[0.24, 0.035, 0.04]}
            >
              <boxGeometry args={[1, 1, 1]} />
            </mesh>
          ))}
        </>
      ) : null}

      {isBomber ? (
        <>
          <RibbedBand y={4.58} radius={0.29} materials={materials} />
          <mesh
            material={materials.topDetail}
            position={[0, 3.72, 0.47]}
          >
            <boxGeometry args={[0.045, 1.75, 0.038]} />
          </mesh>
          <mesh
            material={materials.metal}
            position={[0.03, 4.48, 0.5]}
            scale={[0.035, 0.06, 0.018]}
          >
            <sphereGeometry args={[1, 18, 12]} />
          </mesh>
        </>
      ) : null}
    </group>
  );
}
