export type AvatarOption<T extends string = string> = {
  label: string;
  value: T;
};

const bodyPresets = [
  { label: "Balanced", value: "balanced" },
  { label: "Lean", value: "lean" },
  { label: "Strong", value: "strong" },
  { label: "Soft", value: "soft" },
] as const;

const skinTones = [
  { label: "Porcelain", value: "#f7d8c4" },
  { label: "Warm", value: "#e9b88e" },
  { label: "Golden", value: "#ca9064" },
  { label: "Bronze", value: "#a66b49" },
  { label: "Deep", value: "#744832" },
  { label: "Rich", value: "#4b2d25" },
] as const;

const faceShapes = [
  { label: "Oval", value: "oval" },
  { label: "Round", value: "round" },
  { label: "Square", value: "square" },
  { label: "Heart", value: "heart" },
  { label: "Long", value: "long" },
] as const;

const earStyles = [
  { label: "Classic", value: "classic" },
  { label: "Small", value: "small" },
  { label: "Rounded", value: "rounded" },
  { label: "Close", value: "close" },
] as const;

const eyeShapes = [
  { label: "Almond", value: "almond" },
  { label: "Round", value: "round" },
  { label: "Soft", value: "soft" },
  { label: "Narrow", value: "narrow" },
  { label: "Lifted", value: "lifted" },
  { label: "Relaxed", value: "relaxed" },
] as const;

const eyeColors = [
  { label: "Deep brown", value: "#3b241d" },
  { label: "Brown", value: "#684433" },
  { label: "Hazel", value: "#8a7441" },
  { label: "Green", value: "#54745c" },
  { label: "Blue", value: "#547d9f" },
  { label: "Grey", value: "#7d8790" },
  { label: "Amber", value: "#a77032" },
  { label: "Black", value: "#171717" },
] as const;

const eyebrowStyles = [
  { label: "Natural", value: "natural" },
  { label: "Straight", value: "straight" },
  { label: "Arched", value: "arched" },
  { label: "Soft", value: "soft" },
  { label: "Bold", value: "bold" },
] as const;

const noseStyles = [
  { label: "Soft", value: "soft" },
  { label: "Straight", value: "straight" },
  { label: "Rounded", value: "rounded" },
  { label: "Defined", value: "defined" },
  { label: "Small", value: "small" },
] as const;

const mouthStyles = [
  { label: "Calm", value: "calm" },
  { label: "Warm", value: "warm" },
  { label: "Smile", value: "smile" },
  { label: "Focused", value: "focused" },
  { label: "Soft", value: "soft" },
  { label: "Confident", value: "confident" },
] as const;

const hairStyles = [
  { label: "Short", value: "short" },
  { label: "Side sweep", value: "side" },
  { label: "Curly", value: "curly" },
  { label: "Bob", value: "bob" },
  { label: "Coily", value: "coily" },
  { label: "Fade", value: "fade" },
  { label: "Textured", value: "textured" },
  { label: "Long", value: "long" },
  { label: "Bun", value: "bun" },
  { label: "Braids", value: "braids" },
  { label: "None", value: "none" },
] as const;

const hairColors = [
  { label: "Black", value: "#171717" },
  { label: "Espresso", value: "#35241f" },
  { label: "Brown", value: "#5a3825" },
  { label: "Chestnut", value: "#7c4a2d" },
  { label: "Auburn", value: "#8a3f2b" },
  { label: "Blonde", value: "#c9a35a" },
  { label: "Silver", value: "#9ca3af" },
  { label: "Platinum", value: "#ded9c8" },
] as const;

const facialHairStyles = [
  { label: "None", value: "none" },
  { label: "Stubble", value: "stubble" },
  { label: "Moustache", value: "moustache" },
  { label: "Goatee", value: "goatee" },
  { label: "Short beard", value: "beard" },
] as const;

const topStyles = [
  { label: "Crew tee", value: "tee" },
  { label: "Polo", value: "polo" },
  { label: "Oxford", value: "oxford" },
  { label: "Knit", value: "knit" },
  { label: "Mock neck", value: "mock" },
  { label: "Blouse", value: "blouse" },
  { label: "Henley", value: "henley" },
  { label: "Sport", value: "sport" },
] as const;

const outerwearStyles = [
  { label: "None", value: "none" },
  { label: "Blazer", value: "blazer" },
  { label: "Overshirt", value: "overshirt" },
  { label: "Bomber", value: "bomber" },
  { label: "Cardigan", value: "cardigan" },
  { label: "Utility jacket", value: "utility" },
] as const;

