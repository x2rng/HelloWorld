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
  state,
  compact = false,
}: {
  config: PixelCompanionConfig;
  stage: CompanionStage;
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
        compact ? "min-h-40" : "min-h-[28rem]",
      )}
    >
      <div
        className={cx(
          "absolute rounded-full bg-blue-400/14 blur-3xl",
          compact ? "size-28" : "size-64",
        )}
      />
      <div
        className={cx(
          "absolute rounded-full border border-white/8 bg-white/[0.025]",
          compact ? "size-28" : "size-72",
        )}
      />
      <PixelCompanion
        config={config}
        stage={stage}
        state={state}
        size={compact ? 124 : 260}
        className="relative"
      />
      <div
        className={cx(
          "relative text-center",
          compact ? "mt-1" : "mt-4",
        )}
      >
        <p className={cx("font-semibold text-white", compact ? "text-xs" : "text-base")}>
          {family.label}
        </p>
        <Link
          href="/employee/avatar"
          className={cx(
            "mt-1 inline-flex font-medium text-blue-200/70 transition hover:text-blue-100",
            compact ? "text-[10px]" : "text-xs",
          )}
        >
          Customize companion
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
  const activeMilestone =
    journeyMilestones.find((milestone) => milestone.status === "in_progress") ??
    journeyMilestones.find((milestone) => milestone.status === "upcoming") ??
    journeyMilestones.at(-1) ??
    null;

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
  const primaryAction = getEmployeeDashboardAction({
    playerSetupCompleted: profile.player_setup_completed !== false,
    nextTaskId: nextTask?.task.id ?? null,
    nextTaskStatus: nextTask?.task.progress?.status ?? null,
    completedTasks,
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
    .slice(0, 3);
  const journeyName = assignment?.track?.title ?? "No journey assigned yet";
  const journeyIsComplete = totalTasks > 0 && completedTasks === totalTasks;
  const totalCompletedTasks =
    statsResult.data?.completed_tasks_count ?? completedTasks;

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[38px] border border-white/10 bg-[#090d14] text-white shadow-[0_32px_110px_rgba(0,0,0,0.42)]">
        <div className="absolute -left-24 top-12 size-72 rounded-full bg-blue-500/14 blur-3xl" />
        <div className="absolute -right-16 -top-20 size-80 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-300/35 to-transparent" />

        <div className="relative grid lg:grid-cols-[minmax(0,1.12fr)_minmax(21rem,0.68fr)]">
          <div className="p-5 sm:p-8 lg:p-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-200/65">
              Player home
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl leading-[0.98] sm:text-6xl">
              Welcome back, {firstName}.
            </h1>

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_8.5rem] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_11rem] lg:block">
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  <span className="whitespace-nowrap">Level {level.level}</span>
                  <span className="whitespace-nowrap">
                    <span className="mr-2 hidden text-white/24 sm:inline">·</span>
                    {levelTitle}
                  </span>
                </p>
                <p className="mt-2 text-sm text-white/52">
                  {level.nextLevel
                    ? `${level.totalXp} / ${xpTarget} XP to Level ${level.nextLevel}`
                    : `${level.totalXp} total XP · Current level peak`}
                </p>
                <div
                  className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/9"
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
                <p className="mt-2 text-xs text-white/38">
                  {level.nextLevel
                    ? `${level.xpToNextLevel} XP remaining`
                    : "Highest current EXP level reached"}
                </p>
              </div>

              <div className="lg:hidden">
                <DashboardCompanion
                  config={companionConfig}
                  stage={companionStage.id}
                  state={companionState}
                  compact
                />
              </div>
            </div>

            <div className="mt-7 border-t border-white/9 pt-6">
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
                    Current journey
                  </p>
                  <p className="mt-2 line-clamp-1 text-lg font-semibold sm:text-xl">
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
                className="mt-4 h-2 overflow-hidden rounded-full bg-white/9"
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
            </div>

            <Link
              href={primaryAction.href}
              className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 shadow-[0_14px_40px_rgba(255,255,255,0.1)] transition hover:-translate-y-0.5 hover:bg-blue-50 sm:w-auto"
            >
              {primaryAction.label}
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          <div className="relative hidden overflow-hidden border-l border-white/8 bg-white/[0.018] lg:flex lg:items-center lg:justify-center">
            <div className="absolute inset-x-10 bottom-12 h-20 rounded-full bg-blue-400/10 blur-3xl" />
            <DashboardCompanion
              config={companionConfig}
              stage={companionStage.id}
              state={companionState}
            />
          </div>
        </div>
      </section>

      {!hasRoleSkills ? <OccupationSetupForm /> : null}

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[34px] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Today&apos;s focus</p>
              <h2 className="mt-2 text-3xl">Your next meaningful step</h2>
            </div>
            {nextTask ? (
              <BadgePill tone="amber">+{TASK_XP_REWARD} XP</BadgePill>
            ) : null}
          </div>

          {nextTask ? (
            <div className="mt-7">
              <p className="text-sm font-semibold text-blue-200">
                {nextTask.milestone.title}
              </p>
              <h3 className="mt-2 text-3xl leading-tight">
                {nextTask.task.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {nextTask.task.description ??
                  "Continue this step to move your onboarding journey forward."}
              </p>
              <Link
                href={`/employee/onboarding#task-${nextTask.task.id}`}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.055] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
              >
                Open next step
              </Link>
            </div>
          ) : assignment ? (
            <div className="mt-7 rounded-[26px] border border-emerald-400/14 bg-emerald-400/[0.055] p-5">
              <p className="text-xl font-semibold">
                {journeyIsComplete
                  ? "Your assigned journey is complete."
                  : "There is no active step right now."}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Review the journey to see the progress already recorded across
                each milestone.
              </p>
              <Link
                href="/employee/onboarding"
                className="mt-5 inline-flex text-sm font-semibold text-emerald-200"
              >
                View journey
              </Link>
            </div>
          ) : (
            <div className="mt-7 rounded-[26px] border border-white/8 bg-white/[0.025] p-5">
              <p className="text-xl font-semibold">No journey assigned yet.</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Your workspace admin can assign an onboarding journey when it is
                ready.
              </p>
              <Link
                href="/employee/onboarding"
                className="mt-5 inline-flex text-sm font-semibold text-blue-200"
              >
                View journey
              </Link>
            </div>
          )}
        </Card>

        <Card className="rounded-[34px] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Journey progress</p>
              <h2 className="mt-2 text-3xl">{journeyName}</h2>
            </div>
            <p className="text-3xl font-semibold text-white">
              {journeyProgress}%
            </p>
          </div>

          <div className="mt-7 h-2.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-200"
              style={{ width: `${journeyProgress}%` }}
            />
          </div>

          <div className="mt-7 rounded-[26px] border border-white/8 bg-white/[0.025] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/38">
                {journeyIsComplete ? "Final milestone" : "Current milestone"}
              </p>
              {activeMilestone ? (
                <span
                  className={cx(
                    "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                    activeMilestone.status === "completed"
                      ? "bg-emerald-400/10 text-emerald-200"
                      : activeMilestone.status === "in_progress"
                        ? "bg-blue-400/10 text-blue-200"
                        : "bg-white/[0.055] text-white/45",
                  )}
                >
                  {milestoneStatusCopy[activeMilestone.status]}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-xl font-semibold">
              {activeMilestone?.milestone.title ?? "Waiting for your first milestone"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {activeMilestone?.milestone.description ??
                (assignment
                  ? "Milestone details will appear as the journey is prepared."
                  : "A current milestone will appear after a journey is assigned.")}
            </p>
            {activeMilestone ? (
              <div className="mt-5 flex items-center justify-between gap-4 text-sm">
                <span className="text-[var(--color-muted)]">
                  {activeMilestone.completedTasks} of {activeMilestone.totalTasks} steps
                </span>
                <span className="font-semibold">
                  {activeMilestone.progress}%
                </span>
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
            <span>
              {completedMilestones} of {journeyMilestones.length} milestones completed
            </span>
            {assignment ? (
              <Link
                href="/employee/onboarding"
                className="font-semibold text-blue-200"
              >
                Open full journey
              </Link>
            ) : null}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <Card className="rounded-[34px] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Achievements preview</p>
              <h2 className="mt-2 text-3xl">Recent proof of growth</h2>
            </div>
            <BadgePill tone="amber">
              {unlockedResult.data.length} unlocked
            </BadgePill>
          </div>

          <div className="mt-7 space-y-3">
            {recentUnlockedAchievements.length > 0 ? (
              recentUnlockedAchievements.map(({ achievement, unlockedAt }) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-4 rounded-[24px] border border-amber-300/12 bg-amber-300/[0.045] p-4"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-amber-300/18 bg-amber-300/10 text-amber-200">
                    ◆
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-[10px] uppercase tracking-[0.12em] text-white/35">
                        {new Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                        }).format(new Date(unlockedAt))}
                      </p>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                      {achievementDescription(achievement.description)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-white/8 bg-white/[0.025] p-5">
                <p className="font-semibold">Your first achievement is ahead.</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Complete journey steps to begin building a visible record of
                  progress.
                </p>
              </div>
            )}
          </div>

          <Link
            href="/employee/player"
            className="mt-6 inline-flex text-sm font-semibold text-blue-200"
          >
            View Player and achievements
          </Link>
        </Card>

        <Card className="rounded-[34px] p-6 sm:p-8">
          <p className="eyebrow">Progress summary</p>
          <h2 className="mt-2 text-3xl">Your momentum at a glance</h2>

          <dl className="mt-7 divide-y divide-white/8 border-y border-white/8">
            {[
              ["Total steps completed", totalCompletedTasks],
              ["Milestones completed", completedMilestones],
              ["Steps remaining", remainingTasks],
              ["Achievements unlocked", unlockedResult.data.length],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-4"
              >
                <dt className="text-sm text-[var(--color-muted)]">{label}</dt>
                <dd className="text-2xl font-semibold text-white">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-5 text-sm leading-6 text-[var(--color-muted)]">
            Progress reflects completed onboarding steps and achievements already
            recorded in EXP.
          </p>
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
