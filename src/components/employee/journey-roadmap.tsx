"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { completeTask } from "@/app/employee/onboarding/actions";
import { PixelCompanion } from "@/components/avatar/pixel-companion";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import type {
  CompanionStage,
  CompanionState,
  PixelCompanionConfig,
} from "@/lib/avatar/companion-types";
import type {
  JourneyRoadmapMilestone,
  JourneyRoadmapTask,
  RoadmapMilestoneState,
  RoadmapTaskState,
} from "@/lib/journey-roadmap";
import { cx } from "@/lib/utils";

type JourneyRoadmapProps = {
  assignmentId: string;
  track: {
    title: string;
    description: string | null;
    skillFocus: string[];
  };
  milestones: JourneyRoadmapMilestone[];
  journeyComplete: boolean;
  completedTasks: number;
  totalTasks: number;
  overallPercent: number;
  recentCompletion?: boolean;
  level: {
    current: number;
    totalXp: number;
    progress: number;
    nextLevel: number | null;
    xpToNextLevel: number;
  };
  companion: {
    config: PixelCompanionConfig;
    stage: CompanionStage;
  };
};

const milestoneStatePresentation: Record<
  RoadmapMilestoneState,
  { label: string; description: string }
> = {
  completed: {
    label: "Completed",
    description: "This milestone is complete and ready to review.",
  },
  current: {
    label: "In progress",
    description: "This is where your onboarding journey is moving forward.",
  },
  available_next: {
    label: "Up next",
    description: "This milestone follows your current work.",
  },
  locked: {
    label: "Locked",
    description: "Complete the previous milestone to unlock this stage.",
  },
};

const taskStatePresentation: Record<RoadmapTaskState, string> = {
  completed: "Completed",
  next: "Next",
  available: "Available",
  locked: "Locked",
};

function StatusIcon({
  state,
  className,
}: {
  state: RoadmapMilestoneState;
  className?: string;
}) {
  if (state === "completed") {
    return (
      <svg
        viewBox="0 0 20 20"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m5 10.5 3 3 7-7" />
      </svg>
    );
  }

  if (state === "locked") {
    return (
      <svg
        viewBox="0 0 20 20"
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4.5" y="8.5" width="11" height="8" rx="2" />
        <path d="M7 8.5V6.8a3 3 0 0 1 6 0v1.7" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {state === "current" ? (
        <>
          <circle cx="10" cy="10" r="5.5" />
          <circle cx="10" cy="10" r="1.7" fill="currentColor" stroke="none" />
        </>
      ) : (
        <>
          <path d="M4 10h11" />
          <path d="m11 6 4 4-4 4" />
        </>
      )}
    </svg>
  );
}

function MilestoneStatusBadge({ state }: { state: RoadmapMilestoneState }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em]",
        state === "completed" &&
          "border-emerald-300/10 bg-emerald-300/[0.035] text-emerald-100/60",
        state === "current" &&
          "border-blue-300/24 bg-blue-300/10 text-blue-100",
        state === "available_next" &&
          "border-cyan-300/13 bg-cyan-300/[0.045] text-cyan-100/72",
        state === "locked" &&
          "border-white/7 bg-white/[0.025] text-white/32",
      )}
    >
      {milestoneStatePresentation[state].label}
    </span>
  );
}

function TaskSubmitButton({ primary }: { primary: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="sm"
      variant={primary ? "primary" : "secondary"}
      disabled={pending}
      className={cx(
        "min-w-36",
        primary && "shadow-[0_12px_30px_rgba(59,130,246,0.18)]",
      )}
    >
      {pending
        ? "Saving..."
        : primary
          ? "Complete next task"
          : "Complete task"}
    </Button>
  );
}

function TaskStateBadge({ state }: { state: RoadmapTaskState }) {
  return (
    <span
      className={cx(
        "shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em]",
        state === "completed" &&
          "border-emerald-300/9 bg-emerald-300/[0.035] text-emerald-100/58",
        state === "next" &&
          "border-blue-300/22 bg-blue-300/10 text-blue-100",
        state === "available" &&
          "border-white/9 bg-white/[0.035] text-white/50",
        state === "locked" &&
          "border-white/6 bg-white/[0.02] text-white/28",
      )}
    >
      {taskStatePresentation[state]}
    </span>
  );
}

