import { requireRole } from "@/lib/exp-auth";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

export const dynamic = "force-dynamic";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("EMPLOYEE");

  return (
    <WorkspaceShell
      profile={profile}
      title="Employee workspace"
      subtitle="You are authenticated as an employee. The onboarding journey will be attached in the next phase."
    >
      {children}
    </WorkspaceShell>
  );
}
