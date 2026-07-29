"use client";

import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export type CompanionView = "front" | "side" | "rear";

export type CompanionViewRequest = {
  view: CompanionView;
  nonce: number;
};

export function PlayerCompanionCamera({
  viewRequest,
  autoRotate,
  onInteraction,
}: {
  viewRequest: CompanionViewRequest;
  autoRotate: boolean;
  onInteraction: () => void;
}) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    const instance = controls.current;
    if (!instance) return;
    const angle =
      viewRequest.view === "front"
        ? 0
        : viewRequest.view === "side"
          ? Math.PI / 2
          : Math.PI;
    camera.position.set(Math.sin(angle) * 6.4, 0.55, Math.cos(angle) * 6.4);
    instance.target.set(0, 0.52, 0);
    instance.update();
  }, [camera, viewRequest]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.085}
      rotateSpeed={0.62}
      zoomSpeed={0.55}
      minDistance={5.35}
      maxDistance={8.2}
      minPolarAngle={Math.PI * 0.36}
      maxPolarAngle={Math.PI * 0.61}
      target={[0, 0.52, 0]}
      autoRotate={autoRotate}
      autoRotateSpeed={0.52}
      onStart={onInteraction}
    />
  );
}
