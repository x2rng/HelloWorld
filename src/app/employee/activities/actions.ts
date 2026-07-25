"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/exp-auth";
import {
  activityCategoryOptions,
  activityProofTypeOptions,
  activityVisibilityOptions,
} from "@/lib/growth-activities";
import { createClient } from "@/lib/supabase/server";

export type CreateGrowthActivityState = { ok: boolean; message: string };

function requiredText(formData: FormData, key: string, maxLength: number) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) throw new Error(`${key} is required.`);
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function requiredOption<T extends readonly { value: string }[]>(formData: FormData, key: string, options: T) {
  const value = formData.get(key);
  if (typeof value !== "string" || !options.some((option) => option.value === value)) {
    throw new Error(`Choose a valid ${key}.`);
  }
  return value;
}

function optionalProofUrl(formData: FormData) {
  const value = formData.get("proof_url");
  if (typeof value !== "string" || !value.trim()) return null;
  const normalized = value.trim().slice(0, 1000);
  let url: URL;
  try { url = new URL(normalized); }
  catch { throw new Error("Enter a valid proof link beginning with http:// or https://."); }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Proof links must use http:// or https://.");
  }
  return url.toString();
}

export async function createGrowthActivity(
  _previousState: CreateGrowthActivityState,
  formData: FormData,
): Promise<CreateGrowthActivityState> {
  try {
    const { profile } = await requireRole("EMPLOYEE");
    const supabase = await createClient();
    const { error } = await supabase.from("growth_activities").insert({
      workspace_id: profile.workspace_id,
      employee_id: profile.id,
      title: requiredText(formData, "title", 100),
      description: requiredText(formData, "description", 500),
      category: requiredOption(formData, "category", activityCategoryOptions),
      skill_name: requiredText(formData, "skill_name", 60),
      proof_type: requiredOption(formData, "proof_type", activityProofTypeOptions),
      proof_url: optionalProofUrl(formData),
      visibility: requiredOption(formData, "visibility", activityVisibilityOptions),
      status: "pending",
      suggested_xp: 0,
    });

    if (error) throw new Error(`Failed to log growth activity: ${error.message}`);
    revalidatePath("/employee/activities");
    return { ok: true, message: "Growth activity submitted for review." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Failed to log growth activity." };
  }
}
