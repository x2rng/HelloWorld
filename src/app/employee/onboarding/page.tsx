import Link from "next/link";
import { completeTask } from "@/app/employee/onboarding/actions";
import { AchievementList } from "@/components/employee/achievement-list";
import { FullBodyAvatar } from "@/components/employee/full-body-avatar";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { normalizeStoredAvatarConfig } from "@/components/avatar-3d/config/avatar-v4-parser";
import { getAvatarStage, getNextAvatarStage } from "@/lib/avatar-stage";
import {
  buildJourneyMilestones,
  getNextJourneyTask,
  journeyPercent,
  TASK_XP_REWARD,
  type JourneyMilestoneStatus,
} from "@/lib/employee-journey";
import { requireRole } from "@/lib/exp-auth";
import {
  getGrowthAreaDefinition,
  isGrowthAreaName,
  type GrowthAreaTone,
} from "@/lib/growth-areas";
import type {
  AchievementRecord,
  EmployeeAchievementRecord,
  EmployeeStatsRecord,
  MilestoneRecord,
  TaskProgressRecord,
  TaskRecord,
} from "@/lib/exp-types";
import { getLevelInfo } from "@/lib/levels";
import { normalizeSkillContributions, normalizeSkillFocus } from "@/lib/skill-attribution";
import {
  type RoleFocus,
} from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";
import { cx } from "@/lib/utils";

type AssignmentWithTrack = {
  id: string;
  workspace_id: string;
  track_id: string;
  employee_id: string;
  status: string;
  start_date: string;
  due_date: string;
  track: {
    id: string;
    title: string;
    description: string | null;
    skill_focus: unknown;
  } | null;
};

type EmployeeAvatarProfile = {
  avatar_config: unknown;
  role_focus: RoleFocus | null;
  assigned_skills: unknown;
};

const milestoneStatusPresentation: Record<
  JourneyMilestoneStatus,
  { label: string; tone: "green" | "blue" | "neutral" }
> = {
  completed: { label: "Completed", tone: "green" },
  in_progress: { label: "Active", tone: "blue" },
  upcoming: { label: "Upcoming", tone: "neutral" },
};

const activeMilestoneClasses: Record<GrowthAreaTone, string> = {
  blue: "border-blue-400/25 shadow-[0_28px_100px_rgba(80,115,255,0.14)]",
  purple: "border-purple-400/25 shadow-[0_28px_100px_rgba(150,105,255,0.14)]",
  cyan: "border-cyan-400/25 shadow-[0_28px_100px_rgba(45,190,215,0.12)]",
  green: "border-emerald-400/25 shadow-[0_28px_100px_rgba(45,185,115,0.12)]",
  orange: "border-orange-400/25 shadow-[0_28px_100px_rgba(225,115,45,0.12)]",
};

const growthStepClasses: Record<GrowthAreaTone, string> = {
  blue: "border-blue-400/15 bg-blue-400/[0.035]",
  purple: "border-purple-400/15 bg-purple-400/[0.035]",
  cyan: "border-cyan-400/15 bg-cyan-400/[0.03]",
  green: "border-emerald-400/15 bg-emerald-400/[0.03]",
  orange: "border-orange-400/15 bg-orange-400/[0.035]",
};

export const dynamic = "force-dynamic";

