"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/exp-auth";
import {
  isCompleteAvatarConfig,
  normalizeAvatarConfig,
} from "@/lib/avatar-config";
import { createClient } from "@/lib/supabase/server";

export type SaveAvatarState = {
  message: string;
  ok: boolean;
};

function parseAvatarConfig(formData: FormData) {
  const value = formData.get("avatar_config");
  if (typeof value !== "string") return null;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export async function saveAvatarConfig(
  _previousState: SaveAvatarState,
  formData: FormData,
): Promise<SaveAvatarState> {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const input = parseAvatarConfig(formData);

  if (!isCompleteAvatarConfig(input)) {
    return {
      ok: false,
      message: "Your avatar contains an invalid selection. Review it and try again.",
    };
  }
  const avatarConfig = normalizeAvatarConfig(input);

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
  revalidatePath("/employee/player");
  revalidatePath("/employee/skills");

  redirect("/employee/player");
}