function TaskCard({
  assignmentId,
  task,
}: {
  assignmentId: string;
  task: JourneyRoadmapTask;
}) {
  const isNext = task.state === "next";
  const isCompleted = task.state === "completed";

  return (
    <article
      className={cx(
        "rounded-[20px] border",
        isNext &&
          "border-blue-300/28 bg-blue-300/[0.07] p-4 shadow-[0_16px_42px_rgba(59,130,246,0.09)]",
        isCompleted &&
          "border-emerald-300/7 bg-emerald-300/[0.015] p-3.5",
        task.state === "available" &&
          "border-white/8 bg-white/[0.025] p-3.5",
        task.state === "locked" &&
          "border-white/6 bg-white/[0.015] p-3.5 text-white/58",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4
            className={cx(
              "font-semibold",
              isCompleted ? "text-white/72" : "text-white",
            )}
          >
            {task.title}
          </h4>
          {!isCompleted ? (
            <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
              {task.description ??
                "Complete this task to continue your onboarding progress."}
            </p>
          ) : null}
        </div>
        <TaskStateBadge state={task.state} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full border border-blue-300/10 bg-blue-300/[0.035] px-2.5 py-1 text-blue-100/66">
          {task.growthArea}
        </span>
        {task.xpReward ? (
          <span className="font-semibold text-cyan-200/72">
            +{task.xpReward} XP
          </span>
        ) : null}
      </div>

      {task.skillContributions.length > 0 ? (
        <div className={cx(isCompleted ? "mt-2.5" : "mt-3")}>
          {!isCompleted ? (
            <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-white/30">
              Skill contribution
            </p>
          ) : null}
          <div className={cx("flex flex-wrap gap-2", !isCompleted && "mt-2")}>
            {task.skillContributions.map((contribution) => (
              <span
                key={contribution.skill}
                className="rounded-full border border-purple-300/10 bg-purple-300/[0.035] px-2.5 py-1 text-xs text-purple-100/68"
              >
                {contribution.skill} · +{contribution.xp} XP
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {task.canComplete ? (
        <form
          action={completeTask.bind(null, assignmentId, task.id)}
          className="mt-4"
        >
          <TaskSubmitButton primary={isNext} />
        </form>
      ) : null}
    </article>
  );
}

function MilestoneDetails({
  assignmentId,
  milestone,
  panelId,
}: {
  assignmentId: string;
  milestone: JourneyRoadmapMilestone;
  panelId: string;
}) {
  const presentation = milestoneStatePresentation[milestone.state];
  const nextTask = milestone.tasks.find((task) => task.state === "next") ?? null;
  const completionDate = milestone.completedAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
        new Date(milestone.completedAt),
      )
    : null;

  return (
    <div>
      <div className="border-b border-white/7 px-5 pb-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <MilestoneStatusBadge state={milestone.state} />
          {completionDate ? (
            <span className="text-xs text-white/32">
              Completed {completionDate}
            </span>
          ) : null}
        </div>
        <h2
          id={panelId}
          className="mt-3 pr-10 text-2xl leading-tight text-white sm:text-3xl"
        >
          {milestone.title}
        </h2>
        <p className="mt-2.5 text-sm leading-6 text-[var(--color-muted)]">
          {milestone.description ??
            "A focused stage within your onboarding journey."}
        </p>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/8 bg-white/[0.025] px-3 py-1.5 text-xs font-medium text-white/65">
            {milestone.completedTasks}/{milestone.totalTasks} tasks
          </span>
          <span className="rounded-full border border-white/8 bg-white/[0.025] px-3 py-1.5 text-xs font-medium text-white/65">
            {milestone.progress}%
          </span>
          {(milestone.state === "completed"
            ? milestone.earnedXp
            : milestone.totalXp) > 0 ? (
            <span className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.035] px-3 py-1.5 text-xs font-medium text-cyan-100/72">
              {milestone.state === "completed"
                ? `${milestone.earnedXp} XP earned`
                : `${milestone.totalXp} XP available`}
            </span>
          ) : null}
        </div>

        {milestone.state === "current" ? (
          <div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-blue-100/80">
                Milestone progress
              </span>
              <span className="text-white/38">{milestone.progress}%</span>
            </div>
            <ProgressBar value={milestone.progress} tone="blue" className="mt-2" />
          </div>
        ) : null}

        {nextTask ? (
          <div className="rounded-[21px] border border-blue-300/16 bg-blue-300/[0.045] p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-blue-100/60">
              Continue your next step
            </p>
            <p className="mt-1.5 font-semibold text-white">{nextTask.title}</p>
            <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
              The next recommended task is emphasized below.
            </p>
          </div>
        ) : null}

        {milestone.skillFocus.length > 0 ? (
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-white/30">
              Skill focus
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {milestone.skillFocus.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-purple-300/10 bg-purple-300/[0.035] px-2.5 py-1 text-xs text-purple-100/68"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {milestone.state === "completed" ? (
          <div className="rounded-[21px] border border-emerald-300/9 bg-emerald-300/[0.03] p-4">
            <p className="text-sm font-semibold text-emerald-100/74">
              This milestone is complete
            </p>
            <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
              You completed every task in this milestone
              {milestone.earnedXp > 0
                ? ` and earned ${milestone.earnedXp} XP.`
                : "."}
            </p>
          </div>
        ) : null}

        {milestone.state === "available_next" ? (
          <div className="rounded-[21px] border border-cyan-300/10 bg-cyan-300/[0.03] p-4">
            <p className="text-sm font-semibold text-cyan-100/72">Up next</p>
            <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
              {milestone.precedingMilestoneTitle
                ? `Complete “${milestone.precedingMilestoneTitle}” before starting this milestone.`
                : "Complete your current milestone before starting this one."}
            </p>
          </div>
        ) : null}

        {milestone.state === "locked" ? (
          <div className="rounded-[21px] border border-white/7 bg-white/[0.02] p-4">
            <p className="text-sm font-semibold text-white/65">
              Locked until the previous milestone is complete
            </p>
            <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
              {milestone.precedingMilestoneTitle
                ? `Complete “${milestone.precedingMilestoneTitle}” to unlock this milestone.`
                : "Complete the milestones before this one to unlock it."}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-white">
                {milestone.state === "completed"
                  ? "Completed tasks"
                  : "Milestone tasks"}
              </h3>
              <span className="text-xs text-white/32">
                {milestone.totalTasks} total
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {milestone.tasks.length > 0 ? (
                milestone.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    assignmentId={assignmentId}
                    task={task}
                  />
                ))
              ) : (
                <div className="rounded-[21px] border border-white/7 bg-white/[0.02] p-4">
                  <p className="text-sm font-semibold text-white/65">
                    No tasks are available yet.
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
                    This milestone is visible on your roadmap, but its tasks have
                    not been prepared.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {milestone.state === "completed" ? (
          <Link
            href="/employee/player"
            className="inline-flex text-sm font-semibold text-blue-200/78 transition hover:text-blue-100"
          >
            View achievements and proof of growth
          </Link>
        ) : null}

        <p className="text-xs leading-5 text-white/26">
          {presentation.description}
        </p>
      </div>
    </div>
  );
}

function MilestoneNode({
  milestone,
  index,
  isLast,
  selected,
  showCompanion,
  markerComplete,
  companion,
  companionState,
  onSelect,
}: {
  milestone: JourneyRoadmapMilestone;
  index: number;
  isLast: boolean;
  selected: boolean;
  showCompanion: boolean;
  markerComplete: boolean;
  companion: JourneyRoadmapProps["companion"];
  companionState: CompanionState;
  onSelect: (milestoneId: string) => void;
}) {
  const xpCopy =
    milestone.state === "completed"
      ? `${milestone.earnedXp} XP earned`
      : `${milestone.totalXp} XP available`;
  const nextTask =
    milestone.tasks.find((task) => task.state === "next") ?? null;

  return (
    <li
      id={`milestone-${milestone.id}`}
      className="relative grid scroll-mt-24 grid-cols-[3.5rem_minmax(0,1fr)] gap-2 pb-4 last:pb-0 sm:gap-3 sm:pb-5"
    >
      {!isLast ? (
        <span
          aria-hidden="true"
          className={cx(
            "absolute bottom-0 left-[1.72rem] top-10 z-0 w-[2px]",
            milestone.state === "completed"
              ? "bg-gradient-to-b from-emerald-300/62 via-emerald-300/38 to-emerald-300/22 shadow-[0_0_12px_rgba(110,231,183,0.12)]"
              : "bg-[repeating-linear-gradient(to_bottom,rgba(148,163,184,0.2)_0,rgba(148,163,184,0.2)_5px,transparent_5px,transparent_11px)]",
          )}
        />
      ) : null}

      <div className="relative z-10 col-start-1 flex justify-center">
        <span
          className={cx(
            "flex items-center justify-center border bg-[#101620] shadow-[0_9px_24px_rgba(0,0,0,0.28)]",
            milestone.state === "completed" &&
              "size-9 rounded-[14px] border-emerald-300/20 bg-emerald-300/12 text-emerald-100/78",
            milestone.state === "current" &&
              "size-11 rounded-[16px] border-blue-200/65 bg-blue-400/18 text-blue-50 ring-4 ring-blue-400/8 shadow-[0_0_34px_rgba(96,165,250,0.32)]",
            milestone.state === "available_next" &&
              "size-9 rounded-[14px] border-cyan-200/38 bg-transparent text-cyan-100/72",
            milestone.state === "locked" &&
              "size-9 rounded-[14px] border-white/8 bg-white/[0.025] text-white/28",
          )}
        >
          <StatusIcon state={milestone.state} className="size-4.5" />
        </span>
      </div>

      {showCompanion ? (
        <div className="pointer-events-none absolute left-0 top-[2.15rem] z-20 flex w-[5.35rem] flex-col items-center">
          <div className="relative flex size-[4.6rem] items-center justify-center">
            <div
              className={cx(
                "absolute size-14 rounded-full blur-2xl",
                markerComplete ? "bg-emerald-300/12" : "bg-blue-300/12",
              )}
            />
            <PixelCompanion
              config={companion.config}
              stage={companion.stage}
              state={companionState}
              size={72}
              className="relative"
              label={`${companion.config.family} companion at ${milestone.title}`}
            />
          </div>
          <span
            className={cx(
              "-mt-1 whitespace-nowrap rounded-full border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] shadow-[0_8px_22px_rgba(0,0,0,0.28)]",
              markerComplete
                ? "border-emerald-300/12 bg-[#101916] text-emerald-100/66"
                : "border-blue-300/16 bg-[#101722] text-blue-100/72",
            )}
          >
            {markerComplete ? "Journey complete" : "You are here"}
          </span>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onSelect(milestone.id)}
        aria-label={`Open ${milestone.title} milestone details`}
        aria-pressed={selected}
        className={cx(
          "group relative col-start-2 w-full overflow-hidden rounded-[22px] border text-left outline-none transition",
          milestone.state === "completed" && "p-3.5",
          milestone.state === "current" && "p-5",
          milestone.state === "available_next" && "p-3.5",
          milestone.state === "locked" && "p-3.5",
          showCompanion && "min-h-[7.6rem] pl-[3.85rem] sm:pl-[4.35rem]",
          milestone.state === "completed" &&
            "border-emerald-300/9 bg-emerald-300/[0.02] hover:border-emerald-300/16",
          milestone.state === "current" &&
            "border-blue-300/34 bg-gradient-to-br from-blue-400/[0.105] via-[#101720] to-[#0d121a] shadow-[0_18px_55px_rgba(59,130,246,0.12)] hover:border-blue-200/48",
          milestone.state === "available_next" &&
            "border-cyan-300/12 bg-cyan-300/[0.02] hover:border-cyan-300/22",
          milestone.state === "locked" &&
            "border-white/6 bg-white/[0.014] hover:border-white/10",
          selected && "ring-1 ring-white/13",
        )}
      >
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/29">
              Milestone {index + 1}
            </p>
            <h3
              className={cx(
                "mt-1.5 text-lg font-semibold leading-tight",
                milestone.state === "locked" ? "text-white/62" : "text-white",
              )}
            >
              {milestone.title}
            </h3>
          </div>
          {!showCompanion ? (
            <MilestoneStatusBadge state={milestone.state} />
          ) : null}
        </div>

        {milestone.state === "current" ? (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">
            {milestone.description ??
              "A focused stage in your onboarding journey."}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          <span className="text-white/43">
            {milestone.completedTasks} / {milestone.totalTasks} tasks
          </span>
          {(milestone.state === "completed"
            ? milestone.earnedXp
            : milestone.totalXp) > 0 ? (
            <span
              className={cx(
                "font-semibold",
                milestone.state === "completed"
                  ? "text-emerald-100/55"
                  : "text-cyan-100/63",
              )}
            >
              {xpCopy}
            </span>
          ) : null}
        </div>

        {milestone.state === "current" ? (
          <>
            <ProgressBar
              value={milestone.progress}
              tone="blue"
              className="mt-3"
            />
            {nextTask ? (
              <p className="mt-2 truncate text-xs font-medium text-blue-100/68">
                Next: {nextTask.title}
              </p>
            ) : null}
          </>
        ) : null}

        <span
          className={cx(
            "inline-flex items-center text-[11px] font-semibold text-white/40 transition group-hover:text-white/67",
            milestone.state === "current" ? "mt-3" : "mt-2.5",
          )}
        >
          {milestone.state === "locked" ? "Preview milestone" : "View details"}
          <span className="ml-1.5" aria-hidden="true">
            →
          </span>
        </span>
      </button>
    </li>
  );
}

export function JourneyRoadmap({
  assignmentId,
  track,
  milestones,
  journeyComplete,
  completedTasks,
  totalTasks,
  overallPercent,
  recentCompletion = false,
  level,
  companion,
}: JourneyRoadmapProps) {
  const currentMilestone =
    milestones.find((milestone) => milestone.state === "current") ?? null;
  const lastCompletedMilestone =
    [...milestones]
      .reverse()
      .find((milestone) => milestone.state === "completed") ?? null;
  const markerMilestone =
    currentMilestone ?? lastCompletedMilestone ?? milestones[0] ?? null;
  const defaultSelectedMilestone =
    currentMilestone ?? lastCompletedMilestone ?? milestones[0] ?? null;
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
    defaultSelectedMilestone?.id ?? null,
  );
  const [mobileSheetMilestoneId, setMobileSheetMilestoneId] = useState<
    string | null
  >(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const roadmapScrollRef = useRef(0);
  const roadmapSectionRef = useRef<HTMLElement>(null);

  const selectedMilestone =
    milestones.find((milestone) => milestone.id === selectedMilestoneId) ??
    defaultSelectedMilestone;
  const mobileSheetMilestone =
    milestones.find((milestone) => milestone.id === mobileSheetMilestoneId) ??
    null;
  const nextTask =
    currentMilestone?.tasks.find((task) => task.state === "next") ?? null;
  const companionState: CompanionState =
    recentCompletion || journeyComplete
      ? "completed"
      : nextTask
        ? "working"
        : "idle";
  const primaryActionLabel = journeyComplete
    ? "Review milestone"
    : nextTask
      ? "Continue next task"
      : currentMilestone
        ? "Review milestone"
        : null;
  const statusMilestone = journeyComplete
    ? lastCompletedMilestone
    : currentMilestone;

  const selectMilestone = useCallback((milestoneId: string) => {
    setSelectedMilestoneId(milestoneId);

    if (window.matchMedia("(max-width: 1023px)").matches) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      roadmapScrollRef.current = window.scrollY;
      setMobileSheetMilestoneId(milestoneId);
    }
  }, [setMobileSheetMilestoneId, setSelectedMilestoneId]);

  const activatePrimaryAction = useCallback(() => {
    if (!statusMilestone) return;
    setSelectedMilestoneId(statusMilestone.id);

    if (window.matchMedia("(max-width: 1023px)").matches) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      roadmapScrollRef.current = window.scrollY;
      setMobileSheetMilestoneId(statusMilestone.id);
      return;
    }

    roadmapSectionRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }, [
    setMobileSheetMilestoneId,
    setSelectedMilestoneId,
    statusMilestone,
  ]);

  const closeMobileSheet = useCallback(() => {
    setMobileSheetMilestoneId(null);
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: roadmapScrollRef.current,
        left: 0,
        behavior: "auto",
      });
      previousFocusRef.current?.focus();
    });
  }, [setMobileSheetMilestoneId]);

  useEffect(() => {
    if (!mobileSheetMilestone) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileSheet();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [closeMobileSheet, mobileSheetMilestone]);

  return (
    <>
      <section className="relative overflow-hidden rounded-[30px] border border-white/9 bg-[#090d14] p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.32)] sm:p-6">
        <div className="absolute -right-20 -top-24 size-64 rounded-full bg-blue-500/9 blur-3xl" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow text-blue-100/52">{track.title}</p>
              <h1 className="mt-2 text-2xl leading-tight sm:text-4xl">
                {journeyComplete
                  ? "Journey complete"
                  : currentMilestone
                    ? `You are in ${currentMilestone.title}`
                    : milestones.length > 0
                      ? "Your roadmap is ready"
                      : "Your roadmap is being prepared"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
                {journeyComplete
                  ? `You completed every milestone in ${track.title}.`
                  : currentMilestone
                    ? `${currentMilestone.completedTasks} of ${currentMilestone.totalTasks} tasks complete.`
                    : track.description ??
                      "Your milestone path will appear here when it is ready."}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p
                className={cx(
                  "text-2xl font-semibold",
                  journeyComplete ? "text-emerald-200" : "text-white",
                )}
              >
                {overallPercent}%
              </p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-white/30">
                Complete
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ProgressBar
              value={overallPercent}
              tone={journeyComplete ? "green" : "blue"}
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-white/7 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/8 bg-white/[0.025] px-3 py-1.5 text-xs font-semibold text-white/72">
                Level {level.current}
              </span>
              <span className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.035] px-3 py-1.5 text-xs font-semibold text-cyan-100/72">
                {level.totalXp} XP
                {level.nextLevel ? (
                  <span className="ml-1 text-cyan-100/38">
                    · {level.xpToNextLevel} to L{level.nextLevel}
                  </span>
                ) : null}
              </span>
              <span className="rounded-full border border-white/8 bg-white/[0.025] px-3 py-1.5 text-xs font-medium text-white/50">
                {completedTasks}/{totalTasks} tasks
              </span>
            </div>

            {primaryActionLabel && statusMilestone ? (
              <button
                type="button"
                onClick={activatePrimaryAction}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950 shadow-[0_12px_34px_rgba(255,255,255,0.09)] transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                {primaryActionLabel}
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section
        id="roadmap"
        ref={roadmapSectionRef}
        className="mt-5 scroll-mt-5"
      >
        <div className="px-1">
          <p className="eyebrow">Journey roadmap</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl">Your milestone path</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Follow the path, then open a milestone to review its tasks.
              </p>
            </div>
            {journeyComplete ? (
              <BadgePill tone="green">Journey complete</BadgePill>
            ) : null}
          </div>
        </div>

        {milestones.length > 0 ? (
          <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(24rem,1.12fr)]">
            <div className="relative rounded-[29px] border border-white/7 bg-[#090d14]/68 px-4 py-5 sm:px-5 sm:py-6">
              <ol className="relative">
                {milestones.map((milestone, index) => (
                  <MilestoneNode
                    key={milestone.id}
                    milestone={milestone}
                    index={index}
                    isLast={index === milestones.length - 1}
                    selected={selectedMilestone?.id === milestone.id}
                    showCompanion={markerMilestone?.id === milestone.id}
                    markerComplete={journeyComplete}
                    companion={companion}
                    companionState={companionState}
                    onSelect={selectMilestone}
                  />
                ))}
              </ol>
            </div>

            <aside
              className="sticky top-5 hidden max-h-[calc(100vh-2.5rem)] overflow-y-auto rounded-[29px] border border-white/8 bg-[#0d121a] shadow-[0_24px_70px_rgba(0,0,0,0.28)] lg:block"
              aria-label="Selected milestone details"
              aria-live="polite"
            >
              {selectedMilestone ? (
                <MilestoneDetails
                  assignmentId={assignmentId}
                  milestone={selectedMilestone}
                  panelId={`desktop-milestone-${selectedMilestone.id}`}
                />
              ) : (
                <div className="p-6">
                  <p className="font-semibold text-white">
                    Select a milestone
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    Choose a milestone from the roadmap to review its tasks and
                    progress.
                  </p>
                </div>
              )}
            </aside>
          </div>
        ) : (
          <div className="mt-5 rounded-[28px] border border-white/7 bg-white/[0.02] p-6">
            <p className="font-semibold text-white">
              Your roadmap is being prepared.
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              This journey is assigned, but no milestones have been added yet.
            </p>
          </div>
        )}
      </section>

      {mobileSheetMilestone ? (
        <div
          className="fixed inset-0 z-[80] bg-black/68 backdrop-blur-sm lg:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeMobileSheet();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`mobile-milestone-${mobileSheetMilestone.id}`}
            className="absolute inset-x-3 bottom-3 max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain rounded-[29px] border border-white/9 bg-[#0d121a] pb-3 shadow-[0_34px_110px_rgba(0,0,0,0.72)] sm:inset-x-5 sm:bottom-5"
          >
            <div className="sticky top-0 z-10 flex justify-end bg-gradient-to-b from-[#0d121a] via-[#0d121a]/96 to-transparent px-4 pb-2 pt-4">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMobileSheet}
                className="flex size-10 items-center justify-center rounded-full border border-white/9 bg-white/[0.04] text-white/55 transition hover:bg-white/[0.08] hover:text-white"
                aria-label="Close milestone details"
              >
                <svg
                  viewBox="0 0 20 20"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="m5 5 10 10M15 5 5 15" />
                </svg>
              </button>
            </div>
            <MilestoneDetails
              assignmentId={assignmentId}
              milestone={mobileSheetMilestone}
              panelId={`mobile-milestone-${mobileSheetMilestone.id}`}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
