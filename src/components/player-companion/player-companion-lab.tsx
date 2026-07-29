"use client";

import { useState } from "react";
import type { CompanionReactionState } from "@/components/player-companion/config/player-companion-types";
import { defaultPlayerCompanionConfig } from "@/components/player-companion/config/player-companion-defaults";
import { FloatingPlayerCompanion } from "@/components/player-companion/floating-player-companion";
import { PlayerCompanionDrawer } from "@/components/player-companion/player-companion-drawer";
import { PlayerCompanionEditor } from "@/components/player-companion/player-companion-editor";
import type {
  CompanionPlayerSummary,
  CompanionSkillGroup,
} from "@/components/player-companion/player-companion-progress";
import { cx } from "@/lib/utils";

const player: CompanionPlayerSummary = {
  employeeName: "Alex Morgan",
  role: "Product Designer",
  level: 4,
  totalXp: 680,
  xpToNextLevel: 120,
  levelProgress: 72,
  stage: "Momentum",
};

const skillGroups: CompanionSkillGroup[] = [
  {
    name: "Core skills",
    skills: [
      {
        name: "Communication",
        icon: "people",
        level: 3,
        progress: 68,
        source: "Shared onboarding reflection",
      },
      {
        name: "Collaboration",
        icon: "people",
        level: 4,
        progress: 42,
        source: "Partnered on team workshop",
      },
      {
        name: "Consistency",
        icon: "target",
        level: 3,
        progress: 81,
        source: "Completed weekly growth step",
      },
    ],
  },
  {
    name: "Role skills",
    skills: [
      {
        name: "User Research",
        icon: "book",
        level: 4,
        progress: 74,
        source: "Interview synthesis",
      },
      {
        name: "Prototyping",
        icon: "tool",
        level: 3,
        progress: 56,
        source: "Prototype review",
      },
    ],
  },
  {
    name: "Personal growth skills",
    skills: [
      {
        name: "Focus",
        icon: "target",
        level: 3,
        progress: 62,
        source: "Deep-work activity",
      },
      {
        name: "Confidence",
        icon: "spark",
        level: 2,
        progress: 48,
        source: "Presented work in progress",
      },
    ],
  },
];

const reactions: Array<{
  value: CompanionReactionState;
  label: string;
  description: string;
}> = [
  { value: "idle", label: "Normal", description: "Default floating idle" },
  { value: "focused", label: "Focused", description: "Quiet working state" },
  { value: "celebrate", label: "Celebrate", description: "Task or achievement" },
  { value: "level-up", label: "Level up", description: "Progression moment" },
];

