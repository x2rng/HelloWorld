import {
  avatarOptions,
  defaultAvatarConfig,
  isCompleteAvatarConfig,
  normalizeAvatarConfig,
  type AvatarConfig,
} from "@/lib/avatar-config";
import { avatarV4Catalogue } from "@/components/avatar-3d/config/avatar-v4-catalogue";
import { defaultAvatarV4Config } from "@/components/avatar-3d/config/avatar-v4-defaults";
import type {
  AccessoryId,
  AvatarOption,
  AvatarV4Config,
  BottomStyleId,
  EarPresetId,
  ExpressionId,
  EyeShapeId,
  EyebrowStyleId,
  FacePresetId,
  FacialHairStyleId,
  GlassesStyleId,
  HairStyleId,
  JawPresetId,
  MouthPresetId,
  NosePresetId,
  OuterwearStyleId,
  ShoeStyleId,
  TopStyleId,
} from "@/components/avatar-3d/config/avatar-v4-types";
import {
  avatarV5ToV3,
  isAvatarV5Config,
  parseAvatarV5Config,
} from "@/components/avatar-v5-production/config/avatar-v5-parser";
import type { AvatarV5Config } from "@/components/avatar-v5-production/config/avatar-v5-types";
import type { PixelCompanionConfig } from "@/lib/avatar/companion-types";
import {
  createPixelCompanionFromStored,
  isCompletePixelCompanionConfig,
  isPixelCompanionConfig,
  normalizeCompanionConfig,
} from "@/lib/avatar/normalize-companion-config";

export type StoredAvatarConfig =
  | AvatarConfig
  | AvatarV4Config
  | AvatarV5Config
  | PixelCompanionConfig;

function allowed<T extends string>(
  value: unknown,
  choices: ReadonlyArray<AvatarOption<T>>,
  fallback: T,
) {
  return typeof value === "string" &&
    choices.some((choice) => choice.value === value)
    ? (value as T)
    : fallback;
}

function allowedColour(
  value: unknown,
  choices: ReadonlyArray<{ value: string }>,
  fallback: string,
) {
  return typeof value === "string" &&
    choices.some((choice) => choice.value === value)
    ? value
    : fallback;
}

function normalizeAccessories(value: unknown): AccessoryId[] {
  if (!Array.isArray(value)) return [];

  const valid = new Set(avatarV4Catalogue.accessories.map((item) => item.value));
  const result: AccessoryId[] = [];

  for (const item of value) {
    if (
      typeof item === "string" &&
      valid.has(item as AccessoryId) &&
      !result.includes(item as AccessoryId)
    ) {
      result.push(item as AccessoryId);
    }
  }

  const headwear = result.filter((item) => item === "cap" || item === "beanie");
  if (headwear.length > 1) {
    return result.filter((item) => item !== "beanie");
  }

  return result.slice(0, 4);
}

