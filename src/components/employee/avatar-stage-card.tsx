import Link from "next/link";
import { FullBodyAvatar } from "@/components/employee/full-body-avatar";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { AvatarConfig } from "@/lib/avatar-config";
import { getAvatarStage, getNextAvatarStage } from "@/lib/avatar-stage";
import { cx } from "@/lib/utils";

type AvatarStageCardProps = {
  currentLevel: number;
  progress: number;
  totalXp: number;
  xpToNextLevel: number;
  avatarConfig?: AvatarConfig | null;
  className?: string;
  compact?: boolean;
  showEditAction?: boolean;
};

const accentClasses = {
  neutral: {
    ring: "border-zinc-200 bg-zinc-100 text-zinc-700",
    glow: "bg-zinc-300/40",
    line: "stroke-zinc-400",
  },
  blue: {
    ring: "border-blue-200 bg-blue-50 text-blue-700",
    glow: "bg-blue-300/40",
    line: "stroke-blue-500",
  },
  green: {
    ring: "border-emerald-200 bg-emerald-50 text-emerald-700",
    glow: "bg-emerald-300/40",
    line: "stroke-emerald-500",
  },
  amber: {
    ring: "border-amber-200 bg-amber-50 text-amber-700",
    glow: "bg-amber-300/40",
    line: "stroke-amber-500",
  },
  black: {
    ring: "border-zinc-900 bg-zinc-950 text-white",
    glow: "bg-zinc-900/20",
    line: "stroke-zinc-900",
  },
} as const;

export function AvatarStageCard({
  currentLevel,
  progress,
  totalXp,
  xpToNextLevel,
  avatarConfig,
  className,
  compact = false,
  showEditAction = false,
}: AvatarStageCardProps) {
  const stage = getAvatarStage(currentLevel);
  const nextStage = getNextAvatarStage(currentLevel);
  const accent = accentClasses[stage.accent];

  return (
    <section
      className={cx(
        "relative overflow-hidden rounded-[36px] border border-black/6 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]",
        compact ? "sm:p-6" : "sm:p-8",
        className,
      )}
    >
      <div className={cx("absolute inset-0 bg-gradient-to-br opacity-80", stage.gradient)} />
      <div className={cx("absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl", accent.glow)} />
      <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex justify-center lg:justify-start">
          <div className={cx("relative", compact ? "h-64 w-52" : "h-80 w-64 sm:h-96 sm:w-72")}>
            <div className="absolute inset-2 rounded-[48px] border border-white/80 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur" />
            <div className="absolute inset-7 rounded-[38px] border border-black/5 bg-gradient-to-br from-white/95 to-white/35 shadow-[0_24px_60px_rgba(15,23,42,0.12)]" />
            <div className={cx("absolute inset-x-10 bottom-12 h-24 rounded-full blur-2xl", accent.glow)} />
            <div className="absolute inset-x-0 bottom-10 flex justify-center">
              <FullBodyAvatar config={avatarConfig} compact={compact} />
            </div>
            <div className={cx("absolute left-8 top-8 h-14 w-14 rounded-2xl border bg-white/80", accent.ring)} />
            <div className={cx("absolute right-8 top-14 h-8 w-8 rounded-full", accent.glow)} />
            <div
              className={cx(
                "absolute bottom-5 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl border text-lg font-semibold shadow-[0_16px_34px_rgba(15,23,42,0.12)]",
                accent.ring,
              )}
            >
              {stage.symbol}
            </div>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <BadgePill tone={stage.accent === "green" ? "green" : stage.accent === "amber" ? "amber" : "blue"}>
              {stage.levelLabel}
            </BadgePill>
            <BadgePill tone="neutral">{totalXp} XP earned</BadgePill>
          </div>
          <p className="eyebrow mt-5">Avatar stage</p>
          <h2 className={cx("mt-2", compact ? "text-3xl" : "text-5xl")}>{stage.name}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            {stage.headline} {stage.description}
          </p>

          <div className="mt-6 rounded-3xl border border-black/6 bg-white/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">
                {nextStage ? `Next stage: ${nextStage.name}` : "Highest V1 stage reached"}
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                {nextStage ? `${xpToNextLevel} XP remaining` : "Ready"}
              </p>
            </div>
            <ProgressBar value={progress} tone={nextStage ? "amber" : "green"} className="mt-3" />
          </div>

          {showEditAction ? (
            <Link href="/employee/avatar" className="mt-5 inline-flex">
              <Button variant="secondary">Edit avatar</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
