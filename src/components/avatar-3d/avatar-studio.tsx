"use client";

import { Canvas } from "@react-three/fiber";
import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  SRGBColorSpace,
} from "three";
import { useState, type ReactNode } from "react";
import { useAvatarQualityController } from "@/components/avatar-3d/avatar-quality-controller";
import type {
  AvatarV4Config,
  AvatarView,
} from "@/components/avatar-3d/config/avatar-v4-types";
import { ProceduralAvatarScene } from "@/components/avatar-3d/procedural-avatar-scene";
import { cx } from "@/lib/utils";

type AvatarStudioProps = {
  config: AvatarV4Config;
  className?: string;
  presentation?: boolean;
  fallback?: ReactNode;
};

const viewButtons: Array<{ label: string; view: AvatarView }> = [
  { label: "Front", view: "front" },
  { label: "Side", view: "side" },
  { label: "Back", view: "back" },
];

export default function AvatarStudio({
  config,
  className,
  presentation = false,
  fallback,
}: AvatarStudioProps) {
  const {
    containerRef,
    quality,
    reducedMotion,
    active,
    dpr,
    shadowSize,
  } = useAvatarQualityController();
  const [autoRotate, setAutoRotate] = useState(false);
  const [viewRequest, setViewRequest] = useState({
    view: "front" as AvatarView,
    nonce: 0,
  });

  function requestView(view: AvatarView) {
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
        "relative isolate min-h-[28rem] overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0e15]",
        presentation ? "h-[30rem] sm:h-[35rem]" : "h-[34rem] lg:h-[43rem]",
        className,
      )}
    >
      <Canvas
        dpr={dpr}
        shadows
        frameloop={
          active && !reducedMotion && quality !== "low" ? "always" : "demand"
        }
        camera={{ position: [0, 0.1, 10.8], fov: 36, near: 0.1, far: 40 }}
        gl={{
          antialias: quality !== "low",
          alpha: false,
          powerPreference: quality === "low" ? "low-power" : "high-performance",
          preserveDrawingBuffer: false,
        }}
        fallback={fallback}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping =
            quality === "low" ? CineonToneMapping : ACESFilmicToneMapping;
          gl.toneMappingExposure = quality === "high" ? 1.02 : 1;
        }}
      >
        <ProceduralAvatarScene
          config={config}
          quality={quality}
          shadowSize={shadowSize}
          reducedMotion={reducedMotion}
          autoRotate={autoRotate}
          onInteraction={() => setAutoRotate(false)}
          viewRequest={viewRequest}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55 backdrop-blur">
          {quality} quality
        </div>
        <p className="max-w-40 text-right text-[11px] leading-5 text-white/45">
          Drag to rotate · Pinch or scroll to zoom
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-1.5 bg-gradient-to-t from-black/70 via-black/28 to-transparent px-4 pb-4 pt-12">
        {viewButtons.map((item) => (
          <button
            key={item.view}
            type="button"
            onClick={() => requestView(item.view)}
            className="rounded-full border border-white/12 bg-black/35 px-3 py-2 text-xs font-semibold text-white/68 backdrop-blur transition hover:border-white/25 hover:text-white"
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={autoRotate}
          onClick={() => setAutoRotate((current) => !current)}
          disabled={reducedMotion || quality === "low"}
          className="rounded-full border border-white/12 bg-black/35 px-3 py-2 text-xs font-semibold text-white/68 backdrop-blur transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          {autoRotate ? "Stop preview" : "Auto rotate"}
        </button>
        <button
          type="button"
          onClick={() => requestView("front")}
          className="rounded-full border border-white/12 bg-black/35 px-3 py-2 text-xs font-semibold text-white/68 backdrop-blur transition hover:border-white/25 hover:text-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
