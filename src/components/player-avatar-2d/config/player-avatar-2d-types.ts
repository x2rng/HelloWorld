export type PlayerAvatar2DPose = "front" | "three-quarter" | "side";

export type PlayerAvatar2DState =
  | "idle"
  | "happy"
  | "focused"
  | "achievement";

export type PlayerAvatar2DPalette = {
  skin: string;
  skinShadow: string;
  skinLight: string;
  hair: string;
  hairShadow: string;
  hairLight: string;
  eye: string;
  eyeDeep: string;
  overshirt: string;
  overshirtShadow: string;
  undershirt: string;
  trousers: string;
  trousersShadow: string;
  shoes: string;
  shoeAccent: string;
  outline: string;
};

export type PlayerAvatar2DProofConfig = {
  pose: PlayerAvatar2DPose;
  palette: PlayerAvatar2DPalette;
};
