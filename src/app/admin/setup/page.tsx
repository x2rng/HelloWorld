import { Card } from "@/components/ui/card";
import { WorkspaceSetupForm } from "@/components/admin/workspace-setup-form";
import { requireRole } from "@/lib/exp-auth";
import { createClient } from "@/lib/supabase/server";
import type { AdminWorkspaceSetupRecord } from "@/lib/admin-workspace";

export const dynamic = "force-dynamic";

export default async function AdminSetupPage() {
  const { profile } = await requireRole("ADMIN");
  const supabase = await createClient();
  const { data: workspace, error } = await supabase.from("workspaces").select("id, name, industry, company_size, setup_completed, setup_profile").eq("id", profile.workspace_id).maybeSingle<AdminWorkspaceSetupRecord>();
  if (error) throw new Error(`Failed to load workspace setup: ${error.message}`);
  if (!workspace) throw new Error("Admin workspace was not found.");

  return (
    <div className="mx-auto max-w-5xl">
      <Card className="relative overflow-hidden rounded-[38px] p-6 sm:p-9">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Workspace setup</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Set up your company growth system.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">Give EXP the company context it needs to make onboarding feel intentional, role-aware, and yours.</p>
          <div className="mt-8"><WorkspaceSetupForm initialName={workspace.name} initialIndustry={workspace.industry} initialCompanySize={workspace.company_size} initialProfile={workspace.setup_profile} /></div>
        </div>
      </Card>
    </div>
  );
}
