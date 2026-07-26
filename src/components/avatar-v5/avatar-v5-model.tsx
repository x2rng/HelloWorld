"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  AnimationClip,
  AnimationMixer,
  Material,
  Mesh,
  Object3D,
  Plane,
  SkinnedMesh,
  Vector3,
} from "three";
import { clone as cloneSkinnedScene } from "three/examples/jsm/utils/SkeletonUtils.js";

const BASE_URL =
  "/avatar-v5/quaternius/base/Superhero_Female_FullBody.gltf";
const HAIR_URL = "/avatar-v5/quaternius/hair/Hair_Long.gltf";
const OUTFIT_URL = "/avatar-v5/quaternius/outfit/Female_Peasant.gltf";
const ANIMATION_URL =
  "/avatar-v5/quaternius/animation/UAL1_Standard.glb";

const MODEL_SCALE = 3.55;
const MODEL_FLOOR_Y = -3.14;
const HEAD_CLIP_WORLD_Y = MODEL_FLOOR_Y + 1.505 * MODEL_SCALE;

type MaterialOwner = Mesh | SkinnedMesh;

function isMaterialOwner(object: Object3D): object is MaterialOwner {
  return object instanceof Mesh || object instanceof SkinnedMesh;
}

function cloneMaterials(
  root: Object3D,
  options?: { clipBelowWorldY?: number },
) {
  const ownedMaterials: Material[] = [];

  root.traverse((object) => {
    if (!isMaterialOwner(object)) return;

    object.castShadow = true;
    object.receiveShadow = true;

    const source = Array.isArray(object.material)
      ? object.material
      : [object.material];
    const cloned = source.map((material) => {
      const next = material.clone();
      ownedMaterials.push(next);

      if (
        options?.clipBelowWorldY !== undefined &&
        material.name === "MI_Superhero_Female"
      ) {
        next.clippingPlanes = [
          new Plane(
            new Vector3(0, 1, 0),
            -options.clipBelowWorldY,
          ),
        ];
        next.clipShadows = true;
      }

      return next;
    });

    object.material = Array.isArray(object.material) ? cloned : cloned[0];
  });

  return ownedMaterials;
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

export function AvatarV5Model({ animate }: { animate: boolean }) {
  const base = useGLTF(BASE_URL);
  const hair = useGLTF(HAIR_URL);
  const outfit = useGLTF(OUTFIT_URL);
  const animationLibrary = useGLTF(ANIMATION_URL);
  const invalidate = useThree((state) => state.invalidate);
  const mixersRef = useRef<
    Array<{ mixer: AnimationMixer; clip: AnimationClip }>
  >([]);

  const prepared = useMemo(() => {
    const baseScene = cloneSkinnedScene(base.scene);
    const hairScene = cloneSkinnedScene(hair.scene);
    const outfitScene = cloneSkinnedScene(outfit.scene);
    const idleClip = animationLibrary.animations.find(
      (clip) => clip.name === "Idle_Loop",
    );

    const materials = [
      ...cloneMaterials(baseScene, {
        clipBelowWorldY: HEAD_CLIP_WORLD_Y,
      }),
      ...cloneMaterials(hairScene),
      ...cloneMaterials(outfitScene),
    ];

    return {
      baseScene,
      hairScene,
      outfitScene,
      materials,
      idleClip,
    };
  }, [
    animationLibrary.animations,
    base.scene,
    hair.scene,
    outfit.scene,
  ]);

  useEffect(() => {
    if (!prepared.idleClip) return;

    const animationTargets = [
      prepared.baseScene,
      prepared.hairScene,
      prepared.outfitScene,
    ];
    mixersRef.current = animationTargets.map((scene) => {
      const clip = createCompatibleClip(prepared.idleClip!, scene);
      const mixer = new AnimationMixer(scene);
      mixer.clipAction(clip).play();
      mixer.setTime(0.5);
      return { mixer, clip };
    });
    invalidate();

    return () => {
      for (const { mixer, clip } of mixersRef.current) {
        mixer.stopAllAction();
        mixer.uncacheClip(clip);
        mixer.uncacheRoot(mixer.getRoot());
      }
      mixersRef.current = [];
    };
  }, [invalidate, prepared]);

  useFrame((_, delta) => {
    if (!animate) return;
    const safeDelta = Math.min(delta, 0.05);
    for (const { mixer } of mixersRef.current) mixer.update(safeDelta);
  });

  useEffect(
    () => () => {
      for (const material of prepared.materials) material.dispose();
    },
    [prepared],
  );

  return (
    <group
      position={[0, MODEL_FLOOR_Y, 0]}
      scale={MODEL_SCALE}
    >
      <primitive object={prepared.baseScene} />
      <primitive object={prepared.hairScene} />
      <primitive object={prepared.outfitScene} />
    </group>
  );
}

useGLTF.preload(BASE_URL);
useGLTF.preload(HAIR_URL);
useGLTF.preload(OUTFIT_URL);
useGLTF.preload(ANIMATION_URL);
