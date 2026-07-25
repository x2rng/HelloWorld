type Rgb = { r: number; g: number; b: number };

function parseHex(value: string): Rgb {
  const normalized = value.replace("#", "");
  const hex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : normalized.padEnd(6, "0").slice(0, 6);

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function channel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
    .toString(16)
    .padStart(2, "0");
}

export function mixColor(base: string, target: string, amount: number) {
  const source = parseHex(base);
  const destination = parseHex(target);
  const ratio = Math.max(0, Math.min(1, amount));

  return `#${channel(source.r + (destination.r - source.r) * ratio)}${channel(
    source.g + (destination.g - source.g) * ratio,
  )}${channel(source.b + (destination.b - source.b) * ratio)}`;
}

export function getColorScale(base: string) {
  return {
    highlight: mixColor(base, "#ffffff", 0.2),
    base,
    shadow: mixColor(base, "#17202a", 0.2),
    deepShadow: mixColor(base, "#11151b", 0.38),
  };
}

export function getSkinScale(base: string) {
  return {
    highlight: mixColor(base, "#fff3e8", 0.2),
    base,
    blush: mixColor(base, "#c96f67", 0.2),
    shadow: mixColor(base, "#69463f", 0.16),
    deepShadow: mixColor(base, "#4a3432", 0.27),
  };
}
