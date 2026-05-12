export const levelThresholds = [
  { level: 1, xp: 0 },
  { level: 2, xp: 100 },
  { level: 3, xp: 250 },
  { level: 4, xp: 500 },
  { level: 5, xp: 800 },
] as const;

export function getLevelInfo(totalXp: number) {
  const current =
    [...levelThresholds].reverse().find((threshold) => totalXp >= threshold.xp) ??
    levelThresholds[0];
  const next = levelThresholds.find((threshold) => threshold.xp > totalXp) ?? null;
  const previousXp = current.xp;
  const nextXp = next?.xp ?? current.xp;
  const progress =
    next && nextXp > previousXp
      ? Math.round(((totalXp - previousXp) / (nextXp - previousXp)) * 100)
      : 100;

  return {
    level: current.level,
    totalXp,
    nextLevel: next?.level ?? null,
    xpIntoLevel: totalXp - previousXp,
    xpForNextLevel: next ? nextXp - previousXp : 0,
    xpToNextLevel: next ? nextXp - totalXp : 0,
    progress,
  };
}
