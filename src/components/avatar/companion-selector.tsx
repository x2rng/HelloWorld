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
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
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
              "group flex min-h-44 flex-col items-center rounded-[24px] border p-4 text-center transition",
              selected
                ? "border-blue-300/45 bg-blue-400/[0.09] shadow-[0_18px_55px_rgba(59,130,246,0.14)]"
                : "border-white/8 bg-white/[0.025] hover:border-white/16 hover:bg-white/[0.045]",
            )}
          >
            <PixelCompanion
              config={nextConfig}
              stage={stage}
              size={84}
              className="transition group-hover:-translate-y-0.5"
            />
            <span className="mt-2 text-sm font-semibold text-white">
              {family.label}
            </span>
            <span className="mt-1 text-xs leading-5 text-white/42">
              {family.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
