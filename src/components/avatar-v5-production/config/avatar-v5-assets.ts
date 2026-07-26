import type {
  AvatarV5BottomStyleId,
  AvatarV5ColourVariantId,
  AvatarV5EyeColourId,
  AvatarV5FacialHairStyleId,
  AvatarV5HairStyleId,
  AvatarV5ShoeStyleId,
  AvatarV5TopStyleId,
} from "@/components/avatar-v5-production/config/avatar-v5-types";

const ROOT = "/avatar-v5-production";

export const avatarV5BaseAsset =
  `${ROOT}/base/Superhero_Female_FullBody.gltf`;
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

export const avatarV5TopAssets: Record<
  AvatarV5TopStyleId,
  { body: string; arms: string; family: "peasant" | "ranger" }
> = {
  "heritage-fitted": {
    body: `${ROOT}/outfits/Female_Peasant_Body.gltf`,
    arms: `${ROOT}/outfits/Female_Peasant_Arms.gltf`,
    family: "peasant",
  },
  "ranger-structured": {
    body: `${ROOT}/outfits/Female_Ranger_Body.gltf`,
    arms: `${ROOT}/outfits/Female_Ranger_Arms.gltf`,
    family: "ranger",
  },
};

export const avatarV5BottomAssets: Record<
  AvatarV5BottomStyleId,
  { asset: string; family: "peasant" | "ranger" }
> = {
  "heritage-trousers": {
    asset: `${ROOT}/outfits/Female_Peasant_Legs.gltf`,
    family: "peasant",
  },
  "ranger-trousers": {
    asset: `${ROOT}/outfits/Female_Ranger_Legs.gltf`,
    family: "ranger",
  },
};

export const avatarV5ShoeAssets: Record<
  AvatarV5ShoeStyleId,
  { asset: string; family: "peasant" | "ranger" }
> = {
  "heritage-boots": {
    asset: `${ROOT}/outfits/Female_Peasant_Feet.gltf`,
    family: "peasant",
  },
  "ranger-boots": {
    asset: `${ROOT}/outfits/Female_Ranger_Feet.gltf`,
    family: "ranger",
  },
};

export function avatarV5OutfitTexture(
  family: "peasant" | "ranger",
  variant: AvatarV5ColourVariantId,
) {
  const familyName = family === "peasant" ? "Peasant" : "Ranger";
  const sourceVariant =
    variant === "alternate"
      ? family === "peasant"
        ? "2"
        : "3"
      : variant === "original"
        ? ""
        : `_${variant[0].toUpperCase()}${variant.slice(1)}`;
  return `${ROOT}/outfits/T_${familyName}${sourceVariant}_BaseColor.png`;
}
