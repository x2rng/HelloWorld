import { BadgePill } from "@/components/ui/badge-pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getAvatarStage, getNextAvatarStage } from "@/lib/avatar-stage";
import { cx } from "@/lib/utils";

type AvatarStageCardProps = {
  currentLevel: number;
  progress: number;
  totalXp: number;
  xpToNextLevel: number;
  className?: string;
  compact?: boolean;
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
  className,
  compact = false,
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
          <div className="relative h-52 w-52 sm:h-64 sm:w-64">
            <div className="absolute inset-6 rounded-[42px] border border-white/80 bg-white/55 shadow-inner backdrop-blur" />
            <div className="absolute inset-0 rounded-full border border-black/5 bg-white/45" />
            <div className="absolute inset-10 rounded-full border border-black/10 bg-gradient-to-br from-white to-black/5" />
            <svg
              viewBox="0 0 220 220"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label={`${stage.name} avatar stage`}
            >
              <circle cx="110" cy="110" r="72" fill="white" opacity="0.72" />
              <path
                d="M72 140 C86 105 92 86 110 86 C128 86 134 105 148 140"
                className={cx("fill-none stroke-[10] stroke-linecap-round", accent.line)}
              />
              <circle cx="110" cy="74" r="26" fill="white" stroke="currentColor" strokeOpacity="0.14" strokeWidth="2" />
              <path d="M78 155 H142" className={cx("fill-none stroke-[8] stroke-linecap-round", accent.line)} />
              <path d="M92 52 L110 34 L128 52" className={cx("fill-none stroke-[6] stroke-linecap-round stroke-linejoin-round", accent.line)} />
              <circle cx="70" cy="84" r="5" fill="currentColor" opacity="0.22" />
              <circle cx="150" cy="84" r="5" fill="currentColor" opacity="0.22" />
              <circle cx="110" cy="172" r="4" fill="currentColor" opacity="0.18" />
            </svg>
            <div
              className={cx(
                "absolute bottom-4 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl border text-lg font-semibold shadow-sm",
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
        </div>
      </div>
    </section>
  );
}
