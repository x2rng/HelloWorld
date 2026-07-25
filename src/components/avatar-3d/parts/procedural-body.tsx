"use client";

import { useMemo } from "react";
import { Vector3 } from "three";
import { createHandGeometry } from "@/components/avatar-3d/geometry/create-hand-geometry";
import {
  createArmGeometry,
  createLegGeometry,
} from "@/components/avatar-3d/geometry/create-limb-geometry";
import {
  createTorsoGeometry,
  defaultBodyAnchors,
} from "@/components/avatar-3d/geometry/create-torso-geometry";
import { createTaperedCurveGeometry } from "@/components/avatar-3d/geometry/geometry-utils";
import type { AvatarPartProps } from "@/components/avatar-3d/parts/avatar-part-types";

export function ProceduralBody({ config, materials }: AvatarPartProps) {
  const torso = useMemo(() => createTorsoGeometry(), []);
  const leftArm = useMemo(() => createArmGeometry(-1), []);
  const rightArm = useMemo(() => createArmGeometry(1), []);
  const leftLeg = useMemo(() => createLegGeometry(-1), []);
  const rightLeg = useMemo(() => createLegGeometry(1), []);
  const hand = useMemo(() => createHandGeometry(), []);
  const leftThumb = useMemo(
    () =>
      createTaperedCurveGeometry(
        [
          new Vector3(-0.73, 2.95, 0.14),
          new Vector3(-0.84, 2.82, 0.23),
          new Vector3(-0.79, 2.69, 0.25),
        ],
        0.06,
        0.035,
        12,
        8,
      ),
    [],
  );
  const rightThumb = useMemo(
    () =>
      createTaperedCurveGeometry(
        [
          new Vector3(0.73, 2.95, 0.14),
          new Vector3(0.84, 2.82, 0.23),
          new Vector3(0.79, 2.69, 0.25),
        ],
        0.06,
        0.035,
        12,
        8,
      ),
    [],
  );

  const torsoCentre =
    (defaultBodyAnchors.shoulderY + defaultBodyAnchors.hipY) / 2;
  const exposesArms =
    config.outerwearStyleId === "none" &&
    (config.topStyleId === "fitted-tee" ||
      config.topStyleId === "relaxed-tee" ||
      config.topStyleId === "polo-shirt");

  return (
    <group>
      <mesh
        geometry={torso}
        material={materials.skin}
        position-y={torsoCentre}
        castShadow
        receiveShadow
      />
      <mesh
        material={materials.skin}
        position={[0, 4.92, -0.02]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.22, 0.29, 0.4, 28, 4]} />
      </mesh>

      {exposesArms ? (
        <>
          <mesh
            geometry={leftArm}
            material={materials.skin}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={rightArm}
            material={materials.skin}
            castShadow
            receiveShadow
          />
        </>
      ) : null}
      <mesh
        geometry={hand}
        material={materials.skin}
        position={[-0.72, 2.68, 0.14]}
        rotation-z={-0.05}
        castShadow
      />
      <mesh
        geometry={hand}
        material={materials.skin}
        position={[0.72, 2.68, 0.14]}
        rotation-z={0.05}
        castShadow
      />
      <mesh geometry={leftThumb} material={materials.skin} castShadow />
      <mesh geometry={rightThumb} material={materials.skin} castShadow />

      <mesh geometry={leftLeg} material={materials.skin} castShadow receiveShadow />
      <mesh geometry={rightLeg} material={materials.skin} castShadow receiveShadow />
      {config.bottomStyleId === "skirt"
        ? ([-1, 1] as const).map((side) => (
        <group key={side}>
          <mesh
            material={materials.skin}
            position={[side * 0.34, 1.44, 0.07]}
            scale={[0.31, 0.27, 0.29]}
            castShadow
          >
            <sphereGeometry args={[1, 24, 18]} />
          </mesh>
        </group>
          ))
        : null}
    </group>
  );
}
