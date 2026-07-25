import { redirect } from "next/navigation";
import { PlayerSetupFlow } from "@/components/employee/player-setup-flow";
import { getAvatarStage } from "@/lib/avatar-stage";
import { requireRole } from "@/lib/exp-auth";
import type { EmployeeStatsRecord } from "@/lib/exp-types";
import { getLevelInfo } from "@/lib/levels";
import { normalizePlayerSetupProfile } from "@/lib/player-setup";
import { createClient } from "@/lib/supabase/server";

type SetupProfileRow = {
  avatar_config: unknown;
  role_focus: unknown;
  assigned_skills: unknown;
  interests: unknown;
  growth_priorities: unknown;
  player_setup_completed: boolean;
};

type SetupAssignmentRow = {
  track: { title: string } | null;
};

export const dynamic = "force-dynamic";

export default async function EmployeeSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const [setupResult, statsResult, assignmentResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "avatar_config, role_focus, assigned_skills, interests, growth_priorities, player_setup_completed",
      )
      .eq("id", profile.id)
      .maybeSingle<SetupProfileRow>(),
    supabase
      .from("employee_stats")
      .select(
        "id, workspace_id, employee_id, total_xp, current_level, completed_tasks_count, created_at, updated_at",
      )
      .eq("workspace_id", profile.workspace_id)
      .eq("employee_id", profile.id)
      .maybeSingle<EmployeeStatsRecord>(),
    supabase
      .from("track_assignments")
      .select("track:onboarding_tracks(title)")
      .eq("workspace_id", profile.workspace_id)
      .eq("employee_id", profile.id)
      .maybeSingle<SetupAssignmentRow>(),
  ]);

  if (setupResult.error || !setupResult.data) {
    throw new Error("Your player setup could not be loaded.");
  }
  if (statsResult.error || assignmentResult.error) {
    throw new Error("Your starting player summary could not be loaded.");
  }
  const editStep =
    edit === "interests"
      ? 2
      : edit === "priorities"
        ? 3
        : edit === "avatar"
          ? 4
          : null;

  if (setupResult.data.player_setup_completed && editStep === null) {
    redirect("/employee/player");
  }

  const setupProfile = normalizePlayerSetupProfile(setupResult.data);
  const level = getLevelInfo(statsResult.data?.total_xp ?? 0);
  const stage = getAvatarStage(level.level);

  return (
    <PlayerSetupFlow
      employeeName={profile.full_name ?? profile.email}
      workspaceName={profile.workspace?.name ?? "Your company"}
      roleFocus={setupProfile.roleFocus}
      assignedSkills={setupProfile.assignedSkills}
      hasCompanyAssignedIdentity={setupProfile.hasCompanyAssignedIdentity}
      initialInterests={setupProfile.interests}
      initialGrowthPriorities={setupProfile.growthPriorities}
      initialAvatarConfig={setupProfile.avatarConfig}
      assignmentTitle={assignmentResult.data?.track?.title ?? null}
      startingLevel={level.level}
      avatarStage={stage.name}
      initialStep={editStep ?? 0}
      editing={setupResult.data.player_setup_completed}
    />
  );
}
