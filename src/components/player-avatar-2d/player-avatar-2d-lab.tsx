"use client";

import { useCallback, useState } from "react";
import { defaultPlayerAvatar2DProof } from "./config/player-avatar-2d-defaults";
import type {
  PlayerAvatar2DPose,
  PlayerAvatar2DState,
} from "./config/player-avatar-2d-types";
import { FloatingPlayerAvatar2D } from "./floating-player-avatar-2d";
import type {
  PlayerAvatar2DSkillGroup,
  PlayerAvatar2DSummary,
} from "./player-avatar-2d-progress";
import { PlayerAvatar2DRenderer } from "./player-avatar-2d-renderer";
import { PlayerAvatar2DSkillsDrawer } from "./player-avatar-2d-skills-drawer";
import { cx } from "@/lib/utils";

const player: PlayerAvatar2DSummary = {
  employeeName: "Alex Morgan",
  role: "Product Designer",
  level: 4,
  totalXp: 680,
  xpToNextLevel: 120,
  levelProgress: 72,
};

const skillGroups: PlayerAvatar2DSkillGroup[] = [
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
        source: "Partnered on a team workshop",
      },
      {
        name: "Consistency",
        icon: "target",
        level: 3,
        progress: 81,
        source: "Completed a weekly growth step",
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

const poses: Array<{ value: PlayerAvatar2DPose; label: string }> = [
  { value: "front", label: "Front" },
  { value: "three-quarter", label: "Three-quarter" },
  { value: "side", label: "Side" },
];

const states: Array<{
  value: PlayerAvatar2DState;
  label: string;
  detail: string;
}> = [
  { value: "idle", label: "Idle", detail: "Breathing + natural blink" },
  { value: "happy", label: "Happy", detail: "Gentle positive reaction" },
  { value: "focused", label: "Focused", detail: "Quieter working posture" },
  { value: "achievement", label: "Achievement", detail: "Short celebration hook" },
];

function MockEmployeeHome() {
  return (
    <div className="relative min-h-[46rem] overflow-hidden rounded-[34px] border border-white/9 bg-[#070a10] shadow-[0_34px_120px_rgba(0,0,0,0.36)]">
      <header className="flex items-center justify-between border-b border-white/8 bg-[#0b0f16]/94 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-slate-950">
            E
          </span>
          <div>
            <p className="text-sm font-semibold text-white">EXP</p>
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/32">
              Player
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-full bg-[#7c9cff] px-4 py-2.5 text-xs font-semibold text-white"
        >
          Log activity
        </button>
      </header>

      <div className="p-4 pb-28 sm:p-7 sm:pb-28">
        <section className="overflow-hidden rounded-[28px] border border-white/9 bg-[radial-gradient(circle_at_92%_8%,rgba(143,216,197,0.12),transparent_36%),linear-gradient(145deg,#141b28,#0d121b)] p-6 pr-20 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#8fd8c5]/70">
            Good afternoon, Alex
          </p>
          <h2 className="mt-3 max-w-xl text-3xl leading-[1.02] text-white sm:text-5xl">
            Your next step is ready.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/45">
            Review your prototype with your manager and capture the feedback that shapes the next iteration.
          </p>
          <button
            type="button"
            className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Continue journey
          </button>
        </section>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Current level", "Level 4", "680 XP"],
            ["Journey", "68%", "8 of 12 steps"],
            ["Momentum", "3 weeks", "Steady progress"],
          ].map(([label, value, meta]) => (
            <article
              key={label}
              className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                {label}
              </p>
              <p className="mt-2 text-xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-xs text-white/34">{meta}</p>
            </article>
          ))}
        </div>

        <section className="mt-4 rounded-[26px] border border-white/8 bg-[#0d121a] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/30">
            This week
          </p>
          <h3 className="mt-2 text-2xl text-white">Growth activity</h3>
          <div className="mt-4 space-y-2.5">
            {[
              "Completed customer interview observation",
              "Shared prototype feedback with the team",
              "Logged a focused learning session",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[18px] border border-white/7 bg-white/[0.025] p-3"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#8fd8c5]/10 text-[10px] font-bold text-[#a9e5d5]">
                  0{index + 1}
                </span>
                <p className="text-xs leading-5 text-white/55">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <nav className="absolute bottom-3 left-3 right-3 grid grid-cols-5 rounded-[24px] border border-white/9 bg-[#0a0e15]/96 p-2 shadow-2xl backdrop-blur">
        {["Home", "Journey", "Skills", "Feed", "Player"].map((item, index) => (
          <span
            key={item}
            className={cx(
              "rounded-[17px] px-1 py-3 text-center text-[10px]",
              index === 0 ? "bg-white text-slate-950" : "text-white/34",
            )}
          >
            {item}
          </span>
        ))}
      </nav>
    </div>
  );
}

export function PlayerAvatar2DLab() {
  const [mode, setMode] = useState<"artwork" | "floating">("artwork");
  const [pose, setPose] = useState<PlayerAvatar2DPose>("three-quarter");
  const [state, setState] = useState<PlayerAvatar2DState>("idle");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const config = {
    ...defaultPlayerAvatar2DProof,
    pose,
  };
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <main className="workspace-theme min-h-screen px-4 py-5 sm:px-6 lg:px-8 lg:py-9">
      <div className="mx-auto max-w-[88rem]">
        <header className="overflow-hidden rounded-[34px] border border-white/9 bg-[radial-gradient(circle_at_88%_0%,rgba(143,216,197,0.1),transparent_26rem),#0c1018] p-6 shadow-[0_28px_100px_rgba(0,0,0,0.3)] sm:p-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-[#8fd8c5]/20 bg-[#8fd8c5]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-[#b5ecdc]">
                  2D visual proof
                </span>
                <span className="rounded-full border border-white/9 bg-white/[0.035] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.17em] text-white/43">
                  Isolated · no persistence
                </span>
              </div>
              <h1 className="mt-5 text-4xl leading-[0.98] text-white sm:text-6xl lg:text-7xl">
                A player with a point of view.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/47 sm:text-base">
                One intentionally authored, layered character proof—built for emotional readability at full editor scale and at a quiet 82-pixel interface scale.
              </p>
            </div>

            <div className="flex self-start rounded-full border border-white/9 bg-white/[0.035] p-1 lg:self-auto">
              {[
                { value: "artwork" as const, label: "Artwork proof" },
                { value: "floating" as const, label: "Floating UX" },
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
                    "rounded-full px-4 py-2.5 text-xs font-semibold sm:px-5",
                    mode === item.value
                      ? "bg-white text-slate-950"
                      : "text-white/42 hover:text-white/75",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {mode === "artwork" ? (
          <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
            <div className="relative min-h-[42rem] overflow-hidden rounded-[36px] border border-white/9 bg-[radial-gradient(circle_at_50%_30%,rgba(143,216,197,0.12),transparent_18rem),radial-gradient(circle_at_50%_90%,rgba(180,164,255,0.1),transparent_22rem),#0b0f17]">
              <div className="absolute left-5 top-5 z-10 rounded-full border border-white/9 bg-black/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/42 backdrop-blur sm:left-7 sm:top-7">
                Authored SVG layers · three-quarter default
              </div>
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#06090f] to-transparent" />
              <div className="relative mx-auto flex min-h-[42rem] max-w-[38rem] items-end justify-center px-4 pb-12 pt-20">
                <PlayerAvatar2DRenderer
                  config={config}
                  state={state}
                  className="h-[34rem] max-h-[74vh] w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <section className="rounded-[28px] border border-white/9 bg-[#0d121a] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/32">
                  Pose
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {poses.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={pose === item.value}
                      onClick={() => setPose(item.value)}
                      className={cx(
                        "rounded-[16px] border px-2 py-3 text-xs font-semibold",
                        pose === item.value
                          ? "border-[#8fd8c5]/30 bg-[#8fd8c5]/10 text-[#c3f0e4]"
                          : "border-white/8 bg-white/[0.025] text-white/40",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/9 bg-[#0d121a] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/32">
                  Expression state
                </p>
                <div className="mt-3 space-y-2">
                  {states.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={state === item.value}
                      onClick={() => setState(item.value)}
                      className={cx(
                        "flex w-full items-center justify-between rounded-[17px] border px-4 py-3 text-left",
                        state === item.value
                          ? "border-[#b4a4ff]/28 bg-[#b4a4ff]/10"
                          : "border-white/8 bg-white/[0.025]",
                      )}
                    >
                      <span className={cx("text-xs font-semibold", state === item.value ? "text-white" : "text-white/55")}>
                        {item.label}
                      </span>
                      <span className="text-[9px] text-white/28">{item.detail}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-[1fr_auto] items-center gap-5 rounded-[28px] border border-white/9 bg-[linear-gradient(145deg,#151b28,#0e131b)] p-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8fd8c5]/65">
                    Compact proof
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    Readable without a card
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/36">
                    The face, hair and outfit still separate at mobile widget scale.
                  </p>
                </div>
                <div className="flex h-[112px] w-[94px] items-end justify-center rounded-[22px] border border-white/8 bg-black/15">
                  <PlayerAvatar2DRenderer
                    config={config}
                    state={state}
                    compact
                    className="h-[106px] w-[92px] translate-y-1"
                  />
                </div>
              </section>
            </div>
          </section>
        ) : (
          <section className="mt-5">
            <MockEmployeeHome />
            <FloatingPlayerAvatar2D
              config={config}
              open={drawerOpen}
              state={state}
              onClick={() => setDrawerOpen(true)}
            />
            <PlayerAvatar2DSkillsDrawer
              open={drawerOpen}
              onClose={closeDrawer}
              config={config}
              player={player}
              groups={skillGroups}
            />
          </section>
        )}

        <footer className="mt-5 grid gap-3 text-xs text-white/37 md:grid-cols-3">
          <div className="rounded-[22px] border border-white/8 bg-white/[0.025] p-4">
            <p className="font-semibold text-white/68">Designed in layers</p>
            <p className="mt-1.5 leading-5">Hair, body, clothing, face and effects remain independent visual modules.</p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-white/[0.025] p-4">
            <p className="font-semibold text-white/68">No data writes</p>
            <p className="mt-1.5 leading-5">This proof never reads or saves profile avatar configuration.</p>
          </div>
          <div className="rounded-[22px] border border-white/8 bg-white/[0.025] p-4">
            <p className="font-semibold text-white/68">Approval gate</p>
            <p className="mt-1.5 leading-5">Customization and employee integration wait until this single character is approved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
