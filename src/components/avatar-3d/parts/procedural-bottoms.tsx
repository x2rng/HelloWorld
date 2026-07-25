"use client";

import { useMemo } from "react";
import { Vector3 } from "three";
import {
  createEllipticalLoftGeometry,
  createTaperedCurveGeometry,
} from "@/components/avatar-3d/geometry/geometry-utils";
import type { AvatarPartProps } from "@/components/avatar-3d/parts/avatar-part-types";
import type { BottomStyleId } from "@/components/avatar-3d/config/avatar-v4-types";

const radii: Record<
  Exclude<BottomStyleId, "skirt">,
  { hip: number; ankle: number; depth: number }
> = {
  "straight-trousers": { hip: 0.37, ankle: 0.24, depth: 0.03 },
  "slim-trousers": { hip: 0.35, ankle: 0.2, depth: 0.02 },
  jeans: { hip: 0.365, ankle: 0.22, depth: 0.025 },
  "relaxed-trousers": { hip: 0.4, ankle: 0.29, depth: 0.045 },
  "sports-bottoms": { hip: 0.385, ankle: 0.21, depth: 0.04 },
};

function createBottomLeg(side: -1 | 1, style: Exclude<BottomStyleId, "skirt">) {
  const shape = radii[style];
  return createTaperedCurveGeometry(
    [
      new Vector3(side * 0.34, 2.8, shape.depth),
      new Vector3(side * 0.36, 2.14, 0.025 + shape.depth),
      new Vector3(side * 0.34, 1.44, 0.08 + shape.depth),
      new Vector3(side * 0.3, 0.65, 0.04 + shape.depth),
      new Vector3(side * 0.3, 0.31, 0.03 + shape.depth),
    ],
    shape.hip,
    shape.ankle,
    34,
    16,
  );
}

function createSkirtGeometry() {
  return createEllipticalLoftGeometry([
    { y: 2.82, radiusX: 0.62, radiusZ: 0.38 },
    { y: 2.52, radiusX: 0.64, radiusZ: 0.39 },
    { y: 2.05, radiusX: 0.72, radiusZ: 0.41, offsetZ: 0.015 },
    { y: 1.55, radiusX: 0.78, radiusZ: 0.42, offsetZ: 0.02 },
  ]);
}

function createWaistband(style: BottomStyleId) {
  const radiusX = style === "skirt" ? 0.63 : 0.59;
  return createEllipticalLoftGeometry([
    { y: 2.73, radiusX, radiusZ: 0.385 },
    { y: 2.87, radiusX: radiusX * 0.98, radiusZ: 0.375 },
  ]);
}

export function ProceduralBottoms({ config, materials }: AvatarPartProps) {
  const style = config.bottomStyleId;
  const left = useMemo(
    () => (style === "skirt" ? null : createBottomLeg(-1, style)),
    [style],
  );
  const right = useMemo(
    () => (style === "skirt" ? null : createBottomLeg(1, style)),
    [style],
  );
  const skirt = useMemo(() => createSkirtGeometry(), []);
  const waistband = useMemo(() => createWaistband(style), [style]);
  const seamLeft = useMemo(
    () =>
      createTaperedCurveGeometry(
        [
          new Vector3(-0.34, 2.65, 0.38),
          new Vector3(-0.34, 1.62, 0.31),
          new Vector3(-0.3, 0.42, 0.22),
        ],
        0.012,
        0.009,
        24,
        7,
      ),
    [],
  );
  const seamRight = useMemo(
    () =>
      createTaperedCurveGeometry(
        [
          new Vector3(0.34, 2.65, 0.38),
          new Vector3(0.34, 1.62, 0.31),
          new Vector3(0.3, 0.42, 0.22),
        ],
        0.012,
        0.009,
        24,
        7,
      ),
    [],
  );

  return (
    <group>
      {style === "skirt" ? (
        <mesh
          geometry={skirt}
          material={materials.bottoms}
          castShadow
          receiveShadow
        />
      ) : (
        <>
          <mesh
            geometry={left ?? undefined}
            material={materials.bottoms}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={right ?? undefined}
            material={materials.bottoms}
            castShadow
            receiveShadow
          />
          <mesh geometry={seamLeft} material={materials.bottomsDetail} />
          <mesh geometry={seamRight} material={materials.bottomsDetail} />
        </>
      )}
      <mesh
        geometry={waistband}
        material={materials.bottomsDetail}
        castShadow
      />

      {style === "jeans" ? (
        <>
          {([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.bottomsDetail}
              position={[side * 0.34, 2.48, 0.38]}
              rotation-z={side * 0.13}
              scale={[0.2, 0.13, 0.025]}
            >
              <sphereGeometry args={[1, 24, 14]} />
            </mesh>
          ))}
          <mesh
            material={materials.metal}
            position={[0, 2.78, 0.4]}
            rotation-x={Math.PI / 2}
          >
            <cylinderGeometry args={[0.035, 0.035, 0.024, 16]} />
          </mesh>
        </>
      ) : null}

      {style === "sports-bottoms" ? (
        ([-1, 1] as const).map((side) => (
          <mesh
            key={side}
            material={materials.bottomsDetail}
            position={[side * 0.56, 1.5, 0.02]}
            scale={[0.025, 1.12, 0.03]}
          >
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        ))
      ) : null}

      {style === "skirt"
        ? ([-0.48, -0.24, 0, 0.24, 0.48] as const).map((x) => (
            <mesh
              key={x}
              material={materials.bottomsDetail}
              position={[x, 2.03, 0.4 - Math.abs(x) * 0.18]}
              rotation-z={x * -0.16}
              scale={[0.018, 0.48, 0.02]}
            >
              <boxGeometry args={[1, 1, 1]} />
            </mesh>
          ))
        : null}

      {(style === "straight-trousers" ||
        style === "relaxed-trousers" ||
        style === "slim-trousers")
        ? ([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.bottomsDetail}
              position={[side * 0.34, 1.48, 0.31]}
              rotation-z={side * 0.08}
              scale={[0.22, 0.018, 0.018]}
            >
              <boxGeometry args={[1, 1, 1]} />
            </mesh>
          ))
        : null}
    </group>
  );
}
