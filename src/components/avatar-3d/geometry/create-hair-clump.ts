import { Vector3 } from "three";
import { createTaperedCurveGeometry } from "@/components/avatar-3d/geometry/geometry-utils";

export function createHairClump(
  points: Array<[number, number, number]>,
  rootRadius: number,
  tipRadius = rootRadius * 0.2,
) {
  return createTaperedCurveGeometry(
    points.map((point) => new Vector3(...point)),
    rootRadius,
    tipRadius,
    Math.max(14, points.length * 7),
    9,
  );
}
