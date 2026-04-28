import type {
  AchievementDefinition,
  AvatarConfig,
  CategoryKey,
  CategoryProgress,
  DashboardAction,
  DerivedUserView,
  LevelInfo,
  OnboardingData,
  StoredUser,
} from "@/lib/types";
import { clamp } from "@/lib/utils";

const LEVEL_THRESHOLDS = [0, 100, 220, 360, 520, 700, 900, 1120, 1360, 1620, 1900];

const ACTION_LIBRARY: DashboardAction[] = [
  { id: "skill-story", title: "Add a skill story", reason: "Give your strongest skill a visible narrative.", xp: 40, category: "professional" },
  { id: "learning-sprint", title: "Set a 7-day learning sprint", reason: "Short timelines create momentum and measurable progress.", xp: 45, category: "learning" },
  { id: "fitness-setup", title: "Complete your fitness setup", reason: "A clear physical target makes the profile feel real.", xp: 35, category: "health" },
  { id: "hobby-project", title: "Define your hobby project", reason: "Turning interests into projects makes growth tangible.", xp: 35, category: "hobbies" },
  { id: "reflection-check", title: "Write your weekly reflection", reason: "Reflection converts effort into clarity.", xp: 30, category: "personal" },
  { id: "milestone-map", title: "Map your next milestone", reason: "Visible milestones make your next level feel close.", xp: 40, category: "professional" },
];

const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: "identity-builder", title: "Identity Builder", description: "Complete your onboarding and define your direction.", xp: 50, tone: "blue" },
  { id: "first-triad", title: "Focus Locked", description: "Choose the first three skills you want to improve.", xp: 40, tone: "blue" },
  { id: "avatar-awakened", title: "Avatar Awakened", description: "Create the version of you that growth will shape.", xp: 50, tone: "amber" },
  { id: "habit-starter", title: "Habit Starter", description: "Complete your first dashboard action.", xp: 50, tone: "green" },
  { id: "wellness-initiate", title: "Wellness Initiate", description: "Activate health tracking in your profile.", xp: 40, tone: "green" },
  { id: "multi-potential", title: "Multi-Potential", description: "Add at least three hobbies or interest lanes.", xp: 45, tone: "amber" },
  { id: "clarity-of-focus", title: "Clarity of Focus", description: "Choose a main personal growth priority.", xp: 45, tone: "blue" },
  { id: "streak-three", title: "3-Day Streak", description: "Build a three-step momentum streak.", xp: 60, tone: "amber" },
  { id: "balanced-profile", title: "Balanced Profile", description: "Bring all growth categories above 35%.", xp: 65, tone: "green" },
  { id: "profile-architect", title: "Profile 80%", description: "Reach 80% profile completion.", xp: 70, tone: "blue" },
  { id: "rising-creator", title: "Rising Creator", description: "Push the hobbies category beyond 60%.", xp: 55, tone: "amber" },
  { id: "learning-momentum", title: "Learning Momentum", description: "Push the learning category beyond 60%.", xp: 55, tone: "blue" },
];

const AVATAR_UNLOCKS = [
  { level: 2, label: "Structured jacket" },
  { level: 3, label: "Silver frames" },
  { level: 4, label: "Sport fit bottoms" },
  { level: 5, label: "Headband accent" },
  { level: 7, label: "Deep palette bundle" },
  { level: 9, label: "Founder silhouette" },
];

export function getLevelInfo(totalXp: number): LevelInfo {
  const levelIndex = LEVEL_THRESHOLDS.findLastIndex((threshold) => totalXp >= threshold);
  const level = Math.max(1, levelIndex + 1);
  const currentXp = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const nextLevelXp = LEVEL_THRESHOLDS[level] ?? null;
  const progress = nextLevelXp ? clamp(((totalXp - currentXp) / (nextLevelXp - currentXp)) * 100, 0, 100) : 100;
  return { level, currentXp, nextLevelXp, progress };
}

export function createStarterAvatar(name: string): AvatarConfig {
  return {
    avatarName: name,
    skinTone: "warm",
    hairStyle: "short",
    hairColor: "ink",
    eyeColor: "graphite",
    top: "tee",
    bottom: "relaxed",
    accessory: "none",
  };
}

