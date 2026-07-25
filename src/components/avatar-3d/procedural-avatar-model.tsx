"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { getIdleAnimation } from "@/components/avatar-3d/animation/avatar-idle-animation";
import type {
  AvatarQualityTier,
  AvatarV4Config,
} from "@/components/avatar-3d/config/avatar-v4-types";
import { createAvatarMaterials } from "@/components/avatar-3d/materials/avatar-materials";
import { ProceduralAccessories } from "@/components/avatar-3d/parts/procedural-accessories";
import { ProceduralBody } from "@/components/avatar-3d/parts/procedural-body";
import { ProceduralBottoms } from "@/components/avatar-3d/parts/procedural-bottoms";
import { ProceduralFace } from "@/components/avatar-3d/parts/procedural-face";
import { ProceduralHair } from "@/components/avatar-3d/parts/procedural-hair";
import { ProceduralOuterwear } from "@/components/avatar-3d/parts/procedural-outerwear";
import { ProceduralShoes } from "@/components/avatar-3d/parts/procedural-shoes";
import { ProceduralTop } from "@/components/avatar-3d/parts/procedural-top";

type ProceduralAvatarModelProps = {
  config: AvatarV4Config;
  quality: AvatarQualityTier;
  reducedMotion: boolean;
};

export function ProceduralAvatarModel({
  config,
  quality,
  reducedMotion,
}: ProceduralAvatarModelProps) {
  const model = useRef<Group>(null);
  const materials = useMemo(() => createAvatarMaterials(config), [config]);

  useEffect(() => () => materials.dispose(), [materials]);

  useFrame(({ clock }) => {
    if (!model.current || reducedMotion || quality === "low") return;
    const idle = getIdleAnimation(clock.elapsedTime);
    model.current.scale.y = 1 + idle.breath;
    model.current.rotation.z = idle.posture;
    model.current.rotation.y = idle.head;
  });

  const partProps = {
    config,
    materials,
    quality,
    reducedMotion,
  };

  return (
    <group ref={model} position={[0, -3.15, 0]}>
      <ProceduralBody {...partProps} />
      <ProceduralBottoms {...partProps} />
      <ProceduralShoes {...partProps} />
      <ProceduralTop {...partProps} />
      <ProceduralOuterwear {...partProps} />
      <ProceduralFace {...partProps} />
      <ProceduralHair {...partProps} />
      <ProceduralAccessories {...partProps} />
    </group>
  );
}
