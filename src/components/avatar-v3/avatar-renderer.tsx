import {
  AccessoryLayer,
  GlassesLayer,
  OuterwearLayer,
  TopLayer,
} from "@/components/avatar-v3/layers/clothing-accessory-layers";
import {
  BodyBaseLayer,
  BottomLayer,
  ShoeLayer,
} from "@/components/avatar-v3/layers/body-layers";
import {
  FaceBaseLayer,
  FaceFeatureLayer,
} from "@/components/avatar-v3/layers/face-layers";
import {
  FacialHairLayer,
  HairBackLayer,
  HairFrontLayer,
} from "@/components/avatar-v3/layers/hair-layers";
import {
  defaultAvatarConfig,
  normalizeAvatarConfig,
  type AvatarConfig,
} from "@/lib/avatar-config";
import { cx } from "@/lib/utils";

export type AvatarRendererProps = {
  config?: AvatarConfig | null;
  className?: string;
  size?: "compact" | "standard" | "large";
  showStage?: boolean;
};

const stageColors: Record<
  AvatarConfig["backgroundPreference"],
  { glow: string; ground: string }
> = {
  studio: { glow: "#7183a4", ground: "#303743" },
  blue: { glow: "#4677d7", ground: "#29426d" },
  warm: { glow: "#be7b55", ground: "#684c3f" },
  forest: { glow: "#4b826a", ground: "#304c41" },
};

export function AvatarRenderer({
  config = defaultAvatarConfig,
  className,
  size = "standard",
  showStage = false,
}: AvatarRendererProps) {
  const avatar = normalizeAvatarConfig(config);
  const stage = stageColors[avatar.backgroundPreference];

  return (
    <svg
      viewBox="0 0 300 520"
      className={cx(
        size === "compact" && "h-40 w-24",
        size === "standard" && "h-80 w-48 sm:h-[22rem] sm:w-56",
        size === "large" && "h-[28rem] w-64 sm:h-[34rem] sm:w-80",
        className,
      )}
      role="img"
      aria-label="EXP player avatar"
    >
      {showStage ? (
        <>
          <ellipse
            cx="150"
            cy="290"
            rx="126"
            ry="202"
            fill={stage.glow}
            opacity="0.08"
          />
          <ellipse
            cx="150"
            cy="497"
            rx="92"
            ry="15"
            fill={stage.ground}
            opacity="0.32"
          />
        </>
      ) : (
        <ellipse
          cx="150"
          cy="498"
          rx="82"
          ry="12"
          fill="#111827"
          opacity="0.13"
        />
      )}

      <HairBackLayer config={avatar} />
      <BodyBaseLayer config={avatar} />
      <BottomLayer config={avatar} />
      <ShoeLayer config={avatar} />
      <TopLayer config={avatar} />
      <OuterwearLayer config={avatar} />
      <FaceBaseLayer config={avatar} />
      <FaceFeatureLayer config={avatar} />
      <FacialHairLayer config={avatar} />
      <HairFrontLayer config={avatar} />
      <GlassesLayer config={avatar} />
      <AccessoryLayer config={avatar} />
    </svg>
  );
}
