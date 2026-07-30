"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/exp-auth";
import {
  isCompletePixelCompanionConfig,
  normalizeCompanionConfig,
} from "@/lib/avatar/normalize-companion-config";
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

  if (!isCompletePixelCompanionConfig(input)) {
    return {
      ok: false,
      message:
        "Your companion contains an invalid selection. Review it and try again.",
    };
  }
  const avatarConfig = normalizeCompanionConfig(input);

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_config: avatarConfig })
    .eq("id", profile.id);

  if (error) {
    return {
      ok: false,
      message: "Your companion could not be saved. Please try again.",
    };
  }

  revalidatePath("/employee");
  revalidatePath("/employee/avatar");
  revalidatePath("/employee/onboarding");
  revalidatePath("/employee/player");
  revalidatePath("/employee/skills");

  return {
    ok: true,
    message: "Your companion is ready.",
  };
}
