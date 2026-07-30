import { PixelCompanion } from "@/components/avatar/pixel-companion";
import {
  companionGlowOptions,
  companionPatternOptions,
  companionThemeOptions,
} from "@/components/avatar/companion-palettes";
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
  const theme =
    companionThemeOptions.find((item) => item.id === config.colorTheme) ??
    companionThemeOptions[0];
  const glow =
    companionGlowOptions.find((item) => item.id === config.glowColor) ??
    companionGlowOptions[0];
  const marking =
    companionPatternOptions.find((item) => item.id === config.pattern) ??
    companionPatternOptions[0];

  return (
    <div
      className={cx(
        "relative flex flex-col items-center justify-center overflow-hidden border",
        variant === "editor"
          ? "min-h-[17.5rem] rounded-[26px] p-5 sm:min-h-[20rem] sm:p-6 lg:min-h-[34rem] lg:rounded-[32px] lg:p-8"
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
            "h-auto w-[196px] sm:w-[224px] lg:w-[292px]",
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
          {variant === "editor" ? (
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              {[theme.label, `${glow.label} glow`, marking.label].map((label) => (
                <span
                  key={label}
                  className={cx(
                    "rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                    surface === "light"
                      ? "border-slate-300 bg-white/60 text-slate-600"
                      : "border-white/9 bg-white/[0.045] text-white/52",
                  )}
                >
                  {label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
