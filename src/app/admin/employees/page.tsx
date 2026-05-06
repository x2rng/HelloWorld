import Link from "next/link";
import { InviteEmployeeForm } from "@/components/admin/invite-employee-form";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/exp-auth";
import { getAppUrl } from "@/lib/env";
import type { InviteRecord, ProfileRecord } from "@/lib/exp-types";
import { createClient } from "@/lib/supabase/server";

type EmployeeAssignmentRow = {
  id: string;
  employee_id: string;
  status: string;
  start_date: string;
  due_date: string;
  track: {
    title: string;
  } | null;
};

export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage() {
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

  const { data: assignments, error: assignmentsError } = await supabase
    .from("track_assignments")
    .select("id, employee_id, status, start_date, due_date, track:onboarding_tracks(title)")
    .eq("workspace_id", profile.workspace_id)
    .returns<EmployeeAssignmentRow[]>();

  if (assignmentsError) {
    throw new Error(`Failed to load employee assignments: ${assignmentsError.message}`);
  }

  const assignmentByEmployee = new Map(assignments.map((assignment) => [assignment.employee_id, assignment]));
  const { data: invites, error: invitesError } = await supabase
    .from("invites")
    .select("id, workspace_id, email, role, token, status, invited_by, created_at, expires_at")
    .eq("workspace_id", profile.workspace_id)
    .eq("role", "EMPLOYEE")
    .order("created_at", { ascending: false })
    .returns<InviteRecord[]>();

  if (invitesError) {
    throw new Error(`Failed to load invites: ${invitesError.message}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Workspace employees</p>
          <h2 className="mt-2 text-4xl">Employees</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Employees appear here after their profile exists in this workspace. Invite acceptance will make this smoother
            in a later phase.
          </p>
        </div>
        <Link href="/admin/assignments">
          <Button size="lg">Assign track</Button>
        </Link>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-[36px] p-6 sm:p-8">
          <p className="eyebrow">Invite employee</p>
          <h3 className="mt-2 text-3xl">Create a join link</h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Email delivery is not wired yet. Create an invite and share the generated link directly.
          </p>
          <div className="mt-5">
            <InviteEmployeeForm />
          </div>
        </Card>

        <Card className="rounded-[36px] p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Invites</p>
              <h3 className="mt-2 text-3xl">Recent invite links</h3>
            </div>
            <BadgePill tone="blue">{invites.length}</BadgePill>
          </div>
          <div className="mt-5 space-y-3">
            {invites.length === 0 ? (
              <p className="text-sm leading-6 text-[var(--color-muted)]">
                No invite links have been created yet.
              </p>
            ) : (
              invites.map((invite) => (
                <div key={invite.id} className="rounded-2xl border border-black/6 bg-white/70 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <input
                        readOnly
                        value={`${getAppUrl()}/invite/${invite.token}`}
                        className="mt-3 h-10 w-full rounded-xl border border-black/8 bg-white px-3 text-sm outline-none"
                      />
                    </div>
                    <BadgePill tone={invite.status === "ACCEPTED" ? "green" : "amber"}>
                      {invite.status}
                    </BadgePill>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {employees.length === 0 ? (
        <Card className="rounded-[36px] p-8">
          <BadgePill tone="amber">No employees</BadgePill>
          <h3 className="mt-4 text-3xl">No employee profiles yet.</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            Once employees join this workspace, they can be assigned a track from the assignments page.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {employees.map((employee) => {
            const assignment = assignmentByEmployee.get(employee.id);

            return (
              <Card key={employee.id} className="rounded-[28px] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-2xl">{employee.full_name ?? employee.email}</h3>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{employee.email}</p>
                  </div>
                  <BadgePill tone={assignment ? "green" : "neutral"}>
                    {assignment ? assignment.status : "Unassigned"}
                  </BadgePill>
                </div>

                {assignment ? (
                  <div className="mt-5 rounded-2xl border border-black/6 bg-white/70 p-4 text-sm">
                    <p className="font-medium">{assignment.track?.title ?? "Assigned track"}</p>
                    <p className="mt-2 text-[var(--color-muted)]">
                      {assignment.start_date} to {assignment.due_date}
                    </p>
                  </div>
                ) : (
                  <p className="mt-5 text-sm leading-6 text-[var(--color-muted)]">
                    This employee does not have a track assignment yet.
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
