import { Vector3 } from "three";
import { createDeformedSphereGeometry } from "@/components/avatar-3d/geometry/geometry-utils";

export function createHandGeometry() {
  return createDeformedSphereGeometry(
    [0.17, 0.3, 0.11],
    (point: Vector3) => {
      const lower = Math.max(0, (-point.y - 0.05) / 0.25);
      point.x *= 1 - lower * 0.2;
      point.z += Math.max(0, point.y) * 0.08;
    },
    26,
    18,
  );
}
