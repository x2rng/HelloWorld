import Link from "next/link";
import { createAssignment } from "@/app/admin/assignments/actions";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/exp-auth";
import type { OnboardingTrackRecord, ProfileRecord } from "@/lib/exp-types";
import { createClient } from "@/lib/supabase/server";

type AssignmentRow = {
  id: string;
  status: string;
  start_date: string;
  due_date: string;
  employee: {
    full_name: string | null;
    email: string;
  } | null;
  track: {
    title: string;
  } | null;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export const dynamic = "force-dynamic";

export default async function AdminAssignmentsPage() {
  const { profile } = await requireRole("ADMIN");
  const supabase = await createClient();

  const { data: employees, error: employeesError } = await supabase
    .from("profiles")
    .select("id, workspace_id, role, full_name, email, created_at, updated_at")
    .eq("workspace_id", profile.workspace_id)
    .eq("role", "EMPLOYEE")
    .order("created_at", { ascending: false })
    .returns<ProfileRecord[]>();

  if (employeesError) {
    throw new Error(`Failed to load employees: ${employeesError.message}`);
  }

  const { data: tracks, error: tracksError } = await supabase
    .from("onboarding_tracks")
    .select("id, workspace_id, title, description, duration_days, created_by, created_at, updated_at")
    .eq("workspace_id", profile.workspace_id)
    .order("created_at", { ascending: false })
    .returns<OnboardingTrackRecord[]>();

  if (tracksError) {
    throw new Error(`Failed to load onboarding tracks: ${tracksError.message}`);
  }

  const { data: assignments, error: assignmentsError } = await supabase
    .from("track_assignments")
    .select("id, status, start_date, due_date, employee:profiles!track_assignments_employee_id_fkey(full_name, email), track:onboarding_tracks(title)")
    .eq("workspace_id", profile.workspace_id)
    .order("created_at", { ascending: false })
    .returns<AssignmentRow[]>();

  if (assignmentsError) {
    throw new Error(`Failed to load assignments: ${assignmentsError.message}`);
  }

  const assignedEmployeeIds = new Set(
    assignments.map((assignment) => assignment.employee?.email).filter(Boolean),
  );
  const assignmentIds = assignments.map((assignment) => assignment.id);
  const { data: progressRows, error: progressError } =
    assignmentIds.length > 0
      ? await supabase
          .from("task_progress")
          .select("assignment_id, status")
          .in("assignment_id", assignmentIds)
          .returns<Array<{ assignment_id: string; status: string }>>()
      : { data: [] as Array<{ assignment_id: string; status: string }>, error: null };

  if (progressError) {
    throw new Error(`Failed to load assignment progress: ${progressError.message}`);
  }

  const progressByAssignment = new Map<string, { completed: number; total: number }>();

  for (const progress of progressRows) {
    const current = progressByAssignment.get(progress.assignment_id) ?? {
      completed: 0,
      total: 0,
    };

    progressByAssignment.set(progress.assignment_id, {
      completed: current.completed + (progress.status === "COMPLETED" ? 1 : 0),
      total: current.total + 1,
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Track assignments</p>
        <h2 className="mt-2 text-4xl">Assignments</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
          Assign one onboarding track to each employee. Task completion, XP, and analytics are intentionally outside this
          phase.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[36px] p-6 sm:p-8">
          <p className="eyebrow">Create assignment</p>
          {employees.length === 0 || tracks.length === 0 ? (
            <div className="mt-5 space-y-4 text-sm leading-6 text-[var(--color-muted)]">
              {employees.length === 0 ? <p>No employee profiles exist in this workspace yet.</p> : null}
              {tracks.length === 0 ? (
                <p>
                  No onboarding tracks exist yet.{" "}
                  <Link href="/admin/tracks/new" className="font-semibold text-[var(--color-blue)]">
                    Create a track
                  </Link>
                  .
                </p>
              ) : null}
            </div>
          ) : (
            <form action={createAssignment} className="mt-5 space-y-5">
              <div className="space-y-2">
                <label htmlFor="assignment-employee" className="text-sm font-medium">
                  Employee
                </label>
                <select
                  id="assignment-employee"
                  name="employee_id"
                  required
                  className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
                >
                  <option value="">Select employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.full_name ?? employee.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="assignment-track" className="text-sm font-medium">
                  Published track
                </label>
                <select
                  id="assignment-track"
                  name="track_id"
                  required
                  className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
                >
                  <option value="">Select track</option>
                  {tracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.title} ({track.duration_days} days)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="assignment-start-date" className="text-sm font-medium">
                  Start date
                </label>
                <input
                  id="assignment-start-date"
                  name="start_date"
                  type="date"
                  defaultValue={today()}
                  className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
                />
                <p className="text-xs text-[var(--color-muted)]">
                  Due date is calculated from the selected track duration.
                </p>
              </div>

              <Button type="submit" className="w-full">
                Create assignment
              </Button>
            </form>
          )}
        </Card>

        <Card className="rounded-[36px] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Assigned employees</p>
              <h3 className="mt-2 text-3xl">Current assignments</h3>
            </div>
            <BadgePill tone="blue">{assignments.length}</BadgePill>
          </div>

          <div className="mt-5 space-y-3">
            {assignments.length === 0 ? (
              <p className="text-sm leading-6 text-[var(--color-muted)]">
                No assignments have been created yet.
              </p>
            ) : (
              assignments.map((assignment) => {
                const progress = progressByAssignment.get(assignment.id) ?? {
                  completed: 0,
                  total: 0,
                };

                return (
                  <div key={assignment.id} className="rounded-2xl border border-black/6 bg-white/70 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium">
                          {assignment.employee?.full_name ?? assignment.employee?.email ?? "Employee"}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-muted)]">
                          {assignment.track?.title ?? "Assigned track"}
                        </p>
                      </div>
                      <BadgePill tone={assignment.status === "COMPLETED" ? "green" : "blue"}>
                        {assignment.status}
                      </BadgePill>
                    </div>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">
                      {assignment.start_date} to {assignment.due_date}
                    </p>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">
                      {progress.completed} / {progress.total} tasks completed
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {assignedEmployeeIds.size > 0 ? (
            <p className="mt-5 text-xs text-[var(--color-muted)]">
              Each employee can only hold one assignment in this V1 foundation.
            </p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
