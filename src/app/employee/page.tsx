import Link from "next/link";
import { AchievementList } from "@/components/employee/achievement-list";
import { FullBodyAvatar } from "@/components/employee/full-body-avatar";
import { OccupationSetupForm } from "@/components/employee/occupation-setup-form";
import { SkillsPanel } from "@/components/employee/skills-panel";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { normalizeAvatarConfig } from "@/lib/avatar-config";
import { getAvatarStage, getNextAvatarStage } from "@/lib/avatar-stage";
import {
  buildJourneyMilestones,
  getJourneyGrowthAreaProgress,
  getNextJourneyTask,
  journeyPercent,
  TASK_XP_REWARD,
} from "@/lib/employee-journey";
import { requireRole } from "@/lib/exp-auth";
import type {
  AchievementRecord,
  EmployeeAchievementRecord,
  EmployeeStatsRecord,
  GrowthActivityRecord,
  MilestoneRecord,
  TaskProgressRecord,
  TaskRecord,
} from "@/lib/exp-types";
import {
  getGrowthAreaDefinition,
  type GrowthAreaTone,
} from "@/lib/growth-areas";
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

type HomeRecognitionRow = {
  activity_id: string;
  points: number;
};

const milestoneStatusCopy = {
  completed: "Completed",
  in_progress: "Active",
  upcoming: "Upcoming",
} as const;

