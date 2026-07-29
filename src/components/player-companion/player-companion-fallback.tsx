"use client";

import {
  getCompanionHairColour,
  getCompanionSkinColour,
} from "@/components/player-companion/config/player-companion-catalogue";
import type { PlayerCompanionConfig } from "@/components/player-companion/config/player-companion-types";
import { cx } from "@/lib/utils";

export function PlayerCompanionPortrait({
  config,
  className,
}: {
  config: PlayerCompanionConfig;
  className?: string;
}) {
  const skin = getCompanionSkinColour(config.skinToneId);
  const hair = getCompanionHairColour(config.hairColourId);

  return (
    <div
      className={cx(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-[28%] bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.18),transparent_48%),linear-gradient(145deg,#242b49,#111522)]",
        className,
      )}
      aria-hidden="true"
    >
      <div
        className="absolute top-[19%] h-[56%] w-[56%] rounded-[46%_46%_48%_48%]"
        style={{ backgroundColor: skin }}
      />
      <div
        className="absolute top-[13%] h-[34%] w-[60%] rounded-[55%_55%_36%_36%]"
        style={{ backgroundColor: hair }}
      />
      <div className="absolute top-[42%] left-[30%] size-[9%] rounded-full bg-[#171a24]" />
      <div className="absolute top-[42%] right-[30%] size-[9%] rounded-full bg-[#171a24]" />
      <div className="absolute top-[60%] h-[3%] w-[18%] rounded-full bg-[#7d4d48]" />
      <div className="absolute -bottom-[16%] h-[46%] w-[66%] rounded-[45%_45%_20%_20%] bg-[#5069c4]" />
    </div>
  );
}

export function PlayerCompanionFallback({
  config,
  compact = false,
  retry,
}: {
  config: PlayerCompanionConfig;
  compact?: boolean;
  retry?: () => void;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className={compact ? "size-full p-2" : "max-w-xs p-6 text-center"}>
        <PlayerCompanionPortrait
          config={config}
          className={compact ? "size-full" : "mx-auto size-28"}
        />
        {!compact ? (
          <>
            <p className="mt-4 text-sm font-semibold text-white/80">
              Your companion is resting
            </p>
            <p className="mt-2 text-xs leading-5 text-white/45">
              The lightweight portrait keeps player access available when 3D is unavailable.
            </p>
            {retry ? (
              <button
                type="button"
                onClick={retry}
                className="mt-4 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/72"
              >
                Retry 3D
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
