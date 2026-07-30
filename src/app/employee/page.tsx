import Link from "next/link";
import { PixelCompanion } from "@/components/avatar/pixel-companion";
import { companionFamilyDefinitions } from "@/lib/avatar/companion-types";
import type {
  CompanionStage,
  CompanionState,
  PixelCompanionConfig,
} from "@/lib/avatar/companion-types";
import { getCompanionStage } from "@/lib/avatar/get-companion-stage";
import { createPixelCompanionFromStored } from "@/lib/avatar/normalize-companion-config";
import { normalizeStoredAvatarConfig } from "@/components/avatar-3d/config/avatar-v4-parser";
import { OccupationSetupForm } from "@/components/employee/occupation-setup-form";
import { SkillsPanel } from "@/components/employee/skills-panel";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { getAvatarStage, getNextAvatarStage } from "@/lib/avatar-stage";
import {
  getEmployeeDashboardAction,
  getEmployeeDashboardJourneyState,
  getEmployeeLevelTitle,
} from "@/lib/employee-dashboard";
import {
  buildJourneyMilestones,
  getNextJourneyTask,
  journeyPercent,
  TASK_XP_REWARD,
} from "@/lib/employee-journey";
import { requireRole } from "@/lib/exp-auth";
import type {
  AchievementRecord,
  EmployeeAchievementRecord,
  EmployeeStatsRecord,
  MilestoneRecord,
  TaskProgressRecord,
  TaskRecord,
} from "@/lib/exp-types";
import { getLevelInfo } from "@/lib/levels";
import {
  deriveSkillGroups,
  hasAssignedRoleSkills,
  normalizeAssignedSkills,
  normalizeRoleFocus,
  type RoleFocus,
} from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";
import { cx } from "@/lib/utils";

