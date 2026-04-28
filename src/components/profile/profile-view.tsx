"use client";

import { AppFrame } from "@/components/layout/app-frame";
import { AvatarRenderer } from "@/components/avatar/avatar-renderer";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useApp } from "@/providers/app-provider";

export function ProfileView() {
  const { currentUser, derived } = useApp();

  if (!currentUser || !derived) return null;

  return (
    <AppFrame title="Your profile" subtitle="A shareable identity snapshot of how you are growing.">
      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-[36px] p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <AvatarRenderer avatar={currentUser.avatar!} size={220} className="rounded-[34px] p-8" />
            <h2 className="mt-6 text-4xl">{currentUser.account.fullName}</h2>
            <p className="mt-2 text-base text-[var(--color-muted)]">@{currentUser.account.username}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <BadgePill tone="blue">Level {derived.level.level}</BadgePill>
              <BadgePill tone="green">{currentUser.progress.streakDays}-day streak</BadgePill>
              <BadgePill tone="amber">{currentUser.progress.totalXp} XP</BadgePill>
            </div>
            <p className="mt-6 text-sm leading-6 text-[var(--color-muted)]">
              {derived.mainFocus} is your current center of gravity. The profile below shows where your momentum is strongest and
              where the next meaningful step is waiting.
            </p>
          </div>
        </Card>

        <div className="grid gap-5">
          <Card className="rounded-[36px] p-6 sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="eyebrow">Summary</p>
                <h2 className="mt-2 text-3xl">A better version of you is taking shape.</h2>
              </div>
              <BadgePill tone="blue">{derived.profileCompletion}% complete</BadgePill>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[26px] border border-black/6 bg-white/75 p-4">
                <p className="text-sm text-[var(--color-muted)]">Main focus</p>
                <p className="mt-2 text-xl font-semibold">{derived.mainFocus}</p>
              </div>
              <div className="rounded-[26px] border border-black/6 bg-white/75 p-4">
                <p className="text-sm text-[var(--color-muted)]">Weekly commitment</p>
                <p className="mt-2 text-xl font-semibold">{currentUser.onboarding?.weeklyCommitment}</p>
              </div>
              <div className="rounded-[26px] border border-black/6 bg-white/75 p-4">
                <p className="text-sm text-[var(--color-muted)]">Top skills</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentUser.onboarding?.topSkills.map((skill) => (
                    <BadgePill key={skill} tone="blue">
                      {skill}
                    </BadgePill>
                  ))}
                </div>
              </div>
              <div className="rounded-[26px] border border-black/6 bg-white/75 p-4">
                <p className="text-sm text-[var(--color-muted)]">Hobbies</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentUser.onboarding?.hobbies.map((hobby) => (
                    <BadgePill key={hobby} tone="amber">
                      {hobby}
                    </BadgePill>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-[36px] p-6 sm:p-8">
            <p className="eyebrow">Category breakdown</p>
            <h2 className="mt-2 text-3xl">Your profile grows in layers.</h2>
            <div className="mt-6 space-y-4">
              {derived.categories.map((category) => (
                <div key={category.key} className="rounded-[28px] border border-black/6 bg-white/75 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                      <p className="text-sm text-[var(--color-muted)]">Level {category.level}</p>
                    </div>
                    <BadgePill tone={category.accent}>{category.badge}</BadgePill>
                  </div>
                  <ProgressBar value={category.completion} tone={category.accent === "amber" ? "amber" : category.accent === "green" ? "green" : "blue"} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[36px] p-6 sm:p-8">
            <p className="eyebrow">Milestone history</p>
            <h2 className="mt-2 text-3xl">Recent progress events</h2>
            <div className="mt-6 space-y-3">
              {currentUser.progress.events.slice(0, 8).map((event) => (
                <div key={event.id} className="rounded-[24px] border border-black/6 bg-white/75 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-[var(--color-muted)]">
                        {new Date(event.createdAt).toLocaleDateString()} - {event.kind}
                      </p>
                    </div>
                    <BadgePill tone={event.kind === "achievement" ? "amber" : event.kind === "action" ? "green" : "blue"}>
                      +{event.xp} XP
                    </BadgePill>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}
