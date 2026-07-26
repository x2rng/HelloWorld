import type {
  AvatarV5AccessoryId,
  AvatarV5BodyPresetId,
  AvatarV5BottomStyleId,
  AvatarV5ColourVariantId,
  AvatarV5EarPresetId,
  AvatarV5EyeColourId,
  AvatarV5EyeShapeId,
  AvatarV5FacePresetId,
  AvatarV5FacialHairStyleId,
  AvatarV5FrameId,
  AvatarV5GlassesStyleId,
  AvatarV5HairColourId,
  AvatarV5HairStyleId,
  AvatarV5Option,
  AvatarV5ShoeStyleId,
  AvatarV5SkinToneId,
  AvatarV5TopStyleId,
} from "@/components/avatar-v5-production/config/avatar-v5-types";

export const avatarV5Frames: ReadonlyArray<AvatarV5Option<AvatarV5FrameId>> = [
  { label: "Sculpted", value: "sculpted", description: "A softly shaped frame." },
  { label: "Structured", value: "structured", description: "A broader structured frame." },
];

export const avatarV5BodyPresets: ReadonlyArray<AvatarV5Option<AvatarV5BodyPresetId>> = [
  { label: "Slim", value: "slim" },
  { label: "Balanced", value: "balanced" },
  { label: "Athletic", value: "athletic" },
  { label: "Broad", value: "broad" },
  { label: "Tall", value: "tall" },
];

export const avatarV5FacePresets: ReadonlyArray<AvatarV5Option<AvatarV5FacePresetId>> = [
  { label: "Balanced", value: "balanced" },
  { label: "Soft", value: "soft" },
  { label: "Defined", value: "defined" },
  { label: "Long", value: "long" },
];

export const avatarV5EyeShapes: ReadonlyArray<AvatarV5Option<AvatarV5EyeShapeId>> = [
  { label: "Balanced", value: "balanced" },
  { label: "Almond", value: "almond" },
  { label: "Round", value: "round" },
  { label: "Focused", value: "focused" },
];

export const avatarV5EarPresets: ReadonlyArray<AvatarV5Option<AvatarV5EarPresetId>> = [
  { label: "Natural", value: "natural" },
  { label: "Compact", value: "compact" },
  { label: "Defined", value: "defined" },
];

export const avatarV5SkinTones: ReadonlyArray<AvatarV5Option<AvatarV5SkinToneId> & { colour: string }> = [
  { label: "Porcelain", value: "porcelain", colour: "#f2cbb3" },
  { label: "Light warm", value: "light-warm", colour: "#deb08d" },
  { label: "Golden", value: "golden", colour: "#c99165" },
  { label: "Warm bronze", value: "warm-bronze", colour: "#b8754e" },
  { label: "Deep bronze", value: "deep-bronze", colour: "#91573b" },
  { label: "Deep", value: "deep", colour: "#704331" },
  { label: "Rich", value: "rich", colour: "#4c2e26" },
];

export const avatarV5HairStyles: ReadonlyArray<AvatarV5Option<AvatarV5HairStyleId>> = [
  { label: "Long layers", value: "approved-long" },
  { label: "Double buns", value: "double-buns" },
  { label: "Close buzz", value: "close-buzz" },
  { label: "Soft crop", value: "soft-close-crop" },
  { label: "Side part", value: "simple-side-part" },
];

export const avatarV5HairColours: ReadonlyArray<AvatarV5Option<AvatarV5HairColourId> & { colour: string }> = [
  { label: "Soft black", value: "soft-black", colour: "#171719" },
  { label: "Espresso", value: "espresso", colour: "#35231e" },
  { label: "Chestnut", value: "chestnut", colour: "#704229" },
  { label: "Auburn", value: "auburn", colour: "#7f3829" },
  { label: "Golden brown", value: "golden-brown", colour: "#a97842" },
  { label: "Silver", value: "silver", colour: "#a8a6a1" },
  { label: "Blue black", value: "blue-black", colour: "#121722" },
  { label: "Ash brown", value: "ash-brown", colour: "#66584e" },
  { label: "Copper", value: "copper", colour: "#a44e2f" },
  { label: "Platinum", value: "platinum", colour: "#d8d1bd" },
];

