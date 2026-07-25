"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/exp-auth";
import { companySizeOptions, industryOptions, normalizeWorkspaceSetupProfile } from "@/lib/workspace-setup";
import { createClient } from "@/lib/supabase/server";

export type SaveWorkspaceSetupState = { ok: boolean; message: string };

function requiredText(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) throw new Error(`${key} is required.`);
  return value.trim();
}

export async function saveWorkspaceSetup(
  _previousState: SaveWorkspaceSetupState,
  formData: FormData,
): Promise<SaveWorkspaceSetupState> {
  try {
    const { profile } = await requireRole("ADMIN");
    const name = requiredText(formData, "company_name").slice(0, 120);
    const industry = requiredText(formData, "industry");
    const companySize = requiredText(formData, "company_size");
    if (!industryOptions.some((option) => option === industry)) throw new Error("Choose a valid industry.");
    if (!companySizeOptions.some((option) => option === companySize)) throw new Error("Choose a valid company size.");

    let submittedProfile: unknown;
    try { submittedProfile = JSON.parse(String(formData.get("setup_profile") ?? "{}")); }
    catch { throw new Error("The company growth profile is not valid."); }
    const setupProfile = normalizeWorkspaceSetupProfile(submittedProfile);
    if (setupProfile.departments.length === 0) throw new Error("Choose at least one department.");
    if (setupProfile.roles.length === 0) throw new Error("Choose at least one newcomer role.");

    const supabase = await createClient();
    const { error } = await supabase.from("workspaces").update({
      name,
      industry,
      company_size: companySize,
      setup_profile: setupProfile,
      setup_completed: true,
    }).eq("id", profile.workspace_id);
    if (error) throw new Error(`Failed to save workspace setup: ${error.message}`);

    revalidatePath("/admin", "layout");
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to save workspace setup." };
  }

  redirect("/admin");
}
