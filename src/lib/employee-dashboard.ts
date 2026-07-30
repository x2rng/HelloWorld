export type EmployeeDashboardAction = {
  href: string;
  label: string;
};

export type EmployeeDashboardJourneyState =
  | "active"
  | "completed"
  | "assigned_without_next"
  | "unassigned";

export function getEmployeeLevelTitle(level: number) {
  const safeLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1;

  if (safeLevel >= 10) return "Pathfinder";
  if (safeLevel >= 7) return "Specialist";
  if (safeLevel >= 5) return "Contributor";
  if (safeLevel >= 3) return "Builder";
  if (safeLevel === 2) return "Explorer";
  return "Starter";
}

export function getEmployeeDashboardJourneyState({
  hasAssignment,
  totalTasks,
  completedTasks,
  nextTaskId,
}: {
  hasAssignment: boolean;
  totalTasks: number;
  completedTasks: number;
  nextTaskId: string | null;
}): EmployeeDashboardJourneyState {
  if (!hasAssignment) return "unassigned";
  if (totalTasks > 0 && completedTasks >= totalTasks) return "completed";
  if (nextTaskId) return "active";
  return "assigned_without_next";
}

export function getEmployeeDashboardAction({
  playerSetupCompleted,
  journeyState,
  nextTaskId,
}: {
  playerSetupCompleted: boolean;
  journeyState: EmployeeDashboardJourneyState;
  nextTaskId: string | null;
}): EmployeeDashboardAction {
  if (!playerSetupCompleted) {
    return {
      href: "/employee/setup",
      label: "Complete player setup",
    };
  }

  if (journeyState === "active" && nextTaskId) {
    return {
      href: `/employee/onboarding#task-${nextTaskId}`,
      label: "Continue next step",
    };
  }

  if (journeyState === "completed") {
    return {
      href: "/employee/onboarding",
      label: "Review completed journey",
    };
  }

  return {
    href: "/employee/onboarding",
    label: "View journey",
  };
}