const bottomStyles = [
  { label: "Tailored", value: "tailored" },
  { label: "Straight", value: "straight" },
  { label: "Relaxed", value: "relaxed" },
  { label: "Chino", value: "chino" },
  { label: "Skirt", value: "skirt" },
  { label: "Sport", value: "sport" },
] as const;

const shoeStyles = [
  { label: "Sneakers", value: "sneakers" },
  { label: "Minimal", value: "minimal" },
  { label: "Loafers", value: "loafers" },
  { label: "Boots", value: "boots" },
  { label: "Runners", value: "runners" },
] as const;

const glassesStyles = [
  { label: "None", value: "none" },
  { label: "Classic", value: "classic" },
  { label: "Round", value: "round" },
  { label: "Architect", value: "architect" },
  { label: "Bold", value: "bold" },
] as const;

const accessoryStyles = [
  { label: "None", value: "none" },
  { label: "Studs", value: "studs" },
  { label: "Hoops", value: "hoops" },
  { label: "Chain", value: "chain" },
  { label: "Scarf", value: "scarf" },
  { label: "Watch", value: "watch" },
] as const;

const clothingColors = [
  { label: "Graphite", value: "#27272a" },
  { label: "Midnight", value: "#1e2b46" },
  { label: "Cobalt", value: "#315fcb" },
  { label: "Forest", value: "#2f6854" },
  { label: "Clay", value: "#9a5544" },
  { label: "Sand", value: "#b59364" },
  { label: "Plum", value: "#6f4b71" },
  { label: "Ivory", value: "#e8e4da" },
] as const;

const bottomColors = [
  { label: "Black", value: "#18181b" },
  { label: "Navy", value: "#24345c" },
  { label: "Stone", value: "#77716a" },
  { label: "Charcoal", value: "#3f4651" },
  { label: "Olive", value: "#536044" },
  { label: "Denim", value: "#405d7b" },
] as const;

const shoeColors = [
  { label: "Ink", value: "#17191d" },
  { label: "White", value: "#e8e7e2" },
  { label: "Brown", value: "#5e4031" },
  { label: "Navy", value: "#273b5e" },
  { label: "Stone", value: "#77716a" },
] as const;

const backgroundPreferences = [
  { label: "Studio", value: "studio" },
  { label: "Blue hour", value: "blue" },
  { label: "Warm light", value: "warm" },
  { label: "Forest", value: "forest" },
] as const;

export const avatarOptions = {
  bodyPresets,
  skinTones,
  faceShapes,
  earStyles,
  eyeShapes,
  eyeColors,
  eyebrowStyles,
  eyebrowColors: hairColors,
  noseStyles,
  mouthStyles,
  hairStyles,
  hairColors,
  facialHairStyles,
  facialHairColors: hairColors,
  topStyles,
  topColors: clothingColors,
  outerwearStyles,
  outerwearColors: clothingColors,
  bottomStyles,
  bottomColors,
  shoeStyles,
  shoeColors,
  glassesStyles,
  accessoryStyles,
  backgroundPreferences,
} as const;

export type BodyPreset = (typeof bodyPresets)[number]["value"];
export type FaceShape = (typeof faceShapes)[number]["value"];
export type EarStyle = (typeof earStyles)[number]["value"];
export type EyeShape = (typeof eyeShapes)[number]["value"];
export type EyebrowStyle = (typeof eyebrowStyles)[number]["value"];
export type NoseStyle = (typeof noseStyles)[number]["value"];
export type MouthStyle = (typeof mouthStyles)[number]["value"];
export type HairStyle = (typeof hairStyles)[number]["value"];
export type FacialHairStyle = (typeof facialHairStyles)[number]["value"];
export type TopStyle = (typeof topStyles)[number]["value"];
export type OuterwearStyle = (typeof outerwearStyles)[number]["value"];
export type BottomStyle = (typeof bottomStyles)[number]["value"];
export type ShoeStyle = (typeof shoeStyles)[number]["value"];
export type GlassesStyle = (typeof glassesStyles)[number]["value"];
export type AccessoryStyle = (typeof accessoryStyles)[number]["value"];
export type BackgroundPreference =
  (typeof backgroundPreferences)[number]["value"];

