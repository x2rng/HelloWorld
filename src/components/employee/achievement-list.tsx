import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import type { AchievementRecord, EmployeeAchievementRecord } from "@/lib/exp-types";

type AchievementListProps = {
  achievements: AchievementRecord[];
  unlockedAchievements: EmployeeAchievementRecord[];
};

function employeeAchievementDescription(description: string) {
  return description
    .replace(/onboarding tasks/gi, "journey steps")
    .replace(/onboarding task/gi, "growth step")
    .replace(/tasks/gi, "growth steps")
    .replace(/task/gi, "growth step");
}

export function AchievementList({
  achievements,
  unlockedAchievements,
}: AchievementListProps) {
  const unlockedIds = new Set(
    unlockedAchievements.map((achievement) => achievement.achievement_id),
  );
  const unlockedById = new Map(
    unlockedAchievements.map((achievement) => [
      achievement.achievement_id,
      achievement,
    ]),
  );
  const recentUnlocked = achievements
    .filter((achievement) => unlockedIds.has(achievement.id))
    .sort((left, right) => {
      const leftDate = unlockedById.get(left.id)?.unlocked_at ?? "";
      const rightDate = unlockedById.get(right.id)?.unlocked_at ?? "";
      return rightDate.localeCompare(leftDate);
    })
    .slice(0, 3);
  const nextAchievements = achievements
    .filter((achievement) => !unlockedIds.has(achievement.id))
    .slice(0, 2);

  return (
    <Card className="rounded-[36px] p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Proof of growth</p>
          <h3 className="mt-2 text-3xl">Achievements in your EXP story</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Each achievement records a meaningful point in the growth you have already built.
          </p>
        </div>
        <BadgePill tone="amber">
          {unlockedAchievements.length} / {achievements.length}
        </BadgePill>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <p className="text-sm font-semibold">Recently unlocked</p>
          <div className="mt-3 space-y-3">
            {recentUnlocked.length > 0 ? (
              recentUnlocked.map((achievement) => (
                <div
                  key={achievement.id}
                  className="rounded-3xl border border-emerald-400/15 bg-[var(--color-green-soft)] p-4 shadow-[inset_0_1px_0_rgba(100,217,154,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-sm text-[var(--color-green)]">
                        ✓
                      </span>
                      <div>
                        <p className="font-medium">{achievement.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                          {employeeAchievementDescription(achievement.description)}
                        </p>
                      </div>
                    </div>
                    <BadgePill tone="green">Unlocked</BadgePill>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-4">
                <p className="font-medium">Your first achievement is within reach.</p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                  Complete the next growth step to begin building your progress record.
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold">Next to unlock</p>
          <div className="mt-3 space-y-3">
            {nextAchievements.length > 0 ? (
              nextAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="rounded-3xl border border-white/8 bg-white/[0.025] p-4"
                >
                  <p className="font-medium text-[var(--color-muted)]">
                    {achievement.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                    {employeeAchievementDescription(achievement.description)}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-4 text-sm text-[var(--color-muted)]">
                Every available starter achievement is unlocked.
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
