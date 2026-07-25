import { createEllipticalLoftGeometry } from "@/components/avatar-3d/geometry/geometry-utils";

export type BodyAnchors = {
  shoulderWidth: number;
  chestDepth: number;
  torsoLength: number;
  waistWidth: number;
  hipWidth: number;
  shoulderY: number;
  chestY: number;
  waistY: number;
  hipY: number;
};

export const defaultBodyAnchors: BodyAnchors = {
  shoulderWidth: 1.52,
  chestDepth: 0.72,
  torsoLength: 2.2,
  waistWidth: 0.96,
  hipWidth: 1.16,
  shoulderY: 4.72,
  chestY: 4.2,
  waistY: 3.28,
  hipY: 2.76,
};

export function createTorsoGeometry(anchors = defaultBodyAnchors) {
  const centreY = (anchors.shoulderY + anchors.hipY) / 2;

  return createEllipticalLoftGeometry([
    {
      y: anchors.hipY - centreY,
      radiusX: anchors.hipWidth * 0.5,
      radiusZ: anchors.chestDepth * 0.45,
      offsetZ: -0.02,
    },
    {
      y: anchors.waistY - centreY,
      radiusX: anchors.waistWidth * 0.5,
      radiusZ: anchors.chestDepth * 0.43,
    },
    {
      y: anchors.chestY - centreY,
      radiusX: anchors.shoulderWidth * 0.46,
      radiusZ: anchors.chestDepth * 0.53,
      offsetZ: 0.04,
    },
    {
      y: anchors.shoulderY - centreY - 0.2,
      radiusX: anchors.shoulderWidth * 0.5,
      radiusZ: anchors.chestDepth * 0.49,
    },
    {
      y: anchors.shoulderY - centreY,
      radiusX: anchors.shoulderWidth * 0.37,
      radiusZ: anchors.chestDepth * 0.38,
      offsetZ: -0.01,
    },
  ]);
}