export function parseAvatarV4Config(value: unknown): AvatarV4Config {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...defaultAvatarV4Config, accessoryIds: [] };
  }

  const config = value as Record<string, unknown>;

  return {
    version: 4,
    renderer: "procedural-3d",
    facePresetId: allowed<FacePresetId>(
      config.facePresetId,
      avatarV4Catalogue.facePresets,
      defaultAvatarV4Config.facePresetId,
    ),
    jawPresetId: allowed<JawPresetId>(
      config.jawPresetId,
      avatarV4Catalogue.jawPresets,
      defaultAvatarV4Config.jawPresetId,
    ),
    eyeShapeId: allowed<EyeShapeId>(
      config.eyeShapeId,
      avatarV4Catalogue.eyeShapes,
      defaultAvatarV4Config.eyeShapeId,
    ),
    eyeColour: allowedColour(
      config.eyeColour,
      avatarV4Catalogue.eyeColours,
      defaultAvatarV4Config.eyeColour,
    ),
    eyebrowStyleId: allowed<EyebrowStyleId>(
      config.eyebrowStyleId,
      avatarV4Catalogue.eyebrowStyles,
      defaultAvatarV4Config.eyebrowStyleId,
    ),
    nosePresetId: allowed<NosePresetId>(
      config.nosePresetId,
      avatarV4Catalogue.nosePresets,
      defaultAvatarV4Config.nosePresetId,
    ),
    mouthPresetId: allowed<MouthPresetId>(
      config.mouthPresetId,
      avatarV4Catalogue.mouthPresets,
      defaultAvatarV4Config.mouthPresetId,
    ),
    earPresetId: allowed<EarPresetId>(
      config.earPresetId,
      avatarV4Catalogue.earPresets,
      defaultAvatarV4Config.earPresetId,
    ),
    skinTone: allowedColour(
      config.skinTone,
      avatarV4Catalogue.skinTones,
      defaultAvatarV4Config.skinTone,
    ),
    hairStyleId: allowed<HairStyleId>(
      config.hairStyleId,
      avatarV4Catalogue.hairStyles,
      defaultAvatarV4Config.hairStyleId,
    ),
    hairColour: allowedColour(
      config.hairColour,
      avatarV4Catalogue.hairColours,
      defaultAvatarV4Config.hairColour,
    ),
    facialHairStyleId: allowed<FacialHairStyleId>(
      config.facialHairStyleId,
      avatarV4Catalogue.facialHairStyles,
      defaultAvatarV4Config.facialHairStyleId,
    ),
    facialHairColour: allowedColour(
      config.facialHairColour,
      avatarV4Catalogue.hairColours,
      defaultAvatarV4Config.facialHairColour,
    ),
    topStyleId: allowed<TopStyleId>(
      config.topStyleId,
      avatarV4Catalogue.topStyles,
      defaultAvatarV4Config.topStyleId,
    ),
    topColour: allowedColour(
      config.topColour,
      avatarV4Catalogue.clothingColours,
      defaultAvatarV4Config.topColour,
    ),
    outerwearStyleId: allowed<OuterwearStyleId>(
      config.outerwearStyleId,
      avatarV4Catalogue.outerwearStyles,
      defaultAvatarV4Config.outerwearStyleId,
    ),
    outerwearColour: allowedColour(
      config.outerwearColour,
      avatarV4Catalogue.clothingColours,
      defaultAvatarV4Config.outerwearColour,
    ),
    bottomStyleId: allowed<BottomStyleId>(
      config.bottomStyleId,
      avatarV4Catalogue.bottomStyles,
      defaultAvatarV4Config.bottomStyleId,
    ),
    bottomColour: allowedColour(
      config.bottomColour,
      avatarV4Catalogue.bottomColours,
      defaultAvatarV4Config.bottomColour,
    ),
    shoeStyleId: allowed<ShoeStyleId>(
      config.shoeStyleId,
      avatarV4Catalogue.shoeStyles,
      defaultAvatarV4Config.shoeStyleId,
    ),
    shoeColour: allowedColour(
      config.shoeColour,
      avatarV4Catalogue.shoeColours,
      defaultAvatarV4Config.shoeColour,
    ),
    glassesStyleId: allowed<GlassesStyleId>(
      config.glassesStyleId,
      avatarV4Catalogue.glassesStyles,
      defaultAvatarV4Config.glassesStyleId,
    ),
    accessoryIds: normalizeAccessories(config.accessoryIds),
    expressionId: allowed<ExpressionId>(
      config.expressionId,
      avatarV4Catalogue.expressions,
      defaultAvatarV4Config.expressionId,
    ),
  };
}

export function isCompleteAvatarV4Config(
  value: unknown,
): value is AvatarV4Config {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const config = value as Record<string, unknown>;
  const parsed = parseAvatarV4Config(config);

  return (
    config.version === 4 &&
    config.renderer === "procedural-3d" &&
    Object.entries(parsed).every(([key, item]) => {
      if (key === "accessoryIds") {
        return JSON.stringify(config[key]) === JSON.stringify(item);
      }
      return config[key] === item;
    })
  );
}

const v3HairMap: Record<string, HairStyleId> = {
  short: "textured-crop",
  side: "side-part",
  curly: "curly-volume",
  bob: "layered-bob",
  coily: "curly-volume",
  fade: "close-crop",
  textured: "textured-crop",
  long: "shoulder-waves",
  bun: "ponytail",
  braids: "shoulder-waves",
  none: "close-crop",
};

const v3TopMap: Record<string, TopStyleId> = {
  tee: "fitted-tee",
  polo: "polo-shirt",
  oxford: "oxford-shirt",
  knit: "crew-sweater",
  mock: "crew-sweater",
  blouse: "relaxed-tee",
  henley: "polo-shirt",
  sport: "relaxed-tee",
};

const v3OuterwearMap: Record<string, OuterwearStyleId> = {
  none: "none",
  blazer: "blazer",
  overshirt: "overshirt",
  bomber: "bomber",
  cardigan: "cardigan",
  utility: "overshirt",
};

