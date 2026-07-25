"use client";

import { useEffect, useId, useState } from "react";
import { FullBodyAvatar } from "@/components/employee/full-body-avatar";
import type { AvatarConfig } from "@/lib/avatar-config";
import type { AvatarStage } from "@/lib/avatar-stage";
import type { DerivedSkillGroup, RoleFocus, SkillIcon } from "@/lib/skills";
import { getRoleFocusLabel } from "@/lib/skills";

type OverallProgress = {
  level: number;
  totalXp: number;
  nextLevel: number | null;
  xpToNextLevel: number;
  progress: number;
};

type SkillsPanelProps = {
  employeeName: string;
  roleFocus: RoleFocus;
  avatarConfig: AvatarConfig;
  stage: AvatarStage;
  nextStage: AvatarStage | null;
  overall: OverallProgress;
  groups: DerivedSkillGroup[];
};

function SkillGlyph({ icon }: { icon: SkillIcon }) {
  if (icon === "people") {
    return <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.5-3.5 2.3-5.3 5.5-5.3s5 1.8 5.5 5.3M15 6.3a3 3 0 0 1 0 5.7M16 14c2.7.3 4.2 2 4.5 5" /></svg>;
  }
  if (icon === "book") {
    return <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22V5.5ZM20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5A3.5 3.5 0 0 1 20 22V5.5Z" /></svg>;
  }
  if (icon === "tool") {
    return <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M14.5 6.5a4.5 4.5 0 0 0-6 5.9L3 18l3 3 5.6-5.5a4.5 4.5 0 0 0 5.9-6l-3 3-3-3 3-3Z" /></svg>;
  }
  if (icon === "spark") {
    return <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m12 2 1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2Z" /><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M22 12h-3M12 22v-3M2 12h3" /></svg>;
}

export function SkillsPanel({
  employeeName,
  roleFocus,
  avatarConfig,
  stage,
  nextStage,
  overall,
  groups,
}: SkillsPanelProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-controls={panelId}
        aria-expanded={open}
        className="fixed bottom-7 right-7 z-40 hidden items-center gap-2 rounded-full border border-blue-300/20 bg-[#101722]/95 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_50px_rgba(20,80,210,0.3)] backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-300/40 hover:bg-[#151f30] lg:flex"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-blue-400/12 text-blue-200"><SkillGlyph icon="spark" /></span>
        Skills
      </button>

      <div
        className={`fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] transition-opacity ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Skills quick view"
        className={`fixed bottom-2 right-2 top-2 z-50 flex w-[calc(100%-1rem)] max-w-[28rem] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0e15] text-white shadow-[0_30px_120px_rgba(0,0,0,0.65)] transition duration-300 sm:bottom-3 sm:right-3 sm:top-3 ${open ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-[105%] opacity-0"}`}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-300/70">Player progress</p>
            <p className="mt-1 text-sm font-semibold">Skills quick view</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-white/65 transition hover:text-white" aria-label="Close skills panel">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-7 pt-4">
          <section className="relative overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-[#172033] to-[#10141d] p-5">
            <div className="absolute -right-10 -top-10 size-36 rounded-full bg-blue-500/15 blur-3xl" />
            <div className="relative flex items-center gap-4">
              <div className="flex size-16 shrink-0 items-start justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
                <FullBodyAvatar config={avatarConfig} compact className="h-24 w-16 -translate-y-1" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold">{employeeName}</p>
                <p className="mt-0.5 text-xs text-white/50">{getRoleFocusLabel(roleFocus)}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-blue-400/12 px-2.5 py-1 text-blue-200">Level {overall.level}</span>
                  <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-white/65">{overall.totalXp} XP</span>
                  <span className="rounded-full bg-purple-400/10 px-2.5 py-1 text-purple-200">{stage.name}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-3 rounded-[24px] border border-white/8 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-white/80">Overall EXP</span>
              <span className="text-white/45">{overall.nextLevel ? `${overall.xpToNextLevel} XP to Level ${overall.nextLevel}` : "Current V1 peak"}</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" style={{ width: `${overall.progress}%` }} /></div>
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-purple-300/10 bg-purple-400/[0.05] p-3">
              <span className="mt-0.5 text-purple-200"><SkillGlyph icon="spark" /></span>
              <div>
                <p className="text-xs font-semibold text-purple-100">Avatar evolution</p>
                <p className="mt-1 text-xs leading-5 text-white/45">
                  {nextStage ? `Next: ${nextStage.name} at ${nextStage.levelLabel}. ` : "You reached the final V1 avatar stage. "}
                  Your avatar evolves as your EXP level grows through completed growth steps.
                </p>
              </div>
            </div>
          </section>

          {groups.map((group, groupIndex) => (
            <section key={group.name} className="mt-6">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{group.name}</h2>
                {groupIndex === 1 ? <span className="text-[10px] text-white/30">{getRoleFocusLabel(roleFocus)}</span> : null}
              </div>
              <div className="mt-2 space-y-2">
                {group.skills.map((skill) => (
                  <div key={skill.name} className="rounded-[20px] border border-white/[0.07] bg-[#111720] p-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-400/[0.09] text-blue-200"><SkillGlyph icon={skill.icon} /></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-white/85">{skill.name}</p>
                          <span className="shrink-0 text-[11px] font-semibold text-blue-200">Level {skill.level}</span>
                        </div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gradient-to-r from-blue-500/80 to-cyan-300/80" style={{ width: `${skill.progress}%` }} /></div>
                        <p className="mt-1.5 text-[10px] text-white/35">{skill.xp} / {skill.totalXpForNextLevel} XP to Level {skill.nextLevel}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </aside>
    </>
  );
}
