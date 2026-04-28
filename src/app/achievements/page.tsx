"use client";

import { AppFrame } from "@/components/layout/app-frame";
import { RouteGate } from "@/components/auth/route-gate";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { useApp } from "@/providers/app-provider";

function AchievementsPageBody() {
  const { currentUser, derived } = useApp();

  if (!currentUser || !derived) return null;

  return (
    <AppFrame title="Achievements" subtitle="Visible proof of clarity, momentum, and consistency.">
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[36px] p-6 sm:p-8">
          <p className="eyebrow">Unlocked</p>
          <h2 className="mt-2 text-3xl">What you have already earned.</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {derived.achievements.unlocked.map((achievement) => (
              <div key={achievement.id} className="rounded-[28px] border border-black/6 bg-white/80 p-4">
                <BadgePill tone={achievement.tone}>+{achievement.xp} XP</BadgePill>
                <h3 className="mt-4 text-lg font-semibold">{achievement.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{achievement.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[36px] p-6 sm:p-8">
          <p className="eyebrow">Still to unlock</p>
          <h2 className="mt-2 text-3xl">The next shape of your profile.</h2>
          <div className="mt-6 space-y-4">
            {[...derived.achievements.nextUp, ...derived.achievements.locked].map((achievement) => (
              <div key={achievement.id} className="rounded-[28px] border border-dashed border-black/10 bg-black/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{achievement.description}</p>
                  </div>
                  <BadgePill tone="neutral">Locked</BadgePill>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppFrame>
  );
}

export default function AchievementsPage() {
  return (
    <RouteGate mode="app">
      <AchievementsPageBody />
    </RouteGate>
  );
}
