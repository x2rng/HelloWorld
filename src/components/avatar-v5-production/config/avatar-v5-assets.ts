import type {
  AvatarV5BottomStyleId,
  AvatarV5ColourVariantId,
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
  if (family === "peasant") {
    return variant === "alternate"
      ? `${ROOT}/outfits/T_Peasant_2_BaseColor.png`
      : `${ROOT}/outfits/T_Peasant_BaseColor.png`;
  }

  return variant === "alternate"
    ? `${ROOT}/outfits/T_Ranger_3_BaseColor.png`
    : `${ROOT}/outfits/T_Ranger_BaseColor.png`;
}
