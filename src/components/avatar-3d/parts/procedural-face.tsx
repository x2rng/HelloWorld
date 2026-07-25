"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  type Group,
  type Mesh,
} from "three";
import { getBlinkAmount } from "@/components/avatar-3d/animation/avatar-blink-controller";
import { createEarGeometry } from "@/components/avatar-3d/geometry/create-ear-geometry";
import {
  createHeadGeometry,
  getHeadDimensions,
} from "@/components/avatar-3d/geometry/create-head-geometry";
import {
  createLipGeometry,
  getMouthWidth,
} from "@/components/avatar-3d/geometry/create-lip-geometry";
import {
  createNoseGeometry,
  getNoseDimensions,
} from "@/components/avatar-3d/geometry/create-nose-geometry";
import { createHairClump } from "@/components/avatar-3d/geometry/create-hair-clump";
import type { AvatarPartProps } from "@/components/avatar-3d/parts/avatar-part-types";

const eyeScales = {
  almond: [0.15, 0.074, 0.055],
  round: [0.135, 0.09, 0.06],
  hooded: [0.15, 0.066, 0.055],
  lifted: [0.15, 0.072, 0.055],
  relaxed: [0.148, 0.065, 0.055],
  focused: [0.145, 0.058, 0.052],
} as const;

function eyebrowPoints(
  side: -1 | 1,
  style: AvatarPartProps["config"]["eyebrowStyleId"],
) {
  const arch =
    style === "arched" ? 0.09 : style === "straight" ? 0.015 : 0.05;
  const outerLift = style === "soft" ? 0.025 : 0.045;
  const width = style === "bold" ? 0.22 : 0.2;
  return [
    [side * 0.12, 0.29, 0.62],
    [side * 0.23, 0.31 + arch, 0.65],
    [side * (0.12 + width), 0.28 + outerLift, 0.61],
  ] as Array<[number, number, number]>;
}

function FacialHair({
  config,
  materials,
}: Pick<AvatarPartProps, "config" | "materials">) {
  const moustacheLeft = useMemo(
    () =>
      createHairClump(
        [
          [-0.01, -0.2, 0.69],
          [-0.11, -0.23, 0.7],
          [-0.21, -0.25, 0.66],
        ],
        0.035,
        0.012,
      ),
    [],
  );
  const moustacheRight = useMemo(
    () =>
      createHairClump(
        [
          [0.01, -0.2, 0.69],
          [0.11, -0.23, 0.7],
          [0.21, -0.25, 0.66],
        ],
        0.035,
        0.012,
      ),
    [],
  );

  if (config.facialHairStyleId === "none") return null;

  return (
    <group>
      {config.facialHairStyleId !== "stubble" ? (
        <>
          <mesh geometry={moustacheLeft} material={materials.facialHair} castShadow />
          <mesh geometry={moustacheRight} material={materials.facialHair} castShadow />
        </>
      ) : null}
      {config.facialHairStyleId === "goatee" ||
      config.facialHairStyleId === "short-beard" ? (
        <mesh
          material={materials.facialHair}
          position={[0, -0.48, 0.58]}
          scale={
            config.facialHairStyleId === "short-beard"
              ? [0.42, 0.34, 0.08]
              : [0.18, 0.24, 0.06]
          }
          castShadow
        >
          <sphereGeometry args={[1, 30, 20, 0, Math.PI * 2, 1.25, 1.35]} />
        </mesh>
      ) : null}
      {config.facialHairStyleId === "stubble" ? (
        <mesh
          material={materials.facialHair}
          position={[0, -0.38, 0.57]}
          scale={[0.43, 0.32, 0.035]}
        >
          <sphereGeometry args={[1, 28, 18, 0, Math.PI * 2, 1.2, 1.45]} />
        </mesh>
      ) : null}
    </group>
  );
}

