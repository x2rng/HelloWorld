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
              "group relative flex min-h-28 flex-col items-center rounded-[20px] border p-2 text-center transition sm:min-h-32 sm:p-2.5",
              selected
                ? "border-blue-300/50 bg-blue-400/[0.09] shadow-[0_12px_34px_rgba(59,130,246,0.12)] ring-1 ring-inset ring-blue-200/18"
                : "border-white/8 bg-white/[0.025] hover:border-white/16 hover:bg-white/[0.045]",
              family.id === "spirit" &&
                "col-span-2 mx-auto w-[calc(50%-0.3125rem)] sm:col-span-1 sm:mx-0 sm:w-auto",
            )}
          >
            {selected ? (
              <span
                aria-hidden="true"
                className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full border border-blue-200/35 bg-blue-300 text-[9px] font-bold text-slate-950"
              >
                ✓
              </span>
            ) : null}
            <PixelCompanion
              config={nextConfig}
              stage={stage}
              size={64}
              className="transition group-hover:-translate-y-0.5"
            />
            <span className="mt-0.5 text-sm font-semibold text-white">
              {family.label}
            </span>
            <span className="max-w-32 text-[10px] leading-4 text-white/46">
              {family.traits}
            </span>
          </button>
        );
      })}
    </div>
  );
}
