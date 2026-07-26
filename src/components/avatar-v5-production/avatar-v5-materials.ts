"use client";

import {
  Color,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Plane,
  SkinnedMesh,
  Texture,
  Vector3,
} from "three";

type MaterialOwner = Mesh | SkinnedMesh;

export type AvatarV5MaterialOptions = {
  clipBelowWorldY?: number;
  hairColour?: string;
  skinColour?: string;
  skinSourceColour?: string;
  skinEligible?: boolean;
  mapOverride?: Texture;
  eyeMapOverride?: Texture;
  faceScale?: [number, number, number];
  eyeScale?: [number, number, number];
};

function isMaterialOwner(object: Object3D): object is MaterialOwner {
  return object instanceof Mesh || object instanceof SkinnedMesh;
}

function applySkinTint(
  material: MeshStandardMaterial,
  targetHex: string,
  sourceHex: string,
) {
  const target = new Color(targetHex);
  const source = new Color(sourceHex);
  material.color.setRGB(
    target.r / Math.max(source.r, 0.01),
    target.g / Math.max(source.g, 0.01),
    target.b / Math.max(source.b, 0.01),
  );
  material.needsUpdate = true;
}

export function prepareAvatarV5Scene(
  root: Object3D,
  options: AvatarV5MaterialOptions,
) {
  const ownedMaterials: Material[] = [];
  const head = root.getObjectByName("Head");
  if (head && options.faceScale) head.scale.set(...options.faceScale);
  const eyes = root.getObjectByName("Eyes");
  if (eyes && options.eyeScale) eyes.scale.set(...options.eyeScale);

  root.traverse((object) => {
    if (!isMaterialOwner(object)) return;

    object.castShadow = true;
    object.receiveShadow = true;

    const sourceMaterials = Array.isArray(object.material)
      ? object.material
      : [object.material];
    const materials = sourceMaterials.map((sourceMaterial) => {
      const material = sourceMaterial.clone();
      ownedMaterials.push(material);

      if (
        options.clipBelowWorldY !== undefined &&
        (material.name === "MI_Superhero_Female" ||
          material.name === "MI_Regular_Female" ||
          material.name === "MI_Superhero_Male" ||
          material.name === "MI_Regular_Male")
      ) {
        material.clippingPlanes = [
          new Plane(new Vector3(0, 1, 0), -options.clipBelowWorldY),
        ];
        material.clipShadows = true;
      }

      if (
        options.hairColour &&
        material instanceof MeshStandardMaterial &&
        material.name.startsWith("MI_Hair")
      ) {
        material.color.set(options.hairColour);
      }

      if (
        options.mapOverride &&
        material instanceof MeshStandardMaterial &&
        (material.name === "MI_Peasant" || material.name === "MI_Ranger")
      ) {
        material.map = options.mapOverride;
        material.needsUpdate = true;
      }

      if (
        options.eyeMapOverride &&
        material instanceof MeshStandardMaterial &&
        material.name === "MI_Eyes"
      ) {
        material.map = options.eyeMapOverride;
        material.needsUpdate = true;
      }

      if (
        options.skinEligible &&
        options.skinColour &&
        material instanceof MeshStandardMaterial &&
        (material.name === "MI_Superhero_Female" ||
          material.name === "MI_Superhero_Male" ||
          material.name === "MI_Regular_Female" ||
          material.name === "MI_Regular_Male")
      ) {
        applySkinTint(
          material,
          options.skinColour,
          options.skinSourceColour ?? "#b8754e",
        );
      }

      return material;
    });

    object.material = Array.isArray(object.material)
      ? materials
      : materials[0];
  });

  return ownedMaterials;
}
