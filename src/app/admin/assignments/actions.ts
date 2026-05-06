"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/exp-auth";
import { createClient } from "@/lib/supabase/server";

function requiredText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} is required.`);
  }

  return value.trim();
}

function isoDate(value: Date) {
  return value.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export async function createAssignment(formData: FormData) {
  const { profile } = await requireRole("ADMIN");
  const supabase = await createClient();
  const employeeId = requiredText(formData, "employee_id");
  const trackId = requiredText(formData, "track_id");
  const startDateValue = formData.get("start_date");
  const startDate =
    typeof startDateValue === "string" && startDateValue
      ? new Date(`${startDateValue}T00:00:00.000Z`)
      : new Date();

  const { data: employee, error: employeeError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", employeeId)
    .eq("workspace_id", profile.workspace_id)
    .eq("role", "EMPLOYEE")
    .maybeSingle();

  if (employeeError) {
    throw new Error(`Failed to verify employee: ${employeeError.message}`);
  }

  if (!employee) {
    throw new Error("Employee was not found in this workspace.");
  }

  const { data: track, error: trackError } = await supabase
    .from("onboarding_tracks")
    .select("id, duration_days")
    .eq("id", trackId)
    .eq("workspace_id", profile.workspace_id)
    .maybeSingle<{ id: string; duration_days: number }>();

  if (trackError) {
    throw new Error(`Failed to verify onboarding track: ${trackError.message}`);
  }

  if (!track) {
    throw new Error("Onboarding track was not found in this workspace.");
  }

  const { data: assignment, error: assignmentError } = await supabase
    .from("track_assignments")
    .insert({
      workspace_id: profile.workspace_id,
      track_id: track.id,
      employee_id: employee.id,
      assigned_by: profile.id,
      start_date: isoDate(startDate),
      due_date: isoDate(addDays(startDate, track.duration_days ?? 30)),
      status: "ASSIGNED",
    })
    .select("id")
    .single<{ id: string }>();

  if (assignmentError || !assignment) {
    throw new Error(
      assignmentError?.message ?? "Failed to create track assignment.",
    );
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("id, milestones!inner(track_id)")
    .eq("milestones.track_id", track.id)
    .returns<Array<{ id: string }>>();

  if (tasksError) {
    throw new Error(`Failed to load assignment tasks: ${tasksError.message}`);
  }

  if (tasks.length > 0) {
    const { error: progressError } = await supabase.from("task_progress").insert(
      tasks.map((task) => ({
        assignment_id: assignment.id,
        task_id: task.id,
        employee_id: employee.id,
        status: "NOT_STARTED",
      })),
    );

    if (progressError) {
      throw new Error(`Failed to initialize task progress: ${progressError.message}`);
    }
  }

  revalidatePath("/admin/assignments");
  revalidatePath("/admin/employees");
}