export type AvatarConfig = {
  version: 3;
  bodyPreset: BodyPreset;
  skinTone: string;
  faceShape: FaceShape;
  earStyle: EarStyle;
  eyeShape: EyeShape;
  eyeColor: string;
  eyebrowStyle: EyebrowStyle;
  eyebrowColor: string;
  noseStyle: NoseStyle;
  mouthStyle: MouthStyle;
  hairStyle: HairStyle;
  hairColor: string;
  facialHairStyle: FacialHairStyle;
  facialHairColor: string;
  topStyle: TopStyle;
  topColor: string;
  outerwearStyle: OuterwearStyle;
  outerwearColor: string;
  bottomStyle: BottomStyle;
  bottomColor: string;
  shoeStyle: ShoeStyle;
  shoeColor: string;
  glassesStyle: GlassesStyle;
  accessoryStyle: AccessoryStyle;
  backgroundPreference: BackgroundPreference;
};

export const defaultAvatarConfig: AvatarConfig = {
  version: 3,
  bodyPreset: "balanced",
  skinTone: skinTones[1].value,
  faceShape: "oval",
  earStyle: "classic",
  eyeShape: "almond",
  eyeColor: eyeColors[0].value,
  eyebrowStyle: "natural",
  eyebrowColor: hairColors[1].value,
  noseStyle: "soft",
  mouthStyle: "warm",
  hairStyle: "short",
  hairColor: hairColors[1].value,
  facialHairStyle: "none",
  facialHairColor: hairColors[1].value,
  topStyle: "knit",
  topColor: clothingColors[1].value,
  outerwearStyle: "none",
  outerwearColor: clothingColors[0].value,
  bottomStyle: "tailored",
  bottomColor: bottomColors[0].value,
  shoeStyle: "minimal",
  shoeColor: shoeColors[0].value,
  glassesStyle: "none",
  accessoryStyle: "none",
  backgroundPreference: "studio",
};

function allowedValue<T extends string>(
  value: unknown,
  options: ReadonlyArray<{ value: T }>,
  fallback: T,
) {
  return typeof value === "string" &&
    options.some((option) => option.value === value)
    ? (value as T)
    : fallback;
}

function legacyColor(value: unknown, aliases: Record<string, string>) {
  return typeof value === "string" ? (aliases[value] ?? value) : value;
}

const legacySkinToneAliases: Record<string, string> = {
  "#f6d7c3": "#f7d8c4",
  "#e8b98f": "#e9b88e",
  "#c98f61": "#ca9064",
  "#9b6545": "#a66b49",
  "#5f382b": "#744832",
};

const legacyHairColorAliases: Record<string, string> = {
  "#c99f45": "#c9a35a",
};

const legacyTopColorAliases: Record<string, string> = {
  "#2563eb": "#315fcb",
  "#059669": "#2f6854",
  "#b9935a": "#b59364",
  "#f8fafc": "#e8e4da",
  "#475569": "#1e2b46",
  "#b91c1c": "#9a5544",
};

const legacyBottomColorAliases: Record<string, string> = {
  "#1e3a8a": "#24345c",
  "#78716c": "#77716a",
  "#374151": "#3f4651",
  "#4d5a36": "#536044",
};

