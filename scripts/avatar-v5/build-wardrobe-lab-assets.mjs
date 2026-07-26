import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { NodeIO } from "@gltf-transform/core";
import { dedup, prune, resample } from "@gltf-transform/functions";
import sharp from "sharp";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "public", "avatar-v5-wardrobe-lab");
const reportPath = path.join(
  projectRoot,
  "src",
  "components",
  "avatar-v5-wardrobe-lab",
  "data",
  "compatibility-report.json",
);

const defaultAuditRoot = path.join(
  process.env.TEMP ?? process.env.TMP ?? "",
  "exp-avatar-v5-wardrobe-audit",
);
const defaultUniversalRoot = path.join(
  defaultAuditRoot,
  "universal",
  "Universal Base Characters[Standard]",
);
const defaultWomenRoot = path.join(
  defaultAuditRoot,
  "downloads",
  "women",
  "Individual Characters",
  "glTF",
);
const defaultMenRoot = path.join(
  defaultAuditRoot,
  "downloads",
  "men",
  "Individual Characters",
  "glTF",
);
const defaultDriveManifest = path.join(defaultAuditRoot, "drive-manifest.json");

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? path.resolve(process.argv[index + 1]) : fallback;
}

const sourceRoots = {
  universal: argument("universal", defaultUniversalRoot),
  women: argument("women", defaultWomenRoot),
  men: argument("men", defaultMenRoot),
};
const driveManifestPath = argument("manifest", defaultDriveManifest);

const APPROVED_BONES = [
  "root",
  "pelvis",
  "spine_01",
  "spine_02",
  "spine_03",
  "neck_01",
  "Head",
  "clavicle_l",
  "upperarm_l",
  "lowerarm_l",
  "hand_l",
  "clavicle_r",
  "upperarm_r",
  "lowerarm_r",
  "hand_r",
  "thigh_l",
  "calf_l",
  "foot_l",
  "ball_l",
  "thigh_r",
  "calf_r",
  "foot_r",
  "ball_r",
];

const hairCandidates = [
  {
    id: "approved-long",
    label: "Approved long",
    source: "Hair_Long",
    asset: "/avatar-v5-production/hair/Hair_Long.gltf",
    status: "approved",
    reason: "Current production hairstyle; exact approved Universal rig.",
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
  },
  {
    id: "double-buns",
    label: "Double buns",
    source: "Hair_Buns",
    asset: "/avatar-v5-production/hair/Hair_Buns.gltf",
    status: "approved",
    reason: "Current production option; exact approved Universal rig.",
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
  },
  {
    id: "buzzed",
    label: "Close buzz",
    source: "Hair_Buzzed",
    asset: "/avatar-v5-wardrobe-lab/hair/Hair_Buzzed.gltf",
    status: "needs-adjustment",
    reason: "Rig-compatible; scalp coverage and silhouette need visual approval.",
    transform: { position: [0, 0.003, 0], rotation: [0, 0, 0], scale: 1.012 },
  },
  {
    id: "buzzed-female",
    label: "Soft close crop",
    source: "Hair_BuzzedFemale",
    asset: "/avatar-v5-wardrobe-lab/hair/Hair_BuzzedFemale.gltf",
    status: "needs-adjustment",
    reason: "Rig-compatible; intentionally close silhouette needs visual approval.",
    transform: { position: [0, 0.004, 0], rotation: [0, 0, 0], scale: 1.014 },
  },
  {
    id: "simple-parted",
    label: "Simple side part",
    source: "Hair_SimpleParted",
    asset: "/avatar-v5-wardrobe-lab/hair/Hair_SimpleParted.gltf",
    status: "needs-adjustment",
    reason: "Rig-compatible; thin crown coverage needs visual approval.",
    transform: { position: [0, 0.004, 0], rotation: [0, 0, 0], scale: 1.015 },
  },
];

const accessoryCandidates = [
  {
    id: "hair-beard",
    label: "Short beard",
    source: "Hair_Beard",
    asset: "/avatar-v5-wardrobe-lab/hair/Hair_Beard.gltf",
    status: "needs-adjustment",
    reason: "Exact Universal head rig, but face fit must be reviewed with V5.",
    transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
  },
];

