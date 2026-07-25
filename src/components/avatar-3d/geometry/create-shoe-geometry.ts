import type { ShoeStyleId } from "@/components/avatar-3d/config/avatar-v4-types";
import { createRoundedShoeBaseGeometry } from "@/components/avatar-3d/geometry/geometry-utils";

const shoeDimensions: Record<
  ShoeStyleId,
  { width: number; height: number; depth: number; toeLift: number }
> = {
  trainers: { width: 0.48, height: 0.24, depth: 0.88, toeLift: 0.1 },
  "casual-shoes": { width: 0.45, height: 0.22, depth: 0.82, toeLift: 0.065 },
  "formal-shoes": { width: 0.43, height: 0.2, depth: 0.9, toeLift: 0.045 },
  boots: { width: 0.48, height: 0.36, depth: 0.86, toeLift: 0.07 },
  "sports-shoes": { width: 0.49, height: 0.25, depth: 0.94, toeLift: 0.13 },
};

export function getShoeDimensions(style: ShoeStyleId) {
  return shoeDimensions[style];
}

export function createShoeGeometry(style: ShoeStyleId) {
  const dimensions = shoeDimensions[style];
  return createRoundedShoeBaseGeometry(
    dimensions.width,
    dimensions.height,
    dimensions.depth,
    dimensions.toeLift,
  );
}
