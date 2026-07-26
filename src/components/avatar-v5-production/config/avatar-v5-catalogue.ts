import type {
  AvatarV5BottomStyleId,
  AvatarV5ColourVariantId,
  AvatarV5HairColourId,
  AvatarV5HairStyleId,
  AvatarV5Option,
  AvatarV5ShoeStyleId,
  AvatarV5SkinToneId,
  AvatarV5TopStyleId,
} from "@/components/avatar-v5-production/config/avatar-v5-types";

export const avatarV5SkinTones: ReadonlyArray<
  AvatarV5Option<AvatarV5SkinToneId> & { colour: string }
> = [
  { label: "Porcelain", value: "porcelain", colour: "#f2cbb3" },
  { label: "Light warm", value: "light-warm", colour: "#deb08d" },
  { label: "Golden", value: "golden", colour: "#c99165" },
  { label: "Warm bronze", value: "warm-bronze", colour: "#b8754e" },
  { label: "Deep bronze", value: "deep-bronze", colour: "#91573b" },
  { label: "Deep", value: "deep", colour: "#704331" },
  { label: "Rich", value: "rich", colour: "#4c2e26" },
];

export const avatarV5HairStyles: ReadonlyArray<
  AvatarV5Option<AvatarV5HairStyleId>
> = [
  {
    label: "Approved long",
    value: "approved-long",
    description: "The approved V5 reference hairstyle.",
  },
  {
    label: "Double buns",
    value: "double-buns",
    description: "A compact tied style with a clear rear silhouette.",
  },
];

export const avatarV5HairColours: ReadonlyArray<
  AvatarV5Option<AvatarV5HairColourId> & { colour: string }
> = [
  { label: "Soft black", value: "soft-black", colour: "#171719" },
  { label: "Espresso", value: "espresso", colour: "#35231e" },
  { label: "Chestnut", value: "chestnut", colour: "#704229" },
  { label: "Auburn", value: "auburn", colour: "#7f3829" },
  { label: "Golden brown", value: "golden-brown", colour: "#a97842" },
  { label: "Silver", value: "silver", colour: "#a8a6a1" },
];

export const avatarV5TopStyles: ReadonlyArray<
  AvatarV5Option<AvatarV5TopStyleId>
> = [
  {
    label: "Heritage fitted",
    value: "heritage-fitted",
    description: "The approved fitted layered top.",
  },
  {
    label: "Ranger structured",
    value: "ranger-structured",
    description: "A more structured fitted silhouette.",
  },
];

export const avatarV5BottomStyles: ReadonlyArray<
  AvatarV5Option<AvatarV5BottomStyleId>
> = [
  {
    label: "Heritage trousers",
    value: "heritage-trousers",
    description: "The approved straight fitted lower layer.",
  },
  {
    label: "Ranger trousers",
    value: "ranger-trousers",
    description: "A slimmer panelled trouser silhouette.",
  },
];

export const avatarV5ShoeStyles: ReadonlyArray<
  AvatarV5Option<AvatarV5ShoeStyleId>
> = [
  {
    label: "Heritage boots",
    value: "heritage-boots",
    description: "The approved ankle boot.",
  },
  {
    label: "Ranger boots",
    value: "ranger-boots",
    description: "A taller structured boot.",
  },
];

export const avatarV5ColourVariants: ReadonlyArray<
  AvatarV5Option<AvatarV5ColourVariantId> & { colour: string }
> = [
  { label: "Original earth", value: "original", colour: "#4b3022" },
  { label: "Alternate slate", value: "alternate", colour: "#46505f" },
];

export const avatarV5Catalogue = {
  skinTones: avatarV5SkinTones,
  hairStyles: avatarV5HairStyles,
  hairColours: avatarV5HairColours,
  topStyles: avatarV5TopStyles,
  bottomStyles: avatarV5BottomStyles,
  shoeStyles: avatarV5ShoeStyles,
  colourVariants: avatarV5ColourVariants,
} as const;

export function getAvatarV5SkinColour(id: AvatarV5SkinToneId) {
  return (
    avatarV5SkinTones.find((option) => option.value === id)?.colour ??
    avatarV5SkinTones[3].colour
  );
}

export function getAvatarV5HairColour(id: AvatarV5HairColourId) {
  return (
    avatarV5HairColours.find((option) => option.value === id)?.colour ??
    avatarV5HairColours[1].colour
  );
}