export function ProceduralFace({
  config,
  materials,
  reducedMotion = false,
  quality,
}: AvatarPartProps) {
  const faceGroup = useRef<Group>(null);
  const leftLid = useRef<Mesh>(null);
  const rightLid = useRef<Mesh>(null);
  const head = useMemo(
    () => createHeadGeometry(config.facePresetId, config.jawPresetId),
    [config.facePresetId, config.jawPresetId],
  );
  const ear = useMemo(
    () => createEarGeometry(config.earPresetId),
    [config.earPresetId],
  );
  const nose = useMemo(
    () => createNoseGeometry(config.nosePresetId),
    [config.nosePresetId],
  );
  const upperLip = useMemo(
    () => createLipGeometry(config.mouthPresetId, "upper"),
    [config.mouthPresetId],
  );
  const lowerLip = useMemo(
    () => createLipGeometry(config.mouthPresetId, "lower"),
    [config.mouthPresetId],
  );
  const leftBrow = useMemo(
    () =>
      createHairClump(
        eyebrowPoints(-1, config.eyebrowStyleId),
        config.eyebrowStyleId === "bold" ? 0.034 : 0.025,
        0.014,
      ),
    [config.eyebrowStyleId],
  );
  const rightBrow = useMemo(
    () =>
      createHairClump(
        eyebrowPoints(1, config.eyebrowStyleId),
        config.eyebrowStyleId === "bold" ? 0.034 : 0.025,
        0.014,
      ),
    [config.eyebrowStyleId],
  );
  const dimensions = getHeadDimensions(config.facePresetId);
  const noseDimensions = getNoseDimensions(config.nosePresetId);
  const eyeScale = eyeScales[config.eyeShapeId];
  const eyeSpacing =
    config.facePresetId === "soft-round"
      ? 0.255
      : config.facePresetId === "long-sculpted"
        ? 0.225
        : 0.24;
  const eyeY =
    config.eyeShapeId === "lifted"
      ? 0.11
      : config.eyeShapeId === "relaxed"
        ? 0.07
        : 0.09;
  const eyeZ = dimensions.depth * 0.93;
  const mouthWidth = getMouthWidth(config.mouthPresetId);

  useFrame(({ clock }) => {
    if (faceGroup.current && !reducedMotion && quality !== "low") {
      faceGroup.current.rotation.y =
        Math.sin(clock.elapsedTime * 0.23) * 0.012;
    }

    const blink =
      reducedMotion || quality === "low" ? 0 : getBlinkAmount(clock.elapsedTime);
    for (const lid of [leftLid.current, rightLid.current]) {
      if (!lid) continue;
      lid.scale.y = 0.028 + blink * 0.105;
      lid.position.y = eyeY + 0.045 - blink * 0.045;
    }
  });

  return (
    <group ref={faceGroup} position={[0, 5.66, 0]} scale={0.9}>
      <mesh geometry={head} material={materials.skin} castShadow receiveShadow />
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <mesh
            geometry={ear}
            material={materials.skin}
            position={[side * (dimensions.width * 0.98), 0.01, -0.01]}
            rotation-y={side * -0.08}
            castShadow
          />
          <mesh
            geometry={ear}
            material={materials.skinShadow}
            position={[side * (dimensions.width * 0.995), 0.01, 0]}
            scale={[0.58, 0.58, 0.56]}
          />

          <mesh
            material={materials.eyeWhite}
            position={[side * eyeSpacing, eyeY, eyeZ]}
            rotation-z={
              config.eyeShapeId === "lifted" ? side * -0.08 : side * 0.015
            }
            scale={eyeScale}
            castShadow
          >
            <sphereGeometry args={[1, 30, 20]} />
          </mesh>
          <mesh
            material={materials.iris}
            position={[side * eyeSpacing, eyeY, eyeZ + 0.075]}
            scale={[eyeScale[1] * 0.7, eyeScale[1] * 0.7, 0.02]}
          >
            <sphereGeometry args={[1, 24, 16]} />
          </mesh>
          <mesh
            material={materials.pupil}
            position={[side * eyeSpacing, eyeY, eyeZ + 0.094]}
            scale={[eyeScale[1] * 0.34, eyeScale[1] * 0.34, 0.014]}
          >
            <sphereGeometry args={[1, 20, 14]} />
          </mesh>
          <mesh
            material={materials.eyeWhite}
            position={[
              side * eyeSpacing - 0.018,
              eyeY + 0.025,
              eyeZ + 0.11,
            ]}
            scale={[0.014, 0.014, 0.008]}
          >
            <sphereGeometry args={[1, 14, 10]} />
          </mesh>

          <mesh
            ref={side === -1 ? leftLid : rightLid}
            material={materials.skin}
            position={[side * eyeSpacing, eyeY + 0.045, eyeZ + 0.085]}
            scale={[eyeScale[0] * 1.05, 0.028, 0.035]}
            castShadow
          >
            <sphereGeometry args={[1, 28, 16]} />
          </mesh>
          <mesh
            material={materials.skinShadow}
            position={[side * eyeSpacing, eyeY - eyeScale[1] * 0.7, eyeZ + 0.072]}
            scale={[eyeScale[0] * 0.92, 0.018, 0.022]}
          >
            <sphereGeometry args={[1, 24, 14]} />
          </mesh>
        </group>
      ))}

      <mesh geometry={leftBrow} material={materials.hair} castShadow />
      <mesh geometry={rightBrow} material={materials.hair} castShadow />

      <mesh
        geometry={nose}
        material={materials.skin}
        position={[0, -0.03, dimensions.depth * 0.78]}
        castShadow
      />
      {([-1, 1] as const).map((side) => (
        <mesh
          key={side}
          material={materials.skinShadow}
          position={[
            side * noseDimensions.width * 0.58,
            -noseDimensions.length * 0.5,
            dimensions.depth * 0.78 + noseDimensions.projection * 0.94,
          ]}
          scale={[0.022, 0.014, 0.012]}
        >
          <sphereGeometry args={[1, 16, 10]} />
        </mesh>
      ))}

      <group
        position={[
          0,
          config.expressionId === "warm" ? -0.32 : -0.34,
          dimensions.depth * 0.93,
        ]}
        scale={[
          mouthWidth / 0.195,
          config.expressionId === "focused" ? 0.82 : 1,
          1,
        ]}
      >
        <mesh
          geometry={upperLip}
          material={materials.lipUpper}
          position-z={0.015}
          rotation-x={-0.08}
        />
        <mesh
          geometry={lowerLip}
          material={materials.lipLower}
          position={[0, -0.07, 0.025]}
          rotation-x={0.08}
        />
      </group>

      <FacialHair config={config} materials={materials} />
    </group>
  );
}
