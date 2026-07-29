import type { SkillIcon } from "@/lib/skills";

export type PlayerAvatar2DSummary = {
  employeeName: string;
  role: string;
  level: number;
  totalXp: number;
  xpToNextLevel: number;
  levelProgress: number;
};

export type PlayerAvatar2DSkillGroup = {
  name: "Core skills" | "Role skills" | "Personal growth skills";
  skills: Array<{
    name: string;
    icon: SkillIcon;
    level: number;
    progress: number;
    source?: string;
  }>;
};
