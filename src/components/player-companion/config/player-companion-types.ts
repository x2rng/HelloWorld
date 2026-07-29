export type CompanionBodyTypeId =
  | "petite"
  | "balanced"
  | "athletic"
  | "soft";

export type CompanionSkinToneId =
  | "porcelain"
  | "warm-light"
  | "golden"
  | "bronze"
  | "deep"
  | "rich";

export type CompanionEyeShapeId =
  | "bright"
  | "soft"
  | "almond"
  | "focused";

export type CompanionEyeColourId =
  | "espresso"
  | "hazel"
  | "green"
  | "ocean"
  | "grey"
  | "violet";

export type CompanionEyebrowStyleId =
  | "natural"
  | "soft"
  | "defined"
  | "confident";

export type CompanionExpressionId =
  | "warm"
  | "calm"
  | "focused"
  | "cheerful";

export type CompanionHairStyleId =
  | "textured-crop"
  | "side-sweep"
  | "soft-bob"
  | "double-buns"
  | "curly-cloud"
  | "high-pony";

export type CompanionHairColourId =
  | "soft-black"
  | "espresso"
  | "chestnut"
  | "auburn"
  | "golden"
  | "silver"
  | "platinum"
  | "midnight";

export type CompanionTopStyleId =
  | "fitted-tee"
  | "knit-sweater"
  | "soft-hoodie"
  | "varsity-jacket";

export type CompanionBottomStyleId =
  | "tapered-trousers"
  | "straight-jeans"
  | "relaxed-cargos"
  | "smart-shorts";

export type CompanionShoeStyleId =
  | "retro-trainers"
  | "ankle-boots"
  | "clean-slip-ons";

export type CompanionColourId =
  | "ink"
  | "cloud"
  | "ocean"
  | "cobalt"
  | "sage"
  | "plum"
  | "clay"
  | "sun";

export type CompanionReactionState =
  | "idle"
  | "celebrate"
  | "focused"
  | "level-up";

export type PlayerCompanionConfig = {
  version: 7;
  renderer: "player-companion";
  bodyTypeId: CompanionBodyTypeId;
  skinToneId: CompanionSkinToneId;
  eyeShapeId: CompanionEyeShapeId;
  eyeColourId: CompanionEyeColourId;
  eyebrowStyleId: CompanionEyebrowStyleId;
  expressionId: CompanionExpressionId;
  hairStyleId: CompanionHairStyleId;
  hairColourId: CompanionHairColourId;
  topStyleId: CompanionTopStyleId;
  topColourId: CompanionColourId;
  bottomStyleId: CompanionBottomStyleId;
  bottomColourId: CompanionColourId;
  shoeStyleId: CompanionShoeStyleId;
  shoeColourId: CompanionColourId;
};

export type CompanionOption<T extends string> = {
  value: T;
  label: string;
  description?: string;
  colour?: string;
};

export type CompanionRenderQuality = "compact" | "full";
