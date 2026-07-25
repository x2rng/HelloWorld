"use client";

import { useActionState } from "react";
import { createGrowthActivity, type CreateGrowthActivityState } from "@/app/employee/activities/actions";
import { Button } from "@/components/ui/button";
import { activityCategoryOptions, activityProofTypeOptions, activityVisibilityOptions } from "@/lib/growth-activities";

const initialState: CreateGrowthActivityState = { ok: false, message: "" };

export function GrowthActivityForm({ skillOptions }: { skillOptions: string[] }) {
  const [state, action, pending] = useActionState(createGrowthActivity, initialState);
  const inputClass = "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-sm text-[var(--color-ink)] outline-none focus:border-blue-400/50";

  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-2"><span className="text-sm font-medium">Activity title</span><input name="title" required maxLength={100} placeholder="Practiced a client discovery conversation" className={inputClass} /></label>
      <label className="block space-y-2"><span className="text-sm font-medium">What did you do?</span><textarea name="description" required maxLength={500} rows={4} placeholder="Describe the activity, what you practiced, and what changed." className="w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-[var(--color-ink)] outline-none focus:border-blue-400/50" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2"><span className="text-sm font-medium">Category</span><select name="category" required defaultValue="ROLE_SKILL_PRACTICE" className={inputClass}>{activityCategoryOptions.map((option) => <option key={option.value} value={option.value} className="bg-[#111720]">{option.label}</option>)}</select></label>
        <label className="space-y-2"><span className="text-sm font-medium">Related skill</span><input name="skill_name" list="activity-skills" required maxLength={60} placeholder="Choose or enter a skill" className={inputClass} /><datalist id="activity-skills">{skillOptions.map((skill) => <option key={skill} value={skill} />)}</datalist></label>
        <label className="space-y-2"><span className="text-sm font-medium">Proof type</span><select name="proof_type" required defaultValue="TEXT_NOTE" className={inputClass}>{activityProofTypeOptions.map((option) => <option key={option.value} value={option.value} className="bg-[#111720]">{option.label}</option>)}</select></label>
        <label className="space-y-2"><span className="text-sm font-medium">Visibility</span><select name="visibility" required defaultValue="PRIVATE" className={inputClass}>{activityVisibilityOptions.map((option) => <option key={option.value} value={option.value} className="bg-[#111720]">{option.label}</option>)}</select></label>
      </div>
      <label className="block space-y-2"><span className="text-sm font-medium">Proof link or image URL <span className="text-[var(--color-muted)]">(optional)</span></span><input name="proof_url" type="url" maxLength={1000} placeholder="https://..." className={inputClass} /></label>
      <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.055] p-4 text-xs leading-6 text-[var(--color-muted)]">
        Submitted activities begin as pending and do not change your current EXP level or XP. Verified activity growth can be connected in a later phase.
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? "Submitting..." : "Log growth activity"}</Button>
      {state.message ? <p className={`rounded-2xl border p-4 text-sm ${state.ok ? "border-emerald-400/20 bg-emerald-400/[0.07] text-[var(--color-green)]" : "border-red-400/20 bg-red-400/[0.07] text-[var(--color-red)]"}`} role="status">{state.message}</p> : null}
    </form>
  );
}
