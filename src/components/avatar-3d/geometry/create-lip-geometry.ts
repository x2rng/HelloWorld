import { ExtrudeGeometry, Shape } from "three";
import type { MouthPresetId } from "@/components/avatar-3d/config/avatar-v4-types";

const mouthWidths: Record<MouthPresetId, number> = {
  neutral: 0.18,
  "soft-smile": 0.195,
  confident: 0.185,
  relaxed: 0.2,
  focused: 0.17,
  friendly: 0.21,
};

export function getMouthWidth(preset: MouthPresetId) {
  return mouthWidths[preset];
}

export function createLipGeometry(
  preset: MouthPresetId,
  lip: "upper" | "lower",
) {
  const width = mouthWidths[preset];
  const smile =
    preset === "soft-smile" || preset === "friendly"
      ? 0.025
      : preset === "confident"
        ? 0.012
        : 0;
  const fullness =
    preset === "relaxed" || preset === "friendly" ? 0.045 : 0.036;
  const shape = new Shape();

  if (lip === "upper") {
    shape.moveTo(-width, 0);
    shape.quadraticCurveTo(-width * 0.45, fullness + smile, 0, fullness * 0.62);
    shape.quadraticCurveTo(width * 0.45, fullness + smile, width, 0);
    shape.quadraticCurveTo(0, -fullness * 0.28 + smile, -width, 0);
  } else {
    shape.moveTo(-width, 0);
    shape.quadraticCurveTo(0, -fullness * 0.8 + smile, width, 0);
    shape.quadraticCurveTo(0, fullness * 0.36 + smile, -width, 0);
  }

  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.018,
    bevelThickness: 0.014,
    curveSegments: 16,
  });
  geometry.center();
  return geometry;
}
