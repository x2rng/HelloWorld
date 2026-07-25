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
      title="Growth workspace"
      subtitle="Your onboarding journey, progress, and growth identity in one place."
    >
      {children}
    </WorkspaceShell>
  );
}
