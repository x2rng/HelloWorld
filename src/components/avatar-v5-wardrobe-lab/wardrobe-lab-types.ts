export type WardrobeLabStatus =
  | "approved"
  | "needs-adjustment"
  | "rejected"
  | "incompatible";

export type WardrobeLabTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
};

export type WardrobeLabHairCandidate = {
  id: string;
  label: string;
  source: string;
  asset: string;
  status: WardrobeLabStatus;
  reason: string;
  transform: WardrobeLabTransform;
};

export type WardrobeLabWardrobeCandidate = {
  id: string;
  label: string;
  family: "women" | "men";
  source: string;
  asset: string;
  status: WardrobeLabStatus;
  reason: string;
  outputBytes: number;
  sourceFile: string;
  sourceBytes: number;
  skeleton: {
    jointCount: number;
    exactApprovedBoneMatches: number;
    approvedBonesCompared: number;
    compatible: boolean;
    note: string;
  };
  meshNodes: string[];
  materials: string[];
  animationCount: number;
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
    size: [number, number, number];
  };
};

export type WardrobeLabSelection =
  | { kind: "hair"; candidate: WardrobeLabHairCandidate }
  | { kind: "accessory"; candidate: WardrobeLabHairCandidate }
  | { kind: "wardrobe"; candidate: WardrobeLabWardrobeCandidate };

export type WardrobeLabAppearance = {
  skinColour: string;
  hairColour: string;
  eyeAsset: string;
  outfitTexture: string;
};
