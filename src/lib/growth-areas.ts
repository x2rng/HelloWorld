export const growthAreas = [
  {
    name: "Company Knowledge",
    description: "Understanding the company, its direction, values, and context.",
    tone: "blue",
  },
  {
    name: "Team Connection",
    description: "Building clarity and working relationships across your team.",
    tone: "purple",
  },
  {
    name: "Tools & Systems",
    description: "Becoming confident with the tools and processes behind the work.",
    tone: "cyan",
  },
  {
    name: "Role Readiness",
    description: "Developing the knowledge and confidence to contribute in your role.",
    tone: "green",
  },
  {
    name: "Culture & Ways of Working",
    description: "Learning how communication, decisions, and collaboration happen here.",
    tone: "orange",
  },
] as const;

export type GrowthAreaName = (typeof growthAreas)[number]["name"];
export type GrowthAreaTone = (typeof growthAreas)[number]["tone"];

const growthAreaRules: Array<{
  area: GrowthAreaName;
  keywords: string[];
}> = [
  {
    area: "Company Knowledge",
    keywords: ["company", "overview", "values"],
  },
  {
    area: "Team Connection",
    keywords: ["team", "manager", "collaboration"],
  },
  {
    area: "Tools & Systems",
    keywords: ["tool", "system", "process", "account"],
  },
  {
    area: "Role Readiness",
    keywords: ["role", "responsibility", "first contribution", "contribution"],
  },
  {
    area: "Culture & Ways of Working",
    keywords: ["culture", "ways of working", "communication"],
  },
];

export type GrowthAreaProgress = {
  name: GrowthAreaName;
  description: string;
  tone: GrowthAreaTone;
  completedSteps: number;
  totalSteps: number;
  progress: number;
};

export function isGrowthAreaName(value: unknown): value is GrowthAreaName {
  return growthAreas.some((area) => area.name === value);
}

export function getGrowthAreaDefinition(name: GrowthAreaName) {
  return growthAreas.find((area) => area.name === name) ?? growthAreas[3];
}

export function getGrowthAreaForStep(
  milestoneTitle: string,
  stepTitle: string,
): GrowthAreaName {
  const searchableText = `${milestoneTitle} ${stepTitle}`.toLowerCase();
  const match = growthAreaRules.find((rule) =>
    rule.keywords.some((keyword) => searchableText.includes(keyword)),
  );

  return match?.area ?? "Role Readiness";
}

export function buildGrowthAreaProgress(
  steps: Array<{ growthArea: GrowthAreaName; completed: boolean }>,
): GrowthAreaProgress[] {
  return growthAreas.map((area) => {
    const areaSteps = steps.filter((step) => step.growthArea === area.name);
    const completedSteps = areaSteps.filter((step) => step.completed).length;
    const totalSteps = areaSteps.length;

    return {
      ...area,
      completedSteps,
      totalSteps,
      progress:
        totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100),
    };
  });
}
