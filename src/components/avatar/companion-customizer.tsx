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
};

const controlSectionClass =
  "rounded-[28px] border border-white/9 bg-[#0d1119] p-5 sm:p-6";

export function CompanionCustomizer({
  config,
  onChange,
  stage = "starter",
}: CompanionCustomizerProps) {
  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start">
      <div className="min-w-0 lg:sticky lg:top-6">
        <CompanionPreview
          config={config}
          stage={stage}
          size={292}
          variant="editor"
          className="shadow-[0_24px_80px_rgba(0,0,0,0.38)]"
        />
      </div>

      <div className="min-w-0 space-y-4">
        <section className={controlSectionClass}>
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Make it yours
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/48">
              Adjust the look while keeping the same EXP companion style.
            </p>
          </div>
          <div className="mt-5 border-t border-white/8 pt-5">
            <p className="mb-3 text-sm font-semibold text-white">Companion</p>
            <CompanionSelector config={config} onChange={onChange} stage={stage} />
          </div>
        </section>

        <section className={controlSectionClass}>
          <fieldset>
            <legend className="text-sm font-semibold text-white">
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
                        ? "border-white/38 bg-white/[0.1] ring-1 ring-inset ring-white/10"
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
                    <span className="mt-2 flex items-center justify-between gap-1 text-[11px] font-medium text-white/68">
                      {option.label}
                      <span
                        aria-hidden="true"
                        className={selected ? "text-blue-200" : "text-transparent"}
                      >
                        ✓
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </section>

        <section className={controlSectionClass}>
          <fieldset>
            <legend className="text-sm font-semibold text-white">
              Glow color
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
                        ? "border-white/32 bg-white/[0.1] text-white ring-1 ring-inset ring-white/8"
                        : "border-white/8 bg-white/[0.025] text-white/54 hover:text-white/78",
                    )}
                  >
                    <span
                      className="size-3 rounded-[3px]"
                      style={{ backgroundColor: option.value }}
                    />
                    {option.label}
                    <span
                      aria-hidden="true"
                      className={selected ? "text-blue-200" : "hidden"}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </section>

        <section className={controlSectionClass}>
          <fieldset>
            <legend className="text-sm font-semibold text-white">Marking</legend>
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
                        ? "border-blue-300/40 bg-blue-400/12 text-blue-100 ring-1 ring-inset ring-blue-200/10"
                        : "border-white/8 bg-white/[0.025] text-white/50 hover:text-white/76",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </section>
      </div>
    </div>
  );
}
