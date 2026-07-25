import { Vector3 } from "three";
import { createTaperedCurveGeometry } from "@/components/avatar-3d/geometry/geometry-utils";

export function createArmGeometry(side: -1 | 1) {
  return createTaperedCurveGeometry(
    [
      new Vector3(side * 0.69, 4.58, -0.01),
      new Vector3(side * 0.81, 4.08, 0.01),
      new Vector3(side * 0.82, 3.55, 0.08),
      new Vector3(side * 0.73, 2.92, 0.13),
    ],
    0.235,
    0.145,
    28,
    14,
  );
}

export function createLegGeometry(side: -1 | 1) {
  return createTaperedCurveGeometry(
    [
      new Vector3(side * 0.34, 2.82, -0.02),
      new Vector3(side * 0.36, 2.15, 0.01),
      new Vector3(side * 0.34, 1.45, 0.07),
      new Vector3(side * 0.31, 0.72, 0.03),
      new Vector3(side * 0.3, 0.26, 0.02),
    ],
    0.34,
    0.17,
    34,
    16,
  );
}
