"use client";

import { PixelCompanion } from "@/components/avatar/pixel-companion";
import {
  companionFamilyDefinitions,
  type CompanionStage,
  type PixelCompanionConfig,
} from "@/lib/avatar/companion-types";
import { cx } from "@/lib/utils";

type CompanionSelectorProps = {
  config: PixelCompanionConfig;
  onChange: (config: PixelCompanionConfig) => void;
  stage?: CompanionStage;
};

export function CompanionSelector({
  config,
  onChange,
  stage = "starter",
}: CompanionSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
      {companionFamilyDefinitions.map((family) => {
        const selected = config.family === family.id;
        const nextConfig = { ...config, family: family.id };

        return (
          <button
            key={family.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(nextConfig)}
            className={cx(
              "group relative flex min-h-36 flex-col items-center rounded-[22px] border p-3 text-center transition sm:min-h-40 sm:p-4",
              selected
                ? "border-blue-300/55 bg-blue-400/[0.1] shadow-[0_14px_42px_rgba(59,130,246,0.13)] ring-1 ring-inset ring-blue-200/20"
                : "border-white/8 bg-white/[0.025] hover:border-white/16 hover:bg-white/[0.045]",
            )}
          >
            <span
              aria-hidden="true"
              className={cx(
                "absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-md border text-[10px] font-bold transition",
                selected
                  ? "border-blue-200/35 bg-blue-300 text-slate-950"
                  : "border-white/10 bg-white/[0.025] text-transparent",
              )}
            >
              ✓
            </span>
            <PixelCompanion
              config={nextConfig}
              stage={stage}
              size={76}
              className="transition group-hover:-translate-y-0.5"
            />
            <span className="mt-1.5 text-sm font-semibold text-white">
              {family.label}
            </span>
            <span className="mt-1 max-w-32 text-[11px] leading-4 text-white/46 sm:text-xs sm:leading-5">
              {family.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
