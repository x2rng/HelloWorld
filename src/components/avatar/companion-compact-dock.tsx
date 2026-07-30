"use client";

import {
  companionGlowOptions,
  companionPatternOptions,
  companionThemeOptions,
} from "@/components/avatar/companion-palettes";
import { PixelCompanion } from "@/components/avatar/pixel-companion";
import {
  companionFamilyDefinitions,
  type CompanionStage,
  type PixelCompanionConfig,
} from "@/lib/avatar/companion-types";

export type CompanionDockAction = {
  label: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function CompanionCompactDock({
  config,
  stage,
  action,
}: {
  config: PixelCompanionConfig;
  stage: CompanionStage;
  action?: CompanionDockAction;
}) {
  const family =
    companionFamilyDefinitions.find((item) => item.id === config.family) ??
    companionFamilyDefinitions[0];
  const theme =
    companionThemeOptions.find((item) => item.id === config.colorTheme) ??
    companionThemeOptions[0];
  const glow =
    companionGlowOptions.find((item) => item.id === config.glowColor) ??
    companionGlowOptions[0];
  const marking =
    companionPatternOptions.find((item) => item.id === config.pattern) ??
    companionPatternOptions[0];

  return (
    <div className="grid h-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[22px] border border-blue-200/18 bg-[#0b1018]/96 px-3 shadow-[0_18px_54px_rgba(0,0,0,0.42)] backdrop-blur-xl">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.035]">
        <PixelCompanion config={config} stage={stage} size={46} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold text-white">
          {family.label}
        </span>
        <span
          className="mt-0.5 block truncate text-[10px] text-white/46"
          aria-live="polite"
        >
          {theme.label} · {glow.label} glow · {marking.label}
        </span>
      </span>
      {action ? (
        <button
          type={action.type ?? "button"}
          onClick={action.onClick}
          disabled={action.disabled}
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-full bg-white px-3 text-[11px] font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-45 motion-reduce:transition-none"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}
