"use client";

import { useMemo } from "react";
import {
  CatmullRomCurve3,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";
import { createRoundedShoeBaseGeometry } from "@/components/avatar-3d/geometry/geometry-utils";
import { getHeadDimensions } from "@/components/avatar-3d/geometry/create-head-geometry";
import type { AvatarPartProps } from "@/components/avatar-3d/parts/avatar-part-types";

function createRectangleFrame(width: number, height: number) {
  const curve = new CatmullRomCurve3(
    [
      new Vector3(-width, height, 0),
      new Vector3(width, height, 0),
      new Vector3(width, -height, 0),
      new Vector3(-width, -height, 0),
    ],
    true,
    "catmullrom",
    0.08,
  );
  return new TubeGeometry(curve, 28, 0.018, 8, true);
}

function createNecklaceGeometry() {
  const curve = new CatmullRomCurve3([
    new Vector3(-0.35, 4.62, 0.28),
    new Vector3(-0.25, 4.32, 0.48),
    new Vector3(0, 4.16, 0.55),
    new Vector3(0.25, 4.32, 0.48),
    new Vector3(0.35, 4.62, 0.28),
  ]);
  return new TubeGeometry(curve, 34, 0.012, 8, false);
}

export function ProceduralAccessories({
  config,
  materials,
}: AvatarPartProps) {
  const dimensions = getHeadDimensions(config.facePresetId);
  const rectangleFrame = useMemo(() => createRectangleFrame(0.17, 0.105), []);
  const necklace = useMemo(() => createNecklaceGeometry(), []);
  const capCrown = useMemo(
    () => new SphereGeometry(1, 34, 22, 0, Math.PI * 2, 0, Math.PI * 0.58),
    [],
  );
  const capBrim = useMemo(
    () => createRoundedShoeBaseGeometry(0.72, 0.07, 0.42, 0.025),
    [],
  );
  const beanie = useMemo(
    () => new SphereGeometry(1, 34, 24, 0, Math.PI * 2, 0, Math.PI * 0.66),
    [],
  );
  const eyeY =
    config.eyeShapeId === "lifted"
      ? 5.77
      : config.eyeShapeId === "relaxed"
        ? 5.73
        : 5.75;
  const eyeZ = dimensions.depth * 0.89 + 0.085;
  const glassesWidth =
    config.facePresetId === "soft-round" ||
    config.facePresetId === "defined-square"
      ? 0.19
      : 0.17;

  return (
    <group>
      {config.glassesStyleId !== "none" ? (
        <group position={[0, eyeY, eyeZ]}>
          {([-1, 1] as const).map((side) => (
            <group key={side} position-x={side * 0.24}>
              {config.glassesStyleId === "round" ? (
                <mesh
                  material={materials.metal}
                  scale={[1.05, 0.82, 1]}
                  castShadow
                >
                  <torusGeometry args={[glassesWidth, 0.018, 10, 36]} />
                </mesh>
              ) : (
                <mesh
                  geometry={rectangleFrame}
                  material={materials.metal}
                  scale={[glassesWidth / 0.17, 1, 1]}
                  castShadow
                />
              )}
              <mesh
                material={materials.glass}
                position-z={0.003}
                scale={[
                  glassesWidth,
                  config.glassesStyleId === "sunglasses" ? 0.12 : 0.1,
                  0.018,
                ]}
              >
                <sphereGeometry args={[1, 24, 16]} />
              </mesh>
            </group>
          ))}
          <mesh material={materials.metal} scale={[0.07, 0.015, 0.015]}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
          {([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.metal}
              position={[side * 0.43, 0, -0.08]}
              rotation-y={side * -0.2}
              scale={[0.23, 0.012, 0.012]}
            >
              <boxGeometry args={[1, 1, 1]} />
            </mesh>
          ))}
        </group>
      ) : null}

      {config.accessoryIds.includes("earrings")
        ? ([-1, 1] as const).map((side) => (
            <mesh
              key={side}
              material={materials.metal}
              position={[
                side * dimensions.width * 1.02,
                5.48,
                0.02,
              ]}
              rotation-y={Math.PI / 2}
              castShadow
            >
              <torusGeometry args={[0.075, 0.016, 10, 30]} />
            </mesh>
          ))
        : null}

      {config.accessoryIds.includes("watch") ? (
        <group position={[-0.72, 2.96, 0.14]}>
          <mesh
            material={materials.darkDetail}
            rotation-x={Math.PI / 2}
            scale={[1, 0.72, 1]}
          >
            <torusGeometry args={[0.175, 0.028, 10, 30]} />
          </mesh>
          <mesh
            material={materials.metal}
            position-z={0.15}
            scale={[0.09, 0.12, 0.025]}
          >
            <sphereGeometry args={[1, 20, 14]} />
          </mesh>
        </group>
      ) : null}

      {config.accessoryIds.includes("necklace") ? (
        <>
          <mesh geometry={necklace} material={materials.metal} castShadow />
          <mesh
            material={materials.metal}
            position={[0, 4.1, 0.57]}
            scale={[0.045, 0.06, 0.025]}
          >
            <sphereGeometry args={[1, 18, 12]} />
          </mesh>
        </>
      ) : null}

      {config.accessoryIds.includes("cap") ? (
        <group position={[0, 6.2, 0]}>
          <mesh
            geometry={capCrown}
            material={materials.top}
            scale={[
              dimensions.width * 1.08,
              dimensions.height * 0.58,
              dimensions.depth * 1.08,
            ]}
            castShadow
          />
          <mesh
            geometry={capBrim}
            material={materials.topDetail}
            position={[0, 0.13, 0.62]}
            rotation-x={-0.12}
            castShadow
          />
        </group>
      ) : null}

      {config.accessoryIds.includes("beanie") ? (
        <group position={[0, 6.18, 0]}>
          <mesh
            geometry={beanie}
            material={materials.top}
            scale={[
              dimensions.width * 1.08,
              dimensions.height * 0.68,
              dimensions.depth * 1.08,
            ]}
            castShadow
          />
          <mesh
            material={materials.topDetail}
            position={[0, 0.05, 0]}
            rotation-x={Math.PI / 2}
            scale={[1.1, 0.9, 1]}
          >
            <torusGeometry args={[dimensions.width * 0.78, 0.08, 10, 42]} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}