const growthAreaCardClasses: Record<GrowthAreaTone, string> = {
  blue: "border-blue-400/20 bg-blue-400/[0.055] shadow-[inset_0_1px_0_rgba(120,151,255,0.12)]",
  purple:
    "border-purple-400/20 bg-purple-400/[0.055] shadow-[inset_0_1px_0_rgba(178,150,255,0.12)]",
  cyan: "border-cyan-400/20 bg-cyan-400/[0.05] shadow-[inset_0_1px_0_rgba(101,220,236,0.12)]",
  green:
    "border-emerald-400/20 bg-emerald-400/[0.05] shadow-[inset_0_1px_0_rgba(100,217,154,0.12)]",
  orange:
    "border-orange-400/20 bg-orange-400/[0.05] shadow-[inset_0_1px_0_rgba(255,173,110,0.12)]",
};

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

  const [
    statsResult,
    achievementsResult,
    unlockedResult,
    avatarResult,
    recentActivitiesResult,
  ] =
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
      supabase
        .from("growth_activities")
        .select(
          "id, workspace_id, employee_id, title, description, category, skill_name, proof_type, proof_url, visibility, status, suggested_xp, created_at",
        )
        .eq("workspace_id", profile.workspace_id)
        .eq("employee_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(3)
        .returns<GrowthActivityRecord[]>(),
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
  if (recentActivitiesResult.error) {
    throw new Error("Recent growth activity could not be loaded.");
  }

  let milestones: MilestoneRecord[] = [];
  let tasks: TaskRecord[] = [];
  let progressRows: TaskProgressRecord[] = [];

  if (assignment?.track) {
    const { data, error: milestonesError } = await supabase
      .from("milestones")
      .select("id, track_id, title, description, position, skill_focus, created_at, updated_at")
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
  const journeyProgress = journeyPercent(completedTasks, totalTasks);
  const level = getLevelInfo(statsResult.data?.total_xp ?? 0);
  const stage = getAvatarStage(level.level);
  const nextStage = getNextAvatarStage(level.level);
  const growthAreaProgress = getJourneyGrowthAreaProgress(journeyMilestones);
  const hasAvatarConfig = avatarResult.data?.avatar_config != null;
  const avatarConfig = normalizeAvatarConfig(avatarResult.data?.avatar_config);
  const firstName = (profile.full_name ?? profile.email).split(" ")[0];
  const roleFocus = normalizeRoleFocus(avatarResult.data?.role_focus);
  const assignedSkills = normalizeAssignedSkills(avatarResult.data?.assigned_skills);
  const hasRoleSkills = hasAssignedRoleSkills(
    avatarResult.data?.role_focus,
    avatarResult.data?.assigned_skills,
  );
  const skillGroups = deriveSkillGroups(journeyMilestones, roleFocus, assignedSkills);
  const roleSkillPreview =
    skillGroups.find((group) => group.name === "Role Skills")?.skills.slice(0, 4) ??
    [];
  const recentActivityIds = recentActivitiesResult.data.map(
    (activity) => activity.id,
  );
  const recentRecognitionResult =
    recentActivityIds.length > 0
      ? await supabase
          .from("activity_recognitions")
          .select("activity_id, points")
          .in("activity_id", recentActivityIds)
          .returns<HomeRecognitionRow[]>()
      : { data: [] as HomeRecognitionRow[], error: null };

  if (recentRecognitionResult.error) {
    throw new Error("Recent recognition could not be loaded.");
  }

  const recognitionByActivity = new Map<string, number>();
  for (const recognition of recentRecognitionResult.data) {
    recognitionByActivity.set(
      recognition.activity_id,
      (recognitionByActivity.get(recognition.activity_id) ?? 0) +
        recognition.points,
    );
  }

  return (
    <div className="space-y-5">
      {!hasRoleSkills ? <OccupationSetupForm /> : null}
      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0d1119] via-[#0b0e15] to-[#07090e] text-white shadow-[0_35px_120px_rgba(0,0,0,0.46)]">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -right-12 -top-20 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="relative grid min-h-[34rem] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                Home
              </p>
              <h2 className="mt-4 max-w-3xl text-4xl leading-[0.98] sm:text-6xl">
                This is your growth identity, {firstName}.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
                Every completed growth step adds experience, strengthens your Player,
                and moves your avatar toward its next stage.
              </p>
              <Link
                href="/employee/activities"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.07] px-5 text-sm font-semibold text-white/80 transition hover:bg-white/[0.12] hover:text-white"
              >
                Log activity
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                      Level {level.level}
                    </p>
                    <p className="mt-2 text-2xl font-semibold">{stage.name}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
                    {level.totalXp} XP
                  </span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-200"
                    style={{ width: `${Math.max(6, level.progress)}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-white/55">
                  {level.nextLevel
                    ? `${level.xpToNextLevel} XP to Level ${level.nextLevel}`
                    : "Highest V1 level reached"}
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Current journey
                </p>
                <p className="mt-2 line-clamp-1 text-xl font-semibold">
                  {assignment?.track?.title ?? "Awaiting assignment"}
                </p>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <p className="text-3xl font-semibold">{journeyProgress}%</p>
                  <p className="pb-1 text-sm text-white/55">
                    {completedTasks} of {totalTasks} steps
                  </p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-200"
                    style={{ width: `${Math.max(totalTasks > 0 ? 6 : 0, journeyProgress)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[26rem] items-end justify-center overflow-hidden border-t border-white/10 bg-white/[0.04] px-6 pt-8 lg:min-h-full lg:border-l lg:border-t-0">
            <div className="absolute left-7 top-7 z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Current avatar stage
              </p>
              <p className="mt-2 text-2xl font-semibold">{stage.name}</p>
              <p className="mt-1 max-w-48 text-sm leading-6 text-white/55">
                Your avatar evolves as you complete growth steps and gain XP.
              </p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.07] px-3 py-2.5 backdrop-blur">
                <p className="text-xs text-white/45">Next evolution</p>
                <p className="mt-1 text-sm font-medium text-white/80">
                  {nextStage
                    ? `${nextStage.name} · ${level.xpToNextLevel} XP away`
                    : "Highest V1 stage reached"}
                </p>
              </div>
            </div>
            <div className="absolute bottom-8 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="relative translate-y-8 scale-110 sm:scale-125">
              <FullBodyAvatar config={avatarConfig} />
            </div>
            <Link
              href="/employee/avatar"
              className="absolute right-6 top-6 z-10 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur hover:bg-white/15 hover:text-white"
            >
              {hasAvatarConfig ? "Edit player" : "Create player"}
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-[36px] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Today&apos;s focus</p>
              <h3 className="mt-2 text-3xl">One clear next step</h3>
            </div>
            {nextTask ? <BadgePill tone="amber">+{TASK_XP_REWARD} XP</BadgePill> : null}
          </div>

          {nextTask ? (
            <div className="mt-7">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-[var(--color-blue)]">
                  {nextTask.milestone.title}
                </p>
                <BadgePill
                  tone={getGrowthAreaDefinition(nextTask.task.growthArea).tone}
                >
                  {nextTask.task.growthArea}
                </BadgePill>
              </div>
              <h4 className="mt-2 text-3xl leading-tight">{nextTask.task.title}</h4>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                {nextTask.task.description ??
                  "Continue this step to move your onboarding journey forward."}
              </p>
              <Link
                href={`/employee/onboarding#task-${nextTask.task.id}`}
                className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Continue to next growth step
              </Link>
            </div>
          ) : assignment ? (
            <div className="mt-7 rounded-[28px] border border-emerald-900/8 bg-[var(--color-green-soft)] p-5">
              <p className="text-xl font-semibold">Your assigned steps are complete.</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Review the journey to see the progress you have built across each milestone.
              </p>
              <Link
                href="/employee/onboarding"
                className="mt-5 inline-flex text-sm font-semibold text-[var(--color-green)] underline underline-offset-4"
              >
                View journey summary
              </Link>
            </div>
          ) : (
            <div className="mt-7 rounded-[28px] border border-white/8 bg-white/[0.035] p-5">
              <p className="text-xl font-semibold">Your journey will appear here.</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Your workspace admin can assign an onboarding track when it is ready.
              </p>
              <Link
                href="/employee/activities"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950"
              >
                Log activity
              </Link>
            </div>
          )}
        </Card>

        <Card className="rounded-[36px] p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Journey progress</p>
              <h3 className="mt-2 text-3xl">
                {assignment?.track?.title ?? "Onboarding roadmap"}
              </h3>
            </div>
            {assignment ? (
              <Link
                href="/employee/onboarding"
                className="text-sm font-semibold text-[var(--color-blue)]"
              >
                Open full journey
              </Link>
            ) : null}
          </div>

          <div className="mt-7 space-y-3">
            {journeyMilestones.length > 0 ? (
              journeyMilestones.map((item, index) => (
                <div
                  key={item.milestone.id}
                  className={cx(
                    "grid gap-4 rounded-[26px] border p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center",
                    item.status === "in_progress"
                      ? "border-blue-200 bg-[var(--color-blue-soft)]"
                      : item.status === "completed"
                        ? "border-emerald-900/8 bg-[var(--color-green-soft)]"
                        : "border-white/8 bg-white/[0.025]",
                  )}
                >
                  <div
                    className={cx(
                      "flex size-10 items-center justify-center rounded-full border text-sm font-semibold",
                      item.status === "completed"
                        ? "border-emerald-400/25 bg-emerald-400/10 text-[var(--color-green)]"
                        : item.status === "in_progress"
                          ? "border-blue-400/25 bg-blue-400/10 text-[var(--color-blue)]"
                          : "border-white/10 bg-white/[0.055] text-[var(--color-muted)]",
                    )}
                  >
                    {item.status === "completed" ? "✓" : index + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{item.milestone.title}</p>
                      <span className="text-xs text-[var(--color-muted)]">
                        {milestoneStatusCopy[item.status]}
                      </span>
                    </div>
                    <ProgressBar
                      value={item.progress}
                      tone={item.status === "completed" ? "green" : "blue"}
                      className="mt-3 h-1.5"
                    />
                  </div>
                  <p className="text-sm text-[var(--color-muted)]">
                    {item.completedTasks} / {item.totalTasks} steps
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-[26px] border border-white/8 bg-white/[0.025] p-5 text-sm leading-6 text-[var(--color-muted)]">
                Milestones will appear here when an onboarding journey is assigned.
              </p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[34px] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Skills preview</p>
              <h3 className="mt-2 text-3xl">Role skills in progress</h3>
            </div>
            <Link
              href="/employee/skills"
              className="text-sm font-semibold text-[var(--color-blue)]"
            >
              View Skills
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {roleSkillPreview.map((skill) => (
              <div
                key={skill.name}
                className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {skill.xp} skill XP
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-200">
                    Level {skill.level}
                  </span>
                </div>
                <ProgressBar value={skill.progress} className="mt-3 h-1.5" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[34px] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Recent progress</p>
              <h3 className="mt-2 text-3xl">Activity and recognition</h3>
            </div>
            <Link
              href="/employee/feed?view=my"
              className="text-sm font-semibold text-[var(--color-blue)]"
            >
              Open Feed
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {recentActivitiesResult.data.length > 0 ? (
              recentActivitiesResult.data.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">
                        {activity.skill_name} ·{" "}
                        {new Intl.DateTimeFormat("en", {
                          dateStyle: "medium",
                        }).format(new Date(activity.created_at))}
                      </p>
                    </div>
                    <BadgePill
                      tone={
                        activity.status === "approved"
                          ? "green"
                          : activity.status === "rejected"
                            ? "red"
                            : "amber"
                      }
                    >
                      {activity.status}
                    </BadgePill>
                  </div>
                  <p className="mt-3 text-xs text-purple-200">
                    {recognitionByActivity.get(activity.id) ?? 0} recognition
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-5">
                <p className="font-medium">No activity logged yet.</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Log real progress to begin building your activity record.
                </p>
                <Link
                  href="/employee/activities"
                  className="mt-4 inline-flex text-sm font-semibold text-[var(--color-blue)]"
                >
                  Log activity
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="rounded-[36px] p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Growth areas</p>
            <h3 className="mt-2 text-3xl">What your Player is building</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              Journey steps contribute to five practical areas of onboarding growth.
              Progress here is based on the steps already completed in your current journey.
            </p>
          </div>
          <BadgePill tone="blue">{completedTasks} growth steps completed</BadgePill>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {growthAreaProgress.map((area) => (
            <div
              key={area.name}
              className={cx(
                "relative flex min-h-52 flex-col justify-between overflow-hidden rounded-[26px] border p-5",
                growthAreaCardClasses[area.tone],
              )}
            >
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ backgroundColor: `var(--color-${area.tone})` }}
              />
              <div>
                <p className="text-lg font-semibold leading-6">{area.name}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  {area.description}
                </p>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{area.progress}%</span>
                  <span className="text-[var(--color-muted)]">
                    {area.completedSteps} / {area.totalSteps}
                  </span>
                </div>
                {area.totalSteps > 0 ? (
                  <ProgressBar
                    value={area.progress}
                    tone={area.progress === 100 ? "green" : area.tone}
                    className="mt-3 h-1.5"
                  />
                ) : (
                  <div className="mt-3 h-1.5 rounded-full bg-[var(--progress-track)]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

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
