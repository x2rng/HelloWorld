import type { AvatarConfig } from "@/lib/avatar-config";

export type AvatarGeometry = {
  shoulderLeft: number;
  shoulderRight: number;
  waistLeft: number;
  waistRight: number;
  hipLeft: number;
  hipRight: number;
  armWidth: number;
  legWidth: number;
};

export function getAvatarGeometry(
  bodyPreset: AvatarConfig["bodyPreset"],
): AvatarGeometry {
  if (bodyPreset === "lean") {
    return {
      shoulderLeft: 101,
      shoulderRight: 199,
      waistLeft: 116,
      waistRight: 184,
      hipLeft: 105,
      hipRight: 195,
      armWidth: 18,
      legWidth: 35,
    };
  }

  if (bodyPreset === "strong") {
    return {
      shoulderLeft: 83,
      shoulderRight: 217,
      waistLeft: 108,
      waistRight: 192,
      hipLeft: 98,
      hipRight: 202,
      armWidth: 25,
      legWidth: 42,
    };
  }

  if (bodyPreset === "soft") {
    return {
      shoulderLeft: 91,
      shoulderRight: 209,
      waistLeft: 104,
      waistRight: 196,
      hipLeft: 94,
      hipRight: 206,
      armWidth: 23,
      legWidth: 43,
    };
  }

  return {
    shoulderLeft: 92,
    shoulderRight: 208,
    waistLeft: 111,
    waistRight: 189,
    hipLeft: 101,
    hipRight: 199,
    armWidth: 21,
    legWidth: 39,
  };
}
