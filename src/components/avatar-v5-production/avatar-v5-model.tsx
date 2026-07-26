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
  avatarV5BaseAssets,
  avatarV5EyeTextures,
  avatarV5FacialHairAssets,
  avatarV5HairAssets,
  avatarV5HairTransforms,
  avatarV5IdleAsset,
  avatarV5OutfitTexture,
  getAvatarV5BottomAsset,
  getAvatarV5ShoeAsset,
  getAvatarV5TopAssets,
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
import { AvatarV6Details } from "@/components/avatar-v5-production/avatar-v6-details";
import { isAvatarV6ModernTop } from "@/components/avatar-v5-production/avatar-v6-garments";

const MODEL_SCALE = 3.55;
const MODEL_FLOOR_Y = -3.14;
const HEAD_CLIP_WORLD_Y = MODEL_FLOOR_Y + 1.505 * MODEL_SCALE;

function bodyScale(config: AvatarV5Config): [number, number, number] {
  switch (config.bodyPresetId) {
    case "slim":
      return [0.86, 1, 0.91];
    case "athletic":
      return [1.075, 1.015, 1.055];
    case "broad":
      return [1.16, 0.995, 1.08];
    case "tall":
      return [0.95, 1.11, 0.96];
    default:
      return [1, 1, 1];
  }
}

function faceScale(config: AvatarV5Config): [number, number, number] {
  switch (config.facePresetId) {
    case "soft":
      return [1.09, 1.025, 1.07];
    case "defined":
      return [0.91, 1.025, 0.93];
    case "long":
      return [0.93, 1.13, 0.96];
    default:
      return [1, 1, 1];
  }
}

function eyeScale(config: AvatarV5Config): [number, number, number] {
  switch (config.eyeShapeId) {
    case "almond":
      return [1.2, 0.62, 1];
    case "round":
      return [0.96, 1.52, 1];
    case "focused":
      return [1.24, 0.4, 1];
    default:
      return [1, 1, 1];
  }
}

function topScale(config: AvatarV5Config): [number, number, number] {
  if (config.topStyleId === "relaxed-tee") return [1.1, 1, 1.07];
  if (config.topStyleId === "crew-sweater") return [1.07, 1.005, 1.08];
  if (config.topStyleId === "hoodie") return [1.1, 1.005, 1.1];
  if (config.topStyleId === "blazer") return [1.07, 1.01, 1.055];
  if (config.topStyleId === "bomber") return [1.12, 0.985, 1.11];
  return [1, 1, 1];
}

function bottomScale(config: AvatarV5Config): [number, number, number] {
  if (config.bottomStyleId === "slim-trousers") return [1.08, 1, 1.1];
  if (config.bottomStyleId === "relaxed-trousers") return [1.23, 1, 1.22];
  if (config.bottomStyleId === "utility-trousers") return [1.22, 1, 1.22];
  if (config.bottomStyleId === "sport-trousers") return [1.14, 1, 1.16];
  return [1.16, 1, 1.18];
}

function shoeScale(config: AvatarV5Config): [number, number, number] {
  if (config.shoeStyleId === "trainers") return [1.04, 1, 1.1];
  if (config.shoeStyleId === "casual-shoes") return [0.98, 1, 1.04];
  if (config.shoeStyleId === "formal-shoes") return [0.94, 1, 1.08];
  if (config.shoeStyleId === "sport-shoes") return [1.08, 1, 1.14];
  if (config.shoeStyleId === "modern-boots") return [1.05, 1.04, 1.06];
  return [1.03, 1.02, 1.05];
}

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
  overrideEyeTexture,
}: {
  asset: string;
  idleClip: AnimationClip | undefined;
  animate: boolean;
  materialOptions: AvatarV5MaterialOptions;
  overrideTexture?: Texture;
  overrideEyeTexture?: Texture;
}) {
  const source = useGLTF(asset);
  const invalidate = useThree((state) => state.invalidate);
  const mixerRef = useRef<AnimationMixer | null>(null);

  const prepared = useMemo(() => {
    const scene = cloneSkinnedScene(source.scene);
    const colourTexture = overrideTexture?.clone();
    const eyeTexture = overrideEyeTexture?.clone();
    for (const texture of [colourTexture, eyeTexture]) {
      if (!texture) continue;
      texture.colorSpace = SRGBColorSpace;
      texture.flipY = false;
      texture.needsUpdate = true;
    }
    const materials = prepareAvatarV5Scene(scene, {
      ...materialOptions,
      mapOverride: colourTexture,
      eyeMapOverride: eyeTexture,
    });
    return { scene, materials, colourTexture, eyeTexture };
  }, [materialOptions, overrideEyeTexture, overrideTexture, source.scene]);

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

  useFrame((state, delta) => {
    if (animate) mixerRef.current?.update(Math.min(delta, 0.05));
    const eyes = prepared.scene.getObjectByName("Eyes");
    if (animate && eyes && materialOptions.eyeScale) {
      const phase = state.clock.elapsedTime % 5.4;
      const blink =
        phase < 0.14
          ? Math.max(0.12, Math.abs(phase - 0.07) / 0.07)
          : 1;
      eyes.scale.y = materialOptions.eyeScale[1] * blink;
    }
  });

  useEffect(
    () => () => {
      for (const material of prepared.materials) material.dispose();
      prepared.colourTexture?.dispose();
      prepared.eyeTexture?.dispose();
    },
    [prepared.colourTexture, prepared.eyeTexture, prepared.materials],
  );

  return <primitive object={prepared.scene} />;
}