export function getUserStage(user?: StoredUser | null) {
  if (!user?.onboarding) return "onboarding";
  if (!user.avatar) return "avatar";
  return "app";
}

function categoryScoreMap(user: StoredUser): Record<CategoryKey, { points: number; max: number; items: number }> {
  const onboarding = user.onboarding;
  const completed = new Set(user.progress.completedActions);
  if (!onboarding) {
    return {
      professional: { points: 0, max: 130, items: 0 },
      personal: { points: 0, max: 125, items: 0 },
      health: { points: 0, max: 105, items: 0 },
      hobbies: { points: 0, max: 120, items: 0 },
      learning: { points: 0, max: 110, items: 0 },
    };
  }

  return {
    professional: {
      points: (onboarding.selectedSkills.length > 0 ? 25 : 0) + (onboarding.topSkills.length === 3 ? 35 : 0) + (completed.has("skill-story") ? 30 : 0) + (completed.has("milestone-map") ? 40 : 0),
      max: 130,
      items: onboarding.selectedSkills.length + onboarding.topSkills.length,
    },
    personal: {
      points: (onboarding.personalPriorities.length > 0 ? 25 : 0) + (onboarding.mainPersonalFocus ? 35 : 0) + (completed.has("reflection-check") ? 30 : 0) + (user.progress.streakDays >= 3 ? 35 : 0),
      max: 125,
      items: onboarding.personalPriorities.length,
    },
    health: {
      points: (onboarding.trackHealth ? 40 : 15) + (onboarding.healthFocusArea ? 20 : 0) + (completed.has("fitness-setup") ? 35 : 0) + (user.progress.streakDays >= 4 ? 10 : 0),
      max: 105,
      items: onboarding.trackHealth ? 2 : 1,
    },
    hobbies: {
      points: (onboarding.hobbies.length > 0 ? 20 : 0) + (onboarding.primaryHobby ? 30 : 0) + (completed.has("hobby-project") ? 35 : 0) + (user.avatar ? 20 : 0) + (completed.has("milestone-map") ? 15 : 0),
      max: 120,
      items: onboarding.hobbies.length,
    },
    learning: {
      points: (onboarding.weeklyCommitment ? 20 : 0) + (onboarding.focusAreas.includes("Learning new skills") ? 20 : 0) + (completed.has("learning-sprint") ? 40 : 0) + (completed.has("skill-story") ? 30 : 0),
      max: 110,
      items: onboarding.topSkills.length,
    },
  };
}

export function getCategoryProgress(user: StoredUser): CategoryProgress[] {
  const map = categoryScoreMap(user);
  return [
    { key: "professional", title: "Professional Skills", level: Math.max(1, Math.ceil((map.professional.points / map.professional.max) * 5)), xp: map.professional.points, maxXp: map.professional.max, completion: Math.round((map.professional.points / map.professional.max) * 100), itemsCount: map.professional.items, badge: map.professional.points > 80 ? "Focus compounding" : "Structure in progress", accent: "blue" },
    { key: "personal", title: "Personal Development", level: Math.max(1, Math.ceil((map.personal.points / map.personal.max) * 5)), xp: map.personal.points, maxXp: map.personal.max, completion: Math.round((map.personal.points / map.personal.max) * 100), itemsCount: map.personal.items, badge: map.personal.points > 75 ? "Discipline forming" : "Momentum gathering", accent: "green" },
    { key: "health", title: "Health & Fitness", level: Math.max(1, Math.ceil((map.health.points / map.health.max) * 5)), xp: map.health.points, maxXp: map.health.max, completion: Math.round((map.health.points / map.health.max) * 100), itemsCount: map.health.items, badge: map.health.points > 55 ? "Body in motion" : "Foundation pending", accent: "green" },
    { key: "hobbies", title: "Creative / Hobby Interests", level: Math.max(1, Math.ceil((map.hobbies.points / map.hobbies.max) * 5)), xp: map.hobbies.points, maxXp: map.hobbies.max, completion: Math.round((map.hobbies.points / map.hobbies.max) * 100), itemsCount: map.hobbies.items, badge: map.hobbies.points > 70 ? "Identity expanding" : "Expression opening", accent: "amber" },
    { key: "learning", title: "Learning Goals", level: Math.max(1, Math.ceil((map.learning.points / map.learning.max) * 5)), xp: map.learning.points, maxXp: map.learning.max, completion: Math.round((map.learning.points / map.learning.max) * 100), itemsCount: map.learning.items, badge: map.learning.points > 70 ? "Growth cadence set" : "Next sprint ready", accent: "blue" },
  ];
}

