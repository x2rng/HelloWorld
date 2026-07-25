"use client";

import { useActionState, useMemo, useState } from "react";
import { inviteEmployee, type InviteEmployeeState } from "@/app/admin/employees/actions";
import { Button } from "@/components/ui/button";
import {
  getRoleTemplateSkills,
  roleTemplateOptions,
  type RoleFocus,
} from "@/lib/skills";

const initialState: InviteEmployeeState = {
  ok: false,
  message: "",
};

export function InviteEmployeeForm() {
  const [state, formAction, pending] = useActionState(inviteEmployee, initialState);
  const [roleFocus, setRoleFocus] = useState<RoleFocus>("GENERAL_EMPLOYEE");
  const [skills, setSkills] = useState<string[]>(() => getRoleTemplateSkills("GENERAL_EMPLOYEE"));
  const [customSkill, setCustomSkill] = useState("");
  const defaultSkills = useMemo(() => getRoleTemplateSkills(roleFocus), [roleFocus]);

  function loadTemplate(value: RoleFocus) {
    setRoleFocus(value);
    setSkills(getRoleTemplateSkills(value));
  }

  function addCustomSkill() {
    const name = customSkill.trim().replace(/\s+/g, " ").slice(0, 60);
    if (!name || skills.some((skill) => skill.toLowerCase() === name.toLowerCase())) return;
    setSkills((current) => [...current, name].slice(0, 30));
    setCustomSkill("");
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="invite-email" className="text-sm font-medium">
          Employee email
        </label>
        <input
          id="invite-email"
          name="email"
          type="email"
          required
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-[var(--color-ink)] outline-none focus:border-blue-400/50"
          placeholder="employee@company.com"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="invite-role-focus" className="text-sm font-medium">Role template</label>
          <button type="button" onClick={() => setSkills(defaultSkills)} className="text-xs font-semibold text-[var(--color-blue)] hover:underline">
            Reset defaults
          </button>
        </div>
        <select
          id="invite-role-focus"
          name="role_focus"
          value={roleFocus}
          onChange={(event) => loadTemplate(event.target.value as RoleFocus)}
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-sm text-[var(--color-ink)] outline-none focus:border-blue-400/50"
        >
          {roleTemplateOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#111720]">{option.label}</option>
          ))}
        </select>
      </div>

      <input type="hidden" name="assigned_skills" value={JSON.stringify(skills)} />

      <div className="rounded-[24px] border border-white/8 bg-white/[0.025] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Assigned role skills</p>
            <p className="mt-1 text-xs text-[var(--color-muted)]">These become the employee&apos;s Role Skills.</p>
          </div>
          <span className="rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-blue)]">{skills.length}</span>
        </div>

        <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
          {skills.map((skill) => {
            const isTemplateSkill = defaultSkills.some((item) => item.toLowerCase() === skill.toLowerCase());
            return (
              <div key={skill} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.035] px-3 py-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-400/10 text-[var(--color-blue)]" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 3 2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z" /></svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{skill}</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-muted)]">{isTemplateSkill ? "Role template" : "Custom"}</p>
                </div>
                <button type="button" onClick={() => setSkills((current) => current.filter((item) => item !== skill))} className="flex size-7 items-center justify-center rounded-full border border-white/10 text-[var(--color-muted)] hover:border-red-400/30 hover:text-[var(--color-red)]" aria-label={`Remove ${skill}`}>
                  <span aria-hidden="true">−</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex gap-2">
          <label htmlFor="custom-skill" className="sr-only">Add custom skill</label>
          <input
            id="custom-skill"
            value={customSkill}
            onChange={(event) => setCustomSkill(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomSkill();
              }
            }}
            maxLength={60}
            placeholder="Add a custom skill"
            className="h-11 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.055] px-3 text-sm outline-none focus:border-blue-400/50"
          />
          <Button type="button" variant="secondary" onClick={addCustomSkill} disabled={!customSkill.trim() || skills.length >= 30} aria-label="Add custom skill">+</Button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating invite..." : "Create invite link"}
      </Button>

      {state.message ? (
        <div
          className={
            state.ok
              ? "rounded-2xl border border-[var(--color-green)]/20 bg-[var(--color-green-soft)] p-4 text-sm text-[var(--color-green)]"
              : "rounded-2xl border border-[var(--color-red)]/20 bg-[var(--color-red-soft)] p-4 text-sm text-[var(--color-red)]"
          }
        >
          <p>{state.message}</p>
          {state.inviteLink ? (
            <input
              readOnly
              value={state.inviteLink}
              className="mt-3 h-11 w-full rounded-xl border border-black/8 bg-white px-3 text-[var(--color-ink)] outline-none"
              onFocus={(event) => event.currentTarget.select()}
            />
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
