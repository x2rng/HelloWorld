"use client";

import dynamic from "next/dynamic";
import type {
  CompanionReactionState,
  PlayerCompanionConfig,
} from "@/components/player-companion/config/player-companion-types";

const PlayerCompanionStudio = dynamic(
  () => import("@/components/player-companion/player-companion-studio"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[32rem] items-center justify-center rounded-[34px] border border-white/10 bg-[#0b0d16] sm:h-[38rem] lg:h-[44rem]">
        <p className="text-sm text-white/42">Waking your companion...</p>
      </div>
    ),
  },
);

export function PlayerCompanionPresentation({
  config,
  reaction = "idle",
  modelScale = 1,
  className,
}: {
  config: PlayerCompanionConfig;
  reaction?: CompanionReactionState;
  modelScale?: number;
  className?: string;
}) {
  return (
    <PlayerCompanionStudio
      config={config}
      reaction={reaction}
      modelScale={modelScale}
      className={className}
    />
  );
}