export function getProfileCompletion(user: StoredUser) {
  const onboarding = user.onboarding;
  const avatar = user.avatar;
  let score = 10;
  if (onboarding) {
    score += onboarding.focusAreas.length > 0 ? 10 : 0;
    score += onboarding.selectedSkills.length > 0 ? 10 : 0;
    score += onboarding.topSkills.length === 3 ? 10 : 0;
    score += onboarding.personalPriorities.length > 0 ? 10 : 0;
    score += onboarding.mainPersonalFocus ? 10 : 0;
    score += onboarding.hobbies.length > 0 ? 10 : 0;
    score += onboarding.primaryHobby ? 5 : 0;
    score += onboarding.motivationStyles.length > 0 ? 5 : 0;
    score += onboarding.weeklyCommitment ? 5 : 0;
  }
  if (avatar) {
    score += avatar.avatarName ? 5 : 0;
    score += avatar.top ? 5 : 0;
    score += avatar.accessory ? 5 : 0;
  }
  score += Math.min(user.progress.completedActions.length * 2, 10);
  return clamp(score, 0, 100);
}

export function getRecommendedActions(user: StoredUser): DashboardAction[] {
  const completed = new Set(user.progress.completedActions);
  const onboarding = user.onboarding;
  return ACTION_LIBRARY.filter((action) => !completed.has(action.id))
    .filter((action) => (action.id === "fitness-setup" ? Boolean(onboarding?.trackHealth) : Boolean(onboarding)))
    .slice(0, 5);
}

function getAchievementIds(user: StoredUser, categories: CategoryProgress[], profileCompletion: number) {
  const unlocked = new Set<string>();
  const completedActions = new Set(user.progress.completedActions);
  const allAbove35 = categories.every((category) => category.completion >= 35);
  const learning = categories.find((category) => category.key === "learning")?.completion ?? 0;
  const hobbies = categories.find((category) => category.key === "hobbies")?.completion ?? 0;
  if (user.onboarding) unlocked.add("identity-builder");
  if (user.onboarding?.topSkills.length === 3) unlocked.add("first-triad");
  if (user.avatar) unlocked.add("avatar-awakened");
  if (completedActions.size >= 1) unlocked.add("habit-starter");
  if (user.onboarding?.trackHealth) unlocked.add("wellness-initiate");
  if ((user.onboarding?.hobbies.length ?? 0) >= 3) unlocked.add("multi-potential");
  if (user.onboarding?.mainPersonalFocus) unlocked.add("clarity-of-focus");
  if (user.progress.streakDays >= 3) unlocked.add("streak-three");
  if (allAbove35) unlocked.add("balanced-profile");
  if (profileCompletion >= 80) unlocked.add("profile-architect");
  if (hobbies >= 60) unlocked.add("rising-creator");
  if (learning >= 60) unlocked.add("learning-momentum");
  return unlocked;
}

function buildAchievements(user: StoredUser, categories: CategoryProgress[], profileCompletion: number) {
  const ids = getAchievementIds(user, categories, profileCompletion);
  const unlocked = ACHIEVEMENTS.filter((achievement) => ids.has(achievement.id));
  const locked = ACHIEVEMENTS.filter((achievement) => !ids.has(achievement.id));
  return { unlocked, nextUp: locked.slice(0, 3), locked: locked.slice(3) };
}

