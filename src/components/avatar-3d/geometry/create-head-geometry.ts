import { Vector3 } from "three";
import type {
  FacePresetId,
  JawPresetId,
} from "@/components/avatar-3d/config/avatar-v4-types";
import { createDeformedSphereGeometry } from "@/components/avatar-3d/geometry/geometry-utils";

const faceDimensions: Record<
  FacePresetId,
  { width: number; height: number; depth: number; cheek: number; forehead: number }
> = {
  "balanced-oval": {
    width: 0.64,
    height: 0.82,
    depth: 0.66,
    cheek: 0.05,
    forehead: 0.02,
  },
  "soft-round": {
    width: 0.69,
    height: 0.76,
    depth: 0.68,
    cheek: 0.08,
    forehead: 0.03,
  },
  "defined-square": {
    width: 0.69,
    height: 0.8,
    depth: 0.66,
    cheek: 0.03,
    forehead: 0.01,
  },
  "tapered-heart": {
    width: 0.67,
    height: 0.81,
    depth: 0.65,
    cheek: 0.07,
    forehead: 0.06,
  },
  "long-sculpted": {
    width: 0.61,
    height: 0.88,
    depth: 0.67,
    cheek: 0.04,
    forehead: 0.02,
  },
};

const jawFactors: Record<JawPresetId, number> = {
  soft: 0.86,
  balanced: 0.9,
  defined: 0.96,
  tapered: 0.79,
  broad: 1.02,
};

export function getHeadDimensions(facePresetId: FacePresetId) {
  return faceDimensions[facePresetId];
}

export function createHeadGeometry(
  facePresetId: FacePresetId,
  jawPresetId: JawPresetId,
) {
  const dimensions = faceDimensions[facePresetId];
  const jaw = jawFactors[jawPresetId];

  return createDeformedSphereGeometry(
    [dimensions.width, dimensions.height, dimensions.depth],
    (point: Vector3) => {
      const normalizedY = point.y / dimensions.height;
      const frontness = Math.max(0, point.z / dimensions.depth);
      const cheekBand = Math.exp(-(((normalizedY + 0.08) / 0.3) ** 2));
      const templeBand = Math.exp(-(((normalizedY - 0.33) / 0.2) ** 2));

      point.x *=
        1 +
        cheekBand * dimensions.cheek -
        templeBand * 0.035 +
        Math.max(0, normalizedY - 0.48) * dimensions.forehead;

      if (normalizedY < -0.22) {
        const jawBlend = Math.min(1, (-normalizedY - 0.22) / 0.72);
        point.x *= 1 + (jaw - 1) * jawBlend;
        point.z *= 1 - jawBlend * 0.06;
      }

      if (normalizedY < -0.72) {
        const chin = Math.min(1, (-normalizedY - 0.72) / 0.28);
        point.x *= 1 - chin * 0.22;
        point.z += frontness * chin * 0.04;
      }

      point.z += frontness * cheekBand * dimensions.cheek * 0.45;
    },
    48,
    34,
  );
}
