import { PixelCompanion } from "@/components/avatar/pixel-companion";
import {
  companionFamilyDefinitions,
  type CompanionStage,
  type CompanionState,
  type PixelCompanionConfig,
} from "@/lib/avatar/companion-types";
import { cx } from "@/lib/utils";

type CompanionPreviewProps = {
  config: PixelCompanionConfig;
  state?: CompanionState;
  stage?: CompanionStage;
  size?: number;
  className?: string;
  reducedMotion?: boolean;
  surface?: "dark" | "light";
  showLabels?: boolean;
};

export function CompanionPreview({
  config,
  state = "idle",
  stage = "starter",
  size = 240,
  className,
  reducedMotion = false,
  surface = "dark",
  showLabels = true,
}: CompanionPreviewProps) {
  const family =
    companionFamilyDefinitions.find((item) => item.id === config.family) ??
    companionFamilyDefinitions[0];

  return (
    <div
      className={cx(
        "relative flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-[30px] border p-6",
        surface === "light"
          ? "border-slate-200 bg-[#eef1f4] text-slate-900"
          : "border-white/9 bg-[#090d14] text-white",
        className,
      )}
    >
      <div
        className={cx(
          "absolute inset-x-8 bottom-8 h-12 rounded-[50%] blur-2xl",
          surface === "light" ? "bg-slate-400/15" : "bg-blue-400/10",
        )}
      />
      <PixelCompanion
        config={config}
        state={state}
        stage={stage}
        size={size}
        reducedMotion={reducedMotion}
        className="relative"
      />
      {showLabels ? (
        <div className="relative mt-2 text-center">
          <p className="text-sm font-semibold">{family.label}</p>
          <p
            className={cx(
              "mt-1 text-xs",
              surface === "light" ? "text-slate-500" : "text-white/42",
            )}
          >
            {family.description}
          </p>
        </div>
      ) : null}
    </div>
  );
}