function AnimatedAvatarPart(
  props: Omit<
    ComponentProps<typeof AnimatedAvatarPartCore>,
    "overrideTexture" | "overrideEyeTexture"
  >,
) {
  return <AnimatedAvatarPartCore {...props} />;
}

function TexturedAvatarPart({
  texture,
  ...props
}: Omit<
    ComponentProps<typeof AnimatedAvatarPartCore>,
    "overrideTexture" | "overrideEyeTexture"
> & { texture: string }) {
  const overrideTexture = useTexture(texture);
  return (
    <AnimatedAvatarPartCore
      {...props}
      overrideTexture={overrideTexture}
    />
  );
}

function BaseAvatarPart({
  eyeTexture,
  ...props
}: Omit<
  ComponentProps<typeof AnimatedAvatarPartCore>,
  "overrideTexture" | "overrideEyeTexture"
> & { eyeTexture: string }) {
  const overrideEyeTexture = useTexture(eyeTexture);
  return (
    <AnimatedAvatarPartCore
      {...props}
      overrideEyeTexture={overrideEyeTexture}
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
  const hairTransform = avatarV5HairTransforms[config.hairStyleId];
  const facialHairAsset =
    config.facialHairStyleId === "none"
      ? null
      : avatarV5FacialHairAssets[config.facialHairStyleId];
  const eyeTexture = avatarV5EyeTextures[config.eyeColourId];
  const baseAsset = avatarV5BaseAssets[config.frameId];
  const top = getAvatarV5TopAssets(config.topStyleId, config.frameId);
  const bottom = getAvatarV5BottomAsset(config.bottomStyleId, config.frameId);
  const shoes = getAvatarV5ShoeAsset(config.shoeStyleId, config.frameId);
  const topTexture = avatarV5OutfitTexture(top.family, config.topColourId);
  const bottomTexture = avatarV5OutfitTexture(
    bottom.family,
    config.bottomColourId,
  );
  const shoeTexture = avatarV5OutfitTexture(
    shoes.family,
    config.shoeColourId,
  );

  const selectedBodyScale = bodyScale(config);
  const selectedFaceScale = faceScale(config);
  const selectedEyeScale = eyeScale(config);
  const selectedTopScale = topScale(config);
  const selectedBottomScale = bottomScale(config);
  const selectedShoeScale = shoeScale(config);
  const modernTop = isAvatarV6ModernTop(config.topStyleId);
  const animateParts = animate;
  const modernBottom =
    config.bottomStyleId !== "heritage-trousers" &&
    config.bottomStyleId !== "ranger-trousers";

  return (
    <group position={[0, MODEL_FLOOR_Y, 0]} scale={MODEL_SCALE}>
      <group scale={selectedBodyScale}>
      <BaseAvatarPart
        asset={baseAsset}
        eyeTexture={eyeTexture}
        idleClip={idleClip}
        animate={animateParts}
        materialOptions={{
          clipBelowWorldY: HEAD_CLIP_WORLD_Y,
          hairColour,
          skinColour,
          skinSourceColour: "#b8754e",
          skinEligible: true,
          faceScale: selectedFaceScale,
          eyeScale: selectedEyeScale,
        }}
      />
      <group position={hairTransform.position} scale={hairTransform.scale}>
        <AnimatedAvatarPart
          asset={hairAsset}
          idleClip={idleClip}
          animate={animateParts}
          materialOptions={{ hairColour, faceScale: selectedFaceScale }}
        />
      </group>
      {facialHairAsset ? (
        <AnimatedAvatarPart
          asset={facialHairAsset}
          idleClip={idleClip}
          animate={animateParts}
          materialOptions={{ hairColour, faceScale: selectedFaceScale }}
        />
      ) : null}
      {!modernTop ? (
      <group scale={selectedTopScale}>
      <TexturedAvatarPart
        asset={top.body}
        idleClip={idleClip}
        animate={animateParts}
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
        animate={animateParts}
        texture={topTexture}
        materialOptions={{
          skinColour,
          skinSourceColour: "#b8754e",
          skinEligible: true,
        }}
      />
      </group>
      ) : null}
      <group scale={selectedBottomScale}>
      {!modernBottom ? (
      <TexturedAvatarPart
        asset={bottom.asset}
        idleClip={idleClip}
        animate={animateParts}
        texture={bottomTexture}
        materialOptions={{
          depthTest: false,
          renderOrder: 2,
        }}
      />
      ) : null}
      </group>
      <group scale={selectedShoeScale}>
      <TexturedAvatarPart
        asset={shoes.asset}
        idleClip={idleClip}
        animate={animateParts}
        texture={shoeTexture}
        materialOptions={{
          depthTest: false,
          renderOrder: 3,
        }}
      />
      </group>
      <AvatarV6Details config={config} />
      </group>
    </group>
  );
}
