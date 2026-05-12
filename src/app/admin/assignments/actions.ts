"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/exp-auth";
import { createClient } from "@/lib/supabase/server";

export type CreateAssignmentState = {
  ok: boolean;
  message: string;
};

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

function isDuplicateAssignmentError(error: { code?: string; message?: string }) {
  return (
    error.code === "23505" ||
    error.message?.includes("track_assignments_one_per_employee")
  );
}

async function removePartialAssignment(
  supabase: Awaited<ReturnType<typeof createClient>>,
  assignmentId: string,
) {
  await supabase.from("track_assignments").delete().eq("id", assignmentId);
}

export async function createAssignment(
  _previousState: CreateAssignmentState,
  formData: FormData,
): Promise<CreateAssignmentState> {
  try {
    const { profile } = await requireRole("ADMIN");
    const supabase = await createClient();
    const employeeId = requiredText(formData, "employee_id");
    const trackId = requiredText(formData, "track_id");
    const startDateValue = formData.get("start_date");
    const startDate =
      typeof startDateValue === "string" && startDateValue
        ? new Date(`${startDateValue}T00:00:00.000Z`)
        : new Date();

    const { data: existingAssignment, error: existingAssignmentError } =
      await supabase
        .from("track_assignments")
        .select("id")
        .eq("workspace_id", profile.workspace_id)
        .eq("employee_id", employeeId)
        .maybeSingle();

    if (existingAssignmentError) {
      return {
        ok: false,
        message: `Failed to check existing assignment: ${existingAssignmentError.message}`,
      };
    }

    if (existingAssignment) {
      return {
        ok: false,
        message: "This employee already has an assigned onboarding track.",
      };
    }

    const { data: employee, error: employeeError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", employeeId)
      .eq("workspace_id", profile.workspace_id)
      .eq("role", "EMPLOYEE")
      .maybeSingle();

    if (employeeError) {
      return {
        ok: false,
        message: `Failed to verify employee: ${employeeError.message}`,
      };
    }

    if (!employee) {
      return {
        ok: false,
        message: "Employee was not found in this workspace.",
      };
    }

    const { data: track, error: trackError } = await supabase
      .from("onboarding_tracks")
      .select("id, duration_days")
      .eq("id", trackId)
      .eq("workspace_id", profile.workspace_id)
      .maybeSingle<{ id: string; duration_days: number }>();

    if (trackError) {
      return {
        ok: false,
        message: `Failed to verify onboarding track: ${trackError.message}`,
      };
    }

    if (!track) {
      return {
        ok: false,
        message: "Onboarding track was not found in this workspace.",
      };
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
      return {
        ok: false,
        message: assignmentError && isDuplicateAssignmentError(assignmentError)
          ? "This employee already has an assigned onboarding track."
          : assignmentError?.message ?? "Failed to create track assignment.",
      };
    }

    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("id, milestones!inner(track_id)")
      .eq("milestones.track_id", track.id)
      .returns<Array<{ id: string }>>();

    if (tasksError) {
      await removePartialAssignment(supabase, assignment.id);

      return {
        ok: false,
        message: `Failed to load assignment tasks: ${tasksError.message}`,
      };
    }

    const assignmentTasks = tasks ?? [];

    if (assignmentTasks.length > 0) {
      const { error: progressError } = await supabase.from("task_progress").insert(
        assignmentTasks.map((task) => ({
          assignment_id: assignment.id,
          task_id: task.id,
          employee_id: employee.id,
          status: "NOT_STARTED",
        })),
      );

      if (progressError) {
        await removePartialAssignment(supabase, assignment.id);

        return {
          ok: false,
          message: `Failed to initialize task progress: ${progressError.message}`,
        };
      }
    }

    revalidatePath("/admin/assignments");
    revalidatePath("/admin/employees");

    return {
      ok: true,
      message: "Onboarding track assigned.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Failed to create assignment.",
    };
  }
}
