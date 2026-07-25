import {
  Color,
  DoubleSide,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  type Material,
  type Texture,
} from "three";
import type { AvatarV4Config } from "@/components/avatar-3d/config/avatar-v4-types";
import {
  deriveColourScale,
  deriveSkinScale,
} from "@/components/avatar-3d/materials/colour-derivation";
import {
  createProceduralFabricTexture,
  type FabricTextureKind,
} from "@/components/avatar-3d/materials/procedural-textures";

export type AvatarMaterialSet = {
  skin: MeshPhysicalMaterial;
  skinShadow: MeshStandardMaterial;
  hair: MeshStandardMaterial;
  hairHighlight: MeshStandardMaterial;
  facialHair: MeshStandardMaterial;
  eyeWhite: MeshPhysicalMaterial;
  iris: MeshPhysicalMaterial;
  pupil: MeshStandardMaterial;
  lipUpper: MeshPhysicalMaterial;
  lipLower: MeshPhysicalMaterial;
  top: MeshStandardMaterial;
  topDetail: MeshStandardMaterial;
  outerwear: MeshStandardMaterial;
  outerwearDetail: MeshStandardMaterial;
  bottoms: MeshStandardMaterial;
  bottomsDetail: MeshStandardMaterial;
  shoe: MeshPhysicalMaterial;
  sole: MeshStandardMaterial;
  metal: MeshPhysicalMaterial;
  glass: MeshPhysicalMaterial;
  darkDetail: MeshStandardMaterial;
  dispose: () => void;
};

function garmentTexture(style: AvatarV4Config["topStyleId"]): FabricTextureKind {
  if (style === "crew-sweater" || style === "hoodie") return "knit";
  if (style === "blazer" || style === "bomber-jacket") return "structured";
  return "cotton";
}

function outerwearTexture(
  style: AvatarV4Config["outerwearStyleId"],
): FabricTextureKind {
  return style === "cardigan" ? "knit" : "structured";
}

function bottomTexture(
  style: AvatarV4Config["bottomStyleId"],
): FabricTextureKind {
  return style === "jeans" ? "denim" : "structured";
}

function makeGarmentMaterial(
  colour: string,
  texture: Texture | null,
  roughness: number,
) {
  return new MeshStandardMaterial({
    color: new Color(colour),
    map: texture,
    roughness,
    metalness: 0,
    side: DoubleSide,
  });
}

export function createAvatarMaterials(
  config: AvatarV4Config,
): AvatarMaterialSet {
  const skin = deriveSkinScale(config.skinTone);
  const hair = deriveColourScale(config.hairColour);
  const facialHair = deriveColourScale(config.facialHairColour);
  const top = deriveColourScale(config.topColour);
  const outerwear = deriveColourScale(config.outerwearColour);
  const bottoms = deriveColourScale(config.bottomColour);
  const shoes = deriveColourScale(config.shoeColour);
  const topMap = createProceduralFabricTexture(garmentTexture(config.topStyleId));
  const outerwearMap = createProceduralFabricTexture(
    outerwearTexture(config.outerwearStyleId),
  );
  const bottomMap = createProceduralFabricTexture(
    bottomTexture(config.bottomStyleId),
  );
  const rubberMap = createProceduralFabricTexture("rubber");

  const materials: Omit<AvatarMaterialSet, "dispose"> = {
    skin: new MeshPhysicalMaterial({
      color: skin.base,
      roughness: 0.72,
      metalness: 0,
      clearcoat: 0.04,
      clearcoatRoughness: 0.8,
    }),
    skinShadow: new MeshStandardMaterial({
      color: skin.shadow,
      roughness: 0.8,
    }),
    hair: new MeshStandardMaterial({
      color: hair.base,
      roughness: 0.58,
      metalness: 0.02,
    }),
    hairHighlight: new MeshStandardMaterial({
      color: new Color(hair.base).lerp(new Color(hair.highlight), 0.34),
      roughness: 0.52,
      metalness: 0.02,
    }),
    facialHair: new MeshStandardMaterial({
      color: facialHair.base,
      roughness: 0.68,
    }),
    eyeWhite: new MeshPhysicalMaterial({
      color: "#f4f1ea",
      roughness: 0.3,
      clearcoat: 0.28,
      clearcoatRoughness: 0.28,
    }),
    iris: new MeshPhysicalMaterial({
      color: config.eyeColour,
      roughness: 0.34,
      clearcoat: 0.32,
    }),
    pupil: new MeshStandardMaterial({ color: "#0a0a0b", roughness: 0.45 }),
    lipUpper: new MeshPhysicalMaterial({
      color: new Color(config.skinTone).lerp(new Color("#7a3f3d"), 0.38),
      roughness: 0.62,
      clearcoat: 0.05,
    }),
    lipLower: new MeshPhysicalMaterial({
      color: new Color(config.skinTone).lerp(new Color("#a95e58"), 0.4),
      roughness: 0.5,
      clearcoat: 0.12,
    }),
    top: makeGarmentMaterial(
      top.base,
      topMap,
      config.topStyleId === "crew-sweater" ||
        config.topStyleId === "hoodie"
        ? 0.94
        : 0.86,
    ),
    topDetail: makeGarmentMaterial(top.shadow, topMap, 0.9),
    outerwear: makeGarmentMaterial(
      outerwear.base,
      outerwearMap,
      config.outerwearStyleId === "cardigan" ? 0.94 : 0.82,
    ),
    outerwearDetail: makeGarmentMaterial(
      outerwear.shadow,
      outerwearMap,
      0.88,
    ),
    bottoms: makeGarmentMaterial(bottoms.base, bottomMap, 0.88),
    bottomsDetail: makeGarmentMaterial(bottoms.shadow, bottomMap, 0.91),
    shoe: new MeshPhysicalMaterial({
      color: shoes.base,
      roughness:
        config.shoeStyleId === "formal-shoes" ? 0.46 : 0.68,
      clearcoat: config.shoeStyleId === "formal-shoes" ? 0.22 : 0.05,
      clearcoatRoughness: 0.42,
    }),
    sole: new MeshStandardMaterial({
      color:
        config.shoeStyleId === "trainers" ||
        config.shoeStyleId === "sports-shoes"
          ? "#d8d7d1"
          : shoes.deepShadow,
      map: rubberMap,
      roughness: 0.92,
    }),
    metal: new MeshPhysicalMaterial({
      color: "#c7c9ce",
      roughness: 0.28,
      metalness: 0.82,
    }),
    glass: new MeshPhysicalMaterial({
      color: config.glassesStyleId === "sunglasses" ? "#252b34" : "#b8d2df",
      roughness: 0.08,
      transmission: config.glassesStyleId === "sunglasses" ? 0.2 : 0.72,
      transparent: true,
      opacity: config.glassesStyleId === "sunglasses" ? 0.72 : 0.34,
      thickness: 0.02,
    }),
    darkDetail: new MeshStandardMaterial({
      color: "#17191d",
      roughness: 0.72,
    }),
  };

  return {
    ...materials,
    dispose: () => {
      Object.values(materials).forEach((material) =>
        (material as Material).dispose(),
      );
      [topMap, outerwearMap, bottomMap, rubberMap].forEach((texture) =>
        texture?.dispose(),
      );
    },
  };
}
