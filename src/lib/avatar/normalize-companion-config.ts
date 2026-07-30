import {
  companionColorThemes,
  companionFamilies,
  companionGlowColors,
  companionPatterns,
  type CompanionColorTheme,
  type CompanionFamily,
  type CompanionGlowColor,
  type CompanionPattern,
  type PixelCompanionConfig,
} from "@/lib/avatar/companion-types";

export const defaultPixelCompanionConfig: PixelCompanionConfig = {
  version: "pixel-companion-v1",
  family: "terminal",
  colorTheme: "classic",
  glowColor: "mint",
  pattern: "corner-pixels",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function allowed<T extends string>(
  value: unknown,
  options: readonly T[],
  fallback: T,
) {
  return typeof value === "string" && options.includes(value as T)
    ? (value as T)
    : fallback;
}

export function isPixelCompanionConfig(
  value: unknown,
): value is PixelCompanionConfig {
  if (!isRecord(value)) return false;
  return value.version === "pixel-companion-v1";
}

export function normalizeCompanionConfig(
  value: unknown,
): PixelCompanionConfig {
  const config = isRecord(value) ? value : {};

  return {
    version: "pixel-companion-v1",
    family: allowed<CompanionFamily>(
      config.family,
      companionFamilies,
      defaultPixelCompanionConfig.family,
    ),
    colorTheme: allowed<CompanionColorTheme>(
      config.colorTheme,
      companionColorThemes,
      defaultPixelCompanionConfig.colorTheme,
    ),
    glowColor: allowed<CompanionGlowColor>(
      config.glowColor,
      companionGlowColors,
      defaultPixelCompanionConfig.glowColor,
    ),
    pattern: allowed<CompanionPattern>(
      config.pattern,
      companionPatterns,
      defaultPixelCompanionConfig.pattern,
    ),
  };
}

export function isCompletePixelCompanionConfig(
  value: unknown,
): value is PixelCompanionConfig {
  if (!isPixelCompanionConfig(value)) return false;
  const parsed = normalizeCompanionConfig(value);

  return (
    value.family === parsed.family &&
    value.colorTheme === parsed.colorTheme &&
    value.glowColor === parsed.glowColor &&
    value.pattern === parsed.pattern
  );
}

/**
 * Produces a safe preview for any stored avatar value. This never writes or
 * mutates the source value; legacy avatars convert only after an explicit save.
 */
export function createPixelCompanionFromStored(
  value: unknown,
): PixelCompanionConfig {
  return isPixelCompanionConfig(value)
    ? normalizeCompanionConfig(value)
    : { ...defaultPixelCompanionConfig };
}