const wardrobeStatus = {
  women: {
    Casual: ["incompatible", "Modern casual silhouette; complete legacy body only."],
    Formal: ["incompatible", "Formal dress silhouette; complete legacy body only."],
    Suit: ["incompatible", "Professional suit silhouette; complete legacy body only."],
    Worker: ["incompatible", "Workwear silhouette; complete legacy body only."],
    Adventurer: ["rejected", "Adventure styling does not meet workplace priority."],
    Medieval: ["rejected", "Medieval styling duplicates the existing fantasy direction."],
    Punk: ["rejected", "Visual direction is not suitable for the professional V5 set."],
    SciFi: ["rejected", "Sci-fi styling is outside this workplace wardrobe phase."],
    Soldier: ["rejected", "Military styling is outside this workplace wardrobe phase."],
    Witch: ["rejected", "Fantasy styling is outside this workplace wardrobe phase."],
  },
  men: {
    Casual_2: ["incompatible", "Modern casual silhouette; complete legacy body only."],
    Casual_Hoodie: ["incompatible", "Useful hoodie silhouette; complete legacy body only."],
    Suit: ["incompatible", "Professional suit silhouette; complete legacy body only."],
    Worker: ["incompatible", "Workwear silhouette; complete legacy body only."],
    Beach: ["rejected", "Beachwear is not a workplace wardrobe priority."],
    Farmer: ["rejected", "Farm styling is not a modern workplace fit."],
    Adventurer: ["rejected", "Adventure styling does not meet workplace priority."],
    King: ["rejected", "Royal fantasy styling is outside this phase."],
    Punk: ["rejected", "Visual direction is not suitable for the professional V5 set."],
    Spacesuit: ["rejected", "Sci-fi styling is outside this workplace wardrobe phase."],
    Swat: ["rejected", "Military styling is outside this workplace wardrobe phase."],
  },
};

function readJson(file) {
  return fs.readFile(file, "utf8").then(JSON.parse);
}

