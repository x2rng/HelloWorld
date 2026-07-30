import { AvatarRenderer } from "@/components/avatar-v3/avatar-renderer";
import { PixelCompanion } from "@/components/avatar/pixel-companion";
import {
  avatarV4ToV3,
  type StoredAvatarConfig,
} from "@/components/avatar-3d/config/avatar-v4-parser";
import { avatarV5ToV3 } from "@/components/avatar-v5-production/config/avatar-v5-parser";
import { getCompanionStage } from "@/lib/avatar/get-companion-stage";
import { isPixelCompanionConfig } from "@/lib/avatar/normalize-companion-config";
import { cx } from "@/lib/utils";

type FullBodyAvatarProps = {
  config?: StoredAvatarConfig | null;
  className?: string;
  compact?: boolean;
  large?: boolean;
  showStage?: boolean;
  level?: number;
};

export function FullBodyAvatar({
  config,
  className,
  compact = false,
  large = false,
  showStage = false,
  level = 1,
}: FullBodyAvatarProps) {
  if (isPixelCompanionConfig(config)) {
    const stage = getCompanionStage(level);
    return (
      <div
        className={cx(
          "flex items-end justify-center",
          compact ? "h-24 w-24" : large ? "h-80 w-80" : "h-64 w-64",
          className,
        )}
      >
        <PixelCompanion
          config={config}
          stage={stage.id}
          size={compact ? 84 : large ? 300 : 240}
        />
      </div>
    );
  }

  const legacyConfig =
    config?.version === 6
      ? avatarV5ToV3(config)
      : config?.version === 4
        ? avatarV4ToV3(config)
        : config;

  return (
    <AvatarRenderer
      config={legacyConfig}
      className={className}
      size={compact ? "compact" : large ? "large" : "standard"}
      showStage={showStage}
    />
  );
}