export const avatarV5EyeColours: ReadonlyArray<AvatarV5Option<AvatarV5EyeColourId> & { colour: string }> = [
  { label: "Brown", value: "brown", colour: "#69452c" },
  { label: "Blue", value: "blue", colour: "#416f9b" },
  { label: "Green", value: "green", colour: "#527a59" },
  { label: "Hazel", value: "hazel", colour: "#8a6e36" },
  { label: "Grey", value: "grey", colour: "#687783" },
];

export const avatarV5FacialHairStyles: ReadonlyArray<AvatarV5Option<AvatarV5FacialHairStyleId>> = [
  { label: "None", value: "none" },
  { label: "Short beard", value: "short-beard" },
];

export const avatarV5TopStyles: ReadonlyArray<AvatarV5Option<AvatarV5TopStyleId>> = [
  {
    label: "Heritage fitted",
    value: "heritage-fitted",
    description: "An artist-authored fitted outfit that moves with the character.",
  },
  {
    label: "Ranger structured",
    value: "ranger-structured",
    description: "An artist-authored layered outfit that moves with the character.",
  },
];

export const avatarV5BottomStyles: ReadonlyArray<AvatarV5Option<AvatarV5BottomStyleId>> = [
  { label: "Heritage trousers", value: "heritage-trousers", description: "Fitted and fully rigged." },
  { label: "Ranger trousers", value: "ranger-trousers", description: "Structured and fully rigged." },
];

export const avatarV5ShoeStyles: ReadonlyArray<AvatarV5Option<AvatarV5ShoeStyleId>> = [
  { label: "Casual ankle boots", value: "heritage-boots" },
  { label: "Structured boots", value: "ranger-boots" },
];

export const avatarV5GlassesStyles: ReadonlyArray<AvatarV5Option<AvatarV5GlassesStyleId>> = [
  { label: "None", value: "none" },
  { label: "Round", value: "round" },
  { label: "Rectangular", value: "rectangular" },
  { label: "Sunglasses", value: "sunglasses" },
];

export const avatarV5Accessories: ReadonlyArray<AvatarV5Option<AvatarV5AccessoryId>> = [
  { label: "Watch", value: "watch" },
  { label: "Necklace", value: "necklace" },
];

export const avatarV5ColourVariants: ReadonlyArray<AvatarV5Option<AvatarV5ColourVariantId> & { colour: string }> = [
  { label: "Earth", value: "original", colour: "#4b3022" },
  { label: "Slate", value: "alternate", colour: "#46505f" },
  { label: "Navy", value: "navy", colour: "#27394f" },
  { label: "Forest", value: "forest", colour: "#334d3d" },
  { label: "Burgundy", value: "burgundy", colour: "#633a46" },
  { label: "Charcoal", value: "charcoal", colour: "#34373e" },
  { label: "Ocean", value: "modern-ocean", colour: "#315d7c" },
  { label: "Sage", value: "modern-sage", colour: "#6a7d68" },
  { label: "Wine", value: "modern-wine", colour: "#754455" },
  { label: "Sand", value: "modern-sand", colour: "#a28d70" },
  { label: "Graphite", value: "modern-graphite", colour: "#353b44" },
  { label: "Cloud", value: "modern-cloud", colour: "#d5d7d9" },
];

export const avatarV5Catalogue = {
  frames: avatarV5Frames,
  bodyPresets: avatarV5BodyPresets,
  facePresets: avatarV5FacePresets,
  eyeShapes: avatarV5EyeShapes,
  earPresets: avatarV5EarPresets,
  skinTones: avatarV5SkinTones,
  hairStyles: avatarV5HairStyles,
  hairColours: avatarV5HairColours,
  eyeColours: avatarV5EyeColours,
  facialHairStyles: avatarV5FacialHairStyles,
  topStyles: avatarV5TopStyles,
  bottomStyles: avatarV5BottomStyles,
  shoeStyles: avatarV5ShoeStyles,
  glassesStyles: avatarV5GlassesStyles,
  accessories: avatarV5Accessories,
  colourVariants: avatarV5ColourVariants,
} as const;

export function getAvatarV5SkinColour(id: AvatarV5SkinToneId) {
  return avatarV5SkinTones.find((option) => option.value === id)?.colour ?? avatarV5SkinTones[3].colour;
}

export function getAvatarV5HairColour(id: AvatarV5HairColourId) {
  return avatarV5HairColours.find((option) => option.value === id)?.colour ?? avatarV5HairColours[1].colour;
}

export function getAvatarV5PaletteColour(id: AvatarV5ColourVariantId) {
  return avatarV5ColourVariants.find((option) => option.value === id)?.colour ?? "#353b44";
}
