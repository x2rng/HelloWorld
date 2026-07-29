"use client";

import { PlayerAvatar2DRenderer } from "./player-avatar-2d-renderer";
import type {
  PlayerAvatar2DProofConfig,
  PlayerAvatar2DState,
} from "./config/player-avatar-2d-types";
import { cx } from "@/lib/utils";

type FloatingPlayerAvatar2DProps = {
  config: PlayerAvatar2DProofConfig;
  open: boolean;
  onClick: () => void;
  state?: PlayerAvatar2DState;
  className?: string;
};

export function FloatingPlayerAvatar2D({
  config,
  open,
  onClick,
  state = "idle",
  className,
}: FloatingPlayerAvatar2DProps) {
  return (
    <button
      type="button"
      aria-label={open ? "Player skills are open" : "Open player skills"}
      aria-expanded={open}
      onClick={onClick}
      className={cx(
        "group fixed bottom-[7rem] right-2 z-40 flex h-[82px] w-[72px] items-end justify-center outline-none md:bottom-7 md:right-7 md:h-[94px] md:w-[84px]",
        className,
      )}
    >
      <span className="absolute bottom-1 left-1/2 h-4 w-[72%] -translate-x-1/2 rounded-full bg-black/35 blur-[7px] transition group-hover:w-[82%]" />
      <span className="absolute bottom-1 left-1/2 h-1.5 w-[54%] -translate-x-1/2 rounded-full bg-indigo-300/35" />
      <span className="relative block h-[82px] w-[72px] origin-bottom transition duration-200 group-hover:-translate-y-1 group-hover:scale-[1.035] group-active:translate-y-0 group-active:scale-95 md:h-[94px] md:w-[84px]">
        <PlayerAvatar2DRenderer
          config={config}
          state={state}
          compact
          label="Open Alex's player skills"
        />
      </span>
      <span className="pointer-events-none absolute bottom-0.5 right-0 flex size-[18px] items-center justify-center rounded-full border-2 border-[#090c13] bg-[#8fd8c5] text-[8px] font-black text-[#10201f] shadow-lg">
        +
      </span>
    </button>
  );
}
