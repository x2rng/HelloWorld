import Link from "next/link";
import {
  createAvatarV4FromStored,
  normalizeStoredAvatarConfig,
} from "@/components/avatar-3d/config/avatar-v4-parser";
import { ProceduralAvatarPresentation } from "@/components/avatar-3d/procedural-avatar-presentation";
import { AvatarV5Presentation } from "@/components/avatar-v5-production/avatar-v5-presentation";
import { isAvatarV5Config } from "@/components/avatar-v5-production/config/avatar-v5-parser";
import { PixelCompanion } from "@/components/avatar/pixel-companion";
import { AchievementList } from "@/components/employee/achievement-list";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { getAvatarStage, getNextAvatarStage } from "@/lib/avatar-stage";
import { getCompanionStage } from "@/lib/avatar/get-companion-stage";
import { isPixelCompanionConfig } from "@/lib/avatar/normalize-companion-config";
import { requireRole } from "@/lib/exp-auth";
import type {
  AchievementRecord,
  EmployeeAchievementRecord,
  EmployeeStatsRecord,
} from "@/lib/exp-types";
import { getLevelInfo } from "@/lib/levels";
import { normalizePlayerSelections } from "@/lib/player-setup";
import {
  getRoleFocusLabel,
  getRoleTemplateSkills,
  normalizeAssignedSkills,
  normalizeRoleFocus,
} from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";

type PlayerProfileRow = {
  avatar_config: unknown;
  role_focus: unknown;
  assigned_skills: unknown;
  interests: unknown;
  growth_priorities: unknown;
};

export const dynamic = "force-dynamic";

