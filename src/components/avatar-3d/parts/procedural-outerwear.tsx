"use client";

import { useMemo } from "react";
import { ExtrudeGeometry, Shape, Vector3 } from "three";
import { createGarmentShell } from "@/components/avatar-3d/geometry/create-garment-shell";
import { createTaperedCurveGeometry } from "@/components/avatar-3d/geometry/geometry-utils";
import { defaultBodyAnchors } from "@/components/avatar-3d/geometry/create-torso-geometry";
import type { AvatarPartProps } from "@/components/avatar-3d/parts/avatar-part-types";
import type { OuterwearStyleId } from "@/components/avatar-3d/config/avatar-v4-types";

function createOuterSleeve(side: -1 | 1, style: OuterwearStyleId) {
  const bulky = style === "bomber";
  return createTaperedCurveGeometry(
    [
      new Vector3(side * 0.71, 4.59, -0.01),
      new Vector3(side * 0.85, 4.08, 0.02),
      new Vector3(side * 0.84, 3.53, 0.09),
      new Vector3(side * 0.73, 2.91, 0.15),
    ],
    0.31 + (bulky ? 0.05 : 0),
    0.185 + (bulky ? 0.025 : 0),
    28,
    14,
  );
}

function createOuterLapel(side: -1 | 1) {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(side * 0.34, -0.3);
  shape.lineTo(side * 0.2, -1.15);
  shape.lineTo(side * 0.02, -0.55);
  shape.closePath();
  return new ExtrudeGeometry(shape, {
    depth: 0.055,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.02,
    bevelThickness: 0.014,
  });
}

export function ProceduralOuterwear({ config, materials }: AvatarPartProps) {
  const style =
    config.topStyleId === "blazer" || config.topStyleId === "bomber-jacket"
      ? "none"
      : config.outerwearStyleId;
  const shell = useMemo(
    () => createGarmentShell({ layer: "outerwear", outerwearStyle: style }),
    [style],
  );
  const leftSleeve = useMemo(() => createOuterSleeve(-1, style), [style]);
  const rightSleeve = useMemo(() => createOuterSleeve(1, style), [style]);
  const leftLapel = useMemo(() => createOuterLapel(-1), []);
  const rightLapel = useMemo(() => createOuterLapel(1), []);
  const torsoCentre =
    (defaultBodyAnchors.shoulderY + defaultBodyAnchors.hipY) / 2;

  if (style === "none") return null;

  return (
    <group>
      <mesh
        geometry={shell}
        material={materials.outerwear}
        position-y={torsoCentre}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={leftSleeve}
        material={materials.outerwear}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={rightSleeve}
        material={materials.outerwear}
        castShadow
        receiveShadow
      />

      {style === "blazer" ? (
        <>
          <mesh
            geometry={leftLapel}
            material={materials.outerwearDetail}
            position={[0, 4.66, 0.49]}
            castShadow
          />
          <mesh
            geometry={rightLapel}
            material={materials.outerwearDetail}
            position={[0, 4.66, 0.49]}
            castShadow
          />
          {[3.83, 3.56].map((y) => (
            <mesh
              key={y}
              material={materials.outerwearDetail}
              position={[0.05, y, 0.54]}
              rotation-x={Math.PI / 2}
            >
              <cylinderGeometry args={[0.04, 0.04, 0.027, 18]} />
            </mesh>
          ))}
          {([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.outerwearDetail}
              position={[side * 0.45, 3.3, 0.55]}
              scale={[0.25, 0.04, 0.04]}
            >
              <boxGeometry args={[1, 1, 1]} />
            </mesh>
          ))}
        </>
      ) : null}

      {style === "bomber" ? (
        <>
          <mesh
            material={materials.outerwearDetail}
            position={[0, 4.59, 0.02]}
            rotation-x={Math.PI / 2}
            scale={[1.14, 0.7, 1]}
          >
            <torusGeometry args={[0.3, 0.055, 12, 40]} />
          </mesh>
          <mesh
            material={materials.outerwearDetail}
            position={[0, 3.7, 0.52]}
          >
            <boxGeometry args={[0.05, 1.78, 0.04]} />
          </mesh>
          <mesh
            material={materials.outerwearDetail}
            position={[0, 2.82, 0]}
            rotation-x={Math.PI / 2}
            scale={[1.25, 0.5, 0.82]}
          >
            <torusGeometry args={[0.5, 0.052, 10, 42]} />
          </mesh>
        </>
      ) : null}

      {style === "overshirt" ? (
        <>
          <mesh
            material={materials.outerwearDetail}
            position={[0, 3.75, 0.52]}
          >
            <boxGeometry args={[0.055, 1.65, 0.04]} />
          </mesh>
          {([-1, 1] as const).map((side) => (
            <group key={side}>
              <mesh
                material={materials.outerwearDetail}
                position={[side * 0.33, 4.05, 0.55]}
                scale={[0.22, 0.22, 0.045]}
              >
                <boxGeometry args={[1, 1, 1]} />
              </mesh>
              <mesh
                material={materials.metal}
                position={[side * 0.33, 4.05, 0.603]}
                scale={[0.025, 0.025, 0.014]}
              >
                <sphereGeometry args={[1, 14, 10]} />
              </mesh>
            </group>
          ))}
        </>
      ) : null}

      {style === "cardigan" ? (
        <>
          {([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.outerwearDetail}
              position={[side * 0.16, 3.72, 0.52]}
              scale={[0.08, 0.92, 0.045]}
            >
              <boxGeometry args={[1, 1, 1]} />
            </mesh>
          ))}
          {[4.13, 3.82, 3.51, 3.2].map((y) => (
            <mesh
              key={y}
              material={materials.outerwearDetail}
              position={[0.05, y, 0.58]}
              rotation-x={Math.PI / 2}
            >
              <cylinderGeometry args={[0.034, 0.034, 0.022, 16]} />
            </mesh>
          ))}
        </>
      ) : null}

      {([-1, 1] as const).map((side) => (
        <mesh
          key={`cuff-${side}`}
          material={materials.outerwearDetail}
          position={[side * 0.73, 2.95, 0.15]}
          rotation-x={Math.PI / 2}
        >
          <cylinderGeometry args={[0.19, 0.18, 0.14, 22]} />
        </mesh>
      ))}
    </group>
  );
}
