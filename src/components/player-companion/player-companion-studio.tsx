"use client";

import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import {
  ACESFilmicToneMapping,
  SRGBColorSpace,
} from "three";
import { AvatarWebGLBoundary } from "@/components/avatar-3d/avatar-webgl-boundary";
import { useAvatarQualityController } from "@/components/avatar-3d/avatar-quality-controller";
import type {
  CompanionReactionState,
  PlayerCompanionConfig,
} from "@/components/player-companion/config/player-companion-types";
import { PlayerCompanionFallback } from "@/components/player-companion/player-companion-fallback";
import {
  type CompanionView,
  type CompanionViewRequest,
} from "@/components/player-companion/player-companion-camera";
import { PlayerCompanionScene } from "@/components/player-companion/player-companion-scene";
import { cx } from "@/lib/utils";

const views: Array<{ value: CompanionView; label: string }> = [
  { value: "front", label: "Front" },
  { value: "side", label: "Side" },
  { value: "rear", label: "Rear" },
];

function StudioCanvas({
  config,
  reaction,
  modelScale,
  className,
}: {
  config: PlayerCompanionConfig;
  reaction: CompanionReactionState;
  modelScale: number;
  className?: string;
}) {
  const {
    containerRef,
    quality,
    reducedMotion,
    active,
    dpr,
  } = useAvatarQualityController();
  const [autoRotate, setAutoRotate] = useState(false);
  const [viewRequest, setViewRequest] = useState<CompanionViewRequest>({
    view: "front",
    nonce: 0,
  });

  function requestView(view: CompanionView) {
    setAutoRotate(false);
    setViewRequest((current) => ({
      view,
      nonce: current.nonce + 1,
    }));
  }

  return (
    <div
      ref={containerRef}
      className={cx(
        "relative isolate h-[32rem] min-h-[28rem] overflow-hidden rounded-[34px] border border-white/10 bg-[#0b0d16] sm:h-[38rem] lg:h-[44rem]",
        className,
      )}
    >
      <div className="pointer-events-none absolute left-[18%] top-[12%] z-0 size-44 rounded-full bg-indigo-500/12 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[8%] right-[14%] z-0 size-52 rounded-full bg-amber-300/8 blur-3xl" />
      <Canvas
        dpr={dpr}
        shadows
        frameloop={active && !reducedMotion ? "always" : "demand"}
        camera={{ position: [0, 0.55, 6.4], fov: 33, near: 0.1, far: 30 }}
        gl={{
          antialias: quality !== "low",
          alpha: false,
          powerPreference: quality === "low" ? "low-power" : "high-performance",
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.03;
        }}
      >
        <PlayerCompanionScene
          config={config}
          reaction={reaction}
          reducedMotion={reducedMotion}
          quality="full"
          modelScale={modelScale}
          autoRotate={autoRotate}
          viewRequest={viewRequest}
          onInteraction={() => setAutoRotate(false)}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="rounded-full border border-white/10 bg-black/28 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-100/70 backdrop-blur">
          Player Companion
        </div>
        <p className="max-w-40 text-right text-[11px] leading-5 text-white/42">
          Drag to rotate · Pinch or scroll to zoom
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-1.5 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-4 pb-4 pt-14">
        {views.map((view) => (
          <button
            key={view.value}
            type="button"
            onClick={() => requestView(view.value)}
            className="rounded-full border border-white/12 bg-black/38 px-3 py-2 text-xs font-semibold text-white/68 backdrop-blur transition hover:border-indigo-200/35 hover:text-white"
          >
            {view.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={autoRotate}
          onClick={() => setAutoRotate((current) => !current)}
          disabled={reducedMotion}
          className="rounded-full border border-white/12 bg-black/38 px-3 py-2 text-xs font-semibold text-white/68 backdrop-blur transition hover:border-indigo-200/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          {autoRotate ? "Stop rotation" : "Auto rotate"}
        </button>
      </div>
    </div>
  );
}

export default function PlayerCompanionStudio({
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
    <AvatarWebGLBoundary
      fallback={(retry) => (
        <div className={cx("h-[32rem] rounded-[34px] border border-white/10 bg-[#0b0d16] sm:h-[38rem] lg:h-[44rem]", className)}>
          <PlayerCompanionFallback config={config} retry={retry} />
        </div>
      )}
    >
      <StudioCanvas
        config={config}
        reaction={reaction}
        modelScale={modelScale}
        className={className}
      />
    </AvatarWebGLBoundary>
  );
}
