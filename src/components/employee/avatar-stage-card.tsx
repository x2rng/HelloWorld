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
    fill: "fill-zinc-500",
    suit: "fill-zinc-200",
    suitDark: "fill-zinc-500",
  },
  blue: {
    ring: "border-blue-200 bg-blue-50 text-blue-700",
    glow: "bg-blue-300/40",
    line: "stroke-blue-500",
    fill: "fill-blue-500",
    suit: "fill-blue-100",
    suitDark: "fill-blue-600",
  },
  green: {
    ring: "border-emerald-200 bg-emerald-50 text-emerald-700",
    glow: "bg-emerald-300/40",
    line: "stroke-emerald-500",
    fill: "fill-emerald-500",
    suit: "fill-emerald-100",
    suitDark: "fill-emerald-600",
  },
  amber: {
    ring: "border-amber-200 bg-amber-50 text-amber-700",
    glow: "bg-amber-300/40",
    line: "stroke-amber-500",
    fill: "fill-amber-500",
    suit: "fill-amber-100",
    suitDark: "fill-amber-600",
  },
  black: {
    ring: "border-zinc-900 bg-zinc-950 text-white",
    glow: "bg-zinc-900/20",
    line: "stroke-zinc-900",
    fill: "fill-zinc-950",
    suit: "fill-zinc-200",
    suitDark: "fill-zinc-950",
  },
} as const;

function StageMotif({
  accent,
  motif,
}: {
  accent: (typeof accentClasses)[keyof typeof accentClasses];
  motif: ReturnType<typeof getAvatarStage>["motif"];
}) {
  if (motif === "path") {
    return (
      <path
        d="M66 52 C82 38 104 46 112 30 C120 46 144 38 154 54"
        className={cx("fill-none stroke-[5] stroke-linecap-round", accent.line)}
      />
    );
  }

  if (motif === "frame") {
    return (
      <path
        d="M72 52 H148 M72 52 V76 M148 52 V76"
        className={cx("fill-none stroke-[5] stroke-linecap-round stroke-linejoin-round", accent.line)}
      />
    );
  }

  if (motif === "check") {
    return (
      <path
        d="M83 55 L103 74 L143 34"
        className={cx("fill-none stroke-[6] stroke-linecap-round stroke-linejoin-round", accent.line)}
      />
    );
  }

  if (motif === "crown") {
    return (
      <path
        d="M76 64 L92 42 L110 62 L128 42 L144 64"
        className={cx("fill-none stroke-[6] stroke-linecap-round stroke-linejoin-round", accent.line)}
      />
    );
  }

  return <circle cx="110" cy="48" r="7" className={accent.fill} opacity="0.72" />;
}

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
          <div className={cx("relative", compact ? "h-52 w-52" : "h-56 w-56 sm:h-72 sm:w-72")}>
            <div className="absolute inset-2 rounded-[48px] border border-white/80 bg-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur" />
            <div className="absolute inset-7 rounded-[38px] border border-black/5 bg-gradient-to-br from-white/95 to-white/35 shadow-[0_24px_60px_rgba(15,23,42,0.12)]" />
            <div className={cx("absolute inset-x-10 bottom-8 h-24 rounded-full blur-2xl", accent.glow)} />
            <svg
              viewBox="0 0 240 240"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label={`${stage.name} avatar stage`}
            >
              <defs>
                <linearGradient id={`portrait-skin-${stage.symbol}`} x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fff7ed" />
                  <stop offset="100%" stopColor="#e7c8a7" />
                </linearGradient>
                <linearGradient id={`portrait-shirt-${stage.symbol}`} x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e5e7eb" />
                </linearGradient>
              </defs>
              <rect x="38" y="34" width="164" height="172" rx="44" fill="white" opacity="0.62" />
              <circle cx="120" cy="118" r="76" fill="white" opacity="0.48" />
              <StageMotif accent={accent} motif={stage.motif} />
              <path
                d="M59 203 C72 166 91 148 120 148 C149 148 168 166 181 203"
                className={cx(accent.suit)}
              />
              <path
                d="M72 203 C83 170 98 154 120 154 C142 154 157 170 168 203"
                className={cx(accent.suitDark)}
                opacity={stage.name === "Starter" ? "0.28" : "0.9"}
              />
              <path
                d="M96 157 L120 188 L144 157"
                fill={`url(#portrait-shirt-${stage.symbol})`}
                opacity={stage.name === "Starter" ? "0.55" : "1"}
              />
              <path
                d="M98 153 L88 184 M142 153 L152 184"
                className={cx("fill-none stroke-[5] stroke-linecap-round", accent.line)}
                opacity={stage.name === "Starter" ? "0.25" : "0.95"}
              />
              <path
                d="M91 104 C88 78 101 59 122 59 C146 59 157 78 152 105 C148 130 138 146 120 146 C102 146 94 130 91 104Z"
                fill={`url(#portrait-skin-${stage.symbol})`}
                stroke="white"
                strokeWidth="5"
              />
              <path
                d="M91 96 C96 70 111 56 132 61 C144 64 153 76 153 97 C142 88 130 83 116 84 C105 85 96 89 91 96Z"
                className={cx(accent.suitDark)}
                opacity={stage.name === "Ready" ? "0.95" : "0.78"}
              />
              <path
                d="M102 111 C106 108 110 108 113 111 M128 111 C132 108 136 108 140 111"
                className="fill-none stroke-zinc-700 stroke-[3] stroke-linecap-round"
                opacity="0.7"
              />
              <path
                d="M111 130 C117 135 125 135 131 130"
                className="fill-none stroke-zinc-700 stroke-[3] stroke-linecap-round"
                opacity={stage.name === "Starter" ? "0.38" : "0.65"}
              />
              <path
                d="M120 117 L117 126 H123"
                className="fill-none stroke-zinc-500 stroke-[2] stroke-linecap-round stroke-linejoin-round"
                opacity="0.38"
              />
              <path
                d="M67 187 C83 202 101 210 120 210 C139 210 157 202 173 187"
                className={cx("fill-none stroke-[4] stroke-linecap-round", accent.line)}
                opacity={stage.name === "Starter" ? "0.28" : "0.75"}
              />
              {stage.name === "Achiever" || stage.name === "Ready" ? (
                <g>
                  <circle cx="168" cy="82" r="18" fill="white" opacity="0.9" />
                  <path
                    d="M159 82 L166 89 L178 74"
                    className={cx("fill-none stroke-[4] stroke-linecap-round stroke-linejoin-round", accent.line)}
                  />
                </g>
              ) : null}
              {stage.name === "Explorer" ? (
                <path
                  d="M61 154 C82 144 92 130 100 112"
                  strokeDasharray="7 8"
                  className={cx("fill-none stroke-[4] stroke-linecap-round", accent.line)}
                />
              ) : null}
            </svg>
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
        </div>
      </div>
    </section>
  );
}
