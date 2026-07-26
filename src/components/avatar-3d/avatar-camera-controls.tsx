"use client";

import { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import type { AvatarView } from "@/components/avatar-3d/config/avatar-v4-types";

export type AvatarViewRequest = {
  view: AvatarView;
  nonce: number;
};

type AvatarCameraControlsProps = {
  autoRotate: boolean;
  onInteraction: () => void;
  viewRequest: AvatarViewRequest;
  focus?: "full" | "face";
};

export function AvatarCameraControls({
  autoRotate,
  onInteraction,
  viewRequest,
  focus = "full",
}: AvatarCameraControlsProps) {
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
    const targetY = focus === "face" ? 2.05 : 0.05;
    const distance = focus === "face" ? 5.2 : 10.8;
    camera.position.set(
      Math.sin(angle) * distance,
      targetY,
      Math.cos(angle) * distance,
    );
    instance.target.set(0, targetY, 0);
    instance.update();
  }, [camera, focus, viewRequest]);

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.075}
      rotateSpeed={0.68}
      zoomSpeed={0.62}
      minDistance={focus === "face" ? 4.4 : 8.4}
      maxDistance={focus === "face" ? 7.2 : 13}
      minPolarAngle={Math.PI * 0.34}
      maxPolarAngle={Math.PI * 0.62}
      target={[0, focus === "face" ? 2.05 : 0.05, 0]}
      autoRotate={autoRotate}
      autoRotateSpeed={0.55}
      onStart={onInteraction}
    />
  );
}
