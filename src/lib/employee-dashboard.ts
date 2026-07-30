import type { TaskProgressStatus } from "@/lib/exp-types";

export type EmployeeDashboardAction = {
  href: string;
  label: string;
};

export function getEmployeeLevelTitle(level: number) {
  const safeLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1;

  if (safeLevel >= 10) return "Pathfinder";
  if (safeLevel >= 7) return "Specialist";
  if (safeLevel >= 5) return "Contributor";
  if (safeLevel >= 3) return "Builder";
  if (safeLevel === 2) return "Explorer";
  return "Starter";
}

export function getEmployeeDashboardAction({
  playerSetupCompleted,
  nextTaskId,
  nextTaskStatus,
  completedTasks,
}: {
  playerSetupCompleted: boolean;
  nextTaskId: string | null;
  nextTaskStatus: TaskProgressStatus | null;
  completedTasks: number;
}): EmployeeDashboardAction {
  if (!playerSetupCompleted) {
    return {
      href: "/employee/setup",
      label: "Complete player setup",
    };
  }

  if (nextTaskId) {
    const href = `/employee/onboarding#task-${nextTaskId}`;

    if (nextTaskStatus === "IN_PROGRESS") {
      return {
        href,
        label: "Resume current milestone",
      };
    }

    return {
      href,
      label: completedTasks > 0 ? "Continue journey" : "Start next task",
    };
  }

  return {
    href: "/employee/onboarding",
    label: "View journey",
  };
}
