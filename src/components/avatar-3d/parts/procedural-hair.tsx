"use client";

import { useMemo } from "react";
import { SphereGeometry } from "three";
import { createHairClump } from "@/components/avatar-3d/geometry/create-hair-clump";
import { getHeadDimensions } from "@/components/avatar-3d/geometry/create-head-geometry";
import type { AvatarPartProps } from "@/components/avatar-3d/parts/avatar-part-types";
import type { HairStyleId } from "@/components/avatar-3d/config/avatar-v4-types";

type ClumpDefinition = {
  points: Array<[number, number, number]>;
  radius: number;
};

function mirrored(
  definitions: ClumpDefinition[],
): ClumpDefinition[] {
  return [
    ...definitions,
    ...definitions.map((definition) => ({
      ...definition,
      points: definition.points.map(
        ([x, y, z]) => [-x, y, z] as [number, number, number],
      ),
    })),
  ];
}

function createRearLayerClumps(style: HairStyleId): ClumpDefinition[] {
  if (style === "close-crop") return [];

  const endY =
    style === "shoulder-waves"
      ? -1.42
      : style === "layered-bob"
        ? -0.82
        : style === "medium-swept"
          ? -0.45
          : style === "curly-volume"
            ? -0.72
            : -0.12;
  const count =
    style === "shoulder-waves" || style === "layered-bob" ? 7 : 5;

  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    const x = -0.43 + t * 0.86;
    const wave =
      style === "shoulder-waves" || style === "curly-volume"
        ? (index % 2 === 0 ? -1 : 1) * 0.1
        : (t - 0.5) * 0.04;
    return {
      points: [
        [x * 0.55, 0.72, -0.34],
        [x, 0.48, -0.59],
        [x + wave, endY * 0.48, -0.66],
        [x - wave * 0.45, endY, -0.57],
      ],
      radius:
        style === "curly-volume"
          ? 0.145
          : style === "shoulder-waves"
            ? 0.115
            : 0.095,
    };
  });
}

