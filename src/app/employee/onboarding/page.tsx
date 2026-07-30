import Link from "next/link";
import { PixelCompanion } from "@/components/avatar/pixel-companion";
import { AchievementList } from "@/components/employee/achievement-list";
import { JourneyRoadmap } from "@/components/employee/journey-roadmap";
import { SkillsPanel } from "@/components/employee/skills-panel";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { normalizeStoredAvatarConfig } from "@/components/avatar-3d/config/avatar-v4-parser";
import { getCompanionStage } from "@/lib/avatar/get-companion-stage";
import { createPixelCompanionFromStored } from "@/lib/avatar/normalize-companion-config";
import { getAvatarStage, getNextAvatarStage } from "@/lib/avatar-stage";
import {
  buildJourneyMilestones,
  getNextJourneyTask,
  journeyPercent,
} from "@/lib/employee-journey";
import { requireRole } from "@/lib/exp-auth";
import { isGrowthAreaName } from "@/lib/growth-areas";
import type {
  AchievementRecord,
  EmployeeAchievementRecord,
  EmployeeStatsRecord,
  MilestoneRecord,
  TaskProgressRecord,
  TaskRecord,
} from "@/lib/exp-types";
import { buildJourneyRoadmap } from "@/lib/journey-roadmap";
import { getLevelInfo } from "@/lib/levels";
import { normalizeSkillContributions, normalizeSkillFocus } from "@/lib/skill-attribution";
import {
  deriveSkillGroups,
  normalizeAssignedSkills,
  normalizeRoleFocus,
  type RoleFocus,
} from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";

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
    const [emptyStatsResult, emptyAvatarResult] = await Promise.all([
      supabase
        .from("employee_stats")
        .select("id, workspace_id, employee_id, total_xp, current_level, completed_tasks_count, created_at, updated_at")
        .eq("workspace_id", profile.workspace_id)
        .eq("employee_id", profile.id)
        .maybeSingle<EmployeeStatsRecord>(),
      supabase
        .from("profiles")
        .select("avatar_config, role_focus, assigned_skills")
        .eq("id", profile.id)
        .maybeSingle<EmployeeAvatarProfile>(),
    ]);
    const emptyLevel = getLevelInfo(emptyStatsResult.data?.total_xp ?? 0);
    const emptyStage = getAvatarStage(emptyLevel.level);
    const emptyCompanionStage = getCompanionStage(emptyLevel.level);
    const emptyCompanionConfig = createPixelCompanionFromStored(
      emptyAvatarResult.data?.avatar_config,
    );
    const emptyRoleFocus = normalizeRoleFocus(emptyAvatarResult.data?.role_focus);
    const emptyAssignedSkills = normalizeAssignedSkills(emptyAvatarResult.data?.assigned_skills);

    return (
      <div className="space-y-5">
        <Card className="relative overflow-hidden rounded-[36px] p-0">
          <div className="absolute -right-12 -top-16 size-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="relative grid items-center gap-4 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div>
              <BadgePill tone="amber">Awaiting assignment</BadgePill>
              <p className="eyebrow mt-6">Your journey</p>
              <h1 className="mt-2 max-w-2xl text-4xl leading-tight sm:text-5xl">
                Your onboarding roadmap will appear here.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
                Your workspace admin can assign a journey when it is ready. Once
                assigned, you will see every milestone, the current step, and what
                comes next.
              </p>
              <Link href="/employee" className="mt-6 inline-flex">
                <Button variant="secondary">Back to Home</Button>
              </Link>
            </div>
            <div className="flex min-h-48 items-center justify-center">
              <PixelCompanion
                config={emptyCompanionConfig}
                state="idle"
                stage={emptyCompanionStage.id}
                size={150}
                reducedMotion
                label={`${emptyCompanionConfig.family} companion waiting for a journey`}
              />
            </div>
          </div>
        </Card>
        <SkillsPanel
          employeeName={profile.full_name ?? profile.email}
          roleFocus={emptyRoleFocus}
          avatarConfig={normalizeStoredAvatarConfig(
            emptyAvatarResult.data?.avatar_config,
          )}
          stage={emptyStage}
          nextStage={getNextAvatarStage(emptyLevel.level)}
          overall={emptyLevel}
          groups={deriveSkillGroups([], emptyRoleFocus, emptyAssignedSkills)}
        />
      </div>
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
  const journeyComplete = tasks.length > 0 && completedTasks === tasks.length;
  const level = getLevelInfo(statsResult.data?.total_xp ?? 0);
  const stage = getAvatarStage(level.level);
  const nextStage = getNextAvatarStage(level.level);
  const avatarConfig = normalizeStoredAvatarConfig(
    avatarResult.data?.avatar_config,
  );
  const pixelCompanionConfig = createPixelCompanionFromStored(
    avatarResult.data?.avatar_config,
  );
  const companionStage = getCompanionStage(level.level);
  const roleFocus = normalizeRoleFocus(avatarResult.data?.role_focus);
  const assignedSkills = normalizeAssignedSkills(avatarResult.data?.assigned_skills);
  const skillGroups = deriveSkillGroups(journeyMilestones, roleFocus, assignedSkills);
  const roadmapMilestones = buildJourneyRoadmap({
    milestones: journeyMilestones,
    nextTaskId: nextTask?.task.id ?? null,
    journeyComplete,
  });
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
                href={`#milestone-${nextTask.milestone.id}`}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-green)] px-5 text-sm font-medium text-white hover:-translate-y-0.5"
              >
                Continue to current milestone
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

      <JourneyRoadmap
        assignmentId={assignment.id}
        track={{
          title: assignment.track?.title ?? "Assigned track",
          description: assignment.track?.description ?? null,
          skillFocus: trackSkillFocus,
        }}
        milestones={roadmapMilestones}
        journeyComplete={journeyComplete}
        completedTasks={completedTasks}
        totalTasks={tasks.length}
        overallPercent={overallPercent}
        level={{
          current: level.level,
          totalXp: level.totalXp,
          progress: level.progress,
          nextLevel: level.nextLevel,
          xpToNextLevel: level.xpToNextLevel,
        }}
        companion={{
          config: pixelCompanionConfig,
          stage: companionStage.id,
        }}
      />

      <AchievementList
        achievements={achievementsResult.data}
        unlockedAchievements={unlockedResult.data}
      />
      <SkillsPanel
        employeeName={profile.full_name ?? profile.email}
        roleFocus={roleFocus}
        avatarConfig={avatarConfig}
        stage={stage}
        nextStage={nextStage}
        overall={level}
        groups={skillGroups}
      />
    </div>
  );
}
