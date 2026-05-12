import Link from "next/link";
import { AchievementList } from "@/components/employee/achievement-list";
import { AvatarEditorForm } from "@/components/employee/avatar-editor-form";
import { AvatarStageCard } from "@/components/employee/avatar-stage-card";
import { Card } from "@/components/ui/card";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/exp-auth";
import type {
  AchievementRecord,
  EmployeeAchievementRecord,
  EmployeeStatsRecord,
} from "@/lib/exp-types";
import { normalizeAvatarConfig } from "@/lib/avatar-config";
import { getLevelInfo } from "@/lib/levels";
import { createClient } from "@/lib/supabase/server";

type EmployeeAssignment = {
  id: string;
  status: string;
  start_date: string;
  due_date: string;
  track: {
    title: string;
    description: string | null;
  } | null;
};

type EmployeeAvatarProfile = {
  avatar_config: unknown;
};

export const dynamic = "force-dynamic";

export default async function EmployeePage() {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const { data: assignment, error } = await supabase
    .from("track_assignments")
    .select("id, status, start_date, due_date, track:onboarding_tracks(title, description)")
    .eq("workspace_id", profile.workspace_id)
    .eq("employee_id", profile.id)
    .maybeSingle<EmployeeAssignment>();

  if (error) {
    throw new Error(`Failed to load assignment: ${error.message}`);
  }

  const { data: stats, error: statsError } = await supabase
    .from("employee_stats")
    .select("id, workspace_id, employee_id, total_xp, current_level, completed_tasks_count, created_at, updated_at")
    .eq("workspace_id", profile.workspace_id)
    .eq("employee_id", profile.id)
    .maybeSingle<EmployeeStatsRecord>();

  if (statsError) {
    throw new Error(`Failed to load employee stats: ${statsError.message}`);
  }

  const { data: achievements, error: achievementsError } = await supabase
    .from("achievements")
    .select("id, code, title, description, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .returns<AchievementRecord[]>();

  if (achievementsError) {
    throw new Error(`Failed to load achievements: ${achievementsError.message}`);
  }

  const { data: unlockedAchievements, error: unlockedAchievementsError } =
    await supabase
      .from("employee_achievements")
      .select("id, workspace_id, employee_id, achievement_id, unlocked_at")
      .eq("workspace_id", profile.workspace_id)
      .eq("employee_id", profile.id)
      .returns<EmployeeAchievementRecord[]>();

  if (unlockedAchievementsError) {
    throw new Error(`Failed to load unlocked achievements: ${unlockedAchievementsError.message}`);
  }

  const { data: avatarProfile, error: avatarProfileError } = await supabase
    .from("profiles")
    .select("avatar_config")
    .eq("id", profile.id)
    .maybeSingle<EmployeeAvatarProfile>();

  if (avatarProfileError) {
    throw new Error(`Failed to load avatar: ${avatarProfileError.message}`);
  }

  const level = getLevelInfo(stats?.total_xp ?? 0);
  const hasAvatarConfig = avatarProfile?.avatar_config != null;
  const avatarConfig = normalizeAvatarConfig(avatarProfile?.avatar_config);

  return (
    <div className="space-y-5">
      {!hasAvatarConfig ? (
        <Card className="rounded-[36px] p-6 sm:p-8">
          <p className="eyebrow">Avatar setup</p>
          <h2 className="mt-2 text-4xl">Create your EXP avatar.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Choose a simple full-body identity before continuing. Your avatar stays
            consistent while the stage frame evolves with your level.
          </p>
          <div className="mt-6">
            <AvatarEditorForm initialConfig={avatarConfig} />
          </div>
        </Card>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <AvatarStageCard
          currentLevel={level.level}
          progress={level.progress}
          totalXp={level.totalXp}
          xpToNextLevel={level.xpToNextLevel}
          avatarConfig={avatarConfig}
          showEditAction={hasAvatarConfig}
        />

        <Card className="rounded-[36px] p-6 sm:p-8">
          <p className="eyebrow">Welcome</p>
          <h2 className="mt-2 text-4xl">{profile.full_name ?? profile.email}</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            Your employee identity is backed by Supabase Auth and a workspace-linked profile. Your assigned onboarding
            track appears here when an admin assigns one.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <BadgePill tone="blue">EMPLOYEE</BadgePill>
            <BadgePill tone="green">{profile.workspace?.name ?? "Workspace linked"}</BadgePill>
          </div>

          <p className="eyebrow mt-8">Assignment</p>
          {assignment ? (
            <div className="mt-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-3xl">{assignment.track?.title ?? "Assigned track"}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {assignment.track?.description ?? "No description has been added to this track yet."}
                  </p>
                </div>
                <BadgePill tone="green">{assignment.status}</BadgePill>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-black/6 bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Start date
                  </p>
                  <p className="mt-2 font-medium">{assignment.start_date}</p>
                </div>
                <div className="rounded-2xl border border-black/6 bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    Due date
                  </p>
                  <p className="mt-2 font-medium">{assignment.due_date}</p>
                </div>
              </div>
              <Link href="/employee/onboarding" className="mt-6 inline-flex">
                <Button>Open onboarding journey</Button>
              </Link>
            </div>
          ) : (
            <div className="mt-4">
              <h3 className="text-3xl">No track assigned yet.</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Your workspace admin can assign an onboarding track when it is ready. Task completion and progress views
                come in a later phase.
              </p>
            </div>
          )}
        </Card>
      </div>

      <AchievementList
        achievements={achievements}
        unlockedAchievements={unlockedAchievements}
      />
    </div>
  );
}