export default async function EmployeeOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{
    achievementUnlocked?: string;
    completionError?: string;
    completionSaved?: string;
    growthArea?: string;
    previousLevel?: string;
    xpEarned?: string;
    skillGains?: string;
  }>;
}) {
  const {
    achievementUnlocked,
    completionError,
    completionSaved,
    growthArea,
    previousLevel,
    xpEarned,
    skillGains,
  } = await searchParams;
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const { data: assignment, error: assignmentError } = await supabase
    .from("track_assignments")
    .select(
      "id, workspace_id, track_id, employee_id, status, start_date, due_date, track:onboarding_tracks(id, title, description, skill_focus)",
    )
    .eq("workspace_id", profile.workspace_id)
    .eq("employee_id", profile.id)
    .maybeSingle<AssignmentWithTrack>();

  if (assignmentError) {
    throw new Error(
      `Failed to load onboarding assignment: ${assignmentError.message}`,
    );
  }

  if (!assignment) {
    return (
      <Card className="rounded-[36px] p-8">
        <BadgePill tone="amber">Awaiting assignment</BadgePill>
        <h2 className="mt-4 text-4xl">Your Journey is not assigned yet.</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
          Your workspace admin can assign a track when it is ready. Your progress
          view will appear here automatically.
        </p>
        <Link href="/employee" className="mt-6 inline-flex">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </Card>
    );
  }

  const { data: milestones, error: milestonesError } = await supabase
    .from("milestones")
    .select("id, track_id, title, description, position, skill_focus, created_at, updated_at")
    .eq("track_id", assignment.track_id)
    .order("position", { ascending: true })
    .returns<MilestoneRecord[]>();

  if (milestonesError) {
    throw new Error(`Failed to load milestones: ${milestonesError.message}`);
  }

  const milestoneIds = milestones.map((milestone) => milestone.id);
  const { data: tasks, error: tasksError } =
    milestoneIds.length > 0
      ? await supabase
          .from("tasks")
          .select(
            "id, milestone_id, title, description, position, skill_contributions, created_at, updated_at",
          )
          .in("milestone_id", milestoneIds)
          .order("position", { ascending: true })
          .returns<TaskRecord[]>()
      : { data: [] as TaskRecord[], error: null };

  if (tasksError) {
    throw new Error(`Failed to load tasks: ${tasksError.message}`);
  }

  const { error: syncProgressError } = await supabase.rpc(
    "ensure_assignment_task_progress",
    { target_assignment_id: assignment.id },
  );

  if (syncProgressError) {
    throw new Error(
      `Failed to initialize task progress: ${syncProgressError.message}`,
    );
  }

  const [progressResult, statsResult, achievementsResult, unlockedResult, avatarResult] =
    await Promise.all([
      supabase
        .from("task_progress")
        .select(
          "id, assignment_id, task_id, employee_id, status, response_text, completed_at, created_at, updated_at",
        )
        .eq("assignment_id", assignment.id)
        .eq("employee_id", profile.id)
        .returns<TaskProgressRecord[]>(),
      supabase
        .from("employee_stats")
        .select(
          "id, workspace_id, employee_id, total_xp, current_level, completed_tasks_count, created_at, updated_at",
        )
        .eq("workspace_id", profile.workspace_id)
        .eq("employee_id", profile.id)
        .maybeSingle<EmployeeStatsRecord>(),
      supabase
        .from("achievements")
        .select("id, code, title, description, sort_order, created_at")
        .order("sort_order", { ascending: true })
        .returns<AchievementRecord[]>(),
      supabase
        .from("employee_achievements")
        .select("id, workspace_id, employee_id, achievement_id, unlocked_at")
        .eq("workspace_id", profile.workspace_id)
        .eq("employee_id", profile.id)
        .returns<EmployeeAchievementRecord[]>(),
      supabase
        .from("profiles")
        .select("avatar_config, role_focus, assigned_skills")
        .eq("id", profile.id)
        .maybeSingle<EmployeeAvatarProfile>(),
    ]);

  if (progressResult.error) {
    throw new Error(`Failed to load task progress: ${progressResult.error.message}`);
  }
  if (statsResult.error) {
    throw new Error(`Failed to load employee stats: ${statsResult.error.message}`);
  }
  if (achievementsResult.error) {
    throw new Error(`Failed to load achievements: ${achievementsResult.error.message}`);
  }
  if (unlockedResult.error) {
    throw new Error(
      `Failed to load unlocked achievements: ${unlockedResult.error.message}`,
    );
  }
  if (avatarResult.error) {
    throw new Error(`Failed to load avatar: ${avatarResult.error.message}`);
  }

  const journeyMilestones = buildJourneyMilestones(
    milestones,
    tasks,
    progressResult.data,
  );
  const nextTask = getNextJourneyTask(journeyMilestones);
  const completedTasks = journeyMilestones.reduce(
    (total, milestone) => total + milestone.completedTasks,
    0,
  );
  const overallPercent = journeyPercent(completedTasks, tasks.length);
  const level = getLevelInfo(statsResult.data?.total_xp ?? 0);
  const stage = getAvatarStage(level.level);
  const nextStage = getNextAvatarStage(level.level);
  const avatarConfig = normalizeStoredAvatarConfig(
    avatarResult.data?.avatar_config,
  );
  const currentMilestone =
    journeyMilestones.find((item) => item.status === "in_progress") ?? null;
  const parsedPreviousLevel = Number(previousLevel);
  const didLevelUp =
    completionSaved === "true" &&
    Number.isFinite(parsedPreviousLevel) &&
    level.level > parsedPreviousLevel;
  const parsedXpEarned = Number(xpEarned);
  const completionGrowthArea = isGrowthAreaName(growthArea)
    ? growthArea
    : "Role Readiness";
  let completionSkillGains = normalizeSkillContributions([]);
  try {
    completionSkillGains = normalizeSkillContributions(skillGains ? JSON.parse(skillGains) : []);
  } catch {
    completionSkillGains = [];
  }
  const trackSkillFocus = normalizeSkillFocus(assignment.track?.skill_focus);

  return (
    <div className="space-y-5">
      {completionError ? (
        <Card className="rounded-[30px] border-red-400/20 bg-red-400/[0.08] p-5" role="alert">
          <p className="font-semibold text-[var(--color-red)]">
            This step could not be completed.
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
            {completionError}
          </p>
        </Card>
      ) : null}

      {completionSaved === "true" ? (
        <Card className="rounded-[32px] border-emerald-400/20 bg-gradient-to-br from-emerald-400/[0.11] via-[#111720] to-[#10141c] p-6 shadow-[0_24px_80px_rgba(34,160,100,0.12)] sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow text-[var(--color-green)]">
                Growth step completed
              </p>
              <h2 className="mt-2 text-3xl">
                {didLevelUp
                  ? `You reached Level ${level.level}.`
                  : "You moved closer to your next level."}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
                {Number.isFinite(parsedXpEarned) && parsedXpEarned > 0
                  ? `You earned ${parsedXpEarned} XP toward ${completionGrowthArea} and `
                  : `Your ${completionGrowthArea} progress is up to date, and `}
                {nextStage
                  ? `moved closer to your next avatar stage, ${nextStage.name}.`
                  : `strengthened your ${stage.name} avatar stage.`}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <BadgePill tone="blue">{completionGrowthArea}</BadgePill>
                {achievementUnlocked ? (
                  <BadgePill tone="green">
                    Achievement unlocked: {achievementUnlocked}
                  </BadgePill>
                ) : null}
              </div>
              {completionSkillGains.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.055] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-green)]">Skills improved</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {completionSkillGains.map((item) => (
                      <span key={item.skill} className="rounded-full border border-white/8 bg-white/[0.045] px-3 py-1.5 text-xs">
                        {item.skill} <strong className="text-[var(--color-green)]">+{item.xp} XP</strong>
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            {nextTask ? (
              <Link
                href={`#task-${nextTask.task.id}`}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-green)] px-5 text-sm font-medium text-white hover:-translate-y-0.5"
              >
                Continue to next growth step
              </Link>
            ) : (
              <BadgePill tone="green">Journey complete</BadgePill>
            )}
          </div>
          <div className="mt-5 flex items-center gap-4">
            <ProgressBar
              value={level.progress}
              tone={level.nextLevel ? "green" : "amber"}
              className="max-w-xl"
            />
            <p className="shrink-0 text-sm text-[var(--color-muted)]">
              {level.totalXp} XP total
            </p>
          </div>
        </Card>
      ) : null}

      <Card className="relative overflow-hidden rounded-[38px] p-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.055] via-blue-400/[0.035] to-transparent" />
        <div className="relative grid lg:grid-cols-[1fr_18rem]">
          <div className="p-6 sm:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <BadgePill tone={overallPercent === 100 ? "green" : "blue"}>
                {overallPercent}% complete
              </BadgePill>
              <BadgePill tone="neutral">Due {assignment.due_date}</BadgePill>
            </div>
            <p className="eyebrow mt-6">Onboarding journey</p>
            <h2 className="mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl">
              {assignment.track?.title ?? "Assigned track"}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              {assignment.track?.description ??
                "A structured path through the knowledge and actions that support your first stage of growth."}
            </p>
            {trackSkillFocus.length > 0 ? (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">Journey skill focus</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {trackSkillFocus.map((skill) => <BadgePill key={skill} tone="blue">{skill}</BadgePill>)}
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                <p className="eyebrow">Current milestone</p>
                <p className="mt-2 font-semibold">
                  {currentMilestone?.milestone.title ??
                    (overallPercent === 100 ? "Journey complete" : "Ready to begin")}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                <p className="eyebrow">Growth stage</p>
                <p className="mt-2 font-semibold">
                  Level {level.level} · {stage.name}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
                <p className="eyebrow">Experience</p>
                <p className="mt-2 font-semibold">{level.totalXp} XP earned</p>
              </div>
            </div>

            <div className="mt-7">
              <div className="flex items-center justify-between gap-4 text-sm">
                <p className="font-medium">Overall journey</p>
                <p className="text-[var(--color-muted)]">
                  {completedTasks} of {tasks.length} steps
                </p>
              </div>
              <ProgressBar
                value={overallPercent}
                tone={overallPercent === 100 ? "green" : "blue"}
                className="mt-3"
              />
            </div>
          </div>

          <div className="relative flex min-h-72 items-end justify-center overflow-hidden border-t border-white/8 bg-white/[0.025] lg:border-l lg:border-t-0">
            <div className="absolute left-5 top-5 z-10">
              <p className="eyebrow">Stage indicator</p>
              <p className="mt-2 text-xl font-semibold">{stage.name}</p>
            </div>
            <div className="absolute bottom-4 h-36 w-36 rounded-full bg-blue-300/25 blur-3xl" />
            <div className="relative translate-y-10">
              <FullBodyAvatar config={avatarConfig} compact />
            </div>
          </div>
        </div>
      </Card>

      <section className="space-y-4">
        <div className="px-1">
          <p className="eyebrow">Journey roadmap</p>
          <h2 className="mt-2 text-3xl">Milestones and growth steps</h2>
        </div>

        {journeyMilestones.length === 0 ? (
          <Card className="rounded-[32px] p-6">
            <p className="text-sm text-[var(--color-muted)]">
              This journey has no milestones yet.
            </p>
          </Card>
        ) : (
          journeyMilestones.map((item, milestoneIndex) => {
            const presentation = milestoneStatusPresentation[item.status];
            const milestoneGrowthAreas = [
              ...new Set(item.tasks.map((task) => task.growthArea)),
            ];
            const primaryGrowthArea =
              milestoneGrowthAreas[0] ?? "Role Readiness";
            const primaryTone = getGrowthAreaDefinition(primaryGrowthArea).tone;
            const milestoneSkillFocus = normalizeSkillFocus(item.milestone.skill_focus);

            return (
              <Card
                key={item.milestone.id}
                className={cx(
                  "relative overflow-hidden rounded-[34px] p-5 sm:p-7",
                  item.status === "in_progress" &&
                    activeMilestoneClasses[primaryTone],
                  item.status === "completed" &&
                    "border-emerald-400/14 bg-emerald-400/[0.025]",
                  item.status === "upcoming" &&
                    "border-white/7 bg-white/[0.018]",
                )}
              >
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ backgroundColor: `var(--color-${primaryTone})` }}
                />
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div
                      className={cx(
                        "flex size-11 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                        item.status === "completed"
                          ? "border-emerald-400/25 bg-emerald-400/10 text-[var(--color-green)]"
                          : item.status === "in_progress"
                            ? "border-blue-400/25 bg-blue-400/10 text-[var(--color-blue)]"
                            : "border-white/10 bg-white/[0.055] text-[var(--color-muted)]",
                      )}
                    >
                      {item.status === "completed" ? "✓" : milestoneIndex + 1}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-3xl">{item.milestone.title}</h3>
                        <BadgePill tone={presentation.tone}>{presentation.label}</BadgePill>
                      </div>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
                        {item.milestone.description ??
                          "A focused set of steps within your onboarding journey."}
                      </p>
                      {milestoneGrowthAreas.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {milestoneGrowthAreas.map((growthArea) => (
                            <BadgePill
                              key={growthArea}
                              tone={getGrowthAreaDefinition(growthArea).tone}
                            >
                              {growthArea}
                            </BadgePill>
                          ))}
                        </div>
                      ) : null}
                      {milestoneSkillFocus.length > 0 ? (
                        <div className="mt-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">Skill focus</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {milestoneSkillFocus.map((skill) => <span key={skill} className="rounded-full border border-purple-400/15 bg-purple-400/[0.055] px-2.5 py-1 text-xs text-purple-200">{skill}</span>)}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-[var(--color-muted)]">
                    {item.completedTasks} / {item.totalTasks} completed
                  </p>
                </div>

                <ProgressBar
                  value={item.progress}
                  tone={item.status === "completed" ? "green" : "blue"}
                  className="mt-6"
                />

                <div className="mt-6 grid gap-3">
                  {item.tasks.length === 0 ? (
                    <p className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 text-sm text-[var(--color-muted)]">
                      No steps have been added to this milestone.
                    </p>
                  ) : (
                    item.tasks.map((task, taskIndex) => {
                      const isCompleted = task.progress?.status === "COMPLETED";
                      const taskSkillContributions = normalizeSkillContributions(task.skill_contributions);
                      const growthAreaTone = getGrowthAreaDefinition(
                        task.growthArea,
                      ).tone;

                      return (
                        <div
                          id={`task-${task.id}`}
                          key={task.id}
                          className={cx(
                            "scroll-mt-32 rounded-[26px] border p-4 sm:p-5",
                            isCompleted
                              ? "border-emerald-900/8 bg-[var(--color-green-soft)]"
                              : growthStepClasses[growthAreaTone],
                          )}
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex gap-4">
                              <div
                                className={cx(
                                  "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                                  isCompleted
                                    ? "bg-emerald-400/10 text-[var(--color-green)]"
                                    : "bg-white/[0.055] text-[var(--color-muted)]",
                                )}
                              >
                                {isCompleted ? "✓" : taskIndex + 1}
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="font-semibold">{task.title}</p>
                                  <BadgePill tone={growthAreaTone}>
                                    {task.growthArea}
                                  </BadgePill>
                                  <span className="text-xs font-medium text-[var(--color-amber)]">
                                    +{TASK_XP_REWARD} XP
                                  </span>
                                </div>
                                <p className="mt-1 max-w-3xl text-sm leading-6 text-[var(--color-muted)]">
                                  {task.description ??
                                    "Complete this step to continue building progress in your journey."}
                                </p>
                                {taskSkillContributions.length > 0 ? (
                                  <div className="mt-3">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">Develops</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {taskSkillContributions.map((item) => (
                                        <span key={item.skill} className="rounded-full border border-blue-400/15 bg-blue-400/[0.06] px-2.5 py-1 text-xs text-blue-100">
                                          {item.skill} <strong className="text-[var(--color-blue)]">+{item.xp} XP</strong>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="mt-2 text-xs font-medium text-[var(--color-blue)]">
                                    Develops skills through the existing {task.growthArea} mapping.
                                  </p>
                                )}
                              </div>
                            </div>

                            {isCompleted ? (
                              <BadgePill tone="green">Completed</BadgePill>
                            ) : task.progress ? (
                              <form
                                action={completeTask.bind(null, assignment.id, task.id)}
                                className="shrink-0"
                              >
                                <Button type="submit" size="sm">
                                  Complete growth step
                                </Button>
                              </form>
                            ) : (
                              <BadgePill tone="red">Unavailable</BadgePill>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card>
            );
          })
        )}
      </section>

      <AchievementList
        achievements={achievementsResult.data}
        unlockedAchievements={unlockedResult.data}
      />
    </div>
  );
}
