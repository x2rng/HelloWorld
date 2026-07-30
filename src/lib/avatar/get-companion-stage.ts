import type { CompanionStage } from "@/lib/avatar/companion-types";

export type CompanionStageDefinition = {
  id: CompanionStage;
  label: string;
  levelRange: string;
};

const stageDefinitions: Record<CompanionStage, CompanionStageDefinition> = {
  starter: {
    id: "starter",
    label: "Starter",
    levelRange: "Levels 1–2",
  },
  explorer: {
    id: "explorer",
    label: "Explorer",
    levelRange: "Levels 3–5",
  },
  builder: {
    id: "builder",
    label: "Builder",
    levelRange: "Level 6+",
  },
};

export function getCompanionStage(level: number): CompanionStageDefinition {
  const safeLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1;
  if (safeLevel >= 6) return stageDefinitions.builder;
  if (safeLevel >= 3) return stageDefinitions.explorer;
  return stageDefinitions.starter;
}

export const companionStageDefinitions = Object.values(stageDefinitions);
