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
  | "double-buns";

export type AvatarV5HairColourId =
  | "soft-black"
  | "espresso"
  | "chestnut"
  | "auburn"
  | "golden-brown"
  | "silver";

export type AvatarV5TopStyleId =
  | "heritage-fitted"
  | "ranger-structured";

export type AvatarV5BottomStyleId =
  | "heritage-trousers"
  | "ranger-trousers";

export type AvatarV5ShoeStyleId =
  | "heritage-boots"
  | "ranger-boots";

export type AvatarV5ColourVariantId = "original" | "alternate";

export type AvatarV5Config = {
  version: 5;
  renderer: "modular-gltf";
  assetFamily: "quaternius-universal";
  skinToneId: AvatarV5SkinToneId;
  hairStyleId: AvatarV5HairStyleId;
  hairColourId: AvatarV5HairColourId;
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