export default async function EmployeePlayerPage() {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const [playerResult, statsResult, achievementsResult, unlockedResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "avatar_config, role_focus, assigned_skills, interests, growth_priorities",
        )
        .eq("id", profile.id)
        .maybeSingle<PlayerProfileRow>(),
      supabase
        .from("employee_stats")
        .select(
          "id, workspace_id, employee_id, total_xp, current_level, completed_tasks_count, created_at, updated_at",
        )
        .eq("workspace_id", profile.workspace_id)
        .eq("employee_id", profile.id)
        .maybeSingle<EmployeeStatsRecord>(),
      supabase
        .from("achievements")
        .select("id, code, title, description, sort_order, created_at")
        .order("sort_order", { ascending: true })
        .returns<AchievementRecord[]>(),
      supabase
        .from("employee_achievements")
        .select("id, workspace_id, employee_id, achievement_id, unlocked_at")
        .eq("workspace_id", profile.workspace_id)
        .eq("employee_id", profile.id)
        .returns<EmployeeAchievementRecord[]>(),
    ]);

  if (
    playerResult.error ||
    statsResult.error ||
    achievementsResult.error ||
    unlockedResult.error
  ) {
    throw new Error("Your player profile could not be loaded.");
  }

  const roleFocus = normalizeRoleFocus(playerResult.data?.role_focus);
  const assignedSkills = normalizeAssignedSkills(
    playerResult.data?.assigned_skills,
  );
  const roleSkills =
    assignedSkills.length > 0
      ? assignedSkills
      : getRoleTemplateSkills(roleFocus);
  const storedAvatarConfig = normalizeStoredAvatarConfig(
    playerResult.data?.avatar_config,
  );
  const overall = getLevelInfo(statsResult.data?.total_xp ?? 0);
  const stage = getAvatarStage(overall.level);
  const nextStage = getNextAvatarStage(overall.level);
  const companionStage = getCompanionStage(overall.level);
  const interests = normalizePlayerSelections(playerResult.data?.interests, 20);
  const growthPriorities = normalizePlayerSelections(
    playerResult.data?.growth_priorities,
    5,
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[38px] border border-white/10 bg-[#0c1017]">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative flex min-h-[28rem] items-end justify-center overflow-hidden border-b border-white/8 bg-white/[0.025] px-6 pt-10 lg:border-b-0 lg:border-r">
            <div className="absolute left-6 top-6">
              <BadgePill tone="purple">Player</BadgePill>
            </div>
            <div className="absolute bottom-8 size-56 rounded-full bg-blue-500/15 blur-3xl" />
            {isPixelCompanionConfig(storedAvatarConfig) ? (
              <div className="flex h-full min-h-[28rem] w-full items-end justify-center pb-12">
                <PixelCompanion
                  config={storedAvatarConfig}
                  stage={companionStage.id}
                  size={320}
                />
              </div>
            ) : isAvatarV5Config(storedAvatarConfig) ? (
              <AvatarV5Presentation
                config={storedAvatarConfig}
                className="h-full min-h-[28rem] w-full rounded-none border-0"
              />
            ) : (
              <ProceduralAvatarPresentation
                config={createAvatarV4FromStored(storedAvatarConfig)}
                className="h-full min-h-[28rem] w-full rounded-none border-0"
              />
            )}
          </div>

          <div className="flex flex-col justify-between p-7 sm:p-10">
            <div>
              <p className="eyebrow">Player identity</p>
              <h1 className="mt-3 text-4xl leading-tight sm:text-6xl">
                {profile.full_name ?? profile.email}
              </h1>
              <p className="mt-3 text-lg text-white/58">
                {getRoleFocusLabel(roleFocus)}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <BadgePill tone="blue">Level {overall.level}</BadgePill>
                <BadgePill tone="cyan">{overall.totalXp} XP</BadgePill>
                <BadgePill tone="purple">
                  {isPixelCompanionConfig(storedAvatarConfig)
                    ? companionStage.label
                    : stage.name}
                </BadgePill>
              </div>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
                <span>Level progress</span>
                <span>
                  {overall.nextLevel
                    ? `${overall.xpToNextLevel} XP to Level ${overall.nextLevel}`
                    : "Current V1 peak"}
                </span>
              </div>
              <ProgressBar value={overall.progress} className="mt-3 h-2" />
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/employee/avatar"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950"
                >
                  Customize companion
                </Link>
                <Link
                  href="/employee/skills"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] px-5 text-sm font-semibold text-white/75"
                >
                  View Skills
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[32px] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Profession</p>
              <h2 className="mt-2 text-3xl">{getRoleFocusLabel(roleFocus)}</h2>
            </div>
            <BadgePill tone="purple">{roleSkills.length} role skills</BadgePill>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {roleSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-purple-300/12 bg-purple-400/[0.07] px-3 py-2 text-xs font-medium text-purple-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </Card>

        <Card className="rounded-[32px] p-6 sm:p-7">
          <p className="eyebrow">
            {isPixelCompanionConfig(storedAvatarConfig)
              ? "Companion stage"
              : "Evolution"}
          </p>
          <h2 className="mt-2 text-3xl">
            {isPixelCompanionConfig(storedAvatarConfig)
              ? companionStage.label
              : stage.name}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            {isPixelCompanionConfig(storedAvatarConfig)
              ? `Your companion stage is derived from Level ${overall.level} and grows through real EXP progress.`
              : nextStage
                ? `Your next player stage is ${nextStage.name}. Complete growth steps to continue evolving.`
                : "You have reached the highest avatar stage available in V1."}
          </p>
          <p className="mt-5 text-xs text-[var(--color-muted)]">
            Companion appearance remains separate from profession and assigned
            skills.
          </p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-[32px] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Interests &amp; hobbies</p>
              <h2 className="mt-2 text-3xl">Life beyond the role</h2>
            </div>
            <Link
              href="/employee/setup?edit=interests"
              className="text-sm font-semibold text-[var(--color-blue)]"
            >
              Edit
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {interests.length > 0 ? (
              interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-blue-300/12 bg-blue-400/[0.07] px-3 py-2 text-xs font-medium text-blue-100"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Add interests when you are ready to personalize future growth
                prompts.
              </p>
            )}
          </div>
        </Card>

        <Card className="rounded-[32px] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Growth priorities</p>
              <h2 className="mt-2 text-3xl">Your current focus</h2>
            </div>
            <Link
              href="/employee/setup?edit=priorities"
              className="text-sm font-semibold text-[var(--color-blue)]"
            >
              Edit
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {growthPriorities.length > 0 ? (
              growthPriorities.map((priority) => (
                <span
                  key={priority}
                  className="rounded-full border border-emerald-300/12 bg-emerald-400/[0.07] px-3 py-2 text-xs font-medium text-emerald-100"
                >
                  {priority}
                </span>
              ))
            ) : (
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Choose up to five priorities to describe what you want to
                strengthen.
              </p>
            )}
          </div>
        </Card>
      </div>

      <AchievementList
        achievements={achievementsResult.data}
        unlockedAchievements={unlockedResult.data}
      />
    </div>
  );
}