const v3BottomMap: Record<string, BottomStyleId> = {
  tailored: "straight-trousers",
  straight: "straight-trousers",
  relaxed: "relaxed-trousers",
  chino: "slim-trousers",
  skirt: "skirt",
  sport: "sports-bottoms",
};

const v3ShoeMap: Record<string, ShoeStyleId> = {
  sneakers: "trainers",
  minimal: "casual-shoes",
  loafers: "formal-shoes",
  boots: "boots",
  runners: "sports-shoes",
};

const v3GlassesMap: Record<string, GlassesStyleId> = {
  none: "none",
  classic: "rectangular",
  round: "round",
  architect: "rectangular",
  bold: "sunglasses",
};

function closestColour(
  value: string,
  options: ReadonlyArray<{ value: string }>,
) {
  const source = Number.parseInt(value.slice(1), 16);
  if (!Number.isFinite(source)) return options[0].value;

  const sourceRgb = [(source >> 16) & 255, (source >> 8) & 255, source & 255];
  let best = options[0].value;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const option of options) {
    const target = Number.parseInt(option.value.slice(1), 16);
    const targetRgb = [(target >> 16) & 255, (target >> 8) & 255, target & 255];
    const distance = sourceRgb.reduce(
      (sum, channel, index) =>
        sum + (channel - targetRgb[index]) ** 2,
      0,
    );
    if (distance < bestDistance) {
      bestDistance = distance;
      best = option.value;
    }
  }

  return best;
}

export function upgradeAvatarV3ToV4(value: unknown): AvatarV4Config {
  const v3 = normalizeAvatarConfig(value);
  const accessories: AccessoryId[] = [];
  if (v3.accessoryStyle === "studs" || v3.accessoryStyle === "hoops") {
    accessories.push("earrings");
  }
  if (v3.accessoryStyle === "watch") accessories.push("watch");
  if (v3.accessoryStyle === "chain") accessories.push("necklace");

  return {
    ...defaultAvatarV4Config,
    facePresetId:
      v3.faceShape === "round"
        ? "soft-round"
        : v3.faceShape === "square"
          ? "defined-square"
          : v3.faceShape === "heart"
            ? "tapered-heart"
            : v3.faceShape === "long"
              ? "long-sculpted"
              : "balanced-oval",
    jawPresetId:
      v3.faceShape === "square"
        ? "defined"
        : v3.faceShape === "heart"
          ? "tapered"
          : "balanced",
    eyeShapeId:
      v3.eyeShape === "narrow"
        ? "focused"
        : v3.eyeShape === "soft"
          ? "hooded"
          : v3.eyeShape,
    eyeColour: closestColour(v3.eyeColor, avatarV4Catalogue.eyeColours),
    eyebrowStyleId: v3.eyebrowStyle,
    nosePresetId: v3.noseStyle === "small" ? "compact" : v3.noseStyle,
    mouthPresetId:
      v3.mouthStyle === "smile"
        ? "friendly"
        : v3.mouthStyle === "warm"
          ? "soft-smile"
          : v3.mouthStyle === "calm"
            ? "neutral"
            : v3.mouthStyle === "soft"
              ? "relaxed"
              : v3.mouthStyle,
    earPresetId:
      v3.earStyle === "small"
        ? "compact"
        : v3.earStyle === "close"
          ? "close"
          : v3.earStyle,
    skinTone: closestColour(v3.skinTone, avatarV4Catalogue.skinTones),
    hairStyleId: v3HairMap[v3.hairStyle] ?? "textured-crop",
    hairColour: closestColour(v3.hairColor, avatarV4Catalogue.hairColours),
    facialHairStyleId:
      v3.facialHairStyle === "beard"
        ? "short-beard"
        : v3.facialHairStyle,
    facialHairColour: closestColour(
      v3.facialHairColor,
      avatarV4Catalogue.hairColours,
    ),
    topStyleId: v3TopMap[v3.topStyle] ?? "fitted-tee",
    topColour: closestColour(v3.topColor, avatarV4Catalogue.clothingColours),
    outerwearStyleId:
      v3OuterwearMap[v3.outerwearStyle] ?? defaultAvatarV4Config.outerwearStyleId,
    outerwearColour: closestColour(
      v3.outerwearColor,
      avatarV4Catalogue.clothingColours,
    ),
    bottomStyleId:
      v3BottomMap[v3.bottomStyle] ?? defaultAvatarV4Config.bottomStyleId,
    bottomColour: closestColour(
      v3.bottomColor,
      avatarV4Catalogue.bottomColours,
    ),
    shoeStyleId: v3ShoeMap[v3.shoeStyle] ?? defaultAvatarV4Config.shoeStyleId,
    shoeColour: closestColour(v3.shoeColor, avatarV4Catalogue.shoeColours),
    glassesStyleId:
      v3GlassesMap[v3.glassesStyle] ?? defaultAvatarV4Config.glassesStyleId,
    accessoryIds: accessories,
    expressionId: v3.mouthStyle === "focused" ? "focused" : "warm",
  };
}

