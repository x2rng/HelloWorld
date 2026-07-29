"use client";

import { Color } from "three";

export function shiftCompanionColour(
  colour: string,
  lightness: number,
  saturation = 0,
) {
  return new Color(colour)
    .offsetHSL(0, saturation, lightness)
    .getStyle();
}

export function CompanionMaterial({
  colour,
  roughness = 0.72,
  metalness = 0,
  clearcoat = 0,
}: {
  colour: string;
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
}) {
  return (
    <meshPhysicalMaterial
      color={colour}
      roughness={roughness}
      metalness={metalness}
      clearcoat={clearcoat}
      clearcoatRoughness={0.72}
    />
  );
}
