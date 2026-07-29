export type CompanionSkillIcon =
  | "people"
  | "target"
  | "book"
  | "tool"
  | "spark";

export type CompanionSkillItem = {
  name: string;
  icon: CompanionSkillIcon;
  level: number;
  progress: number;
  source?: string;
};

export type CompanionSkillGroup = {
  name: "Core skills" | "Role skills" | "Personal growth skills";
  skills: CompanionSkillItem[];
};

export type CompanionPlayerSummary = {
  employeeName: string;
  role: string;
  level: number;
  totalXp: number;
  xpToNextLevel: number | null;
  levelProgress: number;
  stage: string;
};
