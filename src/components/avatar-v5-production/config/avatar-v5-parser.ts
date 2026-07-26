import {
  avatarV5BottomStyles,
  avatarV5ColourVariants,
  avatarV5HairColours,
  avatarV5HairStyles,
  avatarV5ShoeStyles,
  avatarV5SkinTones,
  avatarV5TopStyles,
  getAvatarV5HairColour,
  getAvatarV5SkinColour,
} from "@/components/avatar-v5-production/config/avatar-v5-catalogue";
import { defaultAvatarV5Config } from "@/components/avatar-v5-production/config/avatar-v5-defaults";
import type {
  AvatarV5BottomStyleId,
  AvatarV5ColourVariantId,
  AvatarV5Config,
  AvatarV5HairColourId,
  AvatarV5HairStyleId,
  AvatarV5Option,
  AvatarV5ShoeStyleId,
  AvatarV5SkinToneId,
  AvatarV5TopStyleId,
} from "@/components/avatar-v5-production/config/avatar-v5-types";
import {
  defaultAvatarConfig,
  normalizeAvatarConfig,
  type AvatarConfig,
} from "@/lib/avatar-config";

function allowed<T extends string>(
  value: unknown,
  options: ReadonlyArray<AvatarV5Option<T>>,
  fallback: T,
) {
  return typeof value === "string" &&
    options.some((option) => option.value === value)
    ? (value as T)
    : fallback;
}

export function parseAvatarV5Config(value: unknown): AvatarV5Config {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...defaultAvatarV5Config };
  }

  const config = value as Record<string, unknown>;
  return {
    version: 5,
    renderer: "modular-gltf",
    assetFamily: "quaternius-universal",
    skinToneId: allowed<AvatarV5SkinToneId>(
      config.skinToneId,
      avatarV5SkinTones,
      defaultAvatarV5Config.skinToneId,
    ),
    hairStyleId: allowed<AvatarV5HairStyleId>(
      config.hairStyleId,
      avatarV5HairStyles,
      defaultAvatarV5Config.hairStyleId,
    ),
    hairColourId: allowed<AvatarV5HairColourId>(
      config.hairColourId,
      avatarV5HairColours,
      defaultAvatarV5Config.hairColourId,
    ),
    topStyleId: allowed<AvatarV5TopStyleId>(
      config.topStyleId,
      avatarV5TopStyles,
      defaultAvatarV5Config.topStyleId,
    ),
    topColourId: allowed<AvatarV5ColourVariantId>(
      config.topColourId,
      avatarV5ColourVariants,
      defaultAvatarV5Config.topColourId,
    ),
    bottomStyleId: allowed<AvatarV5BottomStyleId>(
      config.bottomStyleId,
      avatarV5BottomStyles,
      defaultAvatarV5Config.bottomStyleId,
    ),
    bottomColourId: allowed<AvatarV5ColourVariantId>(
      config.bottomColourId,
      avatarV5ColourVariants,
      defaultAvatarV5Config.bottomColourId,
    ),
    shoeStyleId: allowed<AvatarV5ShoeStyleId>(
      config.shoeStyleId,
      avatarV5ShoeStyles,
      defaultAvatarV5Config.shoeStyleId,
    ),
    shoeColourId: allowed<AvatarV5ColourVariantId>(
      config.shoeColourId,
      avatarV5ColourVariants,
      defaultAvatarV5Config.shoeColourId,
    ),
  };
}

export function isAvatarV5Config(value: unknown): value is AvatarV5Config {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const config = value as Record<string, unknown>;
  const parsed = parseAvatarV5Config(config);

  return (
    config.version === 5 &&
    config.renderer === "modular-gltf" &&
    config.assetFamily === "quaternius-universal" &&
    Object.entries(parsed).every(([key, item]) => config[key] === item)
  );
}

export function createAvatarV5FromStored(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (value as Record<string, unknown>).version === 5
  ) {
    return parseAvatarV5Config(value);
  }

  return { ...defaultAvatarV5Config };
}

function randomOption<T extends string>(
  options: ReadonlyArray<AvatarV5Option<T>>,
) {
  return options[Math.floor(Math.random() * options.length)].value;
}

export function randomAvatarV5Config(): AvatarV5Config {
  return {
    version: 5,
    renderer: "modular-gltf",
    assetFamily: "quaternius-universal",
    skinToneId: randomOption(avatarV5SkinTones),
    hairStyleId: randomOption(avatarV5HairStyles),
    hairColourId: randomOption(avatarV5HairColours),
    topStyleId: randomOption(avatarV5TopStyles),
    topColourId: randomOption(avatarV5ColourVariants),
    bottomStyleId: randomOption(avatarV5BottomStyles),
    bottomColourId: randomOption(avatarV5ColourVariants),
    shoeStyleId: randomOption(avatarV5ShoeStyles),
    shoeColourId: randomOption(avatarV5ColourVariants),
  };
}

export function avatarV5ToV3(config: AvatarV5Config): AvatarConfig {
  const hairStyleMap: Record<AvatarV5HairStyleId, AvatarConfig["hairStyle"]> = {
    "approved-long": "long",
    "double-buns": "bun",
  };

  const skinToneMap: Record<AvatarV5SkinToneId, AvatarConfig["skinTone"]> = {
    porcelain: "#f7d8c4",
    "light-warm": "#e9b88e",
    golden: "#ca9064",
    "warm-bronze": "#a66b49",
    "deep-bronze": "#744832",
    deep: "#744832",
    rich: "#4b2d25",
  };

  const hairColourMap: Record<
    AvatarV5HairColourId,
    AvatarConfig["hairColor"]
  > = {
    "soft-black": "#171717",
    espresso: "#35241f",
    chestnut: "#7c4a2d",
    auburn: "#8a3f2b",
    "golden-brown": "#c9a35a",
    silver: "#9ca3af",
  };

  return normalizeAvatarConfig({
    ...defaultAvatarConfig,
    skinTone: skinToneMap[config.skinToneId] ?? getAvatarV5SkinColour(config.skinToneId),
    hairStyle: hairStyleMap[config.hairStyleId],
    hairColor:
      hairColourMap[config.hairColourId] ??
      getAvatarV5HairColour(config.hairColourId),
    eyebrowColor:
      hairColourMap[config.hairColourId] ??
      getAvatarV5HairColour(config.hairColourId),
    topStyle:
      config.topStyleId === "ranger-structured" ? "oxford" : "knit",
    bottomStyle:
      config.bottomStyleId === "ranger-trousers" ? "straight" : "tailored",
    shoeStyle:
      config.shoeStyleId === "ranger-boots" ? "boots" : "minimal",
  });
}
