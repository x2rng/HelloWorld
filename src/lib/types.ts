export type IdentityStage =
  | "Student"
  | "Professional"
  | "Freelancer"
  | "Job Seeker"
  | "Creator"
  | "Entrepreneur"
  | "Other";

export type FocusArea =
  | "Career growth"
  | "Learning new skills"
  | "Fitness and health"
  | "Better habits"
  | "Creativity / hobbies"
  | "Confidence / discipline";

export type PersonalPriority =
  | "Discipline"
  | "Consistency"
  | "Confidence"
  | "Focus"
  | "Time Management"
  | "Emotional Control"
  | "Communication"
  | "Resilience"
  | "Creativity";

export type HealthFocus =
  | "Strength"
  | "General fitness"
  | "Weight management"
  | "Mobility"
  | "Consistency"
  | "Sports performance";

export type MotivationStyle =
  | "Visible progress"
  | "Unlocking rewards"
  | "Streaks"
  | "Competing with others"
  | "Personal goals"
  | "Completing milestones";

export type WeeklyCommitment = "1-2 hours" | "3-5 hours" | "5-8 hours" | "8+ hours";

export type CategoryKey =
  | "professional"
  | "personal"
  | "health"
  | "hobbies"
  | "learning";

export type ActivityKind = "milestone" | "achievement" | "action" | "system";

export interface AccountSetup {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface OnboardingData {
  currentStage: IdentityStage;
  focusAreas: FocusArea[];
  selectedSkills: string[];
  topSkills: string[];
  personalPriorities: PersonalPriority[];
  mainPersonalFocus: PersonalPriority;
  trackHealth: boolean;
  healthFocusArea?: HealthFocus;
  hobbies: string[];
  primaryHobby: string;
  motivationStyles: MotivationStyle[];
  weeklyCommitment: WeeklyCommitment;
}

export interface AvatarConfig {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  top: string;
  bottom: string;
  accessory: string;
  avatarName: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  xp: number;
  category: CategoryKey | "account";
  kind: ActivityKind;
  createdAt: string;
}

export interface UserProgress {
  totalXp: number;
  completedActions: string[];
  earnedAchievements: string[];
  events: ActivityEvent[];
  streakDays: number;
}

export interface StoredUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  account: AccountSetup;
  onboarding?: OnboardingData;
  avatar?: AvatarConfig;
  progress: UserProgress;
}

export interface AppStore {
  currentUserId: string | null;
  users: Record<string, StoredUser>;
}

export interface CategoryProgress {
  key: CategoryKey;
  title: string;
  level: number;
  xp: number;
  maxXp: number;
  completion: number;
  itemsCount: number;
  badge: string;
  accent: "blue" | "green" | "amber";
}

export interface LevelInfo {
  level: number;
  currentXp: number;
  nextLevelXp: number | null;
  progress: number;
}

export interface DashboardAction {
  id: string;
  title: string;
  reason: string;
  xp: number;
  category: CategoryKey;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  xp: number;
  tone: "blue" | "green" | "amber";
}

export interface DerivedUserView {
  firstName: string;
  stage: "onboarding" | "avatar" | "app";
  level: LevelInfo;
  profileCompletion: number;
  categories: CategoryProgress[];
  achievements: {
    unlocked: AchievementDefinition[];
    nextUp: AchievementDefinition[];
    locked: AchievementDefinition[];
  };
  actions: DashboardAction[];
  totalUnlockedAvatarItems: number;
  nextUnlock: {
    level: number;
    label: string;
  } | null;
  weeklyInsight: {
    strongest: string;
    needsAttention: string;
    suggestion: string;
  };
  mainFocus: string;
}
