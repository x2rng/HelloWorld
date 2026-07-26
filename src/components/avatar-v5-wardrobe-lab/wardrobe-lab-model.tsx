"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AnimationClip,
  AnimationMixer,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SkinnedMesh,
  SRGBColorSpace,
  Texture,
} from "three";
import { clone as cloneSkinnedScene } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  avatarV5BaseAsset,
  avatarV5BottomAssets,
  avatarV5IdleAsset,
  avatarV5ShoeAssets,
  avatarV5TopAssets,
} from "@/components/avatar-v5-production/config/avatar-v5-assets";
import { prepareAvatarV5Scene } from "@/components/avatar-v5-production/avatar-v5-materials";
import type {
  WardrobeLabAppearance,
  WardrobeLabHairCandidate,
  WardrobeLabSelection,
} from "@/components/avatar-v5-wardrobe-lab/wardrobe-lab-types";

const MODEL_SCALE = 3.55;
const MODEL_FLOOR_Y = -3.14;
const HEAD_CLIP_WORLD_Y = MODEL_FLOOR_Y + 1.505 * MODEL_SCALE;
const APPROVED_TOP = avatarV5TopAssets["heritage-fitted"];
const APPROVED_BOTTOM = avatarV5BottomAssets["heritage-trousers"];
const APPROVED_SHOES = avatarV5ShoeAssets["heritage-boots"];

