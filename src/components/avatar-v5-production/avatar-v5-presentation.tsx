"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AvatarWebGLBoundary } from "@/components/avatar-3d/avatar-webgl-boundary";
import { AvatarRenderer as AvatarV3Renderer } from "@/components/avatar-v3/avatar-renderer";
import { avatarV5ToV3 } from "@/components/avatar-v5-production/config/avatar-v5-parser";
import type { AvatarV5Config } from "@/components/avatar-v5-production/config/avatar-v5-types";
import { cx } from "@/lib/utils";

const AvatarV5Studio = dynamic(
  () => import("@/components/avatar-v5-production/avatar-v5-studio"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[30rem] animate-pulse rounded-[32px] border border-white/9 bg-white/[0.025]" />
    ),
  },
);

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function PresentationFallback({
  config,
  className,
}: {
  config: AvatarV5Config;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex min-h-[28rem] items-end justify-center overflow-hidden rounded-[32px] border border-white/9 bg-gradient-to-br from-blue-500/10 via-white/[0.035] to-purple-500/8 px-6",
        className,
      )}
    >
      <AvatarV3Renderer
        config={avatarV5ToV3(config)}
        size="large"
        showStage
        className="translate-y-5"
      />
    </div>
  );
}

export function AvatarV5Presentation({
  config,
  className,
}: {
  config: AvatarV5Config;
  className?: string;
}) {
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() =>
      setAvailable(supportsWebGL()),
    );
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (available !== true) {
    return <PresentationFallback config={config} className={className} />;
  }

  return (
    <AvatarWebGLBoundary
      fallback={() => (
        <PresentationFallback config={config} className={className} />
      )}
    >
      <AvatarV5Studio
        config={config}
        presentation
        className={className}
      />
    </AvatarWebGLBoundary>
  );
}