export function createAvatarV4FromStored(value: unknown): AvatarV4Config {
  if (isPixelCompanionConfig(value)) {
    return { ...defaultAvatarV4Config, accessoryIds: [] };
  }

  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ((value as Record<string, unknown>).version === 5 ||
      (value as Record<string, unknown>).version === 6)
  ) {
    return upgradeAvatarV3ToV4(avatarV5ToV3(parseAvatarV5Config(value)));
  }

  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (value as Record<string, unknown>).version === 4
  ) {
    return parseAvatarV4Config(value);
  }

  return upgradeAvatarV3ToV4(value);
}

export function normalizeStoredAvatarConfig(value: unknown): StoredAvatarConfig {
  if (isPixelCompanionConfig(value)) {
    return normalizeCompanionConfig(value);
  }

  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ((value as Record<string, unknown>).version === 5 ||
      (value as Record<string, unknown>).version === 6)
  ) {
    return parseAvatarV5Config(value);
  }

  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (value as Record<string, unknown>).version === 4
  ) {
    return parseAvatarV4Config(value);
  }

  if (isCompleteAvatarConfig(value)) {
    return normalizeAvatarConfig(value);
  }

  return createPixelCompanionFromStored(value);
}

export function isCompleteStoredAvatarConfig(
  value: unknown,
): value is StoredAvatarConfig {
  return (
    isCompletePixelCompanionConfig(value) ||
    isAvatarV5Config(value) ||
    isCompleteAvatarV4Config(value) ||
    isCompleteAvatarConfig(value)
  );
}

export function avatarV4ToV3(config: AvatarV4Config): AvatarConfig {
  const findV3Colour = (
    value: string,
    choices: ReadonlyArray<{ value: string }>,
  ) => closestColour(value, choices);

  const accessoryStyle =
    config.accessoryIds.includes("watch")
      ? "watch"
      : config.accessoryIds.includes("necklace")
        ? "chain"
        : config.accessoryIds.includes("earrings")
          ? "studs"
          : "none";

  return {
    ...defaultAvatarConfig,
    version: 3,
    skinTone: findV3Colour(config.skinTone, avatarOptions.skinTones),
    faceShape:
      config.facePresetId === "soft-round"
        ? "round"
        : config.facePresetId === "defined-square"
          ? "square"
          : config.facePresetId === "tapered-heart"
            ? "heart"
            : config.facePresetId === "long-sculpted"
              ? "long"
              : "oval",
    earStyle: config.earPresetId === "compact" ? "small" : config.earPresetId,
    eyeShape:
      config.eyeShapeId === "hooded"
        ? "soft"
        : config.eyeShapeId === "focused"
          ? "narrow"
          : config.eyeShapeId,
    eyeColor: findV3Colour(config.eyeColour, avatarOptions.eyeColors),
    eyebrowStyle: config.eyebrowStyleId,
    eyebrowColor: findV3Colour(
      config.hairColour,
      avatarOptions.eyebrowColors,
    ),
    noseStyle:
      config.nosePresetId === "compact" ? "small" : config.nosePresetId,
    mouthStyle:
      config.mouthPresetId === "neutral"
        ? "calm"
        : config.mouthPresetId === "soft-smile"
          ? "warm"
          : config.mouthPresetId === "friendly"
            ? "smile"
            : config.mouthPresetId === "relaxed"
              ? "soft"
              : config.mouthPresetId,
    hairStyle:
      config.hairStyleId === "side-part"
        ? "side"
        : config.hairStyleId === "curly-volume"
          ? "curly"
          : config.hairStyleId === "layered-bob"
            ? "bob"
            : config.hairStyleId === "shoulder-waves"
              ? "long"
              : config.hairStyleId === "ponytail"
                ? "bun"
                : config.hairStyleId === "close-crop"
                  ? "fade"
                  : "textured",
    hairColor: findV3Colour(config.hairColour, avatarOptions.hairColors),
    facialHairStyle:
      config.facialHairStyleId === "short-beard"
        ? "beard"
        : config.facialHairStyleId,
    facialHairColor: findV3Colour(
      config.facialHairColour,
      avatarOptions.facialHairColors,
    ),
    topStyle:
      config.topStyleId === "oxford-shirt"
        ? "oxford"
        : config.topStyleId === "polo-shirt"
          ? "polo"
          : config.topStyleId === "crew-sweater"
            ? "knit"
            : config.topStyleId === "relaxed-tee"
              ? "sport"
              : "tee",
    topColor: findV3Colour(config.topColour, avatarOptions.topColors),
    outerwearStyle:
      config.outerwearStyleId === "bomber"
        ? "bomber"
        : config.outerwearStyleId === "blazer"
          ? "blazer"
          : config.outerwearStyleId === "overshirt"
            ? "overshirt"
            : config.outerwearStyleId === "cardigan"
              ? "cardigan"
              : "none",
    outerwearColor: findV3Colour(
      config.outerwearColour,
      avatarOptions.outerwearColors,
    ),
    bottomStyle:
      config.bottomStyleId === "skirt"
        ? "skirt"
        : config.bottomStyleId === "sports-bottoms"
          ? "sport"
          : config.bottomStyleId === "relaxed-trousers"
            ? "relaxed"
            : config.bottomStyleId === "slim-trousers"
              ? "chino"
              : "straight",
    bottomColor: findV3Colour(
      config.bottomColour,
      avatarOptions.bottomColors,
    ),
    shoeStyle:
      config.shoeStyleId === "formal-shoes"
        ? "loafers"
        : config.shoeStyleId === "boots"
          ? "boots"
          : config.shoeStyleId === "sports-shoes"
            ? "runners"
            : config.shoeStyleId === "trainers"
              ? "sneakers"
              : "minimal",
    shoeColor: findV3Colour(config.shoeColour, avatarOptions.shoeColors),
    glassesStyle:
      config.glassesStyleId === "rectangular"
        ? "architect"
        : config.glassesStyleId === "sunglasses"
          ? "bold"
          : config.glassesStyleId,
    accessoryStyle,
  };
}

