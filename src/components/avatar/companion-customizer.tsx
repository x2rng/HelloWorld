"use client";

import { CompanionPreview } from "@/components/avatar/companion-preview";
import { CompanionSelector } from "@/components/avatar/companion-selector";
import {
  companionGlowOptions,
  companionPatternOptions,
  companionThemeOptions,
} from "@/components/avatar/companion-palettes";
import type {
  CompanionStage,
  PixelCompanionConfig,
} from "@/lib/avatar/companion-types";
import { cx } from "@/lib/utils";

type CompanionCustomizerProps = {
  config: PixelCompanionConfig;
  onChange: (config: PixelCompanionConfig) => void;
  stage?: CompanionStage;
  setupMode?: boolean;
};

function StepLabel({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-7 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-400/10 text-xs font-bold text-blue-200">
        {number}
      </span>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/48">
        {children}
      </p>
    </div>
  );
}

export function CompanionCustomizer({
  config,
  onChange,
  stage = "starter",
  setupMode = false,
}: CompanionCustomizerProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-[32px] border border-white/9 bg-[#0d1119] p-5 sm:p-7">
        <StepLabel number={1}>Choose your companion</StepLabel>
        <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
          A character for the way you grow.
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/48">
          Choose a companion that will grow with you throughout your onboarding
          journey.
        </p>
        <div className="mt-6">
          <CompanionSelector config={config} onChange={onChange} stage={stage} />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-white/9 bg-[#0d1119] p-5 sm:p-7">
          <StepLabel number={2}>Make it yours</StepLabel>

          <div className="mt-6 space-y-7">
            <fieldset>
              <legend className="text-sm font-semibold text-white/78">
                Color theme
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {companionThemeOptions.map((option) => {
                  const selected = config.colorTheme === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        onChange({ ...config, colorTheme: option.id })
                      }
                      className={cx(
                        "rounded-2xl border p-2.5 text-left transition",
                        selected
                          ? "border-white/32 bg-white/[0.09]"
                          : "border-white/8 bg-white/[0.025] hover:border-white/16",
                      )}
                    >
                      <span className="flex gap-1">
                        {[
                          option.palette.primary,
                          option.palette.secondary,
                          option.palette.shadow,
                        ].map((color) => (
                          <span
                            key={color}
                            className="h-5 flex-1 rounded-md"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </span>
                      <span className="mt-2 block text-[11px] font-medium text-white/65">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-white/78">
                Glow detail
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {companionGlowOptions.map((option) => {
                  const selected = config.glowColor === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        onChange({ ...config, glowColor: option.id })
                      }
                      className={cx(
                        "flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition",
                        selected
                          ? "border-white/28 bg-white/[0.09] text-white"
                          : "border-white/8 bg-white/[0.025] text-white/52 hover:text-white/78",
                      )}
                    >
                      <span
                        className="size-3 rounded-[3px]"
                        style={{ backgroundColor: option.value }}
                      />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-white/78">
                Pixel pattern
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {companionPatternOptions.map((option) => {
                  const selected = config.pattern === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onChange({ ...config, pattern: option.id })}
                      className={cx(
                        "rounded-xl border px-3 py-2 text-xs font-medium transition",
                        selected
                          ? "border-blue-300/35 bg-blue-400/10 text-blue-100"
                          : "border-white/8 bg-white/[0.025] text-white/48 hover:text-white/75",
                      )}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/9 bg-[#0d1119] p-5 sm:p-7">
          <StepLabel number={3}>Preview</StepLabel>
          <CompanionPreview
            config={config}
            stage={stage}
            size={setupMode ? 220 : 248}
            className="mt-5 min-h-[22rem]"
          />
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3 text-xs">
            <span className="text-white/42">Progression stage</span>
            <span className="font-semibold capitalize text-white/78">{stage}</span>
          </div>
        </section>
      </div>
    </div>
  );
}