export function buildDerivedUserView(user: StoredUser): DerivedUserView {
  const categories = getCategoryProgress(user);
  const profileCompletion = getProfileCompletion(user);
  const achievements = buildAchievements(user, categories, profileCompletion);
  const level = getLevelInfo(user.progress.totalXp);
  const strongest = [...categories].sort((a, b) => b.completion - a.completion)[0];
  const weakest = [...categories].sort((a, b) => a.completion - b.completion)[0];
  const nextUnlock = AVATAR_UNLOCKS.find((unlock) => unlock.level > level.level) ?? null;
  return {
    firstName: user.account.fullName.split(" ")[0] ?? user.account.fullName,
    stage: getUserStage(user),
    level,
    profileCompletion,
    categories,
    achievements,
    actions: getRecommendedActions(user),
    totalUnlockedAvatarItems: AVATAR_UNLOCKS.filter((unlock) => unlock.level <= level.level).length + 4,
    nextUnlock,
    weeklyInsight: {
      strongest: strongest.title,
      needsAttention: weakest.title,
      suggestion:
        weakest.key === "health"
          ? "A light physical target would make this profile feel more grounded."
          : weakest.key === "learning"
            ? "A short learning sprint would turn intent into momentum."
            : "One focused milestone here would make the next level feel much closer.",
    },
    mainFocus: user.onboarding?.focusAreas[0] ?? "Personal growth",
  };
}

export function computePrototypeStreak(user: StoredUser) {
  const base = (user.onboarding ? 1 : 0) + (user.avatar ? 1 : 0) + user.progress.completedActions.length;
  return clamp(base, 0, 7);
}

function createEvent(title: string, xp: number, category: CategoryKey | "account", kind: "milestone" | "achievement" | "action" | "system") {
  return {
    id: `${title}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    title,
    xp,
    category,
    kind,
    createdAt: new Date().toISOString(),
  };
}

function awardEvent(user: StoredUser, title: string, xp: number, category: CategoryKey | "account", kind: "milestone" | "achievement" | "action" | "system") {
  user.progress.events.unshift(createEvent(title, xp, category, kind));
  user.progress.totalXp += xp;
}

export function applyOnboarding(user: StoredUser, onboarding: OnboardingData) {
  const next = structuredClone(user);
  const isFirstCompletion = !next.onboarding;
  next.onboarding = onboarding;
  if (isFirstCompletion) {
    awardEvent(next, "Completed onboarding", 100, "account", "milestone");
    awardEvent(next, "Chose top three skills", 30, "professional", "milestone");
    awardEvent(next, "Defined personal focus", 30, "personal", "milestone");
    awardEvent(next, "Built hobby direction", 20, "hobbies", "milestone");
    if (onboarding.trackHealth) awardEvent(next, "Added fitness direction", 20, "health", "milestone");
  }
  next.progress.streakDays = computePrototypeStreak(next);
  return syncAchievements(next);
}

export function applyAvatar(user: StoredUser, avatar: AvatarConfig) {
  const next = structuredClone(user);
  const firstAvatar = !next.avatar;
  next.avatar = avatar;
  if (firstAvatar) awardEvent(next, "Created avatar", 50, "account", "milestone");
  next.progress.streakDays = computePrototypeStreak(next);
  return syncAchievements(next);
}

export function applyCompletedAction(user: StoredUser, actionId: string) {
  const action = ACTION_LIBRARY.find((item) => item.id === actionId);
  if (!action || user.progress.completedActions.includes(actionId)) return user;
  const next = structuredClone(user);
  next.progress.completedActions.push(actionId);
  awardEvent(next, action.title, action.xp, action.category, "action");
  next.progress.streakDays = computePrototypeStreak(next);
  return syncAchievements(next);
}

function syncAchievements(user: StoredUser) {
  const next = structuredClone(user);
  let pending = true;
  while (pending) {
    pending = false;
    const categories = getCategoryProgress(next);
    const profileCompletion = getProfileCompletion(next);
    const unlockedIds = getAchievementIds(next, categories, profileCompletion);
    for (const achievement of ACHIEVEMENTS) {
      if (unlockedIds.has(achievement.id) && !next.progress.earnedAchievements.includes(achievement.id)) {
        next.progress.earnedAchievements.push(achievement.id);
        awardEvent(next, achievement.title, achievement.xp, "account", "achievement");
        pending = true;
      }
    }
  }
  next.updatedAt = new Date().toISOString();
  return next;
}
