"use client";

import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import type { AvatarView } from "@/components/avatar-3d/config/avatar-v4-types";

export type AvatarViewRequest = {
  view: AvatarView;
  nonce: number;
};

type AvatarCameraControlsProps = {
  autoRotate: boolean;
  onInteraction: () => void;
  viewRequest: AvatarViewRequest;
};

export function AvatarCameraControls({
  autoRotate,
  onInteraction,
  viewRequest,
}: AvatarCameraControlsProps) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  useEffect(() => {
    const instance = controls.current;
    if (!instance) return;
    const angle =
      viewRequest.view === "front"
        ? 0
        : viewRequest.view === "side"
          ? Math.PI / 2
          : Math.PI;
    instance.setAzimuthalAngle(angle);
    instance.setPolarAngle(Math.PI / 2);
    instance.target.set(0, 0.05, 0);
    instance.update();
  }, [viewRequest]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.075}
      rotateSpeed={0.68}
      zoomSpeed={0.62}
      minDistance={8.4}
      maxDistance={13}
      minPolarAngle={Math.PI * 0.34}
      maxPolarAngle={Math.PI * 0.62}
      target={[0, 0.05, 0]}
      autoRotate={autoRotate}
      autoRotateSpeed={0.55}
      onStart={onInteraction}
    />
  );
}
