export type AvatarStageName = "Starter" | "Explorer" | "Builder" | "Achiever" | "Ready";

export type AvatarStage = {
  name: AvatarStageName;
  levelLabel: string;
  accent: "neutral" | "blue" | "green" | "amber" | "black";
  symbol: string;
  headline: string;
  description: string;
  gradient: string;
};

const avatarStages = [
  {
    minLevel: 1,
    name: "Starter",
    levelLabel: "Level 1",
    accent: "neutral",
    symbol: "01",
    headline: "Your onboarding identity is taking shape.",
    description: "Begin with the essentials and create steady early momentum.",
    gradient: "from-zinc-50 via-white to-zinc-200",
  },
  {
    minLevel: 2,
    name: "Explorer",
    levelLabel: "Level 2",
    accent: "blue",
    symbol: "02",
    headline: "You are learning the role with visible momentum.",
    description: "Keep discovering how the company, tools, and expectations connect.",
    gradient: "from-blue-50 via-white to-slate-200",
  },
  {
    minLevel: 3,
    name: "Builder",
    levelLabel: "Level 3",
    accent: "green",
    symbol: "03",
    headline: "You are building confidence through completed work.",
    description: "Your progress is becoming structured, repeatable, and measurable.",
    gradient: "from-emerald-50 via-white to-stone-200",
  },
  {
    minLevel: 4,
    name: "Achiever",
    levelLabel: "Level 4",
    accent: "amber",
    symbol: "04",
    headline: "You are showing ownership across the journey.",
    description: "The strongest onboarding signals are now turning into capability.",
    gradient: "from-amber-50 via-white to-zinc-200",
  },
  {
    minLevel: 5,
    name: "Ready",
    levelLabel: "Level 5+",
    accent: "black",
    symbol: "05",
    headline: "You are ready for the next growth path.",
    description: "Your onboarding profile reflects preparation, clarity, and progress.",
    gradient: "from-zinc-100 via-white to-neutral-300",
  },
] as const satisfies Array<AvatarStage & { minLevel: number }>;

export function getAvatarStage(currentLevel: number): AvatarStage {
  return (
    [...avatarStages].reverse().find((stage) => currentLevel >= stage.minLevel) ??
    avatarStages[0]
  );
}

export function getNextAvatarStage(currentLevel: number): AvatarStage | null {
  return avatarStages.find((stage) => stage.minLevel > currentLevel) ?? null;
}
