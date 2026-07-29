import { requireRole } from "@/lib/exp-auth";
import { EmployeeGameShell } from "@/components/layout/employee-game-shell";
import { normalizeStoredAvatarConfig } from "@/components/avatar-3d/config/avatar-v4-parser";
import type { EmployeeCompanionData } from "@/components/employee/employee-player-companion";
import { getAvatarStage } from "@/lib/avatar-stage";
import { loadEmployeeSkillProfile } from "@/lib/employee-skill-profile";
import type { EmployeeStatsRecord } from "@/lib/exp-types";
import { getLevelInfo } from "@/lib/levels";
import {
  deriveSkillGroups,
  normalizeAssignedSkills,
  normalizeRoleFocus,
} from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";

type CompanionProfileRow = {
  avatar_config: unknown;
  role_focus: unknown;
  assigned_skills: unknown;
};

export const dynamic = "force-dynamic";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const skillProfilePromise = loadEmployeeSkillProfile(
    profile.id,
    profile.workspace_id,
  ).catch(() => null);
  const [companionProfileResult, statsResult, skillProfile] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("avatar_config, role_focus, assigned_skills")
        .eq("id", profile.id)
        .maybeSingle<CompanionProfileRow>(),
      supabase
        .from("employee_stats")
        .select(
          "id, workspace_id, employee_id, total_xp, current_level, completed_tasks_count, created_at, updated_at",
        )
        .eq("workspace_id", profile.workspace_id)
        .eq("employee_id", profile.id)
        .maybeSingle<EmployeeStatsRecord>(),
      skillProfilePromise,
    ]);

  const roleFocus =
    skillProfile?.roleFocus ??
    normalizeRoleFocus(companionProfileResult.data?.role_focus);
  const assignedSkills =
    skillProfile?.assignedSkills ??
    normalizeAssignedSkills(companionProfileResult.data?.assigned_skills);
  const groups =
    skillProfile?.groups ?? deriveSkillGroups([], roleFocus, assignedSkills);
  const overall = getLevelInfo(statsResult.data?.total_xp ?? 0);
  const companion: EmployeeCompanionData = {
    employeeName: profile.full_name ?? profile.email,
    roleFocus,
    avatarConfig: normalizeStoredAvatarConfig(
      companionProfileResult.data?.avatar_config,
    ),
    stage: getAvatarStage(overall.level),
    overall,
    groups,
  };

  return (
    <EmployeeGameShell
      profile={profile}
      playerSetupCompleted={profile.player_setup_completed !== false}
      companion={companion}
    >
      {children}
    </EmployeeGameShell>
  );
}
