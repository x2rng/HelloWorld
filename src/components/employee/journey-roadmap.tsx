"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { completeTask } from "@/app/employee/onboarding/actions";
import { PixelCompanion } from "@/components/avatar/pixel-companion";
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

const LEFT_NODE_X = 29;
const RIGHT_NODE_X = 71;

type RoadmapPathTone = "completed" | "current" | "future";

function getNodeX(index: number) {
  return index % 2 === 0 ? LEFT_NODE_X : RIGHT_NODE_X;
}

function getConnectorTone(
  milestone: JourneyRoadmapMilestone,
  nextMilestone?: JourneyRoadmapMilestone,
): RoadmapPathTone {
  if (nextMilestone?.state === "current") return "current";
  if (milestone.state === "completed") return "completed";
  if (milestone.state === "current") return "current";
  return "future";
}

function RoadmapConnector({
  fromX,
  toX,
  tone,
  className,
}: {
  fromX: number;
  toX: number;
  tone: RoadmapPathTone;
  className: string;
}) {
  const path = `M ${fromX} 0 C ${fromX} 34, ${toX} 66, ${toX} 100`;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={cx(
        "pointer-events-none absolute left-0 z-0 w-full overflow-visible",
        className,
      )}
      aria-hidden="true"
    >
      {tone === "current" ? (
        <path
          d={path}
          fill="none"
          stroke="rgba(96, 165, 250, 0.1)"
          strokeWidth="7"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
      <path
        d={path}
        fill="none"
        stroke={
          tone === "completed"
            ? "rgba(110, 231, 183, 0.46)"
            : tone === "current"
              ? "rgba(125, 211, 252, 0.58)"
              : "rgba(148, 163, 184, 0.14)"
        }
        strokeWidth={tone === "future" ? 1.35 : 1.8}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function RoadmapNode({
  state,
}: {
  state: RoadmapMilestoneState;
}) {
  return (
    <span
      className={cx(
        "relative flex items-center justify-center border bg-[#0d141d] shadow-[0_9px_24px_rgba(0,0,0,0.3)]",
        state === "completed" &&
          "size-9 rounded-[14px] border-emerald-300/24 bg-[#123029] text-emerald-100/82",
        state === "current" &&
          "size-12 rounded-[18px] border-blue-200/68 bg-[#10273e] text-blue-50 ring-4 ring-blue-400/9 shadow-[0_0_38px_rgba(96,165,250,0.34)] motion-safe:animate-[pulse_3.2s_ease-in-out_infinite]",
        state === "available_next" &&
          "size-10 rounded-[15px] border-cyan-200/42 bg-[#0d151e] text-cyan-100/72",
        state === "locked" &&
          "size-9 rounded-[14px] border-white/9 bg-[#0c1118] text-white/26",
      )}
    >
      <StatusIcon
        state={state}
        className={state === "current" ? "size-5" : "size-4"}
      />
    </span>
  );
}

function MilestoneNode({
  milestone,
  nextMilestone,
  index,
  isLast,
  selected,
  showCompanion,
  companion,
  companionState,
  onSelect,
}: {
  milestone: JourneyRoadmapMilestone;
  nextMilestone?: JourneyRoadmapMilestone;
  index: number;
  isLast: boolean;
  selected: boolean;
  showCompanion: boolean;
  companion: JourneyRoadmapProps["companion"];
  companionState: CompanionState;
  onSelect: (milestoneId: string) => void;
}) {
  const nodeX = getNodeX(index);
  const nextNodeX = getNodeX(index + 1);
  const cardOnRight = nodeX === LEFT_NODE_X;
  const xpValue =
    milestone.state === "completed"
      ? milestone.earnedXp
      : milestone.totalXp;
  const roadmapStatus =
    milestone.state === "current"
      ? "Current"
      : milestoneStatePresentation[milestone.state].label;

  return (
    <li
      id={`milestone-${milestone.id}`}
      className="relative h-[9.75rem] scroll-mt-24"
    >
      <RoadmapConnector
        fromX={nodeX}
        toX={nextNodeX}
        tone={getConnectorTone(milestone, nextMilestone)}
        className={isLast ? "top-1/2 h-[7.875rem]" : "top-1/2 h-full"}
      />

      <div
        className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${nodeX}%` }}
      >
        <RoadmapNode state={milestone.state} />
      </div>

      {showCompanion ? (
        <div
          data-roadmap-traveler
          className={cx(
            "pointer-events-none absolute top-1/2 z-30 flex -translate-y-1/2 flex-col items-center transition-[left,transform] duration-500 motion-reduce:transition-none",
            cardOnRight
              ? "-translate-x-full pr-2"
              : "translate-x-0 pl-2",
          )}
          style={{ left: `${nodeX}%` }}
        >
          <span
            className={cx(
              "mb-0.5 whitespace-nowrap rounded-full border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] shadow-[0_8px_22px_rgba(0,0,0,0.28)]",
              "border-blue-300/16 bg-[#101722] text-blue-100/74",
            )}
          >
            You are here
          </span>
          <div className="relative flex size-[4.25rem] items-center justify-center">
            <div
              className={cx(
                "absolute size-12 rounded-full blur-2xl",
                "bg-blue-300/13",
              )}
            />
            <PixelCompanion
              config={companion.config}
              stage={companion.stage}
              state={companionState}
              size={68}
              className="relative"
              label={`${companion.config.family} companion at ${milestone.title}`}
            />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onSelect(milestone.id)}
        aria-label={`Open ${milestone.title} milestone details`}
        aria-pressed={selected}
        style={
          cardOnRight
            ? { left: `calc(${nodeX}% + 2.15rem)`, right: "0.5rem" }
            : { left: "0.5rem", right: `calc(${100 - nodeX}% + 2.15rem)` }
        }
        className={cx(
          "group absolute top-1/2 z-10 -translate-y-1/2 rounded-[20px] border p-3 text-left outline-none transition sm:p-3.5",
          milestone.state === "completed" &&
            "border-emerald-300/8 bg-[#0d1517]/92 hover:border-emerald-300/16",
          milestone.state === "current" &&
            "border-blue-300/34 bg-gradient-to-br from-blue-400/[0.11] via-[#101720] to-[#0d121a] p-3.5 shadow-[0_16px_48px_rgba(59,130,246,0.13)] hover:border-blue-200/48 sm:p-4",
          milestone.state === "available_next" &&
            "border-cyan-300/12 bg-[#0d141c]/88 hover:border-cyan-300/22",
          milestone.state === "locked" &&
            "border-white/6 bg-[#0b1016]/72 hover:border-white/10",
          selected && "ring-1 ring-white/14",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/27">
            Milestone {index + 1}
          </p>
          <span
            className={cx(
              "text-[9px] font-semibold uppercase tracking-[0.09em]",
              milestone.state === "completed" && "text-emerald-100/56",
              milestone.state === "current" && "text-blue-100/84",
              milestone.state === "available_next" && "text-cyan-100/62",
              milestone.state === "locked" && "text-white/28",
            )}
          >
            {roadmapStatus}
          </span>
        </div>
        <h3
          className={cx(
            "mt-1.5 line-clamp-2 font-semibold leading-tight",
            milestone.state === "current" ? "text-lg text-white" : "text-white/78",
            milestone.state === "locked" && "text-white/48",
          )}
        >
          {milestone.title}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px]">
          <span className="text-white/42">
            {milestone.completedTasks}/{milestone.totalTasks} steps
          </span>
          {xpValue > 0 ? (
            <>
              <span className="text-white/18" aria-hidden="true">
                ·
              </span>
              <span
                className={cx(
                  "font-medium",
                  milestone.state === "completed"
                    ? "text-emerald-100/48"
                    : "text-cyan-100/56",
                )}
              >
                {xpValue} XP
              </span>
            </>
          ) : null}
        </div>
        <span className="mt-2 inline-flex items-center text-[10px] font-semibold text-white/32 transition group-hover:text-white/62">
          {milestone.state === "locked" ? "Preview" : "Open"}
          <span className="ml-1" aria-hidden="true">
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
    recentCompletion
      ? "completed"
      : journeyComplete
        ? "idle"
        : nextTask
          ? "working"
          : "idle";
  const primaryActionLabel = journeyComplete
    ? "Review journey"
    : nextTask
      ? "Continue next step"
      : currentMilestone
        ? "View current milestone"
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
      <section className="relative overflow-hidden rounded-[27px] border border-white/9 bg-[#090d14] p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-5">
        <div className="absolute -right-20 -top-24 size-64 rounded-full bg-blue-500/9 blur-3xl" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow text-blue-100/52">Your journey</p>
              <h1 className="mt-1.5 text-2xl leading-tight sm:text-3xl">
                {track.title}
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[var(--color-muted)]">
                {journeyComplete
                  ? "Every milestone is complete."
                  : currentMilestone
                    ? `Current milestone: ${currentMilestone.title}`
                    : "Your milestone path is being prepared."}
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

          <div className="mt-3">
            <ProgressBar
              value={overallPercent}
              tone={journeyComplete ? "green" : "blue"}
            />
          </div>

          <div className="mt-3 flex flex-col gap-3 border-t border-white/7 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-white/66">
                {completedTasks}/{totalTasks} steps
              </span>
              <span className="text-white/16" aria-hidden="true">
                ·
              </span>
              <span className="text-xs font-medium text-white/48">
                Level {level.current}
              </span>
              <span className="text-white/16" aria-hidden="true">
                ·
              </span>
              <span className="text-xs font-semibold text-cyan-100/64">
                {level.totalXp} XP
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
        className="mt-4 scroll-mt-5"
      >
        <div className="px-1">
          <p className="eyebrow">Roadmap</p>
          <h2 className="mt-1.5 text-2xl sm:text-3xl">Your milestone path</h2>
          <p className="mt-1.5 text-sm text-[var(--color-muted)]">
            Follow the route and open any milestone to review its chapter.
          </p>
        </div>

        {milestones.length > 0 ? (
          <div className="mt-4 grid items-start gap-5 lg:grid-cols-[minmax(0,0.92fr)_minmax(24rem,1.08fr)]">
            <div className="relative overflow-hidden rounded-[29px] border border-white/7 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.055),transparent_48%),rgba(9,13,20,0.66)] px-2 py-4 sm:px-4">
              <div className="relative h-16">
                <RoadmapConnector
                  fromX={getNodeX(0)}
                  toX={getNodeX(0)}
                  tone={
                    milestones[0]?.state === "completed"
                      ? "completed"
                      : milestones[0]?.state === "current"
                        ? "current"
                        : "future"
                  }
                  className="top-1/2 h-[6.875rem]"
                />
                <div
                  className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${getNodeX(0)}%` }}
                >
                  <span className="block size-3 rounded-full border border-white/24 bg-[#101720] shadow-[0_0_18px_rgba(148,163,184,0.12)]" />
                </div>
                <div
                  className="absolute top-1/2 z-10 -translate-y-1/2"
                  style={{ left: `calc(${getNodeX(0)}% + 1rem)` }}
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-white/32">
                    Start
                  </p>
                  <p className="mt-0.5 text-xs text-white/48">
                    Journey begins
                  </p>
                </div>
              </div>

              <ol className="relative">
                {milestones.map((milestone, index) => (
                  <MilestoneNode
                    key={milestone.id}
                    milestone={milestone}
                    nextMilestone={milestones[index + 1]}
                    index={index}
                    isLast={index === milestones.length - 1}
                    selected={selectedMilestone?.id === milestone.id}
                    showCompanion={
                      !journeyComplete && markerMilestone?.id === milestone.id
                    }
                    companion={companion}
                    companionState={companionState}
                    onSelect={selectMilestone}
                  />
                ))}
              </ol>

              <div className="relative h-24">
                <div
                  className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${getNodeX(milestones.length)}%` }}
                >
                  <RoadmapNode
                    state={journeyComplete ? "completed" : "locked"}
                  />
                </div>

                {journeyComplete ? (
                  <div
                    data-roadmap-traveler
                    className={cx(
                      "pointer-events-none absolute top-1/2 z-30 flex -translate-y-1/2 flex-col items-center transition-[left,transform] duration-500 motion-reduce:transition-none",
                      getNodeX(milestones.length) === LEFT_NODE_X
                        ? "-translate-x-full pr-2"
                        : "translate-x-0 pl-2",
                    )}
                    style={{ left: `${getNodeX(milestones.length)}%` }}
                  >
                    <span className="mb-0.5 whitespace-nowrap rounded-full border border-emerald-300/12 bg-[#101916] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-emerald-100/68 shadow-[0_8px_22px_rgba(0,0,0,0.28)]">
                      Journey complete
                    </span>
                    <div className="relative flex size-[4.25rem] items-center justify-center">
                      <div className="absolute size-12 rounded-full bg-emerald-300/12 blur-2xl" />
                      <PixelCompanion
                        config={companion.config}
                        stage={companion.stage}
                        state="idle"
                        size={68}
                        className="relative"
                        label={`${companion.config.family} companion at the journey destination`}
                      />
                    </div>
                  </div>
                ) : null}

                <div
                  className={cx(
                    "absolute top-1/2 z-10 -translate-y-1/2",
                    getNodeX(milestones.length) === LEFT_NODE_X
                      ? "translate-x-0"
                      : "-translate-x-full",
                  )}
                  style={{
                    left:
                      getNodeX(milestones.length) === LEFT_NODE_X
                        ? `calc(${getNodeX(milestones.length)}% + 1.75rem)`
                        : `calc(${getNodeX(milestones.length)}% - 1.75rem)`,
                  }}
                >
                  <p
                    className={cx(
                      "whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.12em]",
                      journeyComplete
                        ? "text-emerald-100/58"
                        : "text-white/30",
                    )}
                  >
                    Destination
                  </p>
                  <p className="mt-0.5 whitespace-nowrap text-xs text-white/42">
                    {journeyComplete ? "Route completed" : "End of journey"}
                  </p>
                </div>
              </div>
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
