export type FacePresetId =
  | "balanced-oval"
  | "soft-round"
  | "defined-square"
  | "tapered-heart"
  | "long-sculpted";

export type JawPresetId =
  | "soft"
  | "balanced"
  | "defined"
  | "tapered"
  | "broad";

export type EyeShapeId =
  | "almond"
  | "round"
  | "hooded"
  | "lifted"
  | "relaxed"
  | "focused";

export type EyebrowStyleId =
  | "natural"
  | "straight"
  | "arched"
  | "soft"
  | "bold";

export type NosePresetId =
  | "soft"
  | "straight"
  | "rounded"
  | "defined"
  | "compact";

export type MouthPresetId =
  | "neutral"
  | "soft-smile"
  | "confident"
  | "relaxed"
  | "focused"
  | "friendly";

export type EarPresetId = "classic" | "compact" | "rounded" | "close";

export type HairStyleId =
  | "textured-crop"
  | "side-part"
  | "medium-swept"
  | "close-crop"
  | "layered-bob"
  | "shoulder-waves"
  | "ponytail"
  | "curly-volume";

export type FacialHairStyleId =
  | "none"
  | "stubble"
  | "moustache"
  | "goatee"
  | "short-beard";

export type TopStyleId =
  | "fitted-tee"
  | "relaxed-tee"
  | "oxford-shirt"
  | "polo-shirt"
  | "crew-sweater"
  | "hoodie"
  | "blazer"
  | "bomber-jacket";

export type OuterwearStyleId =
  | "none"
  | "blazer"
  | "bomber"
  | "overshirt"
  | "cardigan";

export type BottomStyleId =
  | "straight-trousers"
  | "slim-trousers"
  | "jeans"
  | "relaxed-trousers"
  | "skirt"
  | "sports-bottoms";

export type ShoeStyleId =
  | "trainers"
  | "casual-shoes"
  | "formal-shoes"
  | "boots"
  | "sports-shoes";

export type GlassesStyleId =
  | "none"
  | "round"
  | "rectangular"
  | "sunglasses";

export type AccessoryId =
  | "earrings"
  | "watch"
  | "necklace"
  | "cap"
  | "beanie";

export type ExpressionId =
  | "neutral"
  | "warm"
  | "focused"
  | "confident";

export type AvatarV4Config = {
  version: 4;
  renderer: "procedural-3d";
  facePresetId: FacePresetId;
  jawPresetId: JawPresetId;
  eyeShapeId: EyeShapeId;
  eyeColour: string;
  eyebrowStyleId: EyebrowStyleId;
  nosePresetId: NosePresetId;
  mouthPresetId: MouthPresetId;
  earPresetId: EarPresetId;
  skinTone: string;
  hairStyleId: HairStyleId;
  hairColour: string;
  facialHairStyleId: FacialHairStyleId;
  facialHairColour: string;
  topStyleId: TopStyleId;
  topColour: string;
  outerwearStyleId: OuterwearStyleId;
  outerwearColour: string;
  bottomStyleId: BottomStyleId;
  bottomColour: string;
  shoeStyleId: ShoeStyleId;
  shoeColour: string;
  glassesStyleId: GlassesStyleId;
  accessoryIds: AccessoryId[];
  expressionId: ExpressionId;
};

export type AvatarQualityTier = "low" | "medium" | "high";

export type AvatarView = "front" | "side" | "back";

export type AvatarOption<T extends string> = {
  label: string;
  value: T;
};