function randomOption<T extends string>(
  choices: ReadonlyArray<AvatarOption<T>>,
) {
  return choices[Math.floor(Math.random() * choices.length)].value;
}

export function randomAvatarV4Config(): AvatarV4Config {
  const hairColour = randomOption(avatarV4Catalogue.hairColours);
  const topStyleId = randomOption(avatarV4Catalogue.topStyles);

  return {
    version: 4,
    renderer: "procedural-3d",
    facePresetId: randomOption(avatarV4Catalogue.facePresets),
    jawPresetId: randomOption(avatarV4Catalogue.jawPresets),
    eyeShapeId: randomOption(avatarV4Catalogue.eyeShapes),
    eyeColour: randomOption(avatarV4Catalogue.eyeColours),
    eyebrowStyleId: randomOption(avatarV4Catalogue.eyebrowStyles),
    nosePresetId: randomOption(avatarV4Catalogue.nosePresets),
    mouthPresetId: randomOption(avatarV4Catalogue.mouthPresets),
    earPresetId: randomOption(avatarV4Catalogue.earPresets),
    skinTone: randomOption(avatarV4Catalogue.skinTones),
    hairStyleId: randomOption(avatarV4Catalogue.hairStyles),
    hairColour,
    facialHairStyleId: randomOption(avatarV4Catalogue.facialHairStyles),
    facialHairColour: hairColour,
    topStyleId,
    topColour: randomOption(avatarV4Catalogue.clothingColours),
    outerwearStyleId:
      topStyleId === "blazer" || topStyleId === "bomber-jacket"
        ? "none"
        : randomOption(avatarV4Catalogue.outerwearStyles),
    outerwearColour: randomOption(avatarV4Catalogue.clothingColours),
    bottomStyleId: randomOption(avatarV4Catalogue.bottomStyles),
    bottomColour: randomOption(avatarV4Catalogue.bottomColours),
    shoeStyleId: randomOption(avatarV4Catalogue.shoeStyles),
    shoeColour: randomOption(avatarV4Catalogue.shoeColours),
    glassesStyleId: randomOption(avatarV4Catalogue.glassesStyles),
    accessoryIds: Math.random() > 0.55 ? [randomOption(avatarV4Catalogue.accessories)] : [],
    expressionId: randomOption(avatarV4Catalogue.expressions),
  };
}
