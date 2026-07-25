import Link from "next/link";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { loadEmployeeSkillProfile } from "@/lib/employee-skill-profile";
import { requireRole } from "@/lib/exp-auth";
import type { EmployeeStatsRecord } from "@/lib/exp-types";
import { getLevelInfo } from "@/lib/levels";
import { getRoleFocusLabel } from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function EmployeeSkillsPage() {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const [skillProfile, statsResult] = await Promise.all([
    loadEmployeeSkillProfile(profile.id, profile.workspace_id),
    supabase
      .from("employee_stats")
      .select(
        "id, workspace_id, employee_id, total_xp, current_level, completed_tasks_count, created_at, updated_at",
      )
      .eq("workspace_id", profile.workspace_id)
      .eq("employee_id", profile.id)
      .maybeSingle<EmployeeStatsRecord>(),
  ]);

  if (statsResult.error) {
    throw new Error("Your overall skill progress could not be loaded.");
  }

  const overall = getLevelInfo(statsResult.data?.total_xp ?? 0);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0d1119] p-7 sm:p-9">
        <div className="absolute -right-20 -top-24 size-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <BadgePill tone="blue">Skills</BadgePill>
              <BadgePill tone="purple">
                {getRoleFocusLabel(skillProfile.roleFocus)}
              </BadgePill>
            </div>
            <h1 className="mt-5 text-4xl leading-tight sm:text-6xl">
              See what your progress is building.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              Growth steps strengthen core capabilities, role skills, and personal
              growth. Skill XP reflects completed journey work.
            </p>
          </div>
          <div className="min-w-52 rounded-[24px] border border-white/8 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
              <span>Overall level</span>
              <span>{overall.totalXp} XP</span>
            </div>
            <p className="mt-2 text-3xl font-semibold">Level {overall.level}</p>
            <ProgressBar value={overall.progress} className="mt-4 h-1.5" />
          </div>
        </div>
      </section>

      {skillProfile.groups.map((group, groupIndex) => (
        <section key={group.name}>
          <div className="flex items-end justify-between gap-4 px-1">
            <div>
              <p className="eyebrow">
                {groupIndex === 0
                  ? "Foundation"
                  : groupIndex === 1
                    ? getRoleFocusLabel(skillProfile.roleFocus)
                    : "Player development"}
              </p>
              <h2 className="mt-2 text-3xl">{group.name}</h2>
            </div>
            <BadgePill tone={groupIndex === 1 ? "purple" : "blue"}>
              {group.skills.length}
            </BadgePill>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {group.skills.map((skill) => (
              <Card key={skill.name} className="rounded-[24px] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{skill.name}</p>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      {skill.xp} skill XP
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-200">
                    Level {skill.level}
                  </span>
                </div>
                <ProgressBar value={skill.progress} className="mt-5 h-1.5" />
                <p className="mt-2 text-xs text-[var(--color-muted)]">
                  {skill.currentLevelXp} / {skill.nextLevelXp} XP toward Level{" "}
                  {skill.nextLevel}
                </p>
              </Card>
            ))}
          </div>
        </section>
      ))}

      <Card className="flex flex-col gap-4 rounded-[28px] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">Build skills through your Journey.</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Each completed growth step shows which skills it contributes to.
          </p>
        </div>
        <Link
          href="/employee/onboarding"
          className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-950"
        >
          Open Journey
        </Link>
      </Card>
    </div>
  );
}