function createStyleClumps(style: HairStyleId): ClumpDefinition[] {
  if (style === "textured-crop") {
    return mirrored([
      {
        points: [
          [0.04, 0.67, 0.18],
          [0.12, 0.83, 0.3],
          [0.2, 0.66, 0.58],
        ],
        radius: 0.12,
      },
      {
        points: [
          [0.16, 0.7, 0.05],
          [0.27, 0.84, 0.2],
          [0.34, 0.62, 0.5],
        ],
        radius: 0.11,
      },
      {
        points: [
          [0.31, 0.55, -0.1],
          [0.42, 0.67, 0.08],
          [0.48, 0.48, 0.35],
        ],
        radius: 0.1,
      },
      {
        points: [
          [0.12, 0.76, -0.34],
          [0.25, 0.84, -0.16],
          [0.31, 0.68, 0.08],
        ],
        radius: 0.115,
      },
    ]);
  }

  if (style === "side-part") {
    return [
      ...mirrored([
        {
          points: [
            [0.05, 0.7, -0.2],
            [0.16, 0.9, 0.03],
            [0.36, 0.78, 0.36],
          ],
          radius: 0.115,
        },
        {
          points: [
            [0.2, 0.66, -0.28],
            [0.38, 0.78, -0.05],
            [0.52, 0.52, 0.28],
          ],
          radius: 0.105,
        },
      ]),
      {
        points: [
          [-0.08, 0.72, 0.1],
          [0.15, 0.98, 0.25],
          [0.49, 0.71, 0.5],
        ],
        radius: 0.14,
      },
      {
        points: [
          [-0.16, 0.66, 0.03],
          [0.1, 0.91, 0.2],
          [0.43, 0.63, 0.56],
        ],
        radius: 0.12,
      },
    ];
  }

  if (style === "medium-swept") {
    return [
      ...mirrored([
        {
          points: [
            [0.06, 0.68, -0.32],
            [0.22, 0.94, -0.03],
            [0.47, 0.72, 0.43],
            [0.46, 0.3, 0.52],
          ],
          radius: 0.13,
        },
        {
          points: [
            [0.26, 0.53, -0.35],
            [0.52, 0.64, -0.1],
            [0.61, 0.24, 0.2],
            [0.56, -0.2, 0.2],
          ],
          radius: 0.12,
        },
      ]),
      {
        points: [
          [-0.12, 0.72, 0.05],
          [0.05, 1.02, 0.26],
          [0.42, 0.76, 0.57],
        ],
        radius: 0.14,
      },
    ];
  }

  if (style === "close-crop") {
    return mirrored([
      {
        points: [
          [0.08, 0.72, 0.02],
          [0.16, 0.79, 0.18],
          [0.22, 0.66, 0.42],
        ],
        radius: 0.065,
      },
      {
        points: [
          [0.28, 0.57, -0.16],
          [0.4, 0.66, 0.02],
          [0.45, 0.48, 0.28],
        ],
        radius: 0.06,
      },
    ]);
  }

  if (style === "layered-bob") {
    return mirrored([
      {
        points: [
          [0.08, 0.72, -0.24],
          [0.32, 0.86, -0.03],
          [0.58, 0.4, 0.18],
          [0.62, -0.35, 0.14],
          [0.52, -0.73, 0.25],
        ],
        radius: 0.15,
      },
      {
        points: [
          [0.28, 0.58, -0.34],
          [0.54, 0.52, -0.16],
          [0.65, -0.08, -0.04],
          [0.58, -0.72, 0.02],
        ],
        radius: 0.145,
      },
      {
        points: [
          [0.16, 0.7, 0.08],
          [0.38, 0.76, 0.36],
          [0.53, 0.22, 0.54],
          [0.48, -0.45, 0.48],
        ],
        radius: 0.13,
      },
    ]);
  }

  if (style === "shoulder-waves") {
    return mirrored([
      {
        points: [
          [0.08, 0.72, -0.28],
          [0.4, 0.88, -0.06],
          [0.62, 0.34, 0.18],
          [0.52, -0.24, 0.32],
          [0.7, -0.82, 0.18],
          [0.56, -1.28, 0.06],
        ],
        radius: 0.14,
      },
      {
        points: [
          [0.28, 0.56, -0.36],
          [0.58, 0.48, -0.16],
          [0.48, -0.05, -0.12],
          [0.7, -0.58, -0.08],
          [0.55, -1.22, -0.02],
        ],
        radius: 0.135,
      },
      {
        points: [
          [0.12, 0.7, 0.05],
          [0.38, 0.74, 0.4],
          [0.52, 0.1, 0.53],
          [0.42, -0.52, 0.46],
          [0.58, -1.08, 0.32],
        ],
        radius: 0.12,
      },
    ]);
  }

  if (style === "ponytail") {
    return [
      ...mirrored([
        {
          points: [
            [0.08, 0.72, -0.24],
            [0.32, 0.86, -0.08],
            [0.53, 0.45, 0.3],
          ],
          radius: 0.13,
        },
        {
          points: [
            [0.25, 0.58, -0.37],
            [0.5, 0.45, -0.26],
            [0.56, 0.05, -0.14],
          ],
          radius: 0.115,
        },
      ]),
      ...mirrored([
        {
          points: [
            [0.08, 0.35, -0.6],
            [0.22, 0.08, -0.92],
            [0.18, -0.5, -1.02],
            [0.3, -1.1, -0.88],
          ],
          radius: 0.14,
        },
        {
          points: [
            [0.03, 0.36, -0.62],
            [0.14, 0.02, -0.96],
            [0.05, -0.66, -1.04],
            [0.16, -1.28, -0.82],
          ],
          radius: 0.125,
        },
      ]),
    ];
  }

  const curls: ClumpDefinition[] = [];
  const rows = [
    { y: 0.72, radius: 0.43, count: 7 },
    { y: 0.42, radius: 0.59, count: 9 },
    { y: 0.08, radius: 0.62, count: 8 },
  ];
  rows.forEach((row, rowIndex) => {
    for (let index = 0; index < row.count; index += 1) {
      const angle = (index / row.count) * Math.PI * 2;
      const x = Math.cos(angle) * row.radius;
      const z = Math.sin(angle) * row.radius * 0.88;
      curls.push({
        points: [
          [x * 0.72, row.y, z * 0.72],
          [x * 1.06, row.y + 0.18, z * 1.06],
          [
            x * 0.92 + Math.sin(angle * 2) * 0.08,
            row.y - 0.04 - rowIndex * 0.08,
            z * 0.98,
          ],
          [x * 1.02, row.y - 0.28, z * 1.02],
        ],
        radius: 0.11 + rowIndex * 0.008,
      });
    }
  });
  return curls;
}

export function ProceduralHair({ config, materials, quality }: AvatarPartProps) {
  const dimensions = getHeadDimensions(config.facePresetId);
  const hasCap = config.accessoryIds.includes("cap");
  const hasBeanie = config.accessoryIds.includes("beanie");
  const hasHeadwear = hasCap || hasBeanie;
  const definitions = useMemo(
    () => [
      ...createStyleClumps(config.hairStyleId),
      ...createRearLayerClumps(config.hairStyleId),
    ],
    [config.hairStyleId],
  );
  const visibleDefinitions = hasHeadwear
    ? definitions.filter((_, index) => index % 3 === 0)
    : definitions;
  const maxClumps =
    quality === "low"
      ? Math.ceil(visibleDefinitions.length * 0.58)
      : visibleDefinitions.length;
  const clumps = useMemo(
    () =>
      visibleDefinitions
        .slice(0, maxClumps)
        .map((definition) =>
          createHairClump(
            definition.points,
            definition.radius,
            definition.radius * 0.18,
          ),
        ),
    [maxClumps, visibleDefinitions],
  );
  const scalp = useMemo(
    () =>
      new SphereGeometry(
        1,
        quality === "low" ? 28 : 42,
        quality === "low" ? 16 : 24,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.515,
      ),
    [quality],
  );

  return (
    <group position={[0, 5.66, 0]} scale={0.9}>
      <mesh
        geometry={scalp}
        material={materials.hair}
        scale={[
          dimensions.width * 1.025,
          dimensions.height * 1.035,
          dimensions.depth * 1.025,
        ]}
        castShadow
        receiveShadow
      />
      {clumps.map((geometry, index) => (
        <mesh
          key={`${config.hairStyleId}-${index}`}
          geometry={geometry}
          material={index % 4 === 0 ? materials.hairHighlight : materials.hair}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
