import {
  companionBodyTypes,
  companionBottomStyles,
  companionColours,
  companionEyeColours,
  companionEyebrows,
  companionExpressions,
  companionEyeShapes,
  companionHairColours,
  companionHairStyles,
  companionShoeStyles,
  companionSkinTones,
  companionTopStyles,
} from "@/components/player-companion/config/player-companion-catalogue";
import { defaultPlayerCompanionConfig } from "@/components/player-companion/config/player-companion-defaults";
import type {
  CompanionBodyTypeId,
  CompanionBottomStyleId,
  CompanionColourId,
  CompanionExpressionId,
  CompanionEyeColourId,
  CompanionEyebrowStyleId,
  CompanionEyeShapeId,
  CompanionHairColourId,
  CompanionHairStyleId,
  CompanionOption,
  CompanionShoeStyleId,
  CompanionSkinToneId,
  CompanionTopStyleId,
  PlayerCompanionConfig,
} from "@/components/player-companion/config/player-companion-types";

function allowed<T extends string>(
  value: unknown,
  options: ReadonlyArray<CompanionOption<T>>,
  fallback: T,
) {
  return typeof value === "string" &&
    options.some((option) => option.value === value)
    ? (value as T)
    : fallback;
}

export function isPlayerCompanionConfig(
  value: unknown,
): value is PlayerCompanionConfig {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const config = value as Record<string, unknown>;
  return config.version === 7 && config.renderer === "player-companion";
}

export function isCompletePlayerCompanionConfig(
  value: unknown,
): value is PlayerCompanionConfig {
  if (!isPlayerCompanionConfig(value)) return false;

  const config = value as unknown as Record<string, unknown>;
  const parsed = parsePlayerCompanionConfig(value);

  return Object.entries(parsed).every(([key, item]) => config[key] === item);
}

export function parsePlayerCompanionConfig(
  value: unknown,
): PlayerCompanionConfig {
  const config =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    version: 7,
    renderer: "player-companion",
    bodyTypeId: allowed<CompanionBodyTypeId>(
      config.bodyTypeId,
      companionBodyTypes,
      defaultPlayerCompanionConfig.bodyTypeId,
    ),
    skinToneId: allowed<CompanionSkinToneId>(
      config.skinToneId,
      companionSkinTones,
      defaultPlayerCompanionConfig.skinToneId,
    ),
    eyeShapeId: allowed<CompanionEyeShapeId>(
      config.eyeShapeId,
      companionEyeShapes,
      defaultPlayerCompanionConfig.eyeShapeId,
    ),
    eyeColourId: allowed<CompanionEyeColourId>(
      config.eyeColourId,
      companionEyeColours,
      defaultPlayerCompanionConfig.eyeColourId,
    ),
    eyebrowStyleId: allowed<CompanionEyebrowStyleId>(
      config.eyebrowStyleId,
      companionEyebrows,
      defaultPlayerCompanionConfig.eyebrowStyleId,
    ),
    expressionId: allowed<CompanionExpressionId>(
      config.expressionId,
      companionExpressions,
      defaultPlayerCompanionConfig.expressionId,
    ),
    hairStyleId: allowed<CompanionHairStyleId>(
      config.hairStyleId,
      companionHairStyles,
      defaultPlayerCompanionConfig.hairStyleId,
    ),
    hairColourId: allowed<CompanionHairColourId>(
      config.hairColourId,
      companionHairColours,
      defaultPlayerCompanionConfig.hairColourId,
    ),
    topStyleId: allowed<CompanionTopStyleId>(
      config.topStyleId,
      companionTopStyles,
      defaultPlayerCompanionConfig.topStyleId,
    ),
    topColourId: allowed<CompanionColourId>(
      config.topColourId,
      companionColours,
      defaultPlayerCompanionConfig.topColourId,
    ),
    bottomStyleId: allowed<CompanionBottomStyleId>(
      config.bottomStyleId,
      companionBottomStyles,
      defaultPlayerCompanionConfig.bottomStyleId,
    ),
    bottomColourId: allowed<CompanionColourId>(
      config.bottomColourId,
      companionColours,
      defaultPlayerCompanionConfig.bottomColourId,
    ),
    shoeStyleId: allowed<CompanionShoeStyleId>(
      config.shoeStyleId,
      companionShoeStyles,
      defaultPlayerCompanionConfig.shoeStyleId,
    ),
    shoeColourId: allowed<CompanionColourId>(
      config.shoeColourId,
      companionColours,
      defaultPlayerCompanionConfig.shoeColourId,
    ),
  };
}

function legacySkin(value: unknown): CompanionSkinToneId {
  const key = typeof value === "string" ? value : "";
  if (key.includes("porcelain")) return "porcelain";
  if (key.includes("light")) return "warm-light";
  if (key.includes("golden")) return "golden";
  if (key.includes("deep") || key.includes("rich")) return key.includes("rich") ? "rich" : "deep";
  return "bronze";
}

function legacyHair(value: unknown): CompanionHairStyleId {
  const key = typeof value === "string" ? value : "";
  if (key.includes("bun")) return "double-buns";
  if (key.includes("long") || key.includes("pony")) return "high-pony";
  if (key.includes("bob")) return "soft-bob";
  if (key.includes("buzz") || key.includes("crop") || key.includes("fade")) {
    return "textured-crop";
  }
  return "side-sweep";
}

function legacyHairColour(value: unknown): CompanionHairColourId {
  const key = typeof value === "string" ? value : "";
  if (key.includes("silver")) return "silver";
  if (key.includes("platinum")) return "platinum";
  if (key.includes("auburn") || key.includes("copper")) return "auburn";
  if (key.includes("golden")) return "golden";
  if (key.includes("chestnut")) return "chestnut";
  if (key.includes("black") || key.includes("midnight")) return "soft-black";
  return "espresso";
}

/**
 * Phase A compatibility adapter. It creates a companion preview from existing
 * avatar JSON without mutating or replacing the stored avatar_config value.
 */
export function createPlayerCompanionFromStored(
  value: unknown,
): PlayerCompanionConfig {
  if (isPlayerCompanionConfig(value)) return parsePlayerCompanionConfig(value);
  const legacy =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    ...defaultPlayerCompanionConfig,
    bodyTypeId:
      legacy.frameId === "structured" ? "athletic" : "balanced",
    skinToneId: legacySkin(legacy.skinToneId ?? legacy.skinTone),
    eyeShapeId:
      legacy.eyeShapeId === "focused" || legacy.eyeShape === "narrow"
        ? "focused"
        : legacy.eyeShapeId === "round" || legacy.eyeShape === "round"
          ? "bright"
          : "almond",
    hairStyleId: legacyHair(legacy.hairStyleId ?? legacy.hairStyle),
    hairColourId: legacyHairColour(
      legacy.hairColourId ?? legacy.hairColor,
    ),
  };
}
