"use client";

import { Canvas } from "@react-three/fiber";
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
import { PlayerCompanionScene } from "@/components/player-companion/player-companion-scene";
import { cx } from "@/lib/utils";

function CompactCanvas({
  config,
  reaction,
  className,
}: {
  config: PlayerCompanionConfig;
  reaction: CompanionReactionState;
  className?: string;
}) {
  const { containerRef, reducedMotion, active } =
    useAvatarQualityController();

  return (
    <div ref={containerRef} className={cx("relative size-full", className)}>
      <Canvas
        dpr={[1, 1.25]}
        frameloop={active && !reducedMotion ? "always" : "demand"}
        camera={{ position: [0, 0.46, 6.4], fov: 34, near: 0.1, far: 20 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.06;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <PlayerCompanionScene
          config={config}
          reaction={reaction}
          reducedMotion={reducedMotion}
          quality="compact"
          compact
        />
      </Canvas>
    </div>
  );
}

export default function PlayerCompanionViewport({
  config,
  reaction = "idle",
  className,
}: {
  config: PlayerCompanionConfig;
  reaction?: CompanionReactionState;
  className?: string;
}) {
  return (
    <AvatarWebGLBoundary
      fallback={() => (
        <PlayerCompanionFallback config={config} compact />
      )}
    >
      <CompactCanvas
        config={config}
        reaction={reaction}
        className={className}
      />
    </AvatarWebGLBoundary>
  );
}
