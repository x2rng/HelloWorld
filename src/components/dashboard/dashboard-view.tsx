"use client";

import Link from "next/link";
import { AppFrame } from "@/components/layout/app-frame";
import { AvatarRenderer } from "@/components/avatar/avatar-renderer";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatXp } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

export function DashboardView() {
  const { currentUser, derived, completeAction } = useApp();

  if (!currentUser || !derived) return null;

  const nextAction = derived.actions[0];

  return (
    <AppFrame title={`Good evening, ${derived.firstName}`} subtitle="Progress becomes visible when it is structured.">
      <section className="grid gap-5 xl:grid-cols-[1.28fr_0.72fr]">
        <Card className="rounded-[36px] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.82))] p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <BadgePill tone="blue">Level {derived.level.level}</BadgePill>
              <h2 className="max-w-[12ch] text-4xl leading-[0.95] sm:text-5xl">Your current focus: {derived.mainFocus}</h2>
              <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">
                You&apos;re building a profile with direction. A few more deliberate steps and the next unlock becomes visible.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[26px] bg-black/[0.03] p-4">
                  <p className="text-sm text-[var(--color-muted)]">Total XP</p>
                  <p className="mt-2 text-2xl font-semibold">{currentUser.progress.totalXp}</p>
                </div>
                <div className="rounded-[26px] bg-black/[0.03] p-4">
                  <p className="text-sm text-[var(--color-muted)]">Current streak</p>
                  <p className="mt-2 text-2xl font-semibold">{currentUser.progress.streakDays}-day</p>
                </div>
                <div className="rounded-[26px] bg-black/[0.03] p-4">
                  <p className="text-sm text-[var(--color-muted)]">Profile completion</p>
                  <p className="mt-2 text-2xl font-semibold">{derived.profileCompletion}%</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-[30px] bg-black/[0.03] p-5">
              <AvatarRenderer avatar={currentUser.avatar!} size={132} className="rounded-[30px] p-4" />
              <div className="text-center">
                <p className="text-sm text-[var(--color-muted)]">Avatar preview</p>
                <p className="mt-1 text-lg font-semibold">{currentUser.avatar?.avatarName}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
              <span>{currentUser.progress.totalXp - derived.level.currentXp} XP in this level</span>
              <span>{currentUser.progress.totalXp} / {derived.level.nextLevelXp ?? currentUser.progress.totalXp}</span>
            </div>
            <ProgressBar value={derived.level.progress} className="h-3" />
          </div>

          {nextAction ? (
            <div className="mt-8 flex flex-col gap-4 rounded-[30px] border border-black/6 bg-[var(--color-blue-soft)] p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="eyebrow">Next recommended action</p>
                <h3 className="mt-2 text-2xl">{nextAction.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{nextAction.reason}</p>
              </div>
              <Button size="lg" onClick={() => completeAction(nextAction.id)}>
                Complete next milestone
              </Button>
            </div>
          ) : null}
        </Card>

        <Card className="rounded-[36px] p-6 sm:p-8">
          <p className="eyebrow">This week</p>
          <h2 className="mt-3 text-3xl">Calm, clear, and close to the next unlock.</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[26px] bg-white/75 p-4">
              <p className="text-sm text-[var(--color-muted)]">Strongest category</p>
              <p className="mt-2 text-xl font-semibold">{derived.weeklyInsight.strongest}</p>
            </div>
            <div className="rounded-[26px] bg-white/75 p-4">
              <p className="text-sm text-[var(--color-muted)]">Needs attention</p>
              <p className="mt-2 text-xl font-semibold">{derived.weeklyInsight.needsAttention}</p>
            </div>
            <div className="rounded-[26px] bg-white/75 p-4">
              <p className="text-sm text-[var(--color-muted)]">Suggested next move</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]">{derived.weeklyInsight.suggestion}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="rounded-[36px] p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="eyebrow">Today / this week</p>
              <h2 className="mt-2 text-3xl">Recommended actions</h2>
            </div>
            <BadgePill tone="amber">{derived.actions.length} open</BadgePill>
          </div>
          <div className="space-y-3">
            {derived.actions.map((action) => (
              <div key={action.id} className="rounded-[28px] border border-black/6 bg-white/78 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{action.title}</h3>
                      <BadgePill tone="amber">+{action.xp} XP</BadgePill>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{action.reason}</p>
                  </div>
                  <Button variant="secondary" onClick={() => completeAction(action.id)}>
                    Complete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[36px] p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="eyebrow">Avatar upgrades</p>
              <h2 className="mt-2 text-3xl">Progress changes how you look.</h2>
            </div>
            <BadgePill tone="green">{derived.totalUnlockedAvatarItems} unlocked</BadgePill>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[30px] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72))] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--color-muted)]">Current look</p>
                  <p className="mt-2 text-2xl font-semibold">{currentUser.avatar?.avatarName}</p>
                </div>
                <AvatarRenderer avatar={currentUser.avatar!} size={110} className="rounded-[26px] p-4" />
              </div>
            </div>
            <div className="rounded-[28px] border border-black/6 bg-white/75 p-4">
              <p className="text-sm text-[var(--color-muted)]">Next avatar unlock</p>
              <p className="mt-2 text-xl font-semibold">
                {derived.nextUnlock ? `Level ${derived.nextUnlock.level}: ${derived.nextUnlock.label}` : "All preview unlocks earned"}
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Real-life consistency is what turns cosmetic upgrades into something meaningful.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-5">
        <Card className="rounded-[36px] p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="eyebrow">Category progression</p>
              <h2 className="mt-2 text-3xl">Multiple growth paths, one coherent profile.</h2>
            </div>
            <Link href="/profile" className="text-sm font-medium text-[var(--color-blue)]">
              View full profile
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
            {derived.categories.map((category) => (
              <div key={category.key} className="rounded-[28px] border border-black/6 bg-white/75 p-4">
                <BadgePill tone={category.accent}>{category.badge}</BadgePill>
                <h3 className="mt-4 text-xl">{category.title}</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Level {category.level}</p>
                <div className="mt-4">
                  <ProgressBar value={category.completion} tone={category.accent === "amber" ? "amber" : category.accent === "green" ? "green" : "blue"} />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-[var(--color-muted)]">
                  <span>{formatXp(category.xp)}</span>
                  <span>{category.itemsCount} items</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <Card className="rounded-[36px] p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="eyebrow">Achievements</p>
                <h2 className="mt-2 text-3xl">Proof that your profile is taking shape.</h2>
              </div>
              <Link href="/achievements" className="text-sm font-medium text-[var(--color-blue)]">
                See all
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {derived.achievements.unlocked.slice(0, 6).map((achievement) => (
                <div key={achievement.id} className="rounded-[28px] border border-black/6 bg-white/75 p-4">
                  <BadgePill tone={achievement.tone}>+{achievement.xp} XP</BadgePill>
                  <h3 className="mt-4 text-lg font-semibold">{achievement.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{achievement.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid gap-5">
            <Card className="rounded-[36px] p-6 sm:p-8">
              <p className="eyebrow">Near unlocks</p>
              <h2 className="mt-2 text-3xl">A little more structure and these open up.</h2>
              <div className="mt-5 space-y-3">
                {derived.achievements.nextUp.map((achievement) => (
                  <div key={achievement.id} className="rounded-[26px] border border-dashed border-black/10 bg-black/[0.02] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="mt-1 text-sm text-[var(--color-muted)]">{achievement.description}</p>
                      </div>
                      <BadgePill tone="amber">Soon</BadgePill>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[36px] p-6 sm:p-8">
              <p className="eyebrow">Coming next</p>
              <h2 className="mt-2 text-3xl">Skill verification and circles.</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                Proof-based skill validation and lightweight friend circles are planned. For now, the structure is ready and
                your personal growth loop already works.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </AppFrame>
  );
}
