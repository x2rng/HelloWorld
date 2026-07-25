import type { AvatarMaterialSet } from "@/components/avatar-3d/materials/avatar-materials";
import type {
  AvatarQualityTier,
  AvatarV4Config,
} from "@/components/avatar-3d/config/avatar-v4-types";

export type AvatarPartProps = {
  config: AvatarV4Config;
  materials: AvatarMaterialSet;
  quality: AvatarQualityTier;
  reducedMotion?: boolean;
};
