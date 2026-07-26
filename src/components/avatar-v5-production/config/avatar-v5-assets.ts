import type {
  AvatarV5BottomStyleId,
  AvatarV5ColourVariantId,
  AvatarV5EyeColourId,
  AvatarV5FacialHairStyleId,
  AvatarV5FrameId,
  AvatarV5HairStyleId,
  AvatarV5ShoeStyleId,
  AvatarV5TopStyleId,
} from "@/components/avatar-v5-production/config/avatar-v5-types";

const ROOT = "/avatar-v5-production";
type OutfitFamily = "peasant" | "ranger";

export const avatarV5BaseAssets: Record<AvatarV5FrameId, string> = {
  sculpted: `${ROOT}/base/Superhero_Female_FullBody.gltf`,
  structured: `${ROOT}/base/Superhero_Male_FullBody.gltf`,
};
export const avatarV5BaseAsset = avatarV5BaseAssets.sculpted;
export const avatarV5IdleAsset = `${ROOT}/animation/Idle_Loop.glb`;

export const avatarV5HairAssets: Record<AvatarV5HairStyleId, string> = {
  "approved-long": `${ROOT}/hair/Hair_Long.gltf`,
  "double-buns": `${ROOT}/hair/Hair_Buns.gltf`,
  "close-buzz": `${ROOT}/hair/Hair_Buzzed.gltf`,
  "soft-close-crop": `${ROOT}/hair/Hair_BuzzedFemale.gltf`,
  "simple-side-part": `${ROOT}/hair/Hair_SimpleParted.gltf`,
};

export const avatarV5HairTransforms: Record<
  AvatarV5HairStyleId,
  { position: [number, number, number]; scale: number }
> = {
  "approved-long": { position: [0, 0, 0], scale: 1 },
  "double-buns": { position: [0, 0, 0], scale: 1 },
  "close-buzz": { position: [0, 0.003, 0], scale: 1.012 },
  "soft-close-crop": { position: [0, 0.004, 0], scale: 1.014 },
  "simple-side-part": { position: [0, 0.004, 0], scale: 1.015 },
};

export const avatarV5FacialHairAssets: Record<
  Exclude<AvatarV5FacialHairStyleId, "none">,
  string
> = {
  "short-beard": `${ROOT}/hair/Hair_Beard.gltf`,
};

export const avatarV5EyeTextures: Record<AvatarV5EyeColourId, string> = {
  brown: `${ROOT}/base/T_Eye_Brown.png`,
  blue: `${ROOT}/base/T_Eye_Blue.png`,
  green: `${ROOT}/base/T_Eye_Green.png`,
  hazel: `${ROOT}/base/T_Eye_Hazel.png`,
  grey: `${ROOT}/base/T_Eye_Grey.png`,
};

const topFamilies: Record<AvatarV5TopStyleId, OutfitFamily> = {
  "heritage-fitted": "peasant",
  "ranger-structured": "ranger",
  "fitted-tee": "peasant",
  "relaxed-tee": "peasant",
  "oxford-shirt": "peasant",
  "polo-shirt": "peasant",
  "crew-sweater": "peasant",
  hoodie: "ranger",
  blazer: "ranger",
  bomber: "ranger",
};

const bottomFamilies: Record<AvatarV5BottomStyleId, OutfitFamily> = {
  "heritage-trousers": "peasant",
  "ranger-trousers": "ranger",
  "straight-trousers": "peasant",
  "slim-trousers": "ranger",
  jeans: "peasant",
  "relaxed-trousers": "peasant",
  "utility-trousers": "ranger",
  "sport-trousers": "ranger",
};

const shoeFamilies: Record<AvatarV5ShoeStyleId, OutfitFamily> = {
  "heritage-boots": "peasant",
  "ranger-boots": "ranger",
  trainers: "peasant",
  "casual-shoes": "peasant",
  "formal-shoes": "ranger",
  "modern-boots": "ranger",
  "sport-shoes": "ranger",
};

function frameName(frame: AvatarV5FrameId) {
  return frame === "structured" ? "Male" : "Female";
}

export function getAvatarV5TopAssets(
  style: AvatarV5TopStyleId,
  frame: AvatarV5FrameId,
) {
  const family = topFamilies[style];
  const prefix = `${frameName(frame)}_${family === "peasant" ? "Peasant" : "Ranger"}`;
  return {
    body: `${ROOT}/outfits/${prefix}_Body.gltf`,
    arms: `${ROOT}/outfits/${prefix}_Arms.gltf`,
    family,
  };
}

export function getAvatarV5BottomAsset(
  style: AvatarV5BottomStyleId,
  frame: AvatarV5FrameId,
) {
  const family = bottomFamilies[style];
  const prefix = `${frameName(frame)}_${family === "peasant" ? "Peasant" : "Ranger"}`;
  return { asset: `${ROOT}/outfits/${prefix}_Legs.gltf`, family };
}

export function getAvatarV5ShoeAsset(
  style: AvatarV5ShoeStyleId,
  frame: AvatarV5FrameId,
) {
  const family = shoeFamilies[style];
  const prefix = `${frameName(frame)}_${family === "peasant" ? "Peasant" : "Ranger"}`;
  const suffix =
    frame === "structured" && family === "ranger" ? "Feet_Boots" : "Feet";
  return { asset: `${ROOT}/outfits/${prefix}_${suffix}.gltf`, family };
}

// The unlinked wardrobe laboratory still references the two approved V5
// combinations directly. Keep those aliases stable while production uses the
// frame-aware V6 selectors above.
export const avatarV5TopAssets = {
  "heritage-fitted": getAvatarV5TopAssets("heritage-fitted", "sculpted"),
  "ranger-structured": getAvatarV5TopAssets("ranger-structured", "sculpted"),
} as const;
export const avatarV5BottomAssets = {
  "heritage-trousers": getAvatarV5BottomAsset("heritage-trousers", "sculpted"),
  "ranger-trousers": getAvatarV5BottomAsset("ranger-trousers", "sculpted"),
} as const;
export const avatarV5ShoeAssets = {
  "heritage-boots": getAvatarV5ShoeAsset("heritage-boots", "sculpted"),
  "ranger-boots": getAvatarV5ShoeAsset("ranger-boots", "sculpted"),
} as const;

export function avatarV5OutfitTexture(
  family: OutfitFamily,
  variant: AvatarV5ColourVariantId,
) {
  const familyName = family === "peasant" ? "Peasant" : "Ranger";
  let sourceVariant = "";
  if (variant === "alternate") {
    sourceVariant = family === "peasant" ? "2" : "3";
  } else if (variant.startsWith("modern-")) {
    const word = variant.slice("modern-".length);
    sourceVariant = `_Modern${word[0].toUpperCase()}${word.slice(1)}`;
  } else if (variant !== "original") {
    sourceVariant = `_${variant[0].toUpperCase()}${variant.slice(1)}`;
  }
  return `${ROOT}/outfits/T_${familyName}${sourceVariant}_BaseColor.png`;
}
