"use client";

import {
  type ComponentProps,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AnimationClip,
  AnimationMixer,
  Object3D,
  SRGBColorSpace,
  Texture,
} from "three";
import { clone as cloneSkinnedScene } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  avatarV5BaseAsset,
  avatarV5BottomAssets,
  avatarV5HairAssets,
  avatarV5IdleAsset,
  avatarV5OutfitTexture,
  avatarV5ShoeAssets,
  avatarV5TopAssets,
} from "@/components/avatar-v5-production/config/avatar-v5-assets";
import {
  getAvatarV5HairColour,
  getAvatarV5SkinColour,
} from "@/components/avatar-v5-production/config/avatar-v5-catalogue";
import type { AvatarV5Config } from "@/components/avatar-v5-production/config/avatar-v5-types";
import {
  prepareAvatarV5Scene,
  type AvatarV5MaterialOptions,
} from "@/components/avatar-v5-production/avatar-v5-materials";

const MODEL_SCALE = 3.55;
const MODEL_FLOOR_Y = -3.14;
const HEAD_CLIP_WORLD_Y = MODEL_FLOOR_Y + 1.505 * MODEL_SCALE;

function createCompatibleClip(source: AnimationClip, root: Object3D) {
  const nodeNames = new Set<string>();
  root.traverse((object) => {
    if (object.name) nodeNames.add(object.name);
  });

  const clip = source.clone();
  clip.tracks = clip.tracks.filter((track) =>
    nodeNames.has(track.name.split(".")[0]),
  );
  return clip;
}

function AnimatedAvatarPartCore({
  asset,
  idleClip,
  animate,
  materialOptions,
  overrideTexture,
}: {
  asset: string;
  idleClip: AnimationClip | undefined;
  animate: boolean;
  materialOptions: AvatarV5MaterialOptions;
  overrideTexture?: Texture;
}) {
  const source = useGLTF(asset);
  const invalidate = useThree((state) => state.invalidate);
  const mixerRef = useRef<AnimationMixer | null>(null);

  const prepared = useMemo(() => {
    const scene = cloneSkinnedScene(source.scene);
    const colourTexture = overrideTexture?.clone();
    if (colourTexture) {
      colourTexture.colorSpace = SRGBColorSpace;
      colourTexture.needsUpdate = true;
    }
    const materials = prepareAvatarV5Scene(scene, {
      ...materialOptions,
      mapOverride: colourTexture,
    });
    return { scene, materials, colourTexture };
  }, [materialOptions, overrideTexture, source.scene]);

  useEffect(() => {
    if (!idleClip) return;
    const clip = createCompatibleClip(idleClip, prepared.scene);
    const mixer = new AnimationMixer(prepared.scene);
    mixer.clipAction(clip).play();
    mixer.setTime(0.5);
    mixerRef.current = mixer;
    invalidate();

    return () => {
      mixer.stopAllAction();
      mixer.uncacheClip(clip);
      mixer.uncacheRoot(prepared.scene);
      mixerRef.current = null;
    };
  }, [idleClip, invalidate, prepared.scene]);

  useFrame((_, delta) => {
    if (animate) mixerRef.current?.update(Math.min(delta, 0.05));
  });

  useEffect(
    () => () => {
      for (const material of prepared.materials) material.dispose();
      prepared.colourTexture?.dispose();
    },
    [prepared.colourTexture, prepared.materials],
  );

  return <primitive object={prepared.scene} />;
}

function AnimatedAvatarPart(
  props: Omit<
    ComponentProps<typeof AnimatedAvatarPartCore>,
    "overrideTexture"
  >,
) {
  return <AnimatedAvatarPartCore {...props} />;
}

function TexturedAvatarPart({
  texture,
  ...props
}: Omit<
  ComponentProps<typeof AnimatedAvatarPartCore>,
  "overrideTexture"
> & { texture: string }) {
  const overrideTexture = useTexture(texture);
  return (
    <AnimatedAvatarPartCore
      {...props}
      overrideTexture={overrideTexture}
    />
  );
}

export function AvatarV5ProductionModel({
  config,
  animate,
}: {
  config: AvatarV5Config;
  animate: boolean;
}) {
  const animationLibrary = useGLTF(avatarV5IdleAsset);
  const idleClip = animationLibrary.animations.find(
    (clip) => clip.name === "Idle_Loop",
  );
  const skinColour = getAvatarV5SkinColour(config.skinToneId);
  const hairColour = getAvatarV5HairColour(config.hairColourId);
  const hairAsset = avatarV5HairAssets[config.hairStyleId];
  const top = avatarV5TopAssets[config.topStyleId];
  const bottom = avatarV5BottomAssets[config.bottomStyleId];
  const shoes = avatarV5ShoeAssets[config.shoeStyleId];
  const topTexture = avatarV5OutfitTexture(top.family, config.topColourId);
  const bottomTexture = avatarV5OutfitTexture(
    bottom.family,
    config.bottomColourId,
  );
  const shoeTexture = avatarV5OutfitTexture(
    shoes.family,
    config.shoeColourId,
  );

  return (
    <group position={[0, MODEL_FLOOR_Y, 0]} scale={MODEL_SCALE}>
      <AnimatedAvatarPart
        asset={avatarV5BaseAsset}
        idleClip={idleClip}
        animate={animate}
        materialOptions={{
          clipBelowWorldY: HEAD_CLIP_WORLD_Y,
          hairColour,
          skinColour,
          skinSourceColour: "#b8754e",
          skinEligible: true,
        }}
      />
      <AnimatedAvatarPart
        asset={hairAsset}
        idleClip={idleClip}
        animate={animate}
        materialOptions={{ hairColour }}
      />
      <TexturedAvatarPart
        asset={top.body}
        idleClip={idleClip}
        animate={animate}
        texture={topTexture}
        materialOptions={{
          skinColour,
          skinSourceColour: "#b8754e",
          skinEligible: true,
        }}
      />
      <TexturedAvatarPart
        asset={top.arms}
        idleClip={idleClip}
        animate={animate}
        texture={topTexture}
        materialOptions={{
          skinColour,
          skinSourceColour: "#b8754e",
          skinEligible: true,
        }}
      />
      <TexturedAvatarPart
        asset={bottom.asset}
        idleClip={idleClip}
        animate={animate}
        texture={bottomTexture}
        materialOptions={{}}
      />
      <TexturedAvatarPart
        asset={shoes.asset}
        idleClip={idleClip}
        animate={animate}
        texture={shoeTexture}
        materialOptions={{}}
      />
    </group>
  );
}
