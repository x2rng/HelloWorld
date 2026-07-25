import "server-only";

import { redirect } from "next/navigation";
import { requireRole } from "@/lib/exp-auth";
import { createClient } from "@/lib/supabase/server";

export type AdminWorkspaceSetupRecord = {
  id: string;
  name: string;
  industry: string | null;
  company_size: string | null;
  setup_completed: boolean;
  setup_profile: unknown;
};

export async function requireAdminWorkspaceSetup() {
  const context = await requireRole("ADMIN");
  const supabase = await createClient();
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select("id, name, industry, company_size, setup_completed, setup_profile")
    .eq("id", context.profile.workspace_id)
    .maybeSingle<AdminWorkspaceSetupRecord>();

  if (error) throw new Error(`Failed to load workspace setup: ${error.message}`);
  if (!workspace) throw new Error("Admin workspace was not found.");
  if (!workspace.setup_completed) redirect("/admin/setup");

  return { ...context, workspace };
}
