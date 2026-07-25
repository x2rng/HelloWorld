import { AvatarRenderer } from "@/components/avatar-v3/avatar-renderer";
import type { AvatarConfig } from "@/lib/avatar-config";

type FullBodyAvatarProps = {
  config?: AvatarConfig | null;
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
  return (
    <AvatarRenderer
      config={config}
      className={className}
      size={compact ? "compact" : large ? "large" : "standard"}
      showStage={showStage}
    />
  );
}
