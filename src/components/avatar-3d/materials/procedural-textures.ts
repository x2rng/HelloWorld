import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from "three";

export type FabricTextureKind =
  | "cotton"
  | "knit"
  | "denim"
  | "structured"
  | "rubber";

export function createProceduralFabricTexture(
  kind: FabricTextureKind,
): Texture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.fillStyle = "#f3f3f3";
  context.fillRect(0, 0, 64, 64);

  if (kind === "cotton") {
    context.strokeStyle = "rgba(100,100,100,0.08)";
    context.lineWidth = 1;
    for (let index = 0; index < 64; index += 4) {
      context.beginPath();
      context.moveTo(index, 0);
      context.lineTo(index + 12, 64);
      context.stroke();
    }
  }

  if (kind === "knit") {
    context.strokeStyle = "rgba(85,85,85,0.12)";
    context.lineWidth = 1.2;
    for (let index = -64; index < 96; index += 8) {
      context.beginPath();
      context.moveTo(index, 0);
      context.lineTo(index + 64, 64);
      context.stroke();
      context.beginPath();
      context.moveTo(index + 64, 0);
      context.lineTo(index, 64);
      context.stroke();
    }
  }

  if (kind === "denim") {
    context.strokeStyle = "rgba(70,70,70,0.1)";
    context.lineWidth = 1;
    for (let index = -64; index < 96; index += 5) {
      context.beginPath();
      context.moveTo(index, 0);
      context.lineTo(index + 64, 64);
      context.stroke();
    }
  }

  if (kind === "structured") {
    context.strokeStyle = "rgba(80,80,80,0.07)";
    context.lineWidth = 1;
    for (let index = 0; index < 64; index += 5) {
      context.beginPath();
      context.moveTo(index, 0);
      context.lineTo(index, 64);
      context.stroke();
      context.beginPath();
      context.moveTo(0, index);
      context.lineTo(64, index);
      context.stroke();
    }
  }

  if (kind === "rubber") {
    context.fillStyle = "rgba(85,85,85,0.08)";
    for (let x = 2; x < 64; x += 7) {
      for (let y = 2; y < 64; y += 7) {
        context.beginPath();
        context.arc(x, y, 0.8, 0, Math.PI * 2);
        context.fill();
      }
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(kind === "knit" ? 5 : 7, kind === "knit" ? 7 : 9);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
