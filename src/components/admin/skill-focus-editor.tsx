"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { normalizeSkillFocus } from "@/lib/skill-attribution";
import { skillSuggestions } from "@/lib/skills";

type SkillFocusEditorProps = {
  initialSkills: unknown;
  action: (formData: FormData) => void | Promise<void>;
  label: string;
};

export function SkillFocusEditor({ initialSkills, action, label }: SkillFocusEditorProps) {
  const [skills, setSkills] = useState(() => normalizeSkillFocus(initialSkills));
  const [draft, setDraft] = useState("");
  const listId = useId();

  function addSkill() {
    const next = normalizeSkillFocus([...skills, draft]);
    if (next.length === skills.length) return;
    setSkills(next);
    setDraft("");
  }

  return (
    <form action={action} className="rounded-[22px] border border-white/8 bg-white/[0.025] p-4">
      <input type="hidden" name="skill_focus" value={JSON.stringify(skills)} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Context only; task contributions award skill XP.</p>
        </div>
        <span className="rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-blue)]">{skills.length}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {skills.length > 0 ? skills.map((skill) => (
          <span key={skill} className="inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-400/[0.07] px-3 py-1.5 text-xs">
            {skill}
            <button type="button" onClick={() => setSkills((current) => current.filter((item) => item !== skill))} className="text-[var(--color-muted)] hover:text-[var(--color-red)]" aria-label={`Remove ${skill}`}>−</button>
          </span>
        )) : <p className="text-xs text-[var(--color-muted)]">No skill focus configured.</p>}
      </div>
      <div className="mt-3 flex gap-2">
        <label htmlFor={`${listId}-input`} className="sr-only">Add skill</label>
        <input id={`${listId}-input`} list={listId} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addSkill(); } }} maxLength={60} placeholder="Add a skill" className="h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.055] px-3 text-sm outline-none focus:border-blue-400/50" />
        <datalist id={listId}>{skillSuggestions.map((skill) => <option key={skill} value={skill} />)}</datalist>
        <Button type="button" size="sm" variant="secondary" onClick={addSkill} disabled={!draft.trim()}>+</Button>
        <Button type="submit" size="sm">Save</Button>
      </div>
    </form>
  );
}
