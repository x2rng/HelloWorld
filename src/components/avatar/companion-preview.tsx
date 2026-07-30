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
  variant?: "default" | "editor";
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
  variant = "default",
}: CompanionPreviewProps) {
  const family =
    companionFamilyDefinitions.find((item) => item.id === config.family) ??
    companionFamilyDefinitions[0];

  return (
    <div
      className={cx(
        "relative flex flex-col items-center justify-center overflow-hidden border",
        variant === "editor"
          ? "min-h-[13.5rem] rounded-[26px] p-4 sm:min-h-[16rem] sm:p-5 lg:min-h-[34rem] lg:rounded-[32px] lg:p-8"
          : "min-h-72 rounded-[30px] p-6",
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
        className={cx(
          "relative",
          variant === "editor" &&
            "h-auto w-[168px] sm:w-[196px] lg:w-[292px]",
        )}
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
