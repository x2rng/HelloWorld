"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isCompleteStoredAvatarConfig,
  normalizeStoredAvatarConfig,
} from "@/components/avatar-3d/config/avatar-v4-parser";
import { requireRole } from "@/lib/exp-auth";
import {
  growthPriorityOptions,
  normalizePlayerSelections,
} from "@/lib/player-setup";
import {
  getRoleTemplateSkills,
  hasAssignedRoleSkills,
  isRoleFocus,
} from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";

export type CompletePlayerSetupState = {
  ok: boolean;
  message: string;
};

type SetupProfileRow = {
  role_focus: unknown;
  assigned_skills: unknown;
};

function parseArray(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return [];

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return [];
  }
}

function parseObject(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return null;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

export async function completePlayerSetup(
  _previousState: CompletePlayerSetupState,
  formData: FormData,
): Promise<CompletePlayerSetupState> {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const { data: currentProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role_focus, assigned_skills")
    .eq("id", profile.id)
    .maybeSingle<SetupProfileRow>();

  if (profileError || !currentProfile) {
    return {
      ok: false,
      message: "Your player profile could not be prepared. Please try again.",
    };
  }

  const interests = normalizePlayerSelections(
    parseArray(formData, "interests"),
    20,
  );
  const growthPriorities = normalizePlayerSelections(
    parseArray(formData, "growth_priorities"),
    5,
  ).filter((priority) =>
    growthPriorityOptions.includes(
      priority as (typeof growthPriorityOptions)[number],
    ),
  );
  const avatarInput = parseObject(formData, "avatar_config");

  if (!isCompleteStoredAvatarConfig(avatarInput)) {
    return { ok: false, message: "Choose a valid companion." };
  }
  const avatarConfig = normalizeStoredAvatarConfig(avatarInput);

  const update: Record<string, unknown> = {
    interests,
    growth_priorities: growthPriorities,
    avatar_config: avatarConfig,
    player_setup_completed: true,
  };

  if (
    !hasAssignedRoleSkills(
      currentProfile.role_focus,
      currentProfile.assigned_skills,
    )
  ) {
    const fallbackRole = formData.get("role_focus");
    if (!isRoleFocus(fallbackRole)) {
      return {
        ok: false,
        message: "Choose the role that best matches your work.",
      };
    }

    update.role_focus = fallbackRole;
    update.assigned_skills = getRoleTemplateSkills(fallbackRole);
  }

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", profile.id);

  if (error) {
    return {
      ok: false,
      message: "Your player setup could not be saved. Please try again.",
    };
  }

  revalidatePath("/employee");
  revalidatePath("/employee/player");
  revalidatePath("/employee/skills");
  revalidatePath("/employee/setup");
  redirect("/employee");
}
