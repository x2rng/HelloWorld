import { Color } from "three";

export type ColourScale = {
  base: string;
  highlight: string;
  shadow: string;
  deepShadow: string;
};

function blend(source: string, target: string, amount: number) {
  return `#${new Color(source)
    .lerp(new Color(target), amount)
    .getHexString()}`;
}

export function deriveColourScale(
  colour: string,
  warmth = 0,
): ColourScale {
  const warmHighlight = warmth > 0 ? "#fff0db" : "#f4f7ff";
  const deepTarget = warmth > 0 ? "#26140f" : "#10131a";

  return {
    base: colour,
    highlight: blend(colour, warmHighlight, 0.2),
    shadow: blend(colour, deepTarget, 0.2),
    deepShadow: blend(colour, deepTarget, 0.42),
  };
}

export function deriveSkinScale(colour: string): ColourScale {
  return deriveColourScale(colour, 1);
}
