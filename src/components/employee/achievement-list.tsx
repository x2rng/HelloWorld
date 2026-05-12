import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import type { AchievementRecord, EmployeeAchievementRecord } from "@/lib/exp-types";

type AchievementListProps = {
  achievements: AchievementRecord[];
  unlockedAchievements: EmployeeAchievementRecord[];
};

export function AchievementList({
  achievements,
  unlockedAchievements,
}: AchievementListProps) {
  const unlockedIds = new Set(
    unlockedAchievements.map((achievement) => achievement.achievement_id),
  );

  return (
    <Card className="rounded-[36px] p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Achievements</p>
          <h3 className="mt-2 text-3xl">Starter recognition</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Small signals that your onboarding momentum is becoming visible.
          </p>
        </div>
        <BadgePill tone="amber">
          {unlockedAchievements.length} / {achievements.length}
        </BadgePill>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {achievements.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id);

          return (
            <div
              key={achievement.id}
              className="rounded-2xl border border-black/6 bg-white/70 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={isUnlocked ? "font-medium" : "font-medium text-[var(--color-muted)]"}>
                    {achievement.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                    {achievement.description}
                  </p>
                </div>
                <BadgePill tone={isUnlocked ? "green" : "neutral"}>
                  {isUnlocked ? "Unlocked" : "Locked"}
                </BadgePill>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
