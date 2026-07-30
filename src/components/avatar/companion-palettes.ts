import type {
  CompanionColorTheme,
  CompanionGlowColor,
  CompanionPattern,
} from "@/lib/avatar/companion-types";

export type CompanionPalette = {
  primary: string;
  secondary: string;
  shadow: string;
  deepShadow: string;
  highlight: string;
  face: string;
  detail: string;
};

export const companionThemeOptions: Array<{
  id: CompanionColorTheme;
  label: string;
  palette: CompanionPalette;
}> = [
  {
    id: "classic",
    label: "Classic",
    palette: {
      primary: "#4f77d9",
      secondary: "#83a7ff",
      shadow: "#294584",
      deepShadow: "#17274f",
      highlight: "#c8d8ff",
      face: "#f2f5ff",
      detail: "#0d1730",
    },
  },
  {
    id: "sage",
    label: "Sage",
    palette: {
      primary: "#628d78",
      secondary: "#8eb6a0",
      shadow: "#3e6553",
      deepShadow: "#223c31",
      highlight: "#c9decf",
      face: "#f0f6ef",
      detail: "#152a22",
    },
  },
  {
    id: "violet",
    label: "Violet",
    palette: {
      primary: "#7660b8",
      secondary: "#a58bdc",
      shadow: "#493a78",
      deepShadow: "#292146",
      highlight: "#ded1ff",
      face: "#f7f1ff",
      detail: "#211936",
    },
  },
  {
    id: "amber",
    label: "Amber",
    palette: {
      primary: "#bd7934",
      secondary: "#e4a759",
      shadow: "#7b4922",
      deepShadow: "#472814",
      highlight: "#f5d598",
      face: "#fff7e8",
      detail: "#35200f",
    },
  },
  {
    id: "graphite",
    label: "Graphite",
    palette: {
      primary: "#596273",
      secondary: "#8a96aa",
      shadow: "#353c49",
      deepShadow: "#1c222c",
      highlight: "#cbd3df",
      face: "#f0f3f7",
      detail: "#111720",
    },
  },
];

export const companionGlowOptions: Array<{
  id: CompanionGlowColor;
  label: string;
  value: string;
}> = [
  { id: "mint", label: "Mint", value: "#71e0bd" },
  { id: "sky", label: "Sky", value: "#79c9ff" },
  { id: "violet", label: "Violet", value: "#b59aff" },
  { id: "amber", label: "Amber", value: "#ffc66d" },
  { id: "rose", label: "Rose", value: "#ff9aaf" },
  { id: "white", label: "White", value: "#f4f7ff" },
];

export const companionPatternOptions: Array<{
  id: CompanionPattern;
  label: string;
}> = [
  { id: "none", label: "None" },
  { id: "corner-pixels", label: "Corner pixels" },
  { id: "soft-dots", label: "Soft dots" },
  { id: "tiny-stripe", label: "Tiny stripe" },
  { id: "micro-spark", label: "Micro spark" },
];

export function getCompanionPalette(theme: CompanionColorTheme) {
  return (
    companionThemeOptions.find((option) => option.id === theme)?.palette ??
    companionThemeOptions[0].palette
  );
}

const sameHueContrast: Partial<
  Record<CompanionColorTheme, Partial<Record<CompanionGlowColor, string>>>
> = {
  classic: { sky: "#a9ddff" },
  sage: { mint: "#a2efd8" },
  violet: { violet: "#d0c2ff" },
  amber: { amber: "#ffe09b" },
  graphite: { white: "#ffffff" },
};

export function getCompanionGlow(
  glow: CompanionGlowColor,
  theme?: CompanionColorTheme,
) {
  if (theme) {
    const guardedValue = sameHueContrast[theme]?.[glow];
    if (guardedValue) return guardedValue;
  }

  return (
    companionGlowOptions.find((option) => option.id === glow)?.value ??
    companionGlowOptions[0].value
  );
}
