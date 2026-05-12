"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/exp-auth";
import { avatarOptions, normalizeAvatarConfig } from "@/lib/avatar-config";
import { createClient } from "@/lib/supabase/server";

export type SaveAvatarState = {
  message: string;
  ok: boolean;
};

function requiredOption(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function saveAvatarConfig(
  _previousState: SaveAvatarState,
  formData: FormData,
): Promise<SaveAvatarState> {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const avatarConfig = normalizeAvatarConfig({
    skinTone: requiredOption(formData, "skinTone"),
    hairStyle: requiredOption(formData, "hairStyle"),
    hairColor: requiredOption(formData, "hairColor"),
    topColor: requiredOption(formData, "topColor"),
    bottomColor: requiredOption(formData, "bottomColor"),
    glasses: formData.get("glasses") === "on",
  });

  const hasValidSelection =
    avatarOptions.skinTones.some((option) => option.value === avatarConfig.skinTone) &&
    avatarOptions.hairStyles.some((option) => option.value === avatarConfig.hairStyle);

  if (!hasValidSelection) {
    return {
      ok: false,
      message: "Please choose a valid avatar setup.",
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_config: avatarConfig })
    .eq("id", profile.id);

  if (error) {
    return {
      ok: false,
      message: `Failed to save avatar: ${error.message}`,
    };
  }

  revalidatePath("/employee");
  revalidatePath("/employee/avatar");
  revalidatePath("/employee/onboarding");

  redirect("/employee");
}
