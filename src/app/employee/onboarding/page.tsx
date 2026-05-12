import Link from "next/link";
import { completeTask } from "@/app/employee/onboarding/actions";
import { AchievementList } from "@/components/employee/achievement-list";
import { AvatarStageCard } from "@/components/employee/avatar-stage-card";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { requireRole } from "@/lib/exp-auth";
import type {
  AchievementRecord,
  EmployeeAchievementRecord,
  EmployeeStatsRecord,
  MilestoneRecord,
  TaskProgressRecord,
  TaskRecord,
} from "@/lib/exp-types";
import { normalizeAvatarConfig } from "@/lib/avatar-config";
import { getLevelInfo } from "@/lib/levels";
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
  } | null;
};

type TaskWithProgress = TaskRecord & {
  progress: TaskProgressRecord | null;
};

type EmployeeAvatarProfile = {
  avatar_config: unknown;
};

function percent(completed: number, total: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export const dynamic = "force-dynamic";

export default async function EmployeeOnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ achievementUnlocked?: string; completionError?: string }>;
}) {
  const { achievementUnlocked, completionError } = await searchParams;
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const { data: assignment, error: assignmentError } = await supabase
    .from("track_assignments")
    .select("id, workspace_id, track_id, employee_id, status, start_date, due_date, track:onboarding_tracks(id, title, description)")
    .eq("workspace_id", profile.workspace_id)
    .eq("employee_id", profile.id)
    .maybeSingle<AssignmentWithTrack>();

  if (assignmentError) {
    throw new Error(`Failed to load onboarding assignment: ${assignmentError.message}`);
  }

  if (!assignment) {
    return (
      <Card className="rounded-[36px] p-8">
        <BadgePill tone="amber">No assignment</BadgePill>
        <h2 className="mt-4 text-4xl">No onboarding journey assigned yet.</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
          Your workspace admin can assign an onboarding track when it is ready.
        </p>
        <Link href="/employee" className="mt-6 inline-flex">
          <Button variant="secondary">Back to dashboard</Button>
        </Link>
      </Card>
    );
  }

  const { data: milestones, error: milestonesError } = await supabase
    .from("milestones")
    .select("id, track_id, title, description, position, created_at, updated_at")
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
          .select("id, milestone_id, title, description, position, created_at, updated_at")
          .in("milestone_id", milestoneIds)
          .order("position", { ascending: true })
          .returns<TaskRecord[]>()
      : { data: [] as TaskRecord[], error: null };

  if (tasksError) {
    throw new Error(`Failed to load tasks: ${tasksError.message}`);
  }

  const { error: syncProgressError } = await supabase.rpc("ensure_assignment_task_progress", {
    target_assignment_id: assignment.id,
  });

  if (syncProgressError) {
    throw new Error(`Failed to initialize task progress: ${syncProgressError.message}`);
  }

  const { data: progressRows, error: progressError } = await supabase
    .from("task_progress")
    .select("id, assignment_id, task_id, employee_id, status, response_text, completed_at, created_at, updated_at")
    .eq("assignment_id", assignment.id)
    .eq("employee_id", profile.id)
    .returns<TaskProgressRecord[]>();

  if (progressError) {
    throw new Error(`Failed to load task progress: ${progressError.message}`);
  }

  const { data: stats, error: statsError } = await supabase
    .from("employee_stats")
    .select("id, workspace_id, employee_id, total_xp, current_level, completed_tasks_count, created_at, updated_at")
    .eq("workspace_id", profile.workspace_id)
    .eq("employee_id", profile.id)
    .maybeSingle<EmployeeStatsRecord>();

  if (statsError) {
    throw new Error(`Failed to load employee stats: ${statsError.message}`);
  }

  const { data: achievements, error: achievementsError } = await supabase
    .from("achievements")
    .select("id, code, title, description, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .returns<AchievementRecord[]>();

  if (achievementsError) {
    throw new Error(`Failed to load achievements: ${achievementsError.message}`);
  }

  const { data: unlockedAchievements, error: unlockedAchievementsError } =
    await supabase
      .from("employee_achievements")
      .select("id, workspace_id, employee_id, achievement_id, unlocked_at")
      .eq("workspace_id", profile.workspace_id)
      .eq("employee_id", profile.id)
      .returns<EmployeeAchievementRecord[]>();

  if (unlockedAchievementsError) {
    throw new Error(`Failed to load unlocked achievements: ${unlockedAchievementsError.message}`);
  }

  const { data: avatarProfile, error: avatarProfileError } = await supabase
    .from("profiles")
    .select("avatar_config")
    .eq("id", profile.id)
    .maybeSingle<EmployeeAvatarProfile>();

  if (avatarProfileError) {
    throw new Error(`Failed to load avatar: ${avatarProfileError.message}`);
  }

  const progressByTask = new Map(progressRows.map((row) => [row.task_id, row]));
  const tasksByMilestone = new Map<string, TaskWithProgress[]>();

  for (const task of tasks) {
    const current = tasksByMilestone.get(task.milestone_id) ?? [];
    tasksByMilestone.set(task.milestone_id, [
      ...current,
      {
        ...task,
        progress: progressByTask.get(task.id) ?? null,
      },
    ]);
  }

  const completedTasks = progressRows.filter((row) => row.status === "COMPLETED").length;
  const totalTasks = tasks.length;
  const overallPercent = percent(completedTasks, totalTasks);
  const level = getLevelInfo(stats?.total_xp ?? 0);
  const avatarConfig = normalizeAvatarConfig(avatarProfile?.avatar_config);

  return (
    <div className="space-y-5">
      <Card className="rounded-[36px] p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="eyebrow">Onboarding journey</p>
            <h2 className="mt-2 text-4xl">{assignment.track?.title ?? "Assigned track"}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              {assignment.track?.description ?? "No description has been added to this track yet."}
            </p>
          </div>
          <BadgePill tone={assignment.status === "COMPLETED" ? "green" : "blue"}>
            {assignment.status}
          </BadgePill>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-black/6 bg-white/70 p-4">
            <p className="eyebrow">Progress</p>
            <p className="mt-2 text-2xl font-semibold">
              {completedTasks} / {totalTasks}
            </p>
          </div>
          <div className="rounded-2xl border border-black/6 bg-white/70 p-4">
            <p className="eyebrow">Level</p>
            <p className="mt-2 text-2xl font-semibold">{level.level}</p>
          </div>
          <div className="rounded-2xl border border-black/6 bg-white/70 p-4">
            <p className="eyebrow">XP</p>
            <p className="mt-2 text-2xl font-semibold">{level.totalXp}</p>
          </div>
          <div className="rounded-2xl border border-black/6 bg-white/70 p-4">
            <p className="eyebrow">Due</p>
            <p className="mt-2 font-medium">{assignment.due_date}</p>
          </div>
        </div>

        <div className="mt-5">
          <ProgressBar value={overallPercent} tone={overallPercent === 100 ? "green" : "blue"} />
          <p className="mt-2 text-sm text-[var(--color-muted)]">{overallPercent}% complete</p>
        </div>

        <div className="mt-5 rounded-2xl border border-black/6 bg-white/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Level progress</p>
            <p className="text-sm text-[var(--color-muted)]">
              {level.nextLevel ? `${level.xpToNextLevel} XP to Level ${level.nextLevel}` : "Max V1 level"}
            </p>
          </div>
          <ProgressBar value={level.progress} tone={level.nextLevel ? "amber" : "green"} className="mt-3" />
        </div>

        {completionError ? (
          <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
            {completionError}
          </p>
        ) : null}

        {achievementUnlocked ? (
          <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
            Achievement unlocked: {achievementUnlocked}
          </p>
        ) : null}
      </Card>

      <AvatarStageCard
        currentLevel={level.level}
        progress={level.progress}
        totalXp={level.totalXp}
        xpToNextLevel={level.xpToNextLevel}
        avatarConfig={avatarConfig}
        compact
      />

      <section className="space-y-4">
        {milestones.length === 0 ? (
          <Card className="rounded-[32px] p-6">
            <p className="text-sm text-[var(--color-muted)]">This track has no milestones yet.</p>
          </Card>
        ) : (
          milestones.map((milestone) => {
            const milestoneTasks = tasksByMilestone.get(milestone.id) ?? [];
            const milestoneCompleted = milestoneTasks.filter(
              (task) => task.progress?.status === "COMPLETED",
            ).length;
            const milestonePercent = percent(milestoneCompleted, milestoneTasks.length);

            return (
              <Card key={milestone.id} className="rounded-[32px] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <BadgePill tone="neutral">Milestone {milestone.position}</BadgePill>
                    <h3 className="mt-3 text-3xl">{milestone.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                      {milestone.description ?? "No milestone description."}
                    </p>
                  </div>
                  <BadgePill tone={milestonePercent === 100 ? "green" : "blue"}>
                    {milestoneCompleted} / {milestoneTasks.length}
                  </BadgePill>
                </div>

                <div className="mt-5">
                  <ProgressBar value={milestonePercent} tone={milestonePercent === 100 ? "green" : "blue"} />
                </div>

                <div className="mt-5 space-y-3">
                  {milestoneTasks.length === 0 ? (
                    <p className="rounded-2xl border border-black/6 bg-white/70 p-4 text-sm text-[var(--color-muted)]">
                      No tasks in this milestone.
                    </p>
                  ) : (
                    milestoneTasks.map((task) => {
                      const isCompleted = task.progress?.status === "COMPLETED";

                      return (
                        <div
                          key={task.id}
                          className="flex flex-col gap-4 rounded-2xl border border-black/6 bg-white/70 p-4 sm:flex-row sm:items-start sm:justify-between"
                        >
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                              {task.description ?? "No task description."}
                            </p>
                            {task.progress?.completed_at ? (
                              <p className="mt-2 text-xs text-[var(--color-green)]">
                                Task completed. +10 XP
                              </p>
                            ) : (
                              <p className="mt-2 text-xs text-[var(--color-amber)]">Reward: +10 XP</p>
                            )}
                          </div>

                          {isCompleted ? (
                            <BadgePill tone="green">Completed</BadgePill>
                          ) : task.progress ? (
                            <form action={completeTask.bind(null, assignment.id, task.id)}>
                              <Button type="submit" size="sm">
                                Mark complete
                              </Button>
                            </form>
                          ) : (
                            <BadgePill tone="red">Not initialized</BadgePill>
                          )}
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
        achievements={achievements}
        unlockedAchievements={unlockedAchievements}
      />
    </div>
  );
}
