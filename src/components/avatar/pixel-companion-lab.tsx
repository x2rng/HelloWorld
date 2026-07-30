"use client";

import { useState } from "react";
import { CompanionCustomizer } from "@/components/avatar/companion-customizer";
import { CompanionPreview } from "@/components/avatar/companion-preview";
import {
  companionGlowOptions,
  companionPatternOptions,
  companionThemeOptions,
} from "@/components/avatar/companion-palettes";
import { PixelCompanion } from "@/components/avatar/pixel-companion";
import {
  companionFamilies,
  companionFamilyDefinitions,
  companionStages,
  companionStates,
  type CompanionStage,
  type CompanionState,
} from "@/lib/avatar/companion-types";
import { defaultPixelCompanionConfig } from "@/lib/avatar/normalize-companion-config";
import { cx } from "@/lib/utils";

export function PixelCompanionLab() {
  const [config, setConfig] = useState(defaultPixelCompanionConfig);
  const [state, setState] = useState<CompanionState>("idle");
  const [stage, setStage] = useState<CompanionStage>("starter");
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <main className="workspace-theme min-h-screen px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[96rem]">
        <header className="overflow-hidden rounded-[34px] border border-white/9 bg-[#0c1018] p-6 shadow-[0_28px_100px_rgba(0,0,0,0.3)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-blue-300/18 bg-blue-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100">
                  Isolated visual review
                </span>
                <span className="rounded-full border border-white/9 bg-white/[0.035] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/48">
                  No Supabase writes
                </span>
              </div>
              <h1 className="mt-5 text-4xl leading-tight text-white sm:text-6xl">
                Pixel Companion foundation
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/48 sm:text-base">
                Five deliberately distinct companion families, tested at editor
                scale and at the compact size used across the employee experience.
              </p>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-white/9 bg-white/[0.035] px-4 py-3 text-sm text-white/68">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(event) => setReducedMotion(event.target.checked)}
                className="size-4 accent-blue-400"
              />
              Reduced-motion preview
            </label>
          </div>
        </header>

        <section className="mt-5 rounded-[32px] border border-white/9 bg-[#0d1119] p-5 sm:p-7">
          <div className="mb-6 border-b border-white/8 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200/65">
              Internal review controls
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/44">
              Inspect system-controlled state, progression stage, motion, and
              every visual configuration without changing employee data.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-white/42">
                Theme
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {companionThemeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={config.colorTheme === option.id}
                    onClick={() =>
                      setConfig((current) => ({
                        ...current,
                        colorTheme: option.id,
                      }))
                    }
                    className={cx(
                      "rounded-xl border px-3 py-2 text-xs",
                      config.colorTheme === option.id
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/8 text-white/45",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-white/42">
                Glow
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {companionGlowOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={config.glowColor === option.id}
                    onClick={() =>
                      setConfig((current) => ({
                        ...current,
                        glowColor: option.id,
                      }))
                    }
                    className={cx(
                      "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs",
                      config.glowColor === option.id
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/8 text-white/45",
                    )}
                  >
                    <span
                      className="size-2.5 rounded-[2px]"
                      style={{ backgroundColor: option.value }}
                    />
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-white/42">
                Pattern
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {companionPatternOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={config.pattern === option.id}
                    onClick={() =>
                      setConfig((current) => ({
                        ...current,
                        pattern: option.id,
                      }))
                    }
                    className={cx(
                      "rounded-xl border px-3 py-2 text-xs",
                      config.pattern === option.id
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/8 text-white/45",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-5">
              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-white/42">
                  State
                </legend>
                <div className="mt-3 space-y-1.5">
                  {companionStates.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={state === item}
                      onClick={() => setState(item)}
                      className={cx(
                        "block w-full rounded-lg px-2.5 py-1.5 text-left text-xs capitalize",
                        state === item
                          ? "bg-blue-400/12 text-blue-100"
                          : "text-white/42",
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-white/42">
                  Stage
                </legend>
                <div className="mt-3 space-y-1.5">
                  {companionStages.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={stage === item}
                      onClick={() => setStage(item)}
                      className={cx(
                        "block w-full rounded-lg px-2.5 py-1.5 text-left text-xs capitalize",
                        stage === item
                          ? "bg-purple-400/12 text-purple-100"
                          : "text-white/42",
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </section>

        <section className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {companionFamilies.map((familyId) => {
              const family = companionFamilyDefinitions.find(
                (item) => item.id === familyId,
              );
              const familyConfig = { ...config, family: familyId };
              return (
                <article
                  key={familyId}
                  className="rounded-[30px] border border-white/9 bg-[#0d1119] p-4"
                >
                  <CompanionPreview
                    config={familyConfig}
                    state={state}
                    stage={stage}
                    size={196}
                    reducedMotion={reducedMotion}
                    className="min-h-[20rem]"
                    showLabels={false}
                  />
                  <div className="mt-4 flex items-center gap-4">
                    <span className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.025]">
                      <PixelCompanion
                        config={familyConfig}
                        state={state}
                        stage={stage}
                        size={80}
                        reducedMotion={reducedMotion}
                      />
                    </span>
                    <div>
                      <h2 className="font-semibold text-white">
                        {family?.label}
                      </h2>
                      <p className="mt-1 text-xs leading-5 text-white/42">
                        {family?.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <CompanionPreview
            config={config}
            state={state}
            stage={stage}
            size={220}
            reducedMotion={reducedMotion}
            surface="dark"
          />
          <CompanionPreview
            config={config}
            state={state}
            stage={stage}
            size={220}
            reducedMotion={reducedMotion}
            surface="light"
          />
        </section>

        <section className="mt-5 rounded-[34px] border border-white/9 bg-[#090c12] p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200/70">
              Production employee preview
            </p>
            <h2 className="mt-2 text-3xl text-white sm:text-4xl">
              Choose your companion
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/48">
              This is the same preview-first selection experience used in Player
              Setup and the Avatar Editor. State and stage controls remain
              internal.
            </p>
          </div>
          <CompanionCustomizer
            config={config}
            onChange={setConfig}
            stage={stage}
            layoutContext="standalone"
          />
        </section>

        <footer className="mt-5 grid gap-3 text-xs text-white/38 sm:grid-cols-3">
          <div className="rounded-[20px] border border-white/8 bg-white/[0.025] p-4">
            <p className="font-semibold text-white/65">Strict pixel grid</p>
            <p className="mt-1.5 leading-5">
              Every silhouette uses integer-aligned shapes and crisp-edge SVG
              rendering.
            </p>
          </div>
          <div className="rounded-[20px] border border-white/8 bg-white/[0.025] p-4">
            <p className="font-semibold text-white/65">Backward-safe</p>
            <p className="mt-1.5 leading-5">
              Legacy avatar JSON is previewed safely and remains untouched until
              an explicit save.
            </p>
          </div>
          <div className="rounded-[20px] border border-white/8 bg-white/[0.025] p-4">
            <p className="font-semibold text-white/65">Review branch only</p>
            <p className="mt-1.5 leading-5">
              This route is local to the isolated redesign branch and performs no
              database writes.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
