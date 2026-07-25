import type {
  OuterwearStyleId,
  TopStyleId,
} from "@/components/avatar-3d/config/avatar-v4-types";
import {
  createEllipticalLoftGeometry,
  type LoftRing,
} from "@/components/avatar-3d/geometry/geometry-utils";
import {
  defaultBodyAnchors,
  type BodyAnchors,
} from "@/components/avatar-3d/geometry/create-torso-geometry";

type GarmentShellOptions = {
  layer: "top" | "outerwear";
  topStyle?: TopStyleId;
  outerwearStyle?: OuterwearStyleId;
  anchors?: BodyAnchors;
};

export function createGarmentShell({
  layer,
  topStyle = "fitted-tee",
  outerwearStyle = "none",
  anchors = defaultBodyAnchors,
}: GarmentShellOptions) {
  const centreY = (anchors.shoulderY + anchors.hipY) / 2;
  const isOuterwear = layer === "outerwear";
  const style = isOuterwear ? outerwearStyle : topStyle;
  const relaxed =
    style === "relaxed-tee" ||
    style === "hoodie" ||
    style === "bomber-jacket" ||
    style === "bomber" ||
    style === "overshirt";
  const structured =
    style === "blazer" || style === "oxford-shirt" || style === "overshirt";
  const thickness =
    (isOuterwear ? 0.095 : 0.055) +
    (relaxed ? 0.045 : 0) +
    (style === "crew-sweater" || style === "cardigan" ? 0.025 : 0);
  const hemY =
    style === "hoodie" || style === "bomber-jacket" || style === "bomber"
      ? anchors.hipY + 0.13
      : anchors.hipY - 0.05;

  const rings: LoftRing[] = [
    {
      y: hemY - centreY,
      radiusX: anchors.hipWidth * 0.5 + thickness + (relaxed ? 0.045 : 0),
      radiusZ: anchors.chestDepth * 0.45 + thickness,
      offsetZ: -0.01,
    },
    {
      y: anchors.waistY - centreY,
      radiusX:
        anchors.waistWidth * 0.5 + thickness + (relaxed ? 0.08 : 0.015),
      radiusZ: anchors.chestDepth * 0.43 + thickness,
    },
    {
      y: anchors.chestY - centreY,
      radiusX:
        anchors.shoulderWidth * 0.435 +
        thickness +
        (structured ? 0.045 : 0),
      radiusZ: anchors.chestDepth * 0.53 + thickness,
      offsetZ: 0.045,
    },
    {
      y: anchors.shoulderY - centreY - 0.38,
      radiusX:
        anchors.shoulderWidth * 0.49 +
        thickness +
        (structured ? 0.055 : 0),
      radiusZ: anchors.chestDepth * 0.51 + thickness,
      offsetZ: 0.02,
    },
    {
      y: anchors.shoulderY - centreY - 0.18,
      radiusX:
        anchors.shoulderWidth * 0.485 +
        thickness +
        (structured ? 0.065 : 0),
      radiusZ: anchors.chestDepth * 0.49 + thickness,
    },
    {
      y: anchors.shoulderY - centreY,
      radiusX: anchors.shoulderWidth * 0.29 + thickness,
      radiusZ: anchors.chestDepth * 0.36 + thickness,
      offsetZ: -0.015,
    },
  ];

  return createEllipticalLoftGeometry(rings);
}
