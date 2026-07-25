"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/exp-auth";
import { getRoleTemplateSkills, isRoleFocus } from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";

export type SaveOccupationState = { ok: boolean; message: string };

export async function saveOccupation(
  _previousState: SaveOccupationState,
  formData: FormData,
): Promise<SaveOccupationState> {
  const roleFocus = formData.get("role_focus");
  if (!isRoleFocus(roleFocus)) {
    return { ok: false, message: "Choose a valid role to continue." };
  }

  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      role_focus: roleFocus,
      assigned_skills: getRoleTemplateSkills(roleFocus),
    })
    .eq("id", profile.id);

  if (error) {
    return { ok: false, message: `We could not save your role: ${error.message}` };
  }

  revalidatePath("/employee");
  revalidatePath("/employee/onboarding");
  return { ok: true, message: "Your role skills are ready." };
}
