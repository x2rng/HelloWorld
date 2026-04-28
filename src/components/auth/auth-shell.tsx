import Link from "next/link";
import { AvatarRenderer } from "@/components/avatar/avatar-renderer";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { sampleAvatar, sampleCategoryPreview, sampleUserPreview } from "@/lib/mock-data";
import { getLevelInfo } from "@/lib/progression";

export function AuthShell({
  eyebrow,
  title,
  description,
  footer,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const level = getLevelInfo(sampleUserPreview.progress.totalXp);

  return (
    <main className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-6 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel flex flex-col justify-between rounded-[36px] px-6 py-7 sm:px-8 sm:py-8">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
              <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-white">L</span>
              LevelUp
            </Link>
            <div className="space-y-4">
              <p className="eyebrow">Self-growth operating system</p>
              <h1 className="max-w-[10ch] text-5xl leading-[0.92] sm:text-6xl">
                Build the version of yourself you want to return to.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[var(--color-muted)] sm:text-lg">
                LevelUp turns focus, habits, skills, and hobbies into a premium progression experience. Every meaningful step
                strengthens both your profile and your avatar.
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-[30px] bg-white/75 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Preview</p>
                  <h2 className="mt-2 text-2xl">{sampleUserPreview.account.fullName}</h2>
                </div>
                <AvatarRenderer avatar={sampleAvatar} size={112} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
                  <span>Level {level.level}</span>
                  <span>{sampleUserPreview.progress.streakDays}-day streak</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-black/6">
                  <div className="h-full w-[64%] rounded-full bg-[var(--color-blue)]" />
                </div>
                <p className="text-sm text-[var(--color-muted)]">320 / 520 XP to the next unlock</p>
              </div>
            </Card>

            <Card className="rounded-[30px] bg-white/75 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="eyebrow">Growth lanes</p>
                  <h2 className="mt-2 text-2xl">Structured progress feels motivating.</h2>
                </div>
                <BadgePill tone="amber">Preview state</BadgePill>
              </div>
              <div className="space-y-3">
                {sampleCategoryPreview.map((category) => (
                  <div key={category.key} className="rounded-3xl border border-black/6 bg-white/65 px-4 py-3">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">{category.title}</span>
                      <span className="text-[var(--color-muted)]">Level {category.level}</span>
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

        <section className="flex items-center">
          <Card className="w-full rounded-[36px] bg-white/92 p-6 sm:p-8">
            <div className="mb-6">
              <p className="eyebrow">{eyebrow}</p>
              <h2 className="mt-3 text-4xl leading-tight">{title}</h2>
              <p className="mt-3 max-w-lg text-base leading-7 text-[var(--color-muted)]">{description}</p>
            </div>
            {children}
            <div className="mt-6 border-t soft-divider pt-5 text-sm text-[var(--color-muted)]">{footer}</div>
          </Card>
        </section>
      </div>
    </main>
  );
}
