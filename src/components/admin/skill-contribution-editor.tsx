"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { normalizeSkillContributions } from "@/lib/skill-attribution";
import { skillSuggestions } from "@/lib/skills";

type SkillContributionEditorProps = {
  initialContributions: unknown;
  action: (formData: FormData) => void | Promise<void>;
};

export function SkillContributionEditor({ initialContributions, action }: SkillContributionEditorProps) {
  const [contributions, setContributions] = useState(() => normalizeSkillContributions(initialContributions));
  const [skill, setSkill] = useState("");
  const [xp, setXp] = useState(10);
  const listId = useId();

  function addContribution() {
    const next = normalizeSkillContributions([...contributions, { skill, xp }]);
    if (next.length === contributions.length && !contributions.some((item) => item.skill.toLowerCase() === skill.trim().toLowerCase())) return;
    setContributions(next);
    setSkill("");
    setXp(10);
  }

  return (
    <form action={action} className="mt-3 rounded-2xl border border-white/8 bg-black/10 p-3">
      <input type="hidden" name="skill_contributions" value={JSON.stringify(contributions)} />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Skill XP contributions</p>
        <Button type="submit" size="sm" variant="secondary">Save</Button>
      </div>
      <div className="mt-2 space-y-2">
        {contributions.map((contribution) => (
          <div key={contribution.skill} className="grid grid-cols-[1fr_76px_30px] items-center gap-2 rounded-xl bg-white/[0.035] px-3 py-2 text-xs">
            <span className="truncate font-medium">{contribution.skill}</span>
            <label className="flex items-center gap-1 text-[var(--color-muted)]">
              <input type="number" min={1} max={100} value={contribution.xp} onChange={(event) => setContributions((current) => current.map((item) => item.skill === contribution.skill ? { ...item, xp: Math.min(100, Math.max(1, Number(event.target.value) || 1)) } : item))} className="h-8 w-12 rounded-lg border border-white/10 bg-white/[0.055] px-2 text-center text-[var(--color-ink)] outline-none" /> XP
            </label>
            <button type="button" onClick={() => setContributions((current) => current.filter((item) => item.skill !== contribution.skill))} className="flex size-7 items-center justify-center rounded-full text-[var(--color-muted)] hover:text-[var(--color-red)]" aria-label={`Remove ${contribution.skill}`}>−</button>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-[1fr_72px_38px] gap-2">
        <label htmlFor={`${listId}-skill`} className="sr-only">Skill</label>
        <input id={`${listId}-skill`} list={listId} value={skill} onChange={(event) => setSkill(event.target.value)} maxLength={60} placeholder="Skill" className="h-9 min-w-0 rounded-xl border border-white/10 bg-white/[0.055] px-3 text-xs outline-none" />
        <datalist id={listId}>{skillSuggestions.map((item) => <option key={item} value={item} />)}</datalist>
        <label htmlFor={`${listId}-xp`} className="sr-only">XP</label>
        <input id={`${listId}-xp`} type="number" min={1} max={100} value={xp} onChange={(event) => setXp(Number(event.target.value))} className="h-9 rounded-xl border border-white/10 bg-white/[0.055] px-2 text-center text-xs outline-none" />
        <Button type="button" size="sm" variant="secondary" onClick={addContribution} disabled={!skill.trim()}>+</Button>
      </div>
    </form>
  );
}
