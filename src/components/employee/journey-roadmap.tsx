"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
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
    description: "Review the progress already recorded here.",
  },
  current: {
    label: "Current",
    description: "This is where your journey is moving forward now.",
  },
  available_next: {
    label: "Available next",
    description: "This milestone follows your current work.",
  },
  locked: {
    label: "Locked",
    description: "Complete the milestones before this one to unlock it.",
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
      strokeWidth="1.6"
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
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]",
        state === "completed" &&
          "border-emerald-300/10 bg-emerald-300/[0.04] text-emerald-100/65",
        state === "current" &&
          "border-blue-300/22 bg-blue-300/10 text-blue-100",
        state === "available_next" &&
          "border-cyan-300/14 bg-cyan-300/[0.055] text-cyan-100/78",
        state === "locked" &&
          "border-white/8 bg-white/[0.035] text-white/36",
      )}
    >
      {milestoneStatePresentation[state].label}
    </span>
  );
}

function MilestoneNode({
  milestone,
  index,
  onOpen,
}: {
  milestone: JourneyRoadmapMilestone;
  index: number;
  onOpen: (milestoneId: string) => void;
}) {
  const onLeft = index % 2 === 0;
  const xpCopy =
    milestone.state === "completed"
      ? `${milestone.earnedXp} XP earned`
      : milestone.state === "current"
        ? `${milestone.earnedXp} of ${milestone.totalXp} XP earned`
        : `${milestone.totalXp} XP across ${milestone.totalTasks} steps`;

  return (
    <li
      id={`milestone-${milestone.id}`}
      className="relative grid scroll-mt-28 grid-cols-[2.75rem_minmax(0,1fr)] gap-3 pb-6 last:pb-0 lg:grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] lg:gap-5 lg:pb-8"
    >
      <div className="relative z-10 col-start-1 row-start-1 flex justify-center lg:col-start-2">
        <span
          className={cx(
            "relative flex size-10 items-center justify-center rounded-2xl border bg-[#101620] shadow-[0_10px_30px_rgba(0,0,0,0.3)]",
            milestone.state === "completed" &&
              "border-emerald-300/16 text-emerald-100/75",
            milestone.state === "current" &&
              "border-blue-300/45 bg-blue-400/12 text-blue-100 shadow-[0_0_32px_rgba(96,165,250,0.22)]",
            milestone.state === "available_next" &&
              "border-cyan-300/18 text-cyan-100/70",
            milestone.state === "locked" &&
              "border-white/8 text-white/28",
          )}
        >
          <StatusIcon state={milestone.state} className="size-5" />
          <span
            className={cx(
              "absolute top-1/2 hidden h-px w-7 -translate-y-1/2 bg-white/10 lg:block",
              onLeft ? "right-full" : "left-full",
            )}
          />
        </span>
      </div>

      <button
        type="button"
        onClick={() => onOpen(milestone.id)}
        aria-label={`Open ${milestone.title} milestone details`}
        className={cx(
          "group col-start-2 row-start-1 w-full rounded-[28px] border p-4 text-left outline-none transition sm:p-5 lg:col-auto",
          onLeft ? "lg:col-start-1" : "lg:col-start-3",
          milestone.state === "completed" &&
            "border-emerald-300/10 bg-emerald-300/[0.025] hover:border-emerald-300/18 hover:bg-emerald-300/[0.04]",
          milestone.state === "current" &&
            "border-blue-300/35 bg-gradient-to-br from-blue-400/[0.11] via-[#101720] to-[#0d121a] shadow-[0_24px_80px_rgba(59,130,246,0.14)] hover:border-blue-200/50",
          milestone.state === "available_next" &&
            "border-cyan-300/14 bg-cyan-300/[0.025] hover:border-cyan-300/24",
          milestone.state === "locked" &&
            "border-white/7 bg-white/[0.018] text-white/62 hover:border-white/12 hover:bg-white/[0.03]",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/32">
              Milestone {index + 1}
            </p>
            <h3
              className={cx(
                "mt-2 text-xl font-semibold leading-tight sm:text-2xl",
                milestone.state === "locked" ? "text-white/68" : "text-white",
              )}
            >
              {milestone.title}
            </h3>
          </div>
          <MilestoneStatusBadge state={milestone.state} />
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-muted)]">
          {milestone.description ??
            "A focused stage in your onboarding journey."}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span className="text-white/48">
            {milestone.completedTasks} / {milestone.totalTasks} steps
          </span>
          {milestone.totalTasks > 0 ? (
            <span
              className={cx(
                "font-semibold",
                milestone.state === "completed"
                  ? "text-emerald-100/60"
                  : "text-blue-200/72",
              )}
            >
              {xpCopy}
            </span>
          ) : null}
        </div>

        {milestone.state === "current" ? (
          <ProgressBar value={milestone.progress} tone="blue" className="mt-4" />
        ) : null}

        <span className="mt-4 inline-flex items-center text-xs font-semibold text-white/46 transition group-hover:text-white/72">
          {milestone.state === "locked" ? "Preview milestone" : "Open details"}
          <span className="ml-1.5" aria-hidden="true">
            →
          </span>
        </span>
      </button>
    </li>
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
      className={cx(primary && "shadow-[0_12px_30px_rgba(59,130,246,0.18)]")}
    >
      {pending
        ? "Saving..."
        : primary
          ? "Complete next step"
          : "Complete step"}
    </Button>
  );
}

