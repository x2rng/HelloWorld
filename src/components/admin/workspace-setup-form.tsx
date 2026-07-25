"use client";

import { useActionState, useMemo, useState } from "react";
import { saveWorkspaceSetup, type SaveWorkspaceSetupState } from "@/app/admin/setup/actions";
import { Button } from "@/components/ui/button";
import {
  companySizeOptions,
  defaultDepartments,
  getSuggestedRoles,
  getSuggestedSkills,
  industryOptions,
  normalizeWorkspaceSetupProfile,
} from "@/lib/workspace-setup";

const initialActionState: SaveWorkspaceSetupState = { ok: false, message: "" };
const steps = ["Company", "Departments", "Roles", "Skills"];

type WorkspaceSetupFormProps = {
  initialName: string;
  initialIndustry: string | null;
  initialCompanySize: string | null;
  initialProfile: unknown;
};

function addUnique(current: string[], value: string, limit: number) {
  const normalized = value.trim().replace(/\s+/g, " ").slice(0, 60);
  if (!normalized || current.some((item) => item.toLowerCase() === normalized.toLowerCase())) return current;
  return [...current, normalized].slice(0, limit);
}

export function WorkspaceSetupForm({ initialName, initialIndustry, initialCompanySize, initialProfile }: WorkspaceSetupFormProps) {
  const initial = normalizeWorkspaceSetupProfile(initialProfile);
  const [state, action, pending] = useActionState(saveWorkspaceSetup, initialActionState);
  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState(initialName);
  const [industry, setIndustry] = useState(initialIndustry ?? "");
  const [companySize, setCompanySize] = useState(initialCompanySize ?? "");
  const [departments, setDepartments] = useState(initial.departments);
  const [roles, setRoles] = useState(initial.roles);
  const [skills, setSkills] = useState(initial.skills);
  const [customDepartment, setCustomDepartment] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const suggestedRoles = useMemo(() => getSuggestedRoles(departments), [departments]);
  const suggestedSkills = useMemo(() => getSuggestedSkills(roles), [roles]);

  function toggle(current: string[], value: string, setter: (next: string[]) => void) {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function goToSkills() {
    setSkills((current) => current.length > 0 ? current : suggestedSkills);
    setStep(3);
  }

  return (
    <form action={action}>
      <input type="hidden" name="company_name" value={companyName} />
      <input type="hidden" name="industry" value={industry} />
      <input type="hidden" name="company_size" value={companySize} />
      <input type="hidden" name="setup_profile" value={JSON.stringify({ departments, roles, skills })} />

      <div className="grid grid-cols-4 gap-2">
        {steps.map((label, index) => (
          <div key={label}>
            <div className={`h-1.5 rounded-full ${index <= step ? "bg-gradient-to-r from-blue-500 to-cyan-300" : "bg-white/8"}`} />
            <p className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] ${index === step ? "text-white" : "text-white/35"}`}>{index + 1}. {label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 min-h-[28rem]">
        {step === 0 ? (
          <section>
            <p className="eyebrow text-[var(--color-blue)]">Company basics</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Tell EXP where growth happens.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">This context shapes the roles and skills your onboarding system supports.</p>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2"><span className="text-sm font-medium">Company name</span><input value={companyName} onChange={(event) => setCompanyName(event.target.value)} maxLength={120} className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 outline-none focus:border-blue-400/50" /></label>
              <label className="space-y-2"><span className="text-sm font-medium">Industry</span><select value={industry} onChange={(event) => setIndustry(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 outline-none"><option value="">Choose industry</option>{industryOptions.map((option) => <option key={option} value={option} className="bg-[#111720]">{option}</option>)}</select></label>
              <label className="space-y-2"><span className="text-sm font-medium">Company size</span><select value={companySize} onChange={(event) => setCompanySize(event.target.value)} className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 outline-none"><option value="">Choose company size</option>{companySizeOptions.map((option) => <option key={option} value={option} className="bg-[#111720]">{option}</option>)}</select></label>
            </div>
          </section>
        ) : null}

        {step === 1 ? (
          <SelectionStep eyebrow="Departments" title="Choose the departments you onboard for." description="Select common teams or add one that is specific to your company." options={[...defaultDepartments]} selected={departments} onToggle={(value) => toggle(departments, value, setDepartments)} customValue={customDepartment} onCustomChange={setCustomDepartment} onAddCustom={() => { setDepartments((current) => addUnique(current, customDepartment, 30)); setCustomDepartment(""); }} customPlaceholder="Add custom department" />
        ) : null}

        {step === 2 ? (
          <SelectionStep eyebrow="Newcomer types" title="Select the roles you want EXP to support." description="Suggestions are based on your departments. Add any role unique to your company." options={suggestedRoles} selected={roles} onToggle={(value) => toggle(roles, value, setRoles)} customValue={customRole} onCustomChange={setCustomRole} onAddCustom={() => { setRoles((current) => addUnique(current, customRole, 40)); setCustomRole(""); }} customPlaceholder="Add custom role" />
        ) : null}

        {step === 3 ? (
          <SelectionStep eyebrow="Growth skills" title="Review the skills your newcomers can grow." description="These are saved as your company skill context and can support future defaults." options={suggestedSkills} selected={skills} onToggle={(value) => toggle(skills, value, setSkills)} customValue={customSkill} onCustomChange={setCustomSkill} onAddCustom={() => { setSkills((current) => addUnique(current, customSkill, 80)); setCustomSkill(""); }} customPlaceholder="Add custom skill" />
        ) : null}
      </div>

      {state.message ? <p className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm text-[var(--color-red)]" role="alert">{state.message}</p> : null}
      <div className="flex items-center justify-between border-t border-white/8 pt-5">
        <Button type="button" variant="secondary" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>Back</Button>
        {step < 3 ? <Button type="button" onClick={() => step === 2 ? goToSkills() : setStep((current) => current + 1)} disabled={(step === 0 && (!companyName.trim() || !industry || !companySize)) || (step === 1 && departments.length === 0) || (step === 2 && roles.length === 0)}>Continue</Button> : <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Complete company setup"}</Button>}
      </div>
    </form>
  );
}

function SelectionStep({ eyebrow, title, description, options, selected, onToggle, customValue, onCustomChange, onAddCustom, customPlaceholder }: { eyebrow: string; title: string; description: string; options: string[]; selected: string[]; onToggle: (value: string) => void; customValue: string; onCustomChange: (value: string) => void; onAddCustom: () => void; customPlaceholder: string }) {
  return <section><p className="eyebrow text-[var(--color-blue)]">{eyebrow}</p><h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">{description}</p><div className="mt-6 flex flex-wrap gap-2">{options.map((option) => { const active = selected.includes(option); return <button key={option} type="button" onClick={() => onToggle(option)} className={`rounded-full border px-4 py-2 text-sm transition ${active ? "border-blue-400/35 bg-blue-400/12 text-blue-100" : "border-white/10 bg-white/[0.035] text-[var(--color-muted)] hover:text-white"}`}>{active ? "✓ " : "+ "}{option}</button>; })}</div><div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.025] p-4"><div className="flex gap-2"><input value={customValue} onChange={(event) => onCustomChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); onAddCustom(); } }} maxLength={60} placeholder={customPlaceholder} className="h-11 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-sm outline-none" /><Button type="button" variant="secondary" onClick={onAddCustom} disabled={!customValue.trim()}>+</Button></div>{selected.length > 0 ? <div className="mt-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Selected · {selected.length}</p><div className="mt-2 flex flex-wrap gap-2">{selected.map((item) => <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/[0.055] px-3 py-1.5 text-xs">{item}<button type="button" onClick={() => onToggle(item)} className="text-white/40 hover:text-[var(--color-red)]" aria-label={`Remove ${item}`}>−</button></span>)}</div></div> : null}</div></section>;
}
