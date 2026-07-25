import type {
  MilestoneRecord,
  TaskProgressRecord,
  TaskRecord,
} from "@/lib/exp-types";
import {
  buildGrowthAreaProgress,
  getGrowthAreaForStep,
  type GrowthAreaProgress,
  type GrowthAreaName,
} from "@/lib/growth-areas";

export const TASK_XP_REWARD = 10;

export type JourneyTask = TaskRecord & {
  progress: TaskProgressRecord | null;
  growthArea: GrowthAreaName;
};

export type JourneyMilestoneStatus = "completed" | "in_progress" | "upcoming";

export type JourneyMilestone = {
  milestone: MilestoneRecord;
  tasks: JourneyTask[];
  completedTasks: number;
  totalTasks: number;
  progress: number;
  status: JourneyMilestoneStatus;
};

export function journeyPercent(completed: number, total: number) {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function buildJourneyMilestones(
  milestones: MilestoneRecord[],
  tasks: TaskRecord[],
  progressRows: TaskProgressRecord[],
): JourneyMilestone[] {
  const progressByTask = new Map(progressRows.map((row) => [row.task_id, row]));
  const milestoneTitleById = new Map(
    milestones.map((milestone) => [milestone.id, milestone.title]),
  );
  const tasksByMilestone = new Map<string, JourneyTask[]>();

  for (const task of tasks) {
    const milestoneTasks = tasksByMilestone.get(task.milestone_id) ?? [];
    milestoneTasks.push({
      ...task,
      progress: progressByTask.get(task.id) ?? null,
      growthArea: getGrowthAreaForStep(
        milestoneTitleById.get(task.milestone_id) ?? "",
        task.title,
      ),
    });
    milestoneTasks.sort((left, right) => left.position - right.position);
    tasksByMilestone.set(task.milestone_id, milestoneTasks);
  }

  const orderedMilestones = [...milestones].sort(
    (left, right) => left.position - right.position,
  );
  const activeMilestoneIndex = orderedMilestones.findIndex((milestone) =>
    (tasksByMilestone.get(milestone.id) ?? []).some(
      (task) => task.progress?.status !== "COMPLETED",
    ),
  );

  return orderedMilestones.map((milestone, index) => {
    const milestoneTasks = tasksByMilestone.get(milestone.id) ?? [];
    const completedTasks = milestoneTasks.filter(
      (task) => task.progress?.status === "COMPLETED",
    ).length;
    const isCompleted =
      milestoneTasks.length > 0 && completedTasks === milestoneTasks.length;

    return {
      milestone,
      tasks: milestoneTasks,
      completedTasks,
      totalTasks: milestoneTasks.length,
      progress: journeyPercent(completedTasks, milestoneTasks.length),
      status: isCompleted
        ? "completed"
        : index === activeMilestoneIndex
          ? "in_progress"
          : "upcoming",
    };
  });
}

export function getNextJourneyTask(milestones: JourneyMilestone[]) {
  return milestones
    .flatMap((milestone) =>
      milestone.tasks.map((task) => ({
        task,
        milestone: milestone.milestone,
      })),
    )
    .find(({ task }) => task.progress?.status !== "COMPLETED") ?? null;
}

export function getJourneyGrowthAreaProgress(
  milestones: JourneyMilestone[],
): GrowthAreaProgress[] {
  return buildGrowthAreaProgress(
    milestones.flatMap((milestone) =>
      milestone.tasks.map((task) => ({
        growthArea: task.growthArea,
        completed: task.progress?.status === "COMPLETED",
      })),
    ),
  );
}
