import { TorusGeometry } from "three";
import type { EarPresetId } from "@/components/avatar-3d/config/avatar-v4-types";

const earScales: Record<EarPresetId, [number, number, number]> = {
  classic: [0.16, 0.24, 0.07],
  compact: [0.13, 0.2, 0.06],
  rounded: [0.17, 0.22, 0.075],
  close: [0.14, 0.23, 0.05],
};

export function createEarGeometry(preset: EarPresetId) {
  const geometry = new TorusGeometry(0.68, 0.21, 12, 28);
  geometry.scale(...earScales[preset]);
  geometry.rotateY(Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}