function compatibleClip(source: AnimationClip, root: Object3D) {
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

function isMaterialOwner(
  object: Object3D,
): object is Mesh | SkinnedMesh {
  return object instanceof Mesh || object instanceof SkinnedMesh;
}

function AnimatedLabPart({
  asset,
  idleClip,
  animate,
  skinColour,
  hairColour,
  colourTexture,
  eyeTexture,
  clipBody,
}: {
  asset: string;
  idleClip?: AnimationClip;
  animate: boolean;
  skinColour?: string;
  hairColour?: string;
  colourTexture?: Texture;
  eyeTexture?: Texture;
  clipBody?: boolean;
}) {
  const source = useGLTF(asset);
  const invalidate = useThree((state) => state.invalidate);
  const mixerRef = useRef<AnimationMixer | null>(null);

  const prepared = useMemo(() => {
    const scene = cloneSkinnedScene(source.scene);
    const mapOverride = colourTexture?.clone();
    const eyesOverride = eyeTexture?.clone();
    for (const texture of [mapOverride, eyesOverride]) {
      if (!texture) continue;
      texture.colorSpace = SRGBColorSpace;
      texture.flipY = false;
      texture.needsUpdate = true;
    }

    const materials = prepareAvatarV5Scene(scene, {
      clipBelowWorldY: clipBody ? HEAD_CLIP_WORLD_Y : undefined,
      hairColour,
      skinColour,
      skinSourceColour: "#b8754e",
      skinEligible: Boolean(skinColour),
      mapOverride,
    });

    if (eyesOverride) {
      scene.traverse((object) => {
        if (!isMaterialOwner(object)) return;
        const ownerMaterials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        for (const material of ownerMaterials) {
          if (
            material instanceof MeshStandardMaterial &&
            material.name === "MI_Eyes"
          ) {
            material.map = eyesOverride;
            material.needsUpdate = true;
          }
        }
      });
    }

    return { scene, materials, mapOverride, eyesOverride };
  }, [
    clipBody,
    colourTexture,
    eyeTexture,
    hairColour,
    skinColour,
    source.scene,
  ]);

  useEffect(() => {
    if (!idleClip) return;
    const clip = compatibleClip(idleClip, prepared.scene);
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
      prepared.mapOverride?.dispose();
      prepared.eyesOverride?.dispose();
    },
    [prepared],
  );

  return <primitive object={prepared.scene} />;
}

function ApprovedV5Candidate({
  hair,
  beard,
  appearance,
  animate,
}: {
  hair: WardrobeLabHairCandidate;
  beard?: WardrobeLabHairCandidate;
  appearance: WardrobeLabAppearance;
  animate: boolean;
}) {
  const animationLibrary = useGLTF(avatarV5IdleAsset);
  const idleClip = animationLibrary.animations.find(
    (clip) => clip.name === "Idle_Loop",
  );
  const outfitTexture = useTexture(appearance.outfitTexture);
  const eyeTexture = useTexture(appearance.eyeAsset);

  return (
    <group position={[0, MODEL_FLOOR_Y, 0]} scale={MODEL_SCALE}>
      <AnimatedLabPart
        asset={avatarV5BaseAsset}
        idleClip={idleClip}
        animate={animate}
        skinColour={appearance.skinColour}
        hairColour={appearance.hairColour}
        eyeTexture={eyeTexture}
        clipBody
      />
      <group
        position={hair.transform.position}
        rotation={hair.transform.rotation}
        scale={hair.transform.scale}
      >
        <AnimatedLabPart
          asset={hair.asset}
          idleClip={idleClip}
          animate={animate}
          hairColour={appearance.hairColour}
        />
      </group>
      {beard ? (
        <group
          position={beard.transform.position}
          rotation={beard.transform.rotation}
          scale={beard.transform.scale}
        >
          <AnimatedLabPart
            asset={beard.asset}
            idleClip={idleClip}
            animate={animate}
            hairColour={appearance.hairColour}
          />
        </group>
      ) : null}
      <AnimatedLabPart
        asset={APPROVED_TOP.body}
        idleClip={idleClip}
        animate={animate}
        skinColour={appearance.skinColour}
        colourTexture={outfitTexture}
      />
      <AnimatedLabPart
        asset={APPROVED_TOP.arms}
        idleClip={idleClip}
        animate={animate}
        skinColour={appearance.skinColour}
        colourTexture={outfitTexture}
      />
      <AnimatedLabPart
        asset={APPROVED_BOTTOM.asset}
        idleClip={idleClip}
        animate={animate}
        colourTexture={outfitTexture}
      />
      <AnimatedLabPart
        asset={APPROVED_SHOES.asset}
        idleClip={idleClip}
        animate={animate}
        colourTexture={outfitTexture}
      />
    </group>
  );
}

function LegacyFamilyCandidate({
  asset,
  animate,
}: {
  asset: string;
  animate: boolean;
}) {
  const source = useGLTF(asset);
  const invalidate = useThree((state) => state.invalidate);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const prepared = useMemo(() => {
    const scene = cloneSkinnedScene(source.scene);
    const materials: Material[] = [];
    scene.traverse((object) => {
      if (!isMaterialOwner(object)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const sourceMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      const cloned = sourceMaterials.map((material) => {
        const copy = material.clone();
        materials.push(copy);
        return copy;
      });
      object.material = Array.isArray(object.material) ? cloned : cloned[0];
    });
    return { scene, materials };
  }, [source.scene]);

  useEffect(() => {
    const idle = source.animations.find(
      (animation) => animation.name === "Wardrobe_Lab_Idle",
    );
    if (!idle) return;
    const mixer = new AnimationMixer(prepared.scene);
    mixer.clipAction(idle).play();
    mixer.setTime(0.5);
    mixerRef.current = mixer;
    invalidate();
    return () => {
      mixer.stopAllAction();
      mixer.uncacheClip(idle);
      mixer.uncacheRoot(prepared.scene);
      mixerRef.current = null;
    };
  }, [invalidate, prepared.scene, source.animations]);

  useFrame((_, delta) => {
    if (animate) mixerRef.current?.update(Math.min(delta, 0.05));
  });

  useEffect(
    () => () => {
      for (const material of prepared.materials) material.dispose();
    },
    [prepared.materials],
  );

  return (
    <group position={[0, MODEL_FLOOR_Y, 0]} scale={MODEL_SCALE}>
      <primitive object={prepared.scene} />
    </group>
  );
}

export function WardrobeLabModel({
  selection,
  approvedHair,
  beard,
  appearance,
  animate,
}: {
  selection: WardrobeLabSelection;
  approvedHair: WardrobeLabHairCandidate;
  beard?: WardrobeLabHairCandidate;
  appearance: WardrobeLabAppearance;
  animate: boolean;
}) {
  if (selection.kind === "wardrobe") {
    return (
      <LegacyFamilyCandidate
        asset={selection.candidate.asset}
        animate={animate}
      />
    );
  }

  return (
    <ApprovedV5Candidate
      hair={selection.kind === "hair" ? selection.candidate : approvedHair}
      beard={selection.kind === "accessory" ? selection.candidate : beard}
      appearance={appearance}
      animate={animate}
    />
  );
}
