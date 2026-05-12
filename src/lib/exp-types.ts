export type AppRole = "ADMIN" | "EMPLOYEE";

export interface WorkspaceRecord {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileRecord {
  id: string;
  workspace_id: string;
  role: AppRole;
  full_name: string | null;
  email: string;
  created_at: string;
  updated_at: string;
  workspace?: Pick<WorkspaceRecord, "id" | "name"> | null;
}

export interface InviteRecord {
  id: string;
  workspace_id: string;
  email: string;
  role: AppRole;
  token: string;
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
  invited_by: string;
  created_at: string;
  expires_at: string | null;
}

export interface OnboardingTrackRecord {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  duration_days: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MilestoneRecord {
  id: string;
  track_id: string;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface TaskRecord {
  id: string;
  milestone_id: string;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export type AssignmentStatus = "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TaskProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface TrackAssignmentRecord {
  id: string;
  workspace_id: string;
  track_id: string;
  employee_id: string;
  assigned_by: string;
  start_date: string;
  due_date: string;
  status: AssignmentStatus;
  created_at: string;
  updated_at: string;
}

export interface TaskProgressRecord {
  id: string;
  assignment_id: string;
  task_id: string;
  employee_id: string;
  status: TaskProgressStatus;
  response_text: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface XpEventRecord {
  id: string;
  workspace_id: string;
  employee_id: string;
  assignment_id: string;
  task_id: string;
  event_type: "TASK_COMPLETED";
  xp_amount: number;
  created_at: string;
}

export interface EmployeeStatsRecord {
  id: string;
  workspace_id: string;
  employee_id: string;
  total_xp: number;
  current_level: number;
  completed_tasks_count: number;
  created_at: string;
  updated_at: string;
}

export interface AchievementRecord {
  id: string;
  code: string;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
}

export interface EmployeeAchievementRecord {
  id: string;
  workspace_id: string;
  employee_id: string;
  achievement_id: string;
  unlocked_at: string;
}
