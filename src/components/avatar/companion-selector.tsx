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
              "group relative flex min-h-[8.25rem] flex-col items-center rounded-[20px] border p-2.5 text-center transition sm:min-h-36 sm:p-3",
              selected
                ? "border-blue-300/50 bg-blue-400/[0.09] shadow-[0_12px_34px_rgba(59,130,246,0.12)] ring-1 ring-inset ring-blue-200/18"
                : "border-white/8 bg-white/[0.025] hover:border-white/16 hover:bg-white/[0.045]",
            )}
          >
            <span
              aria-hidden="true"
              className={cx(
                "absolute right-2 top-2 flex size-4 items-center justify-center rounded-full border text-[9px] font-bold transition",
                selected
                  ? "border-blue-200/35 bg-blue-300 text-slate-950"
                  : "scale-75 border-transparent bg-transparent text-transparent opacity-0",
              )}
            >
              ✓
            </span>
            <PixelCompanion
              config={nextConfig}
              stage={stage}
              size={70}
              className="transition group-hover:-translate-y-0.5"
            />
            <span className="mt-1 text-sm font-semibold text-white">
              {family.label}
            </span>
            <span className="mt-0.5 max-w-32 text-[10px] leading-4 text-white/46 sm:text-[11px]">
              {family.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
