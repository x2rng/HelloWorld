import { requireRole } from "@/lib/exp-auth";
import { WorkspaceShell } from "@/components/layout/workspace-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("ADMIN");

  return (
    <WorkspaceShell
      profile={profile}
      title="Admin workspace"
      subtitle="Manage workspace setup, employee access, and the onboarding foundation."
    >
      {children}
    </WorkspaceShell>
  );
}
