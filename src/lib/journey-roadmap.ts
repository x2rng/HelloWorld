import type { JourneyMilestone } from "@/lib/employee-journey";
import { TASK_XP_REWARD } from "@/lib/employee-journey";
import type { SkillContribution } from "@/lib/skill-attribution";
import {
  normalizeSkillContributions,
  normalizeSkillFocus,
} from "@/lib/skill-attribution";

export type RoadmapMilestoneState =
  | "completed"
  | "current"
  | "available_next"
  | "locked";

export type RoadmapTaskState =
  | "completed"
  | "next"
  | "available"
  | "locked";

export type JourneyRoadmapTask = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  growthArea: string;
  skillContributions: SkillContribution[];
  state: RoadmapTaskState;
  canComplete: boolean;
  xpReward: number | null;
  completedAt: string | null;
};

export type JourneyRoadmapMilestone = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  state: RoadmapMilestoneState;
  completedTasks: number;
  totalTasks: number;
  progress: number;
  earnedXp: number;
  totalXp: number;
  completedAt: string | null;
  skillFocus: string[];
  growthAreas: string[];
  precedingMilestoneTitle: string | null;
  tasks: JourneyRoadmapTask[];
};

function getMilestoneCompletionDate(milestone: JourneyMilestone) {
  if (
    milestone.tasks.length === 0 ||
    milestone.tasks.some(
      (task) =>
        task.progress?.status !== "COMPLETED" || !task.progress.completed_at,
    )
  ) {
    return null;
  }

  return milestone.tasks
    .map((task) => task.progress?.completed_at)
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => right.localeCompare(left))[0] ?? null;
}

export function buildJourneyRoadmap({
  milestones,
  nextTaskId,
  journeyComplete,
}: {
  milestones: JourneyMilestone[];
  nextTaskId: string | null;
  journeyComplete: boolean;
}): JourneyRoadmapMilestone[] {
  const currentMilestoneIndex = journeyComplete
    ? -1
    : milestones.findIndex((milestone) => milestone.status !== "completed");

  return milestones.map((milestone, milestoneIndex) => {
    let state: RoadmapMilestoneState;

    if (milestone.status === "completed") {
      state = "completed";
    } else if (milestoneIndex === currentMilestoneIndex) {
      state = "current";
    } else if (
      currentMilestoneIndex >= 0 &&
      milestoneIndex === currentMilestoneIndex + 1
    ) {
      state = "available_next";
    } else {
      state = "locked";
    }

    const tasks = milestone.tasks.map((task) => {
      const completed = task.progress?.status === "COMPLETED";
      let taskState: RoadmapTaskState;

      if (completed) {
        taskState = "completed";
      } else if (state === "current" && task.id === nextTaskId) {
        taskState = "next";
      } else if (state === "current" && task.progress) {
        taskState = "available";
      } else {
        taskState = "locked";
      }

      return {
        id: task.id,
        title: task.title,
        description: task.description,
        position: task.position,
        growthArea: task.growthArea,
        skillContributions: normalizeSkillContributions(
          task.skill_contributions,
        ),
        state: taskState,
        canComplete:
          !completed &&
          state === "current" &&
          Boolean(task.progress),
        xpReward: TASK_XP_REWARD,
        completedAt: task.progress?.completed_at ?? null,
      } satisfies JourneyRoadmapTask;
    });

    return {
      id: milestone.milestone.id,
      title: milestone.milestone.title,
      description: milestone.milestone.description,
      position: milestone.milestone.position,
      state,
      completedTasks: milestone.completedTasks,
      totalTasks: milestone.totalTasks,
      progress: milestone.progress,
      earnedXp: milestone.completedTasks * TASK_XP_REWARD,
      totalXp: milestone.totalTasks * TASK_XP_REWARD,
      completedAt:
        state === "completed" ? getMilestoneCompletionDate(milestone) : null,
      skillFocus: normalizeSkillFocus(milestone.milestone.skill_focus),
      growthAreas: [...new Set(milestone.tasks.map((task) => task.growthArea))],
      precedingMilestoneTitle:
        milestoneIndex > 0
          ? milestones[milestoneIndex - 1]?.milestone.title ?? null
          : null,
      tasks,
    } satisfies JourneyRoadmapMilestone;
  });
}