type EmployeeAssignment = {
  id: string;
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

const milestoneStatusCopy = {
  completed: "Completed",
  in_progress: "Current milestone",
  upcoming: "Upcoming",
} as const;

function achievementDescription(description: string) {
  return description
    .replace(/onboarding tasks/gi, "journey steps")
    .replace(/onboarding task/gi, "growth step")
    .replace(/tasks/gi, "growth steps")
    .replace(/task/gi, "growth step");
}

function DashboardCompanion({
  config,
  stage,
  level,
  state,
  compact = false,
}: {
  config: PixelCompanionConfig;
  stage: CompanionStage;
  level: number;
  state: CompanionState;
  compact?: boolean;
}) {
  const family =
    companionFamilyDefinitions.find((item) => item.id === config.family) ??
    companionFamilyDefinitions[0];

  return (
    <div
      className={cx(
        "relative flex flex-col items-center justify-center",
        compact ? "min-h-36" : "min-h-[24rem]",
      )}
    >
      <div
        className={cx(
          "absolute rounded-full bg-blue-400/14 blur-3xl",
          compact ? "size-24" : "size-60",
        )}
      />
      <div
        className={cx(
          "absolute rounded-full border border-white/8 bg-white/[0.025]",
          compact ? "size-24" : "size-64",
        )}
      />
      <PixelCompanion
        config={config}
        stage={stage}
        state={state}
        size={compact ? 112 : 236}
        className="relative"
      />
      <div
        className={cx(
          "relative text-center",
          compact ? "mt-1" : "mt-4",
        )}
      >
        <p
          className={cx(
            "font-semibold text-white",
            compact ? "text-[11px]" : "text-sm",
          )}
        >
          {family.label}
          <span className="hidden text-white/25 sm:inline"> · </span>
          <span className="block text-white/55 sm:inline">
            Level {level} companion
          </span>
        </p>
        <Link
          href="/employee/avatar"
          className={cx(
            "mt-1 inline-flex font-medium text-blue-200/70 transition hover:text-blue-100",
            compact ? "text-[10px]" : "text-xs",
          )}
        >
          Edit
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function EmployeePage() {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const { data: assignment, error } = await supabase
    .from("track_assignments")
    .select(
      "id, status, start_date, due_date, track:onboarding_tracks(id, title, description, skill_focus)",
    )
    .eq("workspace_id", profile.workspace_id)
    .eq("employee_id", profile.id)
    .maybeSingle<EmployeeAssignment>();

  if (error) {
    throw new Error(`Failed to load assignment: ${error.message}`);
  }

  const [statsResult, achievementsResult, unlockedResult, avatarResult] =
    await Promise.all([
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

  let milestones: MilestoneRecord[] = [];
  let tasks: TaskRecord[] = [];
  let progressRows: TaskProgressRecord[] = [];

  if (assignment?.track) {
    const { data, error: milestonesError } = await supabase
      .from("milestones")
      .select(
        "id, track_id, title, description, position, skill_focus, created_at, updated_at",
      )
      .eq("track_id", assignment.track.id)
      .order("position", { ascending: true })
      .returns<MilestoneRecord[]>();

    if (milestonesError) {
      throw new Error(`Failed to load milestones: ${milestonesError.message}`);
    }

    milestones = data;
    const milestoneIds = milestones.map((milestone) => milestone.id);
    const [tasksResult, progressResult] = await Promise.all([
      milestoneIds.length > 0
        ? supabase
            .from("tasks")
            .select(
              "id, milestone_id, title, description, position, skill_contributions, created_at, updated_at",
            )
            .in("milestone_id", milestoneIds)
            .order("position", { ascending: true })
            .returns<TaskRecord[]>()
        : Promise.resolve({ data: [] as TaskRecord[], error: null }),
      supabase
        .from("task_progress")
        .select(
          "id, assignment_id, task_id, employee_id, status, response_text, completed_at, created_at, updated_at",
        )
        .eq("assignment_id", assignment.id)
        .eq("employee_id", profile.id)
        .returns<TaskProgressRecord[]>(),
    ]);

    if (tasksResult.error) {
      throw new Error(`Failed to load tasks: ${tasksResult.error.message}`);
    }
    if (progressResult.error) {
      throw new Error(`Failed to load progress: ${progressResult.error.message}`);
    }

    tasks = tasksResult.data;
    progressRows = progressResult.data;
  }

  const journeyMilestones = buildJourneyMilestones(
    milestones,
    tasks,
    progressRows,
  );
  const nextTask = getNextJourneyTask(journeyMilestones);
  const completedTasks = journeyMilestones.reduce(
    (total, milestone) => total + milestone.completedTasks,
    0,
  );
  const totalTasks = tasks.length;
  const remainingTasks = Math.max(0, totalTasks - completedTasks);
  const journeyProgress = journeyPercent(completedTasks, totalTasks);
  const completedMilestones = journeyMilestones.filter(
    (milestone) => milestone.status === "completed",
  ).length;

  const level = getLevelInfo(statsResult.data?.total_xp ?? 0);
  const levelTitle = getEmployeeLevelTitle(level.level);
  const xpTarget = level.nextLevel
    ? level.totalXp + level.xpToNextLevel
    : level.totalXp;
  const companionStage = getCompanionStage(level.level);
  const companionConfig = createPixelCompanionFromStored(
    avatarResult.data?.avatar_config,
  );
  const companionState: CompanionState = nextTask ? "working" : "idle";
  const journeyState = getEmployeeDashboardJourneyState({
    hasAssignment: Boolean(assignment?.track),
    totalTasks,
    completedTasks,
    nextTaskId: nextTask?.task.id ?? null,
  });
  const primaryAction = getEmployeeDashboardAction({
    playerSetupCompleted: profile.player_setup_completed !== false,
    journeyState,
    nextTaskId: nextTask?.task.id ?? null,
  });

  const firstName = (profile.full_name ?? profile.email).split(" ")[0];
  const roleFocus = normalizeRoleFocus(avatarResult.data?.role_focus);
  const assignedSkills = normalizeAssignedSkills(
    avatarResult.data?.assigned_skills,
  );
  const hasRoleSkills = hasAssignedRoleSkills(
    avatarResult.data?.role_focus,
    avatarResult.data?.assigned_skills,
  );
  const skillGroups = deriveSkillGroups(
    journeyMilestones,
    roleFocus,
    assignedSkills,
  );

  const avatarConfig = normalizeStoredAvatarConfig(
    avatarResult.data?.avatar_config,
  );
  const avatarStage = getAvatarStage(level.level);
  const nextAvatarStage = getNextAvatarStage(level.level);
  const achievementsById = new Map(
    achievementsResult.data.map((achievement) => [achievement.id, achievement]),
  );
  const recentUnlockedAchievements = unlockedResult.data
    .flatMap((unlocked) => {
      const achievement = achievementsById.get(unlocked.achievement_id);
      return achievement
        ? [{ achievement, unlockedAt: unlocked.unlocked_at }]
        : [];
    })
    .sort((left, right) => right.unlockedAt.localeCompare(left.unlockedAt))
    .slice(0, 2);
  const journeyName = assignment?.track?.title ?? "No journey assigned yet";
  const journeyIsComplete = journeyState === "completed";
  const totalCompletedTasks =
    statsResult.data?.completed_tasks_count ?? completedTasks;

  return (
    <div className="space-y-4 pb-5 lg:pb-0">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#090d14] text-white shadow-[0_32px_110px_rgba(0,0,0,0.42)] sm:rounded-[38px]">
        <div className="absolute -left-24 top-12 size-72 rounded-full bg-blue-500/14 blur-3xl" />
        <div className="absolute -right-16 -top-20 size-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-300/35 to-transparent" />

        <div className="relative grid lg:grid-cols-[minmax(0,1.18fr)_minmax(19rem,0.62fr)]">
          <div className="p-5 sm:p-7 lg:p-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-200/65">
              Player home
            </p>
            <h1 className="mt-2 max-w-3xl text-[2.15rem] leading-none sm:text-5xl lg:text-[3.6rem]">
              Welcome back, {firstName}.
            </h1>

            <div className="mt-5 grid grid-cols-[minmax(0,1fr)_8rem] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_10rem] lg:block">
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  <span className="whitespace-nowrap">Level {level.level}</span>
                  <span className="whitespace-nowrap">
                    <span className="mr-2 hidden text-white/24 sm:inline">·</span>
                    {levelTitle}
                  </span>
                </p>
                <p className="mt-1.5 text-sm text-white/52">
                  {level.nextLevel
                    ? `${level.totalXp} / ${xpTarget} XP to Level ${level.nextLevel}`
                    : `${level.totalXp} total XP · Current level peak`}
                </p>
                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-white/9"
                  role="progressbar"
                  aria-label="Level progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={level.progress}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-300 to-cyan-200 shadow-[0_0_20px_rgba(96,165,250,0.42)]"
                    style={{ width: `${Math.min(100, Math.max(0, level.progress))}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-white/38">
                  {level.nextLevel
                    ? `${level.xpToNextLevel} XP remaining`
                    : "Highest current EXP level reached"}
                </p>
              </div>

              <div className="lg:hidden">
                <DashboardCompanion
                  config={companionConfig}
                  stage={companionStage.id}
                  level={level.level}
                  state={companionState}
                  compact
                />
              </div>
            </div>

            <div className="mt-5 border-t border-white/9 pt-5">
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
                    Current journey
                  </p>
                  <p className="mt-1.5 line-clamp-1 text-lg font-semibold sm:text-xl">
                    {journeyName}
                  </p>
                  <p className="mt-1 text-sm text-white/46">
                    {assignment
                      ? `${completedTasks} of ${totalTasks} steps completed`
                      : "Your assigned journey will appear here"}
                  </p>
                </div>
                <p className="shrink-0 text-3xl font-semibold sm:text-4xl">
                  {journeyProgress}%
                </p>
              </div>
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-white/9"
                role="progressbar"
                aria-label="Journey progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={journeyProgress}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-200"
                  style={{ width: `${journeyProgress}%` }}
                />
              </div>

              {journeyState === "active" && nextTask ? (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-blue-300/10 bg-blue-300/[0.045] px-3.5 py-2.5">
                  <p className="min-w-0 truncate text-xs text-white/66 sm:text-sm">
                    <span className="font-semibold text-blue-100">Next up:</span>{" "}
                    {nextTask.task.title}
                  </p>
                  <span className="shrink-0 text-[10px] font-semibold text-amber-200 sm:text-xs">
                    +{TASK_XP_REWARD} XP
                  </span>
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href={primaryAction.href}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(255,255,255,0.1)] transition hover:-translate-y-0.5 hover:bg-blue-50 sm:w-auto"
              >
                {primaryAction.label}
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
              <Link
                href="/employee/activities"
                className="inline-flex px-1 text-xs font-semibold text-white/48 transition hover:text-white/78"
              >
                Log activity
              </Link>
            </div>
          </div>

          <div className="relative hidden overflow-hidden border-l border-white/8 bg-white/[0.018] lg:flex lg:items-center lg:justify-center">
            <div className="absolute inset-x-10 bottom-12 h-20 rounded-full bg-blue-400/10 blur-3xl" />
            <DashboardCompanion
              config={companionConfig}
              stage={companionStage.id}
              level={level.level}
              state={companionState}
            />
          </div>
        </div>
      </section>

      {!hasRoleSkills ? <OccupationSetupForm /> : null}

      <Card className="overflow-hidden rounded-[30px] p-0">
        <div className="grid xl:grid-cols-[0.9fr_1.1fr]">
          <section className="p-5 sm:p-7 xl:flex xl:flex-col xl:justify-center">
          {journeyState === "active" && nextTask ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="eyebrow">Today&apos;s focus</p>
                  <h2 className="mt-2 text-2xl leading-tight sm:text-3xl">
                    {nextTask.task.title}
                  </h2>
                </div>
                <BadgePill tone="amber">+{TASK_XP_REWARD} XP</BadgePill>
              </div>
              <p className="mt-4 text-sm font-semibold text-blue-200">
                {nextTask.milestone.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {nextTask.task.description ??
                  "Continue this step to move your onboarding journey forward."}
              </p>
              <Link
                href={`/employee/onboarding#task-${nextTask.task.id}`}
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.055] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Continue next step
              </Link>
            </>
          ) : journeyIsComplete ? (
            <>
              <p className="eyebrow text-emerald-200/70">Journey complete</p>
              <h2 className="mt-2 text-2xl sm:text-3xl">Every step is complete.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-muted)]">
                You completed every step in this onboarding journey. Review your
                progress or see what you unlocked.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link
                  href="/employee/onboarding"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-300/18 bg-emerald-300/[0.08] px-5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/[0.13]"
                >
                  Review journey
                </Link>
                <Link
                  href="/employee/player"
                  className="text-sm font-semibold text-blue-200"
                >
                  View achievements
                </Link>
              </div>
            </>
          ) : journeyState === "assigned_without_next" ? (
            <>
              <p className="eyebrow">Journey status</p>
              <h2 className="mt-2 text-2xl sm:text-3xl">
                No next step is available.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                Your journey is assigned, but there is no actionable step to
                continue right now.
              </p>
              <Link
                href="/employee/onboarding"
                className="mt-5 inline-flex text-sm font-semibold text-blue-200"
              >
                View journey
              </Link>
            </>
          ) : (
            <>
              <p className="eyebrow">Journey status</p>
              <h2 className="mt-2 text-2xl sm:text-3xl">
                No journey assigned yet.
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                Your workspace admin can assign an onboarding journey when it is
                ready.
              </p>
              <Link
                href="/employee/onboarding"
                className="mt-5 inline-flex text-sm font-semibold text-blue-200"
              >
                View journey
              </Link>
            </>
          )}
          </section>

          <section className="border-t border-white/8 p-5 sm:p-7 xl:border-l xl:border-t-0">
            <p className="eyebrow">Journey progress</p>
            <h2 className="mt-2 text-2xl sm:text-3xl">Milestone path</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              See the structure behind your overall journey progress.
            </p>

            {journeyMilestones.length > 0 ? (
              <ol className="mt-5 space-y-2">
                {journeyMilestones.map((milestone, index) => (
                  <li
                    key={milestone.milestone.id}
                    className="flex items-center gap-3 rounded-[20px] border border-white/8 bg-white/[0.025] px-3.5 py-3"
                  >
                    <span
                      className={cx(
                        "flex size-8 shrink-0 items-center justify-center rounded-xl border text-xs font-semibold",
                        milestone.status === "completed"
                          ? "border-emerald-300/18 bg-emerald-300/10 text-emerald-200"
                          : milestone.status === "in_progress"
                            ? "border-blue-300/20 bg-blue-300/10 text-blue-100"
                            : "border-white/9 bg-white/[0.035] text-white/35",
                      )}
                      aria-hidden="true"
                    >
                      {milestone.status === "completed" ? "✓" : index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {milestone.milestone.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                        {milestone.completedTasks} of {milestone.totalTasks} steps
                      </p>
                    </div>
                    <span
                      className={cx(
                        "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                        milestone.status === "completed"
                          ? "bg-emerald-400/10 text-emerald-200"
                          : milestone.status === "in_progress"
                            ? "bg-blue-400/10 text-blue-200"
                            : "bg-white/[0.055] text-white/42",
                      )}
                    >
                      {milestoneStatusCopy[milestone.status]}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="mt-5 rounded-[20px] border border-white/8 bg-white/[0.025] p-4">
                <p className="text-sm font-semibold">
                  {assignment
                    ? "Milestones are still being prepared."
                    : "Your milestone path will appear here."}
                </p>
              </div>
            )}

            {assignment ? (
              <Link
                href="/employee/onboarding"
                className="mt-5 inline-flex text-sm font-semibold text-blue-200"
              >
                Open full journey
              </Link>
            ) : null}
          </section>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <Card className="rounded-[30px] p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Achievements preview</p>
              <h2 className="mt-2 text-2xl sm:text-3xl">Proof of growth</h2>
            </div>
            <BadgePill tone="amber">
              {unlockedResult.data.length} unlocked
            </BadgePill>
          </div>

          <div className="mt-5 space-y-2.5">
            {recentUnlockedAchievements.length > 0 ? (
              recentUnlockedAchievements.map(({ achievement, unlockedAt }) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-3 rounded-[20px] border border-amber-300/12 bg-amber-300/[0.045] p-3.5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-amber-300/18 bg-amber-300/10 text-sm text-amber-200">
                    ◆
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <p className="text-sm font-semibold">{achievement.title}</p>
                      <p className="text-[9px] uppercase tracking-[0.1em] text-white/35">
                        {new Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                        }).format(new Date(unlockedAt))}
                      </p>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--color-muted)]">
                      {achievementDescription(achievement.description)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-white/8 bg-white/[0.025] p-4">
                <p className="text-sm font-semibold">
                  Your first achievement is ahead.
                </p>
                <p className="mt-1.5 text-xs leading-5 text-[var(--color-muted)]">
                  Complete journey steps to begin building a visible record of
                  progress.
                </p>
              </div>
            )}
          </div>

          <Link
            href="/employee/player"
            className="mt-5 inline-flex text-sm font-semibold text-blue-200"
          >
            View all achievements
          </Link>
        </Card>

        <Card className="rounded-[30px] p-5 sm:p-7">
          <p className="eyebrow">Progress summary</p>
          <h2 className="mt-2 text-2xl sm:text-3xl">Momentum at a glance</h2>

          <dl className="mt-5 grid grid-cols-2 gap-2.5">
            {[
              ["Steps", totalCompletedTasks],
              ["Milestones", completedMilestones],
              ["Achievements", unlockedResult.data.length],
              ["Remaining", remainingTasks],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[20px] border border-white/8 bg-white/[0.025] p-3.5 sm:p-4"
              >
                <dd className="text-2xl font-semibold text-white sm:text-3xl">
                  {value}
                </dd>
                <dt className="mt-1 text-xs text-[var(--color-muted)]">
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <SkillsPanel
        employeeName={profile.full_name ?? profile.email}
        roleFocus={roleFocus}
        avatarConfig={avatarConfig}
        stage={avatarStage}
        nextStage={nextAvatarStage}
        overall={level}
        groups={skillGroups}
      />
    </div>
  );
}
