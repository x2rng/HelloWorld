import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const root = process.cwd();
const lab = path.join(root, "public", "avatar-v5-wardrobe-lab");
const production = path.join(root, "public", "avatar-v5-production");

const hairAssets = [
  "Hair_Buzzed",
  "Hair_BuzzedFemale",
  "Hair_SimpleParted",
  "Hair_Beard",
];

const eyeAssets = {
  blue: "Blue",
  green: "Green",
  hazel: "Hazel",
  grey: "Grey",
};

const paletteVariants = {
  Navy: { hue: 215, saturation: 0.72, brightness: 0.78 },
  Forest: { hue: 125, saturation: 0.7, brightness: 0.78 },
  Burgundy: { hue: 340, saturation: 0.74, brightness: 0.8 },
  Charcoal: { hue: 215, saturation: 0.2, brightness: 0.68 },
};

async function copy(source, target) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.copyFile(source, target);
}

async function main() {
  for (const asset of hairAssets) {
    for (const extension of ["gltf", "bin"]) {
      await copy(
        path.join(lab, "hair", `${asset}.${extension}`),
        path.join(production, "hair", `${asset}.${extension}`),
      );
    }
  }

  for (const texture of ["T_Hair_1_BaseColor.png", "T_Hair_1_Normal.png"]) {
    await copy(
      path.join(lab, "textures", texture),
      path.join(production, "textures", texture),
    );
  }

  for (const [sourceName, targetName] of Object.entries(eyeAssets)) {
    await copy(
      path.join(lab, "eyes", `eye-${sourceName}.png`),
      path.join(production, "base", `T_Eye_${targetName}.png`),
    );
  }

  for (const family of ["Peasant", "Ranger"]) {
    const source = path.join(
      production,
      "outfits",
      `T_${family}_BaseColor.png`,
    );
    for (const [name, settings] of Object.entries(paletteVariants)) {
      await sharp(source)
        .modulate(settings)
        .png({ compressionLevel: 9 })
        .toFile(
          path.join(
            production,
            "outfits",
            `T_${family}_${name}_BaseColor.png`,
          ),
        );
    }
  }

  console.log(
    "Promoted 4 compatible hair assets, 4 eye textures, and 8 palette textures.",
  );
}

await main();