function MockEmployeeSurface() {
  return (
    <div className="min-h-[46rem] overflow-hidden rounded-[36px] border border-white/9 bg-[#07090e] shadow-[0_34px_120px_rgba(0,0,0,0.36)]">
      <header className="flex items-center justify-between border-b border-white/8 bg-[#0b0e15]/88 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-950">
            E
          </span>
          <div>
            <p className="text-sm font-semibold text-white">EXP</p>
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/35">
              Employee home concept
            </p>
          </div>
        </div>
        <span className="rounded-full bg-indigo-400/12 px-3 py-1.5 text-xs font-semibold text-indigo-100">
          Week 3
        </span>
      </header>

      <div className="p-5 sm:p-8">
        <section className="relative overflow-hidden rounded-[30px] border border-white/9 bg-[radial-gradient(circle_at_88%_12%,rgba(99,102,241,0.18),transparent_36%),linear-gradient(145deg,#131927,#0d111a)] p-6 sm:p-8">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300/65">
              Good afternoon, Alex
            </p>
            <h2 className="mt-3 text-3xl text-white sm:text-5xl">
              Your next step is ready.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/46">
              Review the first prototype with your manager and capture the feedback that will shape your next iteration.
            </p>
            <button
              type="button"
              className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
            >
              Continue journey
            </button>
          </div>
        </section>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            ["Current level", "Level 4", "680 total XP"],
            ["Journey progress", "68%", "8 of 12 steps"],
            ["Growth streak", "3 weeks", "Steady momentum"],
          ].map(([label, value, meta]) => (
            <article
              key={label}
              className="rounded-[24px] border border-white/8 bg-white/[0.035] p-5"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/32">
                {label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-xs text-white/35">{meta}</p>
            </article>
          ))}
        </div>

        <section className="mt-5 rounded-[28px] border border-white/8 bg-[#0d1119] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/32">
                This week
              </p>
              <h3 className="mt-2 text-2xl text-white">Growth activity</h3>
            </div>
            <span className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-white/45">
              3 updates
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {[
              "Completed customer interview observation",
              "Shared prototype feedback with the team",
              "Logged a focused learning session",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[19px] border border-white/7 bg-white/[0.025] p-3.5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-indigo-400/10 text-xs font-bold text-indigo-200">
                  {index + 1}
                </span>
                <p className="text-sm text-white/65">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function PlayerCompanionLab() {
  const [mode, setMode] = useState<"creator" | "shell">("creator");
  const [config, setConfig] = useState(defaultPlayerCompanionConfig);
  const [reaction, setReaction] =
    useState<CompanionReactionState>("idle");
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <main className="workspace-theme min-h-screen px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[92rem]">
        <header className="rounded-[34px] border border-white/9 bg-[#0c1018]/92 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.3)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-100">
                  Phase B review
                </span>
                <span className="rounded-full border border-emerald-300/15 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100/80">
                  Integrated locally
                </span>
              </div>
              <h1 className="mt-5 text-4xl leading-[0.98] text-white sm:text-6xl lg:text-7xl">
                Meet your EXP Player Companion.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/48 sm:text-base">
                A stylized, emotionally readable player identity designed to stay close to everyday progress without turning EXP into a noisy social game.
              </p>
            </div>

            <div className="flex rounded-full border border-white/9 bg-white/[0.035] p-1">
              {[
                { value: "creator" as const, label: "Creator review" },
                { value: "shell" as const, label: "Floating UX review" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={mode === item.value}
                  onClick={() => {
                    setMode(item.value);
                    setDrawerOpen(false);
                  }}
                  className={cx(
                    "rounded-full px-4 py-2.5 text-xs font-semibold transition sm:px-5",
                    mode === item.value
                      ? "bg-white text-slate-950"
                      : "text-white/45 hover:text-white/75",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-[34px] border border-white/9 bg-[#0b0f17] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                Progression reactions
              </p>
              <p className="mt-1 text-sm text-white/58">
                Preview the lightweight state hooks.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {reactions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  title={item.description}
                  aria-pressed={reaction === item.value}
                  onClick={() => setReaction(item.value)}
                  className={cx(
                    "rounded-full border px-3.5 py-2 text-xs font-semibold",
                    reaction === item.value
                      ? "border-indigo-300/35 bg-indigo-400/13 text-indigo-50"
                      : "border-white/8 bg-white/[0.025] text-white/42 hover:text-white/72",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-5">
          {mode === "creator" ? (
            <PlayerCompanionEditor
              config={config}
              onChange={setConfig}
              reaction={reaction}
            />
          ) : (
            <>
              <MockEmployeeSurface />
              <FloatingPlayerCompanion
                config={config}
                level={player.level}
                open={drawerOpen}
                reaction={reaction}
                onClick={() => setDrawerOpen(true)}
              />
              <PlayerCompanionDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                config={config}
                player={player}
                groups={skillGroups}
              />
            </>
          )}
        </div>

        <footer className="mt-5 grid gap-3 text-xs text-white/38 sm:grid-cols-3">
          <div className="rounded-[22px] border border-white/8 bg-white/[0.025] p-4">
            <p className="font-semibold text-white/65">One heavy view at a time</p>
            <p className="mt-1.5 leading-5">The lab switches between editor and floating UX to avoid stacking full WebGL scenes.</p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-white/[0.025] p-4">
            <p className="font-semibold text-white/65">Backward-safe</p>
            <p className="mt-1.5 leading-5">Legacy avatar JSON can be adapted for preview without being overwritten.</p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-white/[0.025] p-4">
            <p className="font-semibold text-white/65">Deployment gate</p>
            <p className="mt-1.5 leading-5">Employee routes are integrated locally. Nothing is pushed or deployed until this Phase B review is approved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