export function normalizeAvatarConfig(value: unknown): AvatarConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...defaultAvatarConfig };
  }

  const config = value as Record<string, unknown>;
  const legacyGlasses =
    typeof config.glasses === "boolean" && config.glasses
      ? "classic"
      : defaultAvatarConfig.glassesStyle;

  return {
    version: 3,
    bodyPreset: allowedValue(
      config.bodyPreset,
      bodyPresets,
      defaultAvatarConfig.bodyPreset,
    ),
    skinTone: allowedValue(
      legacyColor(config.skinTone, legacySkinToneAliases),
      skinTones,
      defaultAvatarConfig.skinTone,
    ),
    faceShape: allowedValue(
      config.faceShape,
      faceShapes,
      defaultAvatarConfig.faceShape,
    ),
    earStyle: allowedValue(
      config.earStyle,
      earStyles,
      defaultAvatarConfig.earStyle,
    ),
    eyeShape: allowedValue(
      config.eyeShape,
      eyeShapes,
      defaultAvatarConfig.eyeShape,
    ),
    eyeColor: allowedValue(
      config.eyeColor,
      eyeColors,
      defaultAvatarConfig.eyeColor,
    ),
    eyebrowStyle: allowedValue(
      config.eyebrowStyle,
      eyebrowStyles,
      defaultAvatarConfig.eyebrowStyle,
    ),
    eyebrowColor: allowedValue(
      legacyColor(
        config.eyebrowColor,
        legacyHairColorAliases,
      ),
      hairColors,
      typeof config.hairColor === "string"
        ? allowedValue(
            legacyColor(config.hairColor, legacyHairColorAliases),
            hairColors,
            defaultAvatarConfig.eyebrowColor,
          )
        : defaultAvatarConfig.eyebrowColor,
    ),
    noseStyle: allowedValue(
      config.noseStyle,
      noseStyles,
      defaultAvatarConfig.noseStyle,
    ),
    mouthStyle: allowedValue(
      config.mouthStyle,
      mouthStyles,
      defaultAvatarConfig.mouthStyle,
    ),
    hairStyle: allowedValue(
      config.hairStyle,
      hairStyles,
      defaultAvatarConfig.hairStyle,
    ),
    hairColor: allowedValue(
      legacyColor(config.hairColor, legacyHairColorAliases),
      hairColors,
      defaultAvatarConfig.hairColor,
    ),
    facialHairStyle: allowedValue(
      config.facialHairStyle,
      facialHairStyles,
      defaultAvatarConfig.facialHairStyle,
    ),
    facialHairColor: allowedValue(
      legacyColor(config.facialHairColor, legacyHairColorAliases),
      hairColors,
      typeof config.hairColor === "string"
        ? allowedValue(
            legacyColor(config.hairColor, legacyHairColorAliases),
            hairColors,
            defaultAvatarConfig.facialHairColor,
          )
        : defaultAvatarConfig.facialHairColor,
    ),
    topStyle: allowedValue(
      config.topStyle,
      topStyles,
      defaultAvatarConfig.topStyle,
    ),
    topColor: allowedValue(
      legacyColor(config.topColor, legacyTopColorAliases),
      clothingColors,
      defaultAvatarConfig.topColor,
    ),
    outerwearStyle: allowedValue(
      config.outerwearStyle,
      outerwearStyles,
      defaultAvatarConfig.outerwearStyle,
    ),
    outerwearColor: allowedValue(
      legacyColor(config.outerwearColor, legacyTopColorAliases),
      clothingColors,
      defaultAvatarConfig.outerwearColor,
    ),
    bottomStyle: allowedValue(
      config.bottomStyle,
      bottomStyles,
      defaultAvatarConfig.bottomStyle,
    ),
    bottomColor: allowedValue(
      legacyColor(config.bottomColor, legacyBottomColorAliases),
      bottomColors,
      defaultAvatarConfig.bottomColor,
    ),
    shoeStyle: allowedValue(
      config.shoeStyle,
      shoeStyles,
      defaultAvatarConfig.shoeStyle,
    ),
    shoeColor: allowedValue(
      config.shoeColor,
      shoeColors,
      defaultAvatarConfig.shoeColor,
    ),
    glassesStyle: allowedValue(
      config.glassesStyle,
      glassesStyles,
      legacyGlasses,
    ),
    accessoryStyle: allowedValue(
      config.accessoryStyle,
      accessoryStyles,
      defaultAvatarConfig.accessoryStyle,
    ),
    backgroundPreference: allowedValue(
      config.backgroundPreference,
      backgroundPreferences,
      defaultAvatarConfig.backgroundPreference,
    ),
  };
}

export function isCompleteAvatarConfig(value: unknown): value is AvatarConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const config = value as Record<string, unknown>;
  const normalized = normalizeAvatarConfig(config);

  return (
    config.version === 3 &&
    Object.entries(normalized).every(([key, item]) => config[key] === item)
  );
}

function randomOption<T extends string>(options: readonly AvatarOption<T>[]) {
  return options[Math.floor(Math.random() * options.length)].value;
}

export function randomAvatarConfig(): AvatarConfig {
  const hairColor = randomOption(hairColors);

  return {
    version: 3,
    bodyPreset: randomOption(bodyPresets),
    skinTone: randomOption(skinTones),
    faceShape: randomOption(faceShapes),
    earStyle: randomOption(earStyles),
    eyeShape: randomOption(eyeShapes),
    eyeColor: randomOption(eyeColors),
    eyebrowStyle: randomOption(eyebrowStyles),
    eyebrowColor: hairColor,
    noseStyle: randomOption(noseStyles),
    mouthStyle: randomOption(mouthStyles),
    hairStyle: randomOption(hairStyles),
    hairColor,
    facialHairStyle: randomOption(facialHairStyles),
    facialHairColor: hairColor,
    topStyle: randomOption(topStyles),
    topColor: randomOption(clothingColors),
    outerwearStyle: randomOption(outerwearStyles),
    outerwearColor: randomOption(clothingColors),
    bottomStyle: randomOption(bottomStyles),
    bottomColor: randomOption(bottomColors),
    shoeStyle: randomOption(shoeStyles),
    shoeColor: randomOption(shoeColors),
    glassesStyle: randomOption(glassesStyles),
    accessoryStyle: randomOption(accessoryStyles),
    backgroundPreference: randomOption(backgroundPreferences),
  };
}
