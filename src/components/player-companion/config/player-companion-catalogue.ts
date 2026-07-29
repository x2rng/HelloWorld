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
} from "@/components/player-companion/config/player-companion-types";

export const companionBodyTypes: ReadonlyArray<
  CompanionOption<CompanionBodyTypeId>
> = [
  { value: "petite", label: "Petite", description: "Compact and light." },
  { value: "balanced", label: "Balanced", description: "Soft, balanced proportions." },
  { value: "athletic", label: "Athletic", description: "Broader shoulders and grounded stance." },
  { value: "soft", label: "Soft", description: "Rounder, relaxed proportions." },
];

export const companionSkinTones: ReadonlyArray<
  CompanionOption<CompanionSkinToneId>
> = [
  { value: "porcelain", label: "Porcelain", colour: "#f1c9b5" },
  { value: "warm-light", label: "Warm light", colour: "#dfaa88" },
  { value: "golden", label: "Golden", colour: "#c98b63" },
  { value: "bronze", label: "Bronze", colour: "#a96548" },
  { value: "deep", label: "Deep", colour: "#744531" },
  { value: "rich", label: "Rich", colour: "#4c2d25" },
];

export const companionEyeShapes: ReadonlyArray<
  CompanionOption<CompanionEyeShapeId>
> = [
  { value: "bright", label: "Bright", description: "Open and curious." },
  { value: "soft", label: "Soft", description: "Gentle and relaxed." },
  { value: "almond", label: "Almond", description: "Balanced and expressive." },
  { value: "focused", label: "Focused", description: "Calm and determined." },
];

export const companionEyeColours: ReadonlyArray<
  CompanionOption<CompanionEyeColourId>
> = [
  { value: "espresso", label: "Espresso", colour: "#5c3928" },
  { value: "hazel", label: "Hazel", colour: "#9a7438" },
  { value: "green", label: "Green", colour: "#4f8062" },
  { value: "ocean", label: "Ocean", colour: "#397aaf" },
  { value: "grey", label: "Grey", colour: "#788692" },
  { value: "violet", label: "Violet", colour: "#7564a8" },
];

export const companionEyebrows: ReadonlyArray<
  CompanionOption<CompanionEyebrowStyleId>
> = [
  { value: "natural", label: "Natural" },
  { value: "soft", label: "Soft" },
  { value: "defined", label: "Defined" },
  { value: "confident", label: "Confident" },
];

export const companionExpressions: ReadonlyArray<
  CompanionOption<CompanionExpressionId>
> = [
  { value: "warm", label: "Warm" },
  { value: "calm", label: "Calm" },
  { value: "focused", label: "Focused" },
  { value: "cheerful", label: "Cheerful" },
];

export const companionHairStyles: ReadonlyArray<
  CompanionOption<CompanionHairStyleId>
> = [
  { value: "textured-crop", label: "Textured crop" },
  { value: "side-sweep", label: "Side sweep" },
  { value: "soft-bob", label: "Soft bob" },
  { value: "double-buns", label: "Double buns" },
  { value: "curly-cloud", label: "Curly cloud" },
  { value: "high-pony", label: "High pony" },
];

export const companionHairColours: ReadonlyArray<
  CompanionOption<CompanionHairColourId>
> = [
  { value: "soft-black", label: "Soft black", colour: "#171820" },
  { value: "espresso", label: "Espresso", colour: "#37231f" },
  { value: "chestnut", label: "Chestnut", colour: "#704129" },
  { value: "auburn", label: "Auburn", colour: "#873b30" },
  { value: "golden", label: "Golden", colour: "#b98548" },
  { value: "silver", label: "Silver", colour: "#9ea5ad" },
  { value: "platinum", label: "Platinum", colour: "#d6cdbb" },
  { value: "midnight", label: "Midnight", colour: "#17213b" },
];

export const companionTopStyles: ReadonlyArray<
  CompanionOption<CompanionTopStyleId>
> = [
  { value: "fitted-tee", label: "Fitted tee", description: "Clean crew neck and short sleeves." },
  { value: "knit-sweater", label: "Knit sweater", description: "Soft volume with ribbed edges." },
  { value: "soft-hoodie", label: "Soft hoodie", description: "Rounded hood, pocket and drawstrings." },
  { value: "varsity-jacket", label: "Varsity jacket", description: "Layered jacket with contrast sleeves." },
];

export const companionBottomStyles: ReadonlyArray<
  CompanionOption<CompanionBottomStyleId>
> = [
  { value: "tapered-trousers", label: "Tapered trousers" },
  { value: "straight-jeans", label: "Straight jeans" },
  { value: "relaxed-cargos", label: "Relaxed cargos" },
  { value: "smart-shorts", label: "Smart shorts" },
];

export const companionShoeStyles: ReadonlyArray<
  CompanionOption<CompanionShoeStyleId>
> = [
  { value: "retro-trainers", label: "Retro trainers" },
  { value: "ankle-boots", label: "Ankle boots" },
  { value: "clean-slip-ons", label: "Clean slip-ons" },
];

export const companionColours: ReadonlyArray<
  CompanionOption<CompanionColourId>
> = [
  { value: "ink", label: "Ink", colour: "#242735" },
  { value: "cloud", label: "Cloud", colour: "#d8dce3" },
  { value: "ocean", label: "Ocean", colour: "#397596" },
  { value: "cobalt", label: "Cobalt", colour: "#4e68c6" },
  { value: "sage", label: "Sage", colour: "#71876e" },
  { value: "plum", label: "Plum", colour: "#76516f" },
  { value: "clay", label: "Clay", colour: "#b2624b" },
  { value: "sun", label: "Sun", colour: "#d4a443" },
];

function colourFor<T extends string>(
  options: ReadonlyArray<CompanionOption<T>>,
  id: T,
  fallback: string,
) {
  return options.find((option) => option.value === id)?.colour ?? fallback;
}

export function getCompanionSkinColour(id: CompanionSkinToneId) {
  return colourFor(companionSkinTones, id, "#a96548");
}

export function getCompanionEyeColour(id: CompanionEyeColourId) {
  return colourFor(companionEyeColours, id, "#5c3928");
}

export function getCompanionHairColour(id: CompanionHairColourId) {
  return colourFor(companionHairColours, id, "#37231f");
}

export function getCompanionColour(id: CompanionColourId) {
  return colourFor(companionColours, id, "#397596");
}
