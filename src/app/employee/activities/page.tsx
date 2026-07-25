import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { GrowthActivityForm } from "@/components/employee/growth-activity-form";
import { requireRole } from "@/lib/exp-auth";
import type { GrowthActivityRecord } from "@/lib/exp-types";
import { activityCategoryOptions, activityProofTypeOptions, activityVisibilityOptions, optionLabel } from "@/lib/growth-activities";
import { getRoleTemplateSkills, normalizeAssignedSkills, normalizeRoleFocus, skillSuggestions } from "@/lib/skills";
import { createClient } from "@/lib/supabase/server";

type ActivitySkillProfile = { role_focus: unknown; assigned_skills: unknown };

export const dynamic = "force-dynamic";

export default async function EmployeeActivitiesPage() {
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  const [activitiesResult, skillProfileResult] = await Promise.all([
    supabase.from("growth_activities").select("id, workspace_id, employee_id, title, description, category, skill_name, proof_type, proof_url, visibility, status, suggested_xp, created_at").eq("workspace_id", profile.workspace_id).eq("employee_id", profile.id).order("created_at", { ascending: false }).returns<GrowthActivityRecord[]>(),
    supabase.from("profiles").select("role_focus, assigned_skills").eq("id", profile.id).maybeSingle<ActivitySkillProfile>(),
  ]);
  if (activitiesResult.error) throw new Error(`Failed to load growth activities: ${activitiesResult.error.message}`);
  if (skillProfileResult.error) throw new Error(`Failed to load activity skills: ${skillProfileResult.error.message}`);

  const roleFocus = normalizeRoleFocus(skillProfileResult.data?.role_focus);
  const assignedSkills = normalizeAssignedSkills(skillProfileResult.data?.assigned_skills);
  const skillOptions = [...new Set([...assignedSkills, ...getRoleTemplateSkills(roleFocus), ...skillSuggestions])].slice(0, 80);

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden rounded-[38px] p-7 sm:p-10">
        <div className="absolute -right-20 -top-24 size-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative"><BadgePill tone="cyan">Log activity</BadgePill><h2 className="mt-5 max-w-3xl text-4xl leading-tight sm:text-6xl">Turn real work into visible growth.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">Log an activity and attach proof of progress. Verified activities can contribute to your Player later.</p></div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-[34px] p-6 sm:p-7"><p className="eyebrow">New activity</p><h3 className="mt-2 text-3xl">Log proof of progress</h3><div className="mt-6"><GrowthActivityForm skillOptions={skillOptions} /></div></Card>
        <Card className="rounded-[34px] p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Your activity history</p><h3 className="mt-2 text-3xl">Submitted growth</h3></div><BadgePill tone="blue">{activitiesResult.data.length}</BadgePill></div>
          <div className="mt-6 space-y-3">
            {activitiesResult.data.length === 0 ? <div className="rounded-[26px] border border-white/8 bg-white/[0.025] p-6"><p className="font-semibold">No activities logged yet.</p><p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">Your proof log will build a record of learning, contribution, and skill practice beyond assigned steps.</p></div> : activitiesResult.data.map((activity) => (
              <article key={activity.id} className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap gap-2"><BadgePill tone="purple">{optionLabel(activityCategoryOptions, activity.category)}</BadgePill><BadgePill tone="blue">{activity.skill_name}</BadgePill></div><h4 className="mt-3 text-xl font-semibold">{activity.title}</h4></div><BadgePill tone={activity.status === "approved" ? "green" : activity.status === "rejected" ? "red" : "amber"}>{activity.status}</BadgePill></div>
                <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{activity.description}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--color-muted)]"><span>{optionLabel(activityProofTypeOptions, activity.proof_type)}</span><span>{optionLabel(activityVisibilityOptions, activity.visibility)}</span><span>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(activity.created_at))}</span>{activity.proof_url ? <a href={activity.proof_url} target="_blank" rel="noreferrer" className="font-semibold text-[var(--color-blue)]">View proof ↗</a> : null}</div>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
