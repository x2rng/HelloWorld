import type { AvatarConfig } from "@/lib/avatar-config";
import { normalizeAvatarConfig } from "@/lib/avatar-config";
import {
  getRoleTemplateSkills,
  isRoleFocus,
  normalizeAssignedSkills,
  normalizeRoleFocus,
  type RoleFocus,
} from "@/lib/skills";

export const playerInterestOptions = [
  "Fitness",
  "Running",
  "Walking",
  "Meditation",
  "Reading",
  "Learning",
  "Creativity",
  "Music",
  "Gaming",
  "Travel",
  "Cooking",
  "Volunteering",
  "Personal Finance",
  "Photography",
  "Writing",
] as const;

export const growthPriorityOptions = [
  "Communication",
  "Collaboration",
  "Focus",
  "Discipline",
  "Confidence",
  "Adaptability",
  "Wellbeing",
  "Leadership",
  "Creativity",
  "Technical Growth",
  "Professional Knowledge",
  "Time Management",
] as const;

export function normalizePlayerSelections(value: unknown, limit: number) {
  if (!Array.isArray(value)) return [];

  const selections = new Map<string, string>();
  for (const item of value) {
    if (typeof item !== "string") continue;
    const normalized = item.trim().replace(/\s+/g, " ").slice(0, 60);
    if (normalized) selections.set(normalized.toLowerCase(), normalized);
  }

  return [...selections.values()].slice(0, limit);
}

export type PlayerSetupProfile = {
  roleFocus: RoleFocus;
  assignedSkills: string[];
  hasCompanyAssignedIdentity: boolean;
  interests: string[];
  growthPriorities: string[];
  avatarConfig: AvatarConfig;
};

export function normalizePlayerSetupProfile(value: {
  role_focus?: unknown;
  assigned_skills?: unknown;
  interests?: unknown;
  growth_priorities?: unknown;
  avatar_config?: unknown;
}): PlayerSetupProfile {
  const assignedSkills = normalizeAssignedSkills(value.assigned_skills);
  const hasCompanyAssignedIdentity =
    isRoleFocus(value.role_focus) && assignedSkills.length > 0;
  const roleFocus = normalizeRoleFocus(value.role_focus);

  return {
    roleFocus,
    assignedSkills:
      assignedSkills.length > 0
        ? assignedSkills
        : getRoleTemplateSkills(roleFocus),
    hasCompanyAssignedIdentity,
    interests: normalizePlayerSelections(value.interests, 20),
    growthPriorities: normalizePlayerSelections(value.growth_priorities, 5),
    avatarConfig: normalizeAvatarConfig(value.avatar_config),
  };
}
