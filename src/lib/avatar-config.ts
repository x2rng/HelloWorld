export type AvatarConfig = {
  skinTone: string;
  hairStyle: "short" | "side" | "curly" | "bob" | "coily" | "none";
  hairColor: string;
  topColor: string;
  bottomColor: string;
  glasses: boolean;
};

export const avatarOptions = {
  skinTones: [
    { label: "Porcelain", value: "#f6d7c3" },
    { label: "Warm", value: "#e8b98f" },
    { label: "Golden", value: "#c98f61" },
    { label: "Bronze", value: "#9b6545" },
    { label: "Deep", value: "#5f382b" },
  ],
  hairStyles: [
    { label: "Short", value: "short" },
    { label: "Side", value: "side" },
    { label: "Curly", value: "curly" },
    { label: "Bob", value: "bob" },
    { label: "Coily", value: "coily" },
    { label: "None", value: "none" },
  ],
  hairColors: [
    { label: "Black", value: "#171717" },
    { label: "Brown", value: "#5a3825" },
    { label: "Chestnut", value: "#7c4a2d" },
    { label: "Blonde", value: "#c99f45" },
    { label: "Silver", value: "#9ca3af" },
    { label: "Auburn", value: "#8a3f2b" },
  ],
  topColors: [
    { label: "Graphite", value: "#27272a" },
    { label: "Blue", value: "#2563eb" },
    { label: "Green", value: "#059669" },
    { label: "Sand", value: "#b9935a" },
    { label: "White", value: "#f8fafc" },
    { label: "Slate", value: "#475569" },
    { label: "Red", value: "#b91c1c" },
  ],
  bottomColors: [
    { label: "Black", value: "#18181b" },
    { label: "Navy", value: "#1e3a8a" },
    { label: "Stone", value: "#78716c" },
    { label: "Charcoal", value: "#374151" },
    { label: "Olive", value: "#4d5a36" },
  ],
} as const;

export const defaultAvatarConfig: AvatarConfig = {
  skinTone: avatarOptions.skinTones[1].value,
  hairStyle: "short",
  hairColor: avatarOptions.hairColors[1].value,
  topColor: avatarOptions.topColors[0].value,
  bottomColor: avatarOptions.bottomColors[0].value,
  glasses: false,
};

function allowedValue<T extends string>(
  value: unknown,
  options: ReadonlyArray<{ value: T }>,
  fallback: T,
) {
  return typeof value === "string" && options.some((option) => option.value === value)
    ? (value as T)
    : fallback;
}

export function normalizeAvatarConfig(value: unknown): AvatarConfig {
  if (!value || typeof value !== "object") {
    return defaultAvatarConfig;
  }

  const config = value as Partial<AvatarConfig>;

  return {
    skinTone: allowedValue(config.skinTone, avatarOptions.skinTones, defaultAvatarConfig.skinTone),
    hairStyle: allowedValue(config.hairStyle, avatarOptions.hairStyles, defaultAvatarConfig.hairStyle),
    hairColor: allowedValue(config.hairColor, avatarOptions.hairColors, defaultAvatarConfig.hairColor),
    topColor: allowedValue(config.topColor, avatarOptions.topColors, defaultAvatarConfig.topColor),
    bottomColor: allowedValue(config.bottomColor, avatarOptions.bottomColors, defaultAvatarConfig.bottomColor),
    glasses: typeof config.glasses === "boolean" ? config.glasses : defaultAvatarConfig.glasses,
  };
}
