"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AvatarQualityTier } from "@/components/avatar-3d/config/avatar-v4-types";

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
};

function detectQualityTier(): AvatarQualityTier {
  if (typeof window === "undefined") return "medium";

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const pixelRatio = window.devicePixelRatio || 1;

  if (cores <= 4 || memory <= 3 || (coarsePointer && pixelRatio > 2.5)) {
    return "low";
  }
  if (cores >= 8 && memory >= 8 && !coarsePointer) return "high";
  return "medium";
}

export function useAvatarQualityController() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(
    () =>
      typeof document === "undefined" ||
      document.visibilityState === "visible",
  );
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [quality] = useState<AvatarQualityTier>(detectQualityTier);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
    motion.addEventListener("change", updateMotion);
    return () => motion.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const updateVisibility = () =>
      setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "120px", threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return useMemo(
    () => ({
      containerRef,
      quality,
      reducedMotion,
      active: visible && pageVisible,
      dpr:
        quality === "high"
          ? ([1, 1.8] as [number, number])
          : quality === "medium"
            ? ([1, 1.5] as [number, number])
            : ([1, 1.4] as [number, number]),
      shadowSize: quality === "high" ? 2048 : quality === "medium" ? 1024 : 768,
    }),
    [pageVisible, quality, reducedMotion, visible],
  );
}
