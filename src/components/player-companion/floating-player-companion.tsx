"use client";

import dynamic from "next/dynamic";
import type {
  CompanionReactionState,
  PlayerCompanionConfig,
} from "@/components/player-companion/config/player-companion-types";

const PlayerCompanionViewport = dynamic(
  () => import("@/components/player-companion/player-companion-viewport"),
  {
    ssr: false,
    loading: () => null,
  },
);

export function FloatingPlayerCompanion({
  config,
  level,
  open,
  onClick,
  reaction = "idle",
}: {
  config: PlayerCompanionConfig;
  level: number;
  open: boolean;
  onClick: () => void;
  reaction?: CompanionReactionState;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open player companion and skills"
      aria-expanded={open}
      className={`group fixed bottom-[5.8rem] right-3 z-[60] h-32 w-28 rounded-[30px] outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-indigo-300 sm:bottom-24 sm:right-5 sm:h-36 sm:w-32 lg:bottom-5 lg:right-6 ${
        open
          ? "pointer-events-none translate-y-4 scale-90 opacity-0"
          : "translate-y-0 scale-100 opacity-100 hover:-translate-y-1"
      }`}
    >
      <span className="absolute inset-x-2 bottom-1 h-8 rounded-full bg-indigo-400/22 blur-xl transition group-hover:bg-indigo-300/30" />
      <span className="absolute inset-x-3 bottom-2 h-4 rounded-[50%] border border-indigo-200/18 bg-[#14192a]/88 shadow-[0_12px_30px_rgba(0,0,0,0.38)]" />
      <span className="absolute inset-0 overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.12),transparent_36%),linear-gradient(180deg,rgba(28,34,57,0.84),rgba(10,14,23,0.92))] shadow-[0_20px_70px_rgba(46,55,120,0.34)] backdrop-blur">
        <PlayerCompanionViewport
          config={config}
          reaction={reaction}
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-11 bg-gradient-to-t from-[#0b0f1a] to-transparent" />
      </span>
      <span className="absolute -left-1 top-2 rounded-full border border-white/10 bg-[#111625]/94 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-indigo-100 shadow-lg backdrop-blur">
        Level {level}
      </span>
      <span className="sr-only">
        Open player progress and skills
      </span>
    </button>
  );
}
