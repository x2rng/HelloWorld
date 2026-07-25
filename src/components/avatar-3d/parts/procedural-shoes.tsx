"use client";

import { useMemo } from "react";
import { Vector3 } from "three";
import {
  createShoeGeometry,
  getShoeDimensions,
} from "@/components/avatar-3d/geometry/create-shoe-geometry";
import {
  createEllipticalLoftGeometry,
  createTaperedCurveGeometry,
} from "@/components/avatar-3d/geometry/geometry-utils";
import type { AvatarPartProps } from "@/components/avatar-3d/parts/avatar-part-types";

export function ProceduralShoes({ config, materials }: AvatarPartProps) {
  const style = config.shoeStyleId;
  const dimensions = getShoeDimensions(style);
  const shoe = useMemo(() => createShoeGeometry(style), [style]);
  const sole = useMemo(() => createShoeGeometry(style), [style]);
  const laceLeft = useMemo(
    () =>
      createTaperedCurveGeometry(
        [
          new Vector3(-0.15, 0.3, 0.18),
          new Vector3(0, 0.33, 0.26),
          new Vector3(0.15, 0.3, 0.18),
        ],
        0.014,
        0.012,
        12,
        7,
      ),
    [],
  );
  const bootShaft = useMemo(
    () =>
      createEllipticalLoftGeometry([
        { y: 0.17, radiusX: 0.22, radiusZ: 0.2 },
        { y: 0.52, radiusX: 0.2, radiusZ: 0.18 },
        { y: 0.72, radiusX: 0.21, radiusZ: 0.18 },
      ]),
    [],
  );

  return (
    <group>
      {([-1, 1] as const).map((side) => (
        <group
          key={side}
          position={[side * 0.3, dimensions.height * 0.52, 0.25]}
        >
          <mesh geometry={shoe} material={materials.shoe} castShadow receiveShadow />
          <mesh
            geometry={sole}
            material={materials.sole}
            position-y={-dimensions.height * 0.45}
            scale={[1.05, 0.34, 1.04]}
            castShadow
          />

          {style === "boots" ? (
            <mesh
              geometry={bootShaft}
              material={materials.shoe}
              position={[0, -0.08, -0.12]}
              castShadow
            />
          ) : null}

          {style === "trainers" || style === "sports-shoes" ? (
            <>
              {[-0.09, 0, 0.09].map((z) => (
                <mesh
                  key={z}
                  geometry={laceLeft}
                  material={materials.darkDetail}
                  position={[0, 0, z]}
                  rotation-y={Math.PI / 2}
                />
              ))}
              <mesh
                material={materials.sole}
                position={[side * 0.01, 0.02, 0.13]}
                scale={[0.32, 0.06, 0.38]}
                rotation-x={-0.2}
              >
                <sphereGeometry args={[1, 22, 14]} />
              </mesh>
            </>
          ) : null}

          {style === "formal-shoes" ? (
            <>
              <mesh
                material={materials.darkDetail}
                position={[0, 0.02, 0.2]}
                scale={[0.32, 0.014, 0.02]}
              >
                <boxGeometry args={[1, 1, 1]} />
              </mesh>
              <mesh
                material={materials.shoe}
                position={[0, 0.02, 0.35]}
                scale={[0.34, 0.11, 0.22]}
              >
                <sphereGeometry args={[1, 22, 14]} />
              </mesh>
            </>
          ) : null}

          {style === "casual-shoes" ? (
            <mesh
              material={materials.darkDetail}
              position={[0, 0.1, 0.18]}
              scale={[0.28, 0.035, 0.18]}
              rotation-x={-0.25}
            >
              <sphereGeometry args={[1, 22, 14]} />
            </mesh>
          ) : null}

          {style === "sports-shoes" ? (
            <mesh
              material={materials.darkDetail}
              position={[side * 0.08, -0.01, -0.12]}
              rotation-y={side * 0.14}
              scale={[0.08, 0.1, 0.36]}
            >
              <sphereGeometry args={[1, 22, 14]} />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  );
}
