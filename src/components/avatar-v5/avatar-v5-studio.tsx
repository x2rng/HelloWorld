"use client";

import { Suspense, useState } from "react";
import { useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  ACESFilmicToneMapping,
  CineonToneMapping,
  SRGBColorSpace,
} from "three";
import { useAvatarQualityController } from "@/components/avatar-3d/avatar-quality-controller";
import type { AvatarView } from "@/components/avatar-3d/config/avatar-v4-types";
import { AvatarV5Scene } from "@/components/avatar-v5/avatar-v5-scene";

const viewButtons: Array<{ label: string; view: AvatarView }> = [
  { label: "Front", view: "front" },
  { label: "Side", view: "side" },
  { label: "Rear", view: "back" },
];

export default function AvatarV5Studio() {
  const {
    containerRef,
    quality,
    reducedMotion,
    active,
    dpr,
    shadowSize,
  } = useAvatarQualityController();
  const { active: loading, progress } = useProgress();
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
      className="relative isolate h-[34rem] min-h-[28rem] w-full min-w-0 max-w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1018] lg:h-[43rem]"
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
          localClippingEnabled: true,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.localClippingEnabled = true;
          gl.toneMapping =
            quality === "low" ? CineonToneMapping : ACESFilmicToneMapping;
          gl.toneMappingExposure = quality === "high" ? 1.02 : 1;
        }}
      >
        <Suspense fallback={null}>
          <AvatarV5Scene
            quality={quality}
            shadowSize={shadowSize}
            reducedMotion={reducedMotion}
            autoRotate={autoRotate}
            onInteraction={() => setAutoRotate(false)}
            viewRequest={viewRequest}
          />
        </Suspense>
      </Canvas>

      {loading ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#0b1018]/92 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm font-semibold text-white/78">
              Loading imported glTF assets
            </p>
            <p className="mt-2 text-xs text-white/42">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55 backdrop-blur">
          {quality} quality · imported glTF
        </div>
        <p className="max-w-44 text-right text-[11px] leading-5 text-white/45">
          Drag to rotate · Pinch or scroll to zoom
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-1.5 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-4 pt-12">
        {viewButtons.map((item) => (
          <button
            key={item.view}
            type="button"
            onClick={() => requestView(item.view)}
            className="rounded-full border border-white/12 bg-black/38 px-3 py-2 text-xs font-semibold text-white/72 backdrop-blur transition hover:border-white/25 hover:text-white"
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={autoRotate}
          onClick={() => setAutoRotate((current) => !current)}
          disabled={reducedMotion || quality === "low"}
          className="rounded-full border border-white/12 bg-black/38 px-3 py-2 text-xs font-semibold text-white/72 backdrop-blur transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
        >
          {autoRotate ? "Stop rotation" : "Auto rotate"}
        </button>
        <button
          type="button"
          onClick={() => requestView("front")}
          className="rounded-full border border-white/12 bg-black/38 px-3 py-2 text-xs font-semibold text-white/72 backdrop-blur transition hover:border-white/25 hover:text-white"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
