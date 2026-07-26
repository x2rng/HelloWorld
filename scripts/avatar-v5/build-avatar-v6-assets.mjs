import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const projectRoot = process.cwd();
const productionRoot = path.join(
  projectRoot,
  "public",
  "avatar-v5-production",
);
const tempRoot = process.env.TEMP ?? process.env.TMP ?? "";
const universalRoot = path.join(
  tempRoot,
  "exp-avatar-v5-wardrobe-audit",
  "universal",
  "Universal Base Characters[Standard]",
);
const fantasyRoot = path.join(
  tempRoot,
  "exp-avatar-v5-quaternius",
  "fantasy-extracted",
  "Modular Character Outfits - Fantasy[Standard]",
);

async function copy(source, target) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
}

async function copyPair(sourceDirectory, targetDirectory, name) {
  for (const extension of ["gltf", "bin"]) {
    await copy(
      path.join(sourceDirectory, `${name}.${extension}`),
      path.join(targetDirectory, `${name}.${extension}`),
    );
  }
}

async function redirectSharedTextures(gltfPath, redirects) {
  const document = JSON.parse(await fs.readFile(gltfPath, "utf8"));
  for (const image of document.images ?? []) {
    if (typeof image.uri === "string" && redirects[image.uri]) {
      image.uri = redirects[image.uri];
    }
  }
  await fs.writeFile(gltfPath, `${JSON.stringify(document)}\n`);
}

async function buildFabricTexture({
  source,
  target,
  colour,
  brightness,
  texture,
}) {
  const image = sharp(source)
    .grayscale()
    .linear(0.34, 86)
    .tint(colour)
    .modulate({ brightness });
  const metadata = await image.metadata();
  const width = metadata.width ?? 1024;
  const height = metadata.height ?? 1024;
  const stripe = Buffer.from(
    `<svg width="${width}" height="${height}">
      <defs>
        <pattern id="fabric" width="${texture}" height="${texture}" patternUnits="userSpaceOnUse">
          <path d="M0 ${texture - 1}H${texture}" stroke="rgba(255,255,255,0.055)" stroke-width="1"/>
          <path d="M${texture - 1} 0V${texture}" stroke="rgba(0,0,0,0.04)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#fabric)"/>
    </svg>`,
  );

  await image
    .composite([{ input: stripe, blend: "soft-light" }])
    .png({ compressionLevel: 9 })
    .toFile(target);
}

async function main() {
  const baseSource = path.join(universalRoot, "Base Characters", "Godot - UE");
  const baseTarget = path.join(productionRoot, "base");
  await copyPair(
    baseSource,
    baseTarget,
    "Superhero_Male_FullBody",
  );
  for (const texture of [
    "T_Superhero_Male_Dark.png",
    "T_Superhero_Male_Normal.png",
    "T_Superhero_Male_Roughness.png",
  ]) {
    await copy(path.join(baseSource, texture), path.join(baseTarget, texture));
  }
  await redirectSharedTextures(
    path.join(baseTarget, "Superhero_Male_FullBody.gltf"),
    {
      "T_Hair_1_BaseColor.png": "../textures/T_Hair_1_BaseColor.png",
      "T_Hair_1_Normal_png.png": "../textures/T_Hair_1_Normal.png",
    },
  );

  const outfitSource = path.join(
    fantasyRoot,
    "Exports",
    "glTF (Godot-Unreal)",
    "Modular Parts",
  );
  const outfitTarget = path.join(productionRoot, "outfits");
  for (const name of [
    "Male_Peasant_Body",
    "Male_Peasant_Arms",
    "Male_Peasant_Legs",
    "Male_Peasant_Feet",
    "Male_Ranger_Body",
    "Male_Ranger_Arms",
    "Male_Ranger_Legs",
    "Male_Ranger_Feet_Boots",
  ]) {
    await copyPair(outfitSource, outfitTarget, name);
  }
  for (const texture of [
    "T_Regular_Male_Dark_BaseColor.png",
    "T_Regular_Male_Normal.png",
    "T_Regular_Male_Roughness.png",
  ]) {
    await copy(
      path.join(outfitSource, texture),
      path.join(outfitTarget, texture),
    );
  }

  const palettes = {
    Ocean: { colour: "#315d7c", brightness: 0.94 },
    Sage: { colour: "#6a7d68", brightness: 0.96 },
    Wine: { colour: "#754455", brightness: 0.92 },
    Sand: { colour: "#a28d70", brightness: 1.04 },
    Graphite: { colour: "#353b44", brightness: 0.88 },
    Cloud: { colour: "#d5d7d9", brightness: 1.08 },
  };

  for (const family of ["Peasant", "Ranger"]) {
    const source = path.join(
      outfitTarget,
      `T_${family}_BaseColor.png`,
    );
    for (const [name, settings] of Object.entries(palettes)) {
      await buildFabricTexture({
        source,
        target: path.join(
          outfitTarget,
          `T_${family}_Modern${name}_BaseColor.png`,
        ),
        ...settings,
        texture: family === "Peasant" ? 10 : 14,
      });
    }
  }

  console.log(
    "Built Avatar V6 structured frame assets and 12 modern fabric palettes.",
  );
}

await main();
