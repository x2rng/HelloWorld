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

export type AvatarV5FrameId = "sculpted" | "structured";

export type AvatarV5BodyPresetId =
  | "slim"
  | "balanced"
  | "athletic"
  | "broad"
  | "tall";

export type AvatarV5FacePresetId =
  | "balanced"
  | "soft"
  | "defined"
  | "long";

export type AvatarV5EyeShapeId =
  | "balanced"
  | "almond"
  | "round"
  | "focused";

export type AvatarV5EarPresetId = "natural" | "compact" | "defined";

export type AvatarV5TopStyleId =
  | "heritage-fitted"
  | "ranger-structured"
  | "fitted-tee"
  | "relaxed-tee"
  | "oxford-shirt"
  | "polo-shirt"
  | "crew-sweater"
  | "hoodie"
  | "blazer"
  | "bomber";

export type AvatarV5BottomStyleId =
  | "heritage-trousers"
  | "ranger-trousers"
  | "straight-trousers"
  | "slim-trousers"
  | "jeans"
  | "relaxed-trousers"
  | "utility-trousers"
  | "sport-trousers";

export type AvatarV5ShoeStyleId =
  | "heritage-boots"
  | "ranger-boots"
  | "trainers"
  | "casual-shoes"
  | "formal-shoes"
  | "modern-boots"
  | "sport-shoes";

export type AvatarV5GlassesStyleId =
  | "none"
  | "round"
  | "rectangular"
  | "sunglasses";

export type AvatarV5AccessoryId = "watch" | "necklace";

export type AvatarV5ColourVariantId =
  | "original"
  | "alternate"
  | "navy"
  | "forest"
  | "burgundy"
  | "charcoal"
  | "modern-ocean"
  | "modern-sage"
  | "modern-wine"
  | "modern-sand"
  | "modern-graphite"
  | "modern-cloud";

export type AvatarV5Config = {
  version: 6;
  renderer: "modular-gltf";
  assetFamily: "quaternius-universal";
  frameId: AvatarV5FrameId;
  bodyPresetId: AvatarV5BodyPresetId;
  facePresetId: AvatarV5FacePresetId;
  eyeShapeId: AvatarV5EyeShapeId;
  earPresetId: AvatarV5EarPresetId;
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
  glassesStyleId: AvatarV5GlassesStyleId;
  accessoryIds: AvatarV5AccessoryId[];
};

export type AvatarV5Option<T extends string> = {
  label: string;
  value: T;
  description?: string;
};
