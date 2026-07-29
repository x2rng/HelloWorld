"use client";

import Link from "next/link";
import { useEffect, useId } from "react";
import { CompanionSkillGlyph } from "@/components/player-companion/companion-skill-glyph";
import type { PlayerCompanionConfig } from "@/components/player-companion/config/player-companion-types";
import { PlayerCompanionPortrait } from "@/components/player-companion/player-companion-fallback";
import type {
  CompanionPlayerSummary,
  CompanionSkillGroup,
} from "@/components/player-companion/player-companion-progress";

function QuickActionIcon({
  icon,
}: {
  icon: "player" | "edit" | "activity";
}) {
  if (icon === "edit") {
    return <path d="m4 16-.8 4.8L8 20l10.8-10.8-4-4L4 16Zm9.4-9.4 4 4" />;
  }
  if (icon === "activity") {
    return <path d="M12 4v16M4 12h16" />;
  }
  return (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.7-5 3.2-7.5 7.5-7.5s6.8 2.5 7.5 7.5" />
    </>
  );
}

export function PlayerCompanionDrawer({
  open,
  onClose,
  config,
  player,
  groups,
}: {
  open: boolean;
  onClose: () => void;
  config: PlayerCompanionConfig;
  player: CompanionPlayerSummary;
  groups: CompanionSkillGroup[];
}) {
  const panelId = useId();

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
      <div
        className={`fixed inset-0 z-[70] bg-black/58 backdrop-blur-[3px] transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        inert={!open}
        aria-label="Player companion and skills"
        className={`fixed bottom-2 right-2 top-2 z-[80] flex w-[calc(100%-1rem)] max-w-[29rem] flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#090d15] text-white shadow-[0_34px_140px_rgba(0,0,0,0.72)] transition duration-300 sm:bottom-3 sm:right-3 sm:top-3 ${
          open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-[108%] opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-300/70">
              Player companion
            </p>
            <p className="mt-1 text-sm font-semibold">Growth at a glance</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-white/60 hover:text-white"
            aria-label="Close player companion"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-7 pt-4">
          <section className="relative overflow-hidden rounded-[27px] border border-indigo-200/12 bg-[radial-gradient(circle_at_82%_10%,rgba(129,140,248,0.22),transparent_38%),linear-gradient(145deg,#171c31,#10141f)] p-5">
            <div className="relative flex items-center gap-4">
              <PlayerCompanionPortrait
                config={config}
                className="size-[4.75rem] shrink-0 border border-white/10 shadow-[0_12px_34px_rgba(0,0,0,0.28)]"
              />
              <div className="min-w-0">
                <p className="truncate text-xl font-semibold">{player.employeeName}</p>
                <p className="mt-0.5 text-xs text-white/48">{player.role}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="rounded-full bg-indigo-300/12 px-2.5 py-1 font-semibold text-indigo-100">
                    Level {player.level}
                  </span>
                  <span className="rounded-full bg-white/[0.065] px-2.5 py-1 text-white/65">
                    {player.totalXp} XP
                  </span>
                  <span className="rounded-full bg-amber-300/10 px-2.5 py-1 text-amber-100/85">
                    {player.stage}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative mt-5">
              <div className="flex items-center justify-between text-[11px] text-white/45">
                <span>Level progress</span>
                <span>
                  {player.xpToNextLevel === null
                    ? "Current V1 peak"
                    : `${player.xpToNextLevel} XP to next level`}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300"
                  style={{ width: `${player.levelProgress}%` }}
                />
              </div>
            </div>
          </section>

          <section className="mt-3 grid grid-cols-3 gap-2">
            {[
              { href: "/employee/player", label: "Player page", icon: "player" as const },
              { href: "/employee/avatar", label: "Customize", icon: "edit" as const },
              { href: "/employee/activities", label: "Log activity", icon: "activity" as const },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-[19px] border border-white/8 bg-white/[0.035] px-2 text-center text-[11px] font-semibold text-white/65 transition hover:border-indigo-200/20 hover:bg-indigo-300/[0.07] hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="size-4 text-indigo-200" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <QuickActionIcon icon={action.icon} />
                </svg>
                {action.label}
              </Link>
            ))}
          </section>

          {groups.map((group) => (
            <section key={group.name} className="mt-6">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.17em] text-white/45">
                  {group.name}
                </h2>
                <span className="text-[10px] text-white/25">
                  {group.skills.length}
                </span>
              </div>
              <div className="mt-2 space-y-2">
                {group.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-[20px] border border-white/[0.07] bg-[#111722] p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-[13px] bg-indigo-400/[0.09] text-indigo-200">
                        <CompanionSkillGlyph icon={skill.icon} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-white/82">
                            {skill.name}
                          </p>
                          <span className="shrink-0 text-[11px] font-semibold text-indigo-200">
                            Level {skill.level}
                          </span>
                        </div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/8">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-400/80 to-cyan-300/80"
                            style={{ width: `${skill.progress}%` }}
                          />
                        </div>
                        {skill.source ? (
                          <p className="mt-1.5 truncate text-[10px] text-white/32">
                            Source: {skill.source}
                          </p>
                        ) : null}
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
