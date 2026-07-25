import "server-only";

import { buildJourneyMilestones } from "@/lib/employee-journey";
import type {
  MilestoneRecord,
  TaskProgressRecord,
  TaskRecord,
} from "@/lib/exp-types";
import {
  deriveSkillGroups,
  normalizeAssignedSkills,
  normalizeRoleFocus,
} from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";

type SkillProfileRow = {
  role_focus: unknown;
  assigned_skills: unknown;
};

type SkillAssignmentRow = {
  id: string;
  track: { id: string } | null;
};

export async function loadEmployeeSkillProfile(
  employeeId: string,
  workspaceId: string,
) {
  const supabase = await createClient();
  const [profileResult, assignmentResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("role_focus, assigned_skills")
      .eq("id", employeeId)
      .maybeSingle<SkillProfileRow>(),
    supabase
      .from("track_assignments")
      .select("id, track:onboarding_tracks(id)")
      .eq("workspace_id", workspaceId)
      .eq("employee_id", employeeId)
      .maybeSingle<SkillAssignmentRow>(),
  ]);

  if (profileResult.error) {
    throw new Error("Your role skills could not be loaded.");
  }
  if (assignmentResult.error) {
    throw new Error("Your journey skills could not be loaded.");
  }

  const roleFocus = normalizeRoleFocus(profileResult.data?.role_focus);
  const assignedSkills = normalizeAssignedSkills(
    profileResult.data?.assigned_skills,
  );
  let milestones: MilestoneRecord[] = [];
  let tasks: TaskRecord[] = [];
  let progress: TaskProgressRecord[] = [];

  if (assignmentResult.data?.track) {
    const milestonesResult = await supabase
      .from("milestones")
      .select(
        "id, track_id, title, description, position, skill_focus, created_at, updated_at",
      )
      .eq("track_id", assignmentResult.data.track.id)
      .order("position", { ascending: true })
      .returns<MilestoneRecord[]>();

    if (milestonesResult.error) {
      throw new Error("Journey milestones could not be loaded.");
    }

    milestones = milestonesResult.data;
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
        .eq("assignment_id", assignmentResult.data.id)
        .eq("employee_id", employeeId)
        .returns<TaskProgressRecord[]>(),
    ]);

    if (tasksResult.error || progressResult.error) {
      throw new Error("Skill progress could not be loaded.");
    }

    tasks = tasksResult.data;
    progress = progressResult.data;
  }

  const journey = buildJourneyMilestones(milestones, tasks, progress);

  return {
    roleFocus,
    assignedSkills,
    groups: deriveSkillGroups(journey, roleFocus, assignedSkills),
  };
}
