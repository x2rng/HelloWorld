export type AvatarV5SkinToneId =
  | "porcelain"
  | "light-warm"
  | "golden"
  | "warm-bronze"
  | "deep-bronze"
  | "deep"
  | "rich";

export type AvatarV5HairStyleId =
  | "approved-long"
  | "double-buns"
  | "close-buzz"
  | "soft-close-crop"
  | "simple-side-part";

export type AvatarV5HairColourId =
  | "soft-black"
  | "espresso"
  | "chestnut"
  | "auburn"
  | "golden-brown"
  | "silver"
  | "blue-black"
  | "ash-brown"
  | "copper"
  | "platinum";

export type AvatarV5EyeColourId =
  | "brown"
  | "blue"
  | "green"
  | "hazel"
  | "grey";

export type AvatarV5FacialHairStyleId = "none" | "short-beard";

export type AvatarV5TopStyleId =
  | "heritage-fitted"
  | "ranger-structured";

export type AvatarV5BottomStyleId =
  | "heritage-trousers"
  | "ranger-trousers";

export type AvatarV5ShoeStyleId =
  | "heritage-boots"
  | "ranger-boots";

export type AvatarV5ColourVariantId =
  | "original"
  | "alternate"
  | "navy"
  | "forest"
  | "burgundy"
  | "charcoal";

export type AvatarV5Config = {
  version: 5;
  renderer: "modular-gltf";
  assetFamily: "quaternius-universal";
  skinToneId: AvatarV5SkinToneId;
  eyeColourId: AvatarV5EyeColourId;
  hairStyleId: AvatarV5HairStyleId;
  hairColourId: AvatarV5HairColourId;
  facialHairStyleId: AvatarV5FacialHairStyleId;
  topStyleId: AvatarV5TopStyleId;
  topColourId: AvatarV5ColourVariantId;
  bottomStyleId: AvatarV5BottomStyleId;
  bottomColourId: AvatarV5ColourVariantId;
  shoeStyleId: AvatarV5ShoeStyleId;
  shoeColourId: AvatarV5ColourVariantId;
};

export type AvatarV5Option<T extends string> = {
  label: string;
  value: T;
  description?: string;
};