function TaskStateBadge({ state }: { state: RoadmapTaskState }) {
  return (
    <span
      className={cx(
        "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em]",
        state === "completed" &&
          "border-emerald-300/10 bg-emerald-300/[0.04] text-emerald-100/65",
        state === "next" &&
          "border-blue-300/22 bg-blue-300/10 text-blue-100",
        state === "available" &&
          "border-white/10 bg-white/[0.045] text-white/56",
        state === "locked" &&
          "border-white/7 bg-white/[0.025] text-white/30",
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
      id={`detail-task-${task.id}`}
      className={cx(
        "rounded-[24px] border p-4",
        isNext &&
          "border-blue-300/28 bg-blue-300/[0.07] shadow-[0_18px_50px_rgba(59,130,246,0.1)]",
        isCompleted &&
          "border-emerald-300/9 bg-emerald-300/[0.025]",
        task.state === "available" &&
          "border-white/9 bg-white/[0.028]",
        task.state === "locked" &&
          "border-white/7 bg-white/[0.018] text-white/60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-white">{task.title}</h4>
          <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
            {task.description ??
              "Complete this step to continue building progress in your journey."}
          </p>
        </div>
        <TaskStateBadge state={task.state} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full border border-blue-300/12 bg-blue-300/[0.045] px-2.5 py-1 text-blue-100/72">
          {task.growthArea}
        </span>
        {task.xpReward ? (
          <span className="font-semibold text-cyan-200/75">
            +{task.xpReward} XP
          </span>
        ) : null}
      </div>

      {task.skillContributions.length > 0 ? (
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/32">
            Skill contribution
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {task.skillContributions.map((contribution) => (
              <span
                key={contribution.skill}
                className="rounded-full border border-purple-300/12 bg-purple-300/[0.045] px-2.5 py-1 text-xs text-purple-100/72"
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
}: {
  assignmentId: string;
  milestone: JourneyRoadmapMilestone;
}) {
  const presentation = milestoneStatePresentation[milestone.state];
  const completionDate = milestone.completedAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
        new Date(milestone.completedAt),
      )
    : null;

  return (
    <>
      <div className="border-b border-white/8 px-5 pb-5 sm:px-7">
        <div className="flex items-center gap-2">
          <MilestoneStatusBadge state={milestone.state} />
          {completionDate ? (
            <span className="text-xs text-white/34">
              Completed {completionDate}
            </span>
          ) : null}
        </div>
        <h2
          id={`milestone-dialog-${milestone.id}`}
          className="mt-3 pr-12 text-3xl leading-tight text-white"
        >
          {milestone.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          {milestone.description ??
            "A focused stage in your onboarding journey."}
        </p>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Steps", `${milestone.completedTasks}/${milestone.totalTasks}`],
            ["Progress", `${milestone.progress}%`],
            [
              milestone.state === "completed" ? "XP earned" : "Available XP",
              milestone.state === "completed"
                ? milestone.earnedXp
                : milestone.totalXp,
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[18px] border border-white/8 bg-white/[0.025] p-3"
            >
              <p className="text-lg font-semibold text-white">{value}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.09em] text-white/32">
                {label}
              </p>
            </div>
          ))}
        </div>

        {milestone.state === "current" ? (
          <div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-blue-100">
                Current milestone progress
              </span>
              <span className="text-white/42">{milestone.progress}%</span>
            </div>
            <ProgressBar value={milestone.progress} tone="blue" className="mt-2" />
          </div>
        ) : null}

        {milestone.skillFocus.length > 0 ? (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/32">
              Skill focus
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {milestone.skillFocus.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-purple-300/12 bg-purple-300/[0.045] px-2.5 py-1 text-xs text-purple-100/72"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {milestone.state === "completed" ? (
          <div className="rounded-[22px] border border-emerald-300/10 bg-emerald-300/[0.035] p-4">
            <p className="text-sm font-semibold text-emerald-100/78">
              Milestone complete
            </p>
            <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
              You completed every step in this milestone
              {milestone.totalXp > 0
                ? ` and earned ${milestone.totalXp} XP.`
                : "."}
            </p>
          </div>
        ) : null}

        {milestone.state === "available_next" ? (
          <div className="rounded-[22px] border border-cyan-300/12 bg-cyan-300/[0.035] p-4">
            <p className="text-sm font-semibold text-cyan-100/78">Up next</p>
            <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
              {milestone.precedingMilestoneTitle
                ? `Complete “${milestone.precedingMilestoneTitle}” before starting this milestone.`
                : "Complete your current milestone before starting this one."}
            </p>
          </div>
        ) : null}

        {milestone.state === "locked" ? (
          <div className="rounded-[22px] border border-white/8 bg-white/[0.025] p-4">
            <p className="text-sm font-semibold text-white/68">
              Milestone preview
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
              <h3 className="text-lg font-semibold text-white">
                {milestone.state === "completed"
                  ? "Completed steps"
                  : "Milestone steps"}
              </h3>
              <span className="text-xs text-white/34">
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
                <div className="rounded-[22px] border border-white/8 bg-white/[0.025] p-4">
                  <p className="text-sm font-semibold text-white/68">
                    No steps are available yet.
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--color-muted)]">
                    This milestone is visible on your roadmap, but its steps have
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
            className="inline-flex text-sm font-semibold text-blue-200"
          >
            View achievements and proof of growth
          </Link>
        ) : null}

        <p className="text-xs leading-5 text-white/28">
          {presentation.description}
        </p>
      </div>
    </>
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
  level,
  companion,
}: JourneyRoadmapProps) {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
    null,
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const roadmapScrollRef = useRef(0);
  const selectedMilestone =
    milestones.find((milestone) => milestone.id === selectedMilestoneId) ?? null;
  const currentMilestone =
    milestones.find((milestone) => milestone.state === "current") ?? null;
  const lastCompletedMilestone = [...milestones]
    .reverse()
    .find((milestone) => milestone.state === "completed") ?? null;
  const nextTask =
    currentMilestone?.tasks.find((task) => task.state === "next") ?? null;
  const headerTarget = journeyComplete
    ? lastCompletedMilestone
    : currentMilestone;
  const companionState: CompanionState = journeyComplete
    ? "completed"
    : nextTask
      ? "working"
      : "idle";
  const primaryActionLabel = journeyComplete
    ? "Review completed journey"
    : nextTask
      ? "Continue next step"
      : currentMilestone
        ? "View current milestone"
        : null;

  const openMilestone = useCallback((milestoneId: string) => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    roadmapScrollRef.current = window.scrollY;
    setSelectedMilestoneId(milestoneId);
  }, []);

  const closeMilestone = useCallback(() => {
    setSelectedMilestoneId(null);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: roadmapScrollRef.current, left: 0, behavior: "auto" });
      previousFocusRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    if (!selectedMilestone) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMilestone();
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
  }, [closeMilestone, selectedMilestone]);

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
    }
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#090d14] text-white shadow-[0_32px_110px_rgba(0,0,0,0.38)]">
        <div className="absolute -left-24 top-0 size-72 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute -right-12 -top-24 size-80 rounded-full bg-purple-500/9 blur-3xl" />

        <div className="relative grid lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="p-5 sm:p-8 lg:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <BadgePill tone={journeyComplete ? "green" : "blue"}>
                {overallPercent}% complete
              </BadgePill>
              <span className="text-xs text-white/38">
                {completedTasks} of {totalTasks} steps
              </span>
            </div>

            <p className="eyebrow mt-5 text-blue-200/60">Your journey</p>
            <h1 className="mt-2 max-w-3xl text-4xl leading-tight sm:text-5xl">
              {track.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              {track.description ??
                "A structured path through the knowledge and actions that support your first stage of growth."}
            </p>

            {track.skillFocus.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {track.skillFocus.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-blue-300/12 bg-blue-300/[0.045] px-2.5 py-1 text-xs text-blue-100/68"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 border-y border-white/8 py-4 sm:grid-cols-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/30">
                  Current milestone
                </p>
                <p className="mt-1.5 text-sm font-semibold">
                  {currentMilestone?.title ??
                    (journeyComplete ? "Journey complete" : "Preparing roadmap")}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/30">
                  Level
                </p>
                <p className="mt-1.5 text-sm font-semibold">
                  Level {level.current}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/30">
                  Experience
                </p>
                <p className="mt-1.5 text-sm font-semibold">
                  {level.totalXp} XP
                </p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-cyan-100/78">
                  XP to next level
                </span>
                <span className="text-white/40">
                  {level.nextLevel
                    ? `${level.xpToNextLevel} XP to Level ${level.nextLevel}`
                    : "Current level peak"}
                </span>
              </div>
              <ProgressBar value={level.progress} tone="blue" className="mt-2" />
            </div>

            {primaryActionLabel && headerTarget ? (
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => openMilestone(headerTarget.id)}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(255,255,255,0.1)] transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  {primaryActionLabel}
                  <span className="ml-2" aria-hidden="true">
                    →
                  </span>
                </button>
                {journeyComplete ? (
                  <Link
                    href="/employee/player"
                    className="text-sm font-semibold text-white/48 transition hover:text-white/75"
                  >
                    View achievements
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="relative flex min-h-52 items-center justify-center overflow-hidden border-t border-white/8 bg-white/[0.018] lg:min-h-0 lg:border-l lg:border-t-0">
            <div className="absolute size-44 rounded-full border border-white/7 bg-blue-400/[0.035]" />
            <div className="absolute size-32 rounded-full bg-blue-400/12 blur-3xl" />
            <PixelCompanion
              config={companion.config}
              stage={companion.stage}
              state={companionState}
              size={156}
              className="relative"
            />
          </div>
        </div>
      </section>

      <section id="roadmap" className="mt-5 scroll-mt-24">
        <div className="px-1">
          <p className="eyebrow">Journey roadmap</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl">Your milestone path</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Select a milestone to review its purpose, steps, XP, and skills.
              </p>
            </div>
            {journeyComplete ? (
              <BadgePill tone="green">Journey complete</BadgePill>
            ) : null}
          </div>
        </div>

        {milestones.length > 0 ? (
          <div className="relative mt-6 rounded-[34px] border border-white/8 bg-[#090d14]/72 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="absolute bottom-8 left-[2.25rem] top-8 w-px bg-gradient-to-b from-blue-300/25 via-white/10 to-white/5 lg:left-1/2" />
            <ol className="relative">
              {milestones.map((milestone, index) => (
                <MilestoneNode
                  key={milestone.id}
                  milestone={milestone}
                  index={index}
                  onOpen={openMilestone}
                />
              ))}
            </ol>
          </div>
        ) : (
          <div className="mt-6 rounded-[30px] border border-white/8 bg-white/[0.025] p-6">
            <p className="font-semibold text-white">
              Your roadmap is being prepared.
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              This journey is assigned, but no milestones have been added yet.
            </p>
          </div>
        )}
      </section>

      {selectedMilestone ? (
        <div
          className="fixed inset-0 z-[80] bg-black/68 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeMilestone();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`milestone-dialog-${selectedMilestone.id}`}
            onKeyDown={handleDialogKeyDown}
            className="absolute inset-x-3 bottom-3 max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain rounded-[30px] border border-white/10 bg-[#0d121a] pb-3 shadow-[0_36px_120px_rgba(0,0,0,0.72)] sm:inset-x-5 sm:bottom-5 lg:bottom-4 lg:left-auto lg:right-4 lg:top-4 lg:w-[min(36rem,calc(100vw-2rem))] lg:max-h-none"
          >
            <div className="sticky top-0 z-10 flex justify-end bg-gradient-to-b from-[#0d121a] via-[#0d121a]/95 to-transparent px-4 pb-3 pt-4">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMilestone}
                className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-white/58 transition hover:bg-white/[0.08] hover:text-white"
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
              milestone={selectedMilestone}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
