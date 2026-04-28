"use client";

import Link from "next/link";
import { AvatarRenderer } from "@/components/avatar/avatar-renderer";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sampleAvatar, sampleCategoryPreview, sampleUserPreview } from "@/lib/mock-data";
import { getLevelInfo } from "@/lib/progression";
import { useApp } from "@/providers/app-provider";

export default function HomePage() {
  const { currentUser, derived } = useApp();
  const level = getLevelInfo(sampleUserPreview.progress.totalXp);

  return (
    <main className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="glass-panel rounded-[40px] px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            <div className="space-y-6">
              <BadgePill tone="blue">LevelUp prototype</BadgePill>
              <div className="space-y-4">
                <h1 className="max-w-[11ch] text-5xl leading-[0.92] sm:text-7xl">
                  Improve your real life. See it reflected back.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
                  LevelUp is a premium self-development system where your skills, habits, hobbies, and focus areas shape both
                  your growth dashboard and a digital avatar that evolves with you.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={currentUser ? (derived?.stage === "app" ? "/dashboard" : derived?.stage === "avatar" ? "/avatar" : "/onboarding") : "/register"}>
                  <Button size="lg">{currentUser ? "Continue" : "Create your profile"}</Button>
                </Link>
                <Link href={currentUser ? "/profile" : "/login"}>
                  <Button variant="secondary" size="lg">
                    {currentUser ? "View profile" : "Log in"}
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="rounded-[36px] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.75))] p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="eyebrow">Growth preview</p>
                  <h2 className="mt-2 text-3xl">Calm progress. Visible identity.</h2>
                </div>
                <AvatarRenderer avatar={sampleAvatar} size={124} className="rounded-[28px] p-4" />
              </div>
              <div className="rounded-[28px] bg-black/[0.03] p-5">
                <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
                  <span>Level {level.level}</span>
                  <span>{sampleUserPreview.progress.streakDays}-day streak</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-black/6">
                  <div className="h-full w-[61%] rounded-full bg-[var(--color-blue)]" />
                </div>
                <p className="mt-3 text-sm text-[var(--color-muted)]">320 / 520 XP to Level 5</p>
              </div>
              <div className="mt-5 grid gap-3">
                {sampleCategoryPreview.map((category) => (
                  <div key={category.key} className="rounded-[24px] border border-black/6 bg-white/75 p-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">{category.title}</span>
                      <span className="text-[var(--color-muted)]">{category.completion}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-black/6">
                      <div className="h-full rounded-full bg-[var(--color-blue)]" style={{ width: `${category.completion}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "Identity-first onboarding",
              copy: "Users define who they are, what matters now, and what kind of progress feels motivating.",
            },
            {
              title: "Avatar-led progression",
              copy: "Your avatar starts modestly and upgrades as your real-life profile becomes richer and more consistent.",
            },
            {
              title: "Retention through structure",
              copy: "Clear next actions, visible level progress, and category momentum invite users back without noise.",
            },
          ].map((item) => (
            <Card key={item.title} className="rounded-[32px] p-6">
              <p className="eyebrow">Why it works</p>
              <h2 className="mt-3 text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.copy}</p>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
