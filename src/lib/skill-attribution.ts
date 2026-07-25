export type SkillContribution = {
  skill: string;
  xp: number;
};

function normalizeSkillName(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, 60);
}

export function normalizeSkillFocus(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, string>();
  for (const item of value) {
    const skill = normalizeSkillName(item);
    if (skill) unique.set(skill.toLowerCase(), skill);
  }
  return [...unique.values()].slice(0, 30);
}

export function normalizeSkillContributions(value: unknown): SkillContribution[] {
  if (!Array.isArray(value)) return [];
  const totals = new Map<string, SkillContribution>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as { skill?: unknown; xp?: unknown };
    const skill = normalizeSkillName(record.skill);
    const parsedXp = typeof record.xp === "number" ? record.xp : Number(record.xp);
    if (!skill || !Number.isFinite(parsedXp)) continue;
    const xp = Math.min(100, Math.max(1, Math.round(parsedXp)));
    const key = skill.toLowerCase();
    const existing = totals.get(key);
    totals.set(key, { skill: existing?.skill ?? skill, xp: Math.min(100, (existing?.xp ?? 0) + xp) });
  }
  return [...totals.values()].slice(0, 20);
}
