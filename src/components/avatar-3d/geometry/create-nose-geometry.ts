import { Vector3 } from "three";
import type { NosePresetId } from "@/components/avatar-3d/config/avatar-v4-types";
import { createTaperedCurveGeometry } from "@/components/avatar-3d/geometry/geometry-utils";

const dimensions: Record<
  NosePresetId,
  { length: number; width: number; projection: number }
> = {
  soft: { length: 0.35, width: 0.105, projection: 0.24 },
  straight: { length: 0.39, width: 0.095, projection: 0.25 },
  rounded: { length: 0.34, width: 0.12, projection: 0.27 },
  defined: { length: 0.41, width: 0.1, projection: 0.29 },
  compact: { length: 0.29, width: 0.095, projection: 0.2 },
};

export function getNoseDimensions(preset: NosePresetId) {
  return dimensions[preset];
}

export function createNoseGeometry(preset: NosePresetId) {
  const nose = dimensions[preset];
  return createTaperedCurveGeometry(
    [
      new Vector3(0, nose.length * 0.5, 0.02),
      new Vector3(0, 0.02, nose.projection * 0.5),
      new Vector3(0, -nose.length * 0.48, nose.projection),
    ],
    nose.width * 0.58,
    nose.width,
    18,
    12,
  );
}
