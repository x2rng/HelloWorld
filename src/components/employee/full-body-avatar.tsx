import { AvatarRenderer } from "@/components/avatar-v3/avatar-renderer";
import {
  avatarV4ToV3,
  type StoredAvatarConfig,
} from "@/components/avatar-3d/config/avatar-v4-parser";
import { avatarV5ToV3 } from "@/components/avatar-v5-production/config/avatar-v5-parser";

type FullBodyAvatarProps = {
  config?: StoredAvatarConfig | null;
  className?: string;
  compact?: boolean;
  large?: boolean;
  showStage?: boolean;
};

export function FullBodyAvatar({
  config,
  className,
  compact = false,
  large = false,
  showStage = false,
}: FullBodyAvatarProps) {
  const legacyConfig =
    config?.version === 5
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
