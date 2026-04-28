import type { AvatarConfig, CategoryProgress, StoredUser } from "@/lib/types";

export const sampleAvatar: AvatarConfig = {
  avatarName: "LevelUp You",
  skinTone: "warm",
  hairStyle: "wave",
  hairColor: "brown",
  eyeColor: "blue",
  top: "jacket",
  bottom: "tailored",
  accessory: "glasses",
};

export const sampleCategoryPreview: CategoryProgress[] = [
  {
    key: "professional",
    title: "Professional Skills",
    level: 3,
    xp: 76,
    maxXp: 130,
    completion: 58,
    itemsCount: 6,
    badge: "Rising clarity",
    accent: "blue",
  },
  {
    key: "personal",
    title: "Personal Development",
    level: 2,
    xp: 62,
    maxXp: 125,
    completion: 50,
    itemsCount: 4,
    badge: "Momentum forming",
    accent: "green",
  },
  {
    key: "health",
    title: "Health & Fitness",
    level: 2,
    xp: 44,
    maxXp: 105,
    completion: 42,
    itemsCount: 3,
    badge: "Consistency pending",
    accent: "amber",
  },
];

export const sampleUserPreview: Pick<StoredUser, "account" | "progress"> = {
  account: {
    fullName: "Rron Gj",
    username: "rron",
    email: "rron@example.com",
    password: "",
  },
  progress: {
    totalXp: 320,
    completedActions: [],
    earnedAchievements: [],
    events: [],
    streakDays: 5,
  },
};