function auditGltf(json, file, family) {
  const joints = new Set(
    (json.skins ?? []).flatMap((skin) =>
      (skin.joints ?? [])
        .map((index) => json.nodes?.[index]?.name)
        .filter(Boolean),
    ),
  );
  const approvedMatches = APPROVED_BONES.filter((bone) => joints.has(bone));
  const meshNodes = (json.nodes ?? [])
    .filter((node) => node.mesh !== undefined)
    .map((node) => node.name ?? `mesh-${node.mesh}`);
  const materials = (json.materials ?? []).map(
    (material) => material.name ?? "unnamed",
  );

  const bounds = (json.meshes ?? [])
    .flatMap((mesh) => mesh.primitives ?? [])
    .map((primitive) => json.accessors?.[primitive.attributes?.POSITION])
    .filter((accessor) => accessor?.min && accessor?.max)
    .reduce(
      (result, accessor) => ({
        min: result.min.map((value, index) =>
          Math.min(value, accessor.min[index]),
        ),
        max: result.max.map((value, index) =>
          Math.max(value, accessor.max[index]),
        ),
      }),
      {
        min: [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
        max: [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      },
    );

  return {
    sourceFile: path.basename(file),
    sourceBytes: Buffer.byteLength(JSON.stringify(json)),
    family,
    skeleton: {
      jointCount: joints.size,
      exactApprovedBoneMatches: approvedMatches.length,
      approvedBonesCompared: APPROVED_BONES.length,
      compatible: approvedMatches.length === APPROVED_BONES.length,
      note:
        approvedMatches.length === APPROVED_BONES.length
          ? "Exact approved Universal bone subset found."
          : "Legacy 62-bone rig differs from the approved 65-bone Universal rig.",
    },
    meshNodes,
    materials,
    animationCount: json.animations?.length ?? 0,
    bounds: {
      min: bounds.min,
      max: bounds.max,
      size: bounds.max.map((value, index) => value - bounds.min[index]),
    },
  };
}

async function writeHairCandidate(sourceName) {
  const sourceDirectory = path.join(
    sourceRoots.universal,
    "Hairstyles",
    "Rigged to Head Bone",
    "glTF (Godot -Unreal)",
  );
  const gltfSource = path.join(sourceDirectory, `${sourceName}.gltf`);
  const binSource = path.join(sourceDirectory, `${sourceName}.bin`);
  const gltfTarget = path.join(outputRoot, "hair", `${sourceName}.gltf`);
  const binTarget = path.join(outputRoot, "hair", `${sourceName}.bin`);
  const json = await readJson(gltfSource);

  for (const image of json.images ?? []) {
    image.uri = `../textures/${image.uri}`;
  }

  await fs.mkdir(path.dirname(gltfTarget), { recursive: true });
  await fs.writeFile(gltfTarget, `${JSON.stringify(json, null, 2)}\n`);
  await fs.copyFile(binSource, binTarget);
}

async function writeEyeVariants() {
  const input = path.join(
    projectRoot,
    "public",
    "avatar-v5-production",
    "base",
    "T_Eye_Brown.png",
  );
  const image = sharp(input);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const targets = {
    blue: [52, 105, 150],
    green: [67, 117, 82],
    hazel: [132, 105, 48],
    grey: [102, 116, 126],
  };
  const centerX = info.width * 0.5;
  const centerY = info.height * 0.5;
  const radius = Math.min(info.width, info.height) * 0.115;

  await fs.mkdir(path.join(outputRoot, "eyes"), { recursive: true });
  await fs.copyFile(input, path.join(outputRoot, "eyes", "eye-brown.png"));

  for (const [name, target] of Object.entries(targets)) {
    const output = Buffer.from(data);
    const targetLuma =
      target[0] * 0.2126 + target[1] * 0.7152 + target[2] * 0.0722;

    for (let y = 0; y < info.height; y += 1) {
      for (let x = 0; x < info.width; x += 1) {
        const distance = Math.hypot(x - centerX, y - centerY);
        if (distance > radius) continue;
        const offset = (y * info.width + x) * 4;
        const red = data[offset];
        const green = data[offset + 1];
        const blue = data[offset + 2];
        const luma = red * 0.2126 + green * 0.7152 + blue * 0.0722;
        const looksLikeIris =
          luma > 28 &&
          luma < 175 &&
          red > green * 1.08 &&
          green > blue * 1.04;
        if (!looksLikeIris) continue;

        const scale = Math.max(0.45, Math.min(1.45, luma / targetLuma));
        output[offset] = Math.min(255, Math.round(target[0] * scale));
        output[offset + 1] = Math.min(255, Math.round(target[1] * scale));
        output[offset + 2] = Math.min(255, Math.round(target[2] * scale));
      }
    }

    await sharp(output, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .png({ compressionLevel: 9 })
      .toFile(path.join(outputRoot, "eyes", `eye-${name}.png`));
  }
}

async function writeLegacyCandidate(file, family, id) {
  const io = new NodeIO();
  const document = await io.read(file);
  const animations = document.getRoot().listAnimations();
  const idle =
    animations.find((animation) => animation.getName() === "Idle_Neutral") ??
    animations.find((animation) => animation.getName() === "Idle") ??
    animations[0];

  for (const animation of animations) {
    if (animation !== idle) animation.dispose();
  }
  idle?.setName("Wardrobe_Lab_Idle");

  for (const node of document.getRoot().listNodes()) {
    if (/^(Pistol|Sword|Gun)$/i.test(node.getName())) node.dispose();
  }

  await document.transform(resample(), dedup(), prune());
  const target = path.join(outputRoot, "legacy-families", family, `${id}.glb`);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await io.write(target, document);
  return fs.stat(target);
}

async function main() {
  const safePublicRoot = path.join(projectRoot, "public") + path.sep;
  if (!outputRoot.startsWith(safePublicRoot)) {
    throw new Error("Refusing to write wardrobe assets outside public/");
  }

  const provenancePath = path.join(
    outputRoot,
    "licenses",
    "ASSET_PROVENANCE.md",
  );
  const preservedProvenance = await fs
    .readFile(provenancePath)
    .catch(() => null);
  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(outputRoot, { recursive: true });

  for (const sourceName of [
    "Hair_Buzzed",
    "Hair_BuzzedFemale",
    "Hair_SimpleParted",
    "Hair_Beard",
  ]) {
    await writeHairCandidate(sourceName);
  }

  const textureSource = path.join(
    sourceRoots.universal,
    "Hairstyles",
    "Rigged to Head Bone",
    "glTF (Godot -Unreal)",
  );
  await fs.mkdir(path.join(outputRoot, "textures"), { recursive: true });
  for (const texture of ["T_Hair_1_BaseColor.png", "T_Hair_1_Normal.png"]) {
    await sharp(path.join(textureSource, texture))
      .resize({
        width: 1024,
        height: 1024,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({ compressionLevel: 9 })
      .toFile(path.join(outputRoot, "textures", texture));
  }
  await writeEyeVariants();

  const wardrobe = [];
  for (const family of ["women", "men"]) {
    const directory = sourceRoots[family];
    const files = (await fs.readdir(directory))
      .filter((file) => file.endsWith(".gltf"))
      .sort();

    for (const sourceFile of files) {
      const id = path.basename(sourceFile, ".gltf");
      const sourcePath = path.join(directory, sourceFile);
      const json = await readJson(sourcePath);
      const audit = auditGltf(json, sourcePath, family);
      const [status, reason] = wardrobeStatus[family][id] ?? [
        "rejected",
        "Not retained after the workplace relevance audit.",
      ];
      const output = await writeLegacyCandidate(sourcePath, family, id);
      wardrobe.push({
        id: `${family}-${id.toLowerCase().replaceAll("_", "-")}`,
        label: `${family === "women" ? "Women" : "Men"} · ${id.replaceAll("_", " ")}`,
        family,
        source: id,
        asset: `/avatar-v5-wardrobe-lab/legacy-families/${family}/${id}.glb`,
        status,
        reason,
        outputBytes: output.size,
        ...audit,
      });
    }
  }

  const universalLicense = path.join(
    sourceRoots.universal,
    "License_Standard.txt",
  );
  const womenLicense = path.join(
    path.dirname(path.dirname(sourceRoots.women)),
    "License.txt",
  );
  const menLicense = path.join(
    path.dirname(path.dirname(sourceRoots.men)),
    "License.txt",
  );
  await fs.mkdir(path.join(outputRoot, "licenses"), { recursive: true });
  await fs.copyFile(
    universalLicense,
    path.join(outputRoot, "licenses", "Universal_Base_Characters_Standard.txt"),
  );
  await fs.copyFile(
    womenLicense,
    path.join(outputRoot, "licenses", "Ultimate_Modular_Women.txt"),
  );
  await fs.copyFile(
    menLicense,
    path.join(outputRoot, "licenses", "Ultimate_Modular_Men.txt"),
  );

  const report = {
    generatedAt: new Date().toISOString(),
    approvedSkeleton: {
      family: "Quaternius Universal Base Characters",
      jointCount: 65,
      protected: true,
    },
    advertisedUniversalHairstyles: 20,
    freelyDistributedUniversalHairMeshes: 5,
    freelyDistributedFacialHairMeshes: 1,
    freeUniversalHairMeshNames: [
      "Hair_Buns",
      "Hair_Buzzed",
      "Hair_BuzzedFemale",
      "Hair_Long",
      "Hair_SimpleParted",
    ],
    hair: hairCandidates,
    accessories: accessoryCandidates,
    wardrobe,
    findings: [
      "The free Standard Universal archive contains five hairstyle meshes and one beard, not all 20 hairstyles advertised for the overall pack.",
      "The 2022 Ultimate Modular Women and Men packs use a legacy 62-bone rig that is not compatible with the approved 65-bone Universal rig.",
      "Legacy outfits are retained only as complete alternate-family lab previews. No legacy garment is mixed onto the approved V5 body.",
      "The free Universal eye distribution contains one brown eye texture. Lab-only iris variants recolour masked iris pixels while preserving pupil, highlights, whites, and surrounding pixels.",
    ],
  };

  const driveManifest = await readJson(driveManifestPath).catch(() => null);
  if (driveManifest) {
    report.sourceInventory = Object.fromEntries(
      Object.entries(driveManifest).map(([family, inventory]) => [
        family,
        {
          root: inventory.root,
          folderCount: inventory.folders,
          fileCount: inventory.files.length,
          files: inventory.files.map(({ path: filePath, mime }) => ({
            path: filePath,
            mime,
          })),
        },
      ]),
    );
  }

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  if (preservedProvenance) {
    await fs.writeFile(provenancePath, preservedProvenance);
  }
  console.log(`Wrote ${wardrobe.length} wardrobe audits to ${reportPath}`);
}

await main();
