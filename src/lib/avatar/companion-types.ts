export const companionFamilies = [
  "terminal",
  "growth",
  "signal",
  "stack",
  "spirit",
] as const;

export const companionColorThemes = [
  "classic",
  "sage",
  "violet",
  "amber",
  "graphite",
] as const;

export const companionGlowColors = [
  "mint",
  "sky",
  "violet",
  "amber",
  "rose",
  "white",
] as const;

export const companionPatterns = [
  "none",
  "corner-pixels",
  "soft-dots",
  "tiny-stripe",
  "signal-mark",
] as const;

export const companionStates = ["idle", "working", "completed"] as const;
export const companionStages = ["starter", "explorer", "builder"] as const;

export type CompanionFamily = (typeof companionFamilies)[number];
export type CompanionColorTheme = (typeof companionColorThemes)[number];
export type CompanionGlowColor = (typeof companionGlowColors)[number];
export type CompanionPattern = (typeof companionPatterns)[number];
export type CompanionState = (typeof companionStates)[number];
export type CompanionStage = (typeof companionStages)[number];

export type PixelCompanionConfig = {
  version: "pixel-companion-v1";
  family: CompanionFamily;
  colorTheme: CompanionColorTheme;
  glowColor: CompanionGlowColor;
  pattern: CompanionPattern;
};

export type CompanionFamilyDefinition = {
  id: CompanionFamily;
  label: string;
  description: string;
};

export const companionFamilyDefinitions: CompanionFamilyDefinition[] = [
  {
    id: "terminal",
    label: "Terminal",
    description: "Focused, calm, precise.",
  },
  {
    id: "growth",
    label: "Growth",
    description: "Warm, steady, optimistic.",
  },
  {
    id: "signal",
    label: "Signal",
    description: "Curious, adaptive, bright.",
  },
  {
    id: "stack",
    label: "Stack",
    description: "Organized, reliable, structured.",
  },
  {
    id: "spirit",
    label: "Spirit",
    description: "Minimal, quiet, thoughtful.",
  },
];
