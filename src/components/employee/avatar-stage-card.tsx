import Link from "next/link";
import { FullBodyAvatar } from "@/components/employee/full-body-avatar";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { StoredAvatarConfig } from "@/components/avatar-3d/config/avatar-v4-parser";
import { getAvatarStage, getNextAvatarStage } from "@/lib/avatar-stage";
import { cx } from "@/lib/utils";

type AvatarStageCardProps = {
  currentLevel: number;
  progress: number;
  totalXp: number;
  xpToNextLevel: number;
  avatarConfig?: StoredAvatarConfig | null;
  className?: string;
  compact?: boolean;
  showEditAction?: boolean;
};

const accentClasses = {
  neutral: {
    ring: "border-white/15 bg-white/10 text-zinc-200",
    glow: "bg-zinc-300/20",
    line: "stroke-zinc-400",
  },
  blue: {
    ring: "border-blue-400/25 bg-blue-400/10 text-blue-300",
    glow: "bg-blue-500/25",
    line: "stroke-blue-500",
  },
  green: {
    ring: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    glow: "bg-emerald-500/25",
    line: "stroke-emerald-500",
  },
  amber: {
    ring: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    glow: "bg-amber-500/25",
    line: "stroke-amber-500",
  },
  black: {
    ring: "border-white/20 bg-white/10 text-white",
    glow: "bg-white/15",
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
        "relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0d1119] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,0.38)]",
        compact ? "sm:p-6" : "sm:p-8",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.045] via-transparent to-black/20" />
      <div className={cx("absolute -right-20 -top-24 h-64 w-64 rounded-full blur-3xl", accent.glow)} />
      <div className="relative grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="flex justify-center lg:justify-start">
          <div className={cx("relative", compact ? "h-72 w-56" : "h-[25rem] w-72")}>
            <div className="absolute inset-0 rounded-[44px] border border-white/10 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur" />
            <div className="absolute inset-x-5 bottom-5 top-8 rounded-[36px] border border-white/8 bg-gradient-to-br from-white/[0.08] to-white/[0.015] shadow-[0_24px_60px_rgba(0,0,0,0.28)]" />
            <div className={cx("absolute inset-x-12 bottom-10 h-24 rounded-full blur-2xl", accent.glow)} />
            <div className="absolute inset-x-0 bottom-7 flex justify-center">
              <FullBodyAvatar
                config={avatarConfig}
                compact={compact}
                level={currentLevel}
              />
            </div>
            <div className={cx("absolute left-8 top-8 h-10 w-10 rounded-2xl border", accent.ring)} />
            <div className={cx("absolute right-8 top-12 h-7 w-7 rounded-full opacity-70", accent.glow)} />
            <div
              className={cx(
                "absolute bottom-7 right-7 flex h-14 w-14 items-center justify-center rounded-2xl border text-base font-semibold shadow-[0_16px_34px_rgba(15,23,42,0.12)]",
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

          <div className="mt-6 rounded-3xl border border-white/9 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
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
