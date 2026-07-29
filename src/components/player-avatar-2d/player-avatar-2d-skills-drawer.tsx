"use client";

import Link from "next/link";
import { useEffect, useId } from "react";
import type { PlayerAvatar2DProofConfig } from "./config/player-avatar-2d-types";
import type {
  PlayerAvatar2DSkillGroup,
  PlayerAvatar2DSummary,
} from "./player-avatar-2d-progress";
import { PlayerAvatar2DRenderer } from "./player-avatar-2d-renderer";
import { PlayerAvatar2DSkillGlyph } from "./player-avatar-2d-skill-glyph";

type PlayerAvatar2DSkillsDrawerProps = {
  open: boolean;
  onClose: () => void;
  config: PlayerAvatar2DProofConfig;
  player: PlayerAvatar2DSummary;
  groups: PlayerAvatar2DSkillGroup[];
};

export function PlayerAvatar2DSkillsDrawer({
  open,
  onClose,
  config,
  player,
  groups,
}: PlayerAvatar2DSkillsDrawerProps) {
  const drawerId = useId();

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  return (
    <>
      <button
        type="button"
        aria-label="Close player skills"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px] transition-opacity ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        id={drawerId}
        role="dialog"
        aria-modal="true"
        aria-label="Player skills"
        className={`fixed bottom-2 right-2 top-2 z-50 flex w-[calc(100%-1rem)] max-w-[27rem] flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#0b0f17] text-white shadow-[0_34px_130px_rgba(0,0,0,0.66)] transition duration-300 sm:bottom-3 sm:right-3 sm:top-3 ${
          open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-[105%] opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fd8c5]">
              Player progress
            </p>
            <p className="mt-1 text-sm font-semibold">Skills at a glance</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 hover:text-white"
            aria-label="Close skills drawer"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-7 pt-4">
          <section className="relative overflow-hidden rounded-[25px] border border-white/9 bg-[radial-gradient(circle_at_12%_10%,rgba(143,216,197,0.16),transparent_36%),linear-gradient(145deg,#172131,#111620)] p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-[88px] w-[74px] shrink-0 items-end justify-center overflow-hidden rounded-[20px] border border-white/9 bg-white/[0.045]">
                <PlayerAvatar2DRenderer
                  config={config}
                  state="idle"
                  compact
                  className="h-[105px] w-[82px] translate-y-2"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-semibold">{player.employeeName}</p>
                <p className="mt-0.5 text-xs text-white/48">{player.role}</p>
                <div className="mt-3 flex gap-2 text-[11px] font-semibold">
                  <span className="rounded-full bg-[#8fd8c5]/12 px-2.5 py-1 text-[#b5ecdc]">
                    Level {player.level}
                  </span>
                  <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-white/60">
                    {player.totalXp} XP
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-white/70">Overall EXP</span>
              <span className="text-white/38">{player.xpToNextLevel} XP to next level</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6ec7b3] to-[#b4a4ff]"
                style={{ width: `${player.levelProgress}%` }}
              />
            </div>
          </section>

          {groups.map((group) => (
            <section key={group.name} className="mt-6">
              <h2 className="px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/36">
                {group.name}
              </h2>
              <div className="mt-2 space-y-2">
                {group.skills.map((skill) => (
                  <article
                    key={skill.name}
                    className="rounded-[19px] border border-white/[0.07] bg-white/[0.032] p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#8fd8c5]/10 text-[#a9e5d5]">
                        <PlayerAvatar2DSkillGlyph icon={skill.icon} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-white/82">{skill.name}</p>
                          <span className="text-[10px] font-bold text-[#a9e5d5]">L{skill.level}</span>
                        </div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/8">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#5bbba6] to-[#9b8df0]"
                            style={{ width: `${skill.progress}%` }}
                          />
                        </div>
                        {skill.source ? (
                          <p className="mt-1.5 truncate text-[9px] text-white/30">
                            Recent: {skill.source}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <div className="mt-6 grid gap-2">
            <Link href="/employee/player" className="rounded-full bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950">
              View Player
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/employee/avatar" className="rounded-full border border-white/9 bg-white/[0.045] px-3 py-3 text-center text-xs font-semibold text-white/72">
                Customize avatar
              </Link>
              <Link href="/employee/activities" className="rounded-full border border-white/9 bg-white/[0.045] px-3 py-3 text-center text-xs font-semibold text-white/72">
                Log activity
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
