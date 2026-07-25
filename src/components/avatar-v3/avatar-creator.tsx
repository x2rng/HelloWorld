"use client";

import { useState } from "react";
import { AvatarRenderer } from "@/components/avatar-v3/avatar-renderer";
import { Button } from "@/components/ui/button";
import {
  avatarOptions,
  defaultAvatarConfig,
  randomAvatarConfig,
  type AvatarConfig,
  type AvatarOption,
} from "@/lib/avatar-config";
import { cx } from "@/lib/utils";

const categories = [
  { value: "body", label: "Body" },
  { value: "face", label: "Face" },
  { value: "eyes", label: "Eyes" },
  { value: "hair", label: "Hair" },
  { value: "clothing", label: "Clothing" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
] as const;

type CreatorCategory = (typeof categories)[number]["value"];

type AvatarCreatorProps = {
  config: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
  className?: string;
  setupMode?: boolean;
};

function OptionPreview({
  group,
  index,
  color,
}: {
  group: CreatorCategory;
  index: number;
  color?: string;
}) {
  if (color) {
    return (
      <span
        className="size-9 rounded-full border border-white/15 shadow-[inset_0_1px_4px_rgba(255,255,255,0.15)]"
        style={{ backgroundColor: color }}
      />
    );
  }

  const shift = index % 4;
  return (
    <svg
      viewBox="0 0 48 48"
      className="size-10 text-white/62"
      fill="none"
      aria-hidden="true"
    >
      {group === "body" ? (
        <>
          <circle cx="24" cy="11" r="7" fill="currentColor" opacity="0.7" />
          <path
            d={`M${13 - shift} 40 Q14 20 24 19 Q34 20 ${35 + shift} 40`}
            fill="currentColor"
            opacity="0.42"
          />
        </>
      ) : null}
      {group === "face" ? (
        <>
          <path
            d={`M12 12 Q24 ${5 + shift} 36 12 V26 Q34 41 24 43 Q14 41 12 26Z`}
            fill="currentColor"
            opacity="0.42"
          />
          <path
            d={`M18 ${18 + shift} Q24 14 30 ${18 + shift}`}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : null}
      {group === "eyes" ? (
        <>
          <path
            d={`M5 24 Q13 ${15 + shift} 21 24 Q13 ${33 - shift} 5 24Z`}
            fill="currentColor"
            opacity="0.58"
          />
          <path
            d={`M27 24 Q35 ${15 + shift} 43 24 Q35 ${33 - shift} 27 24Z`}
            fill="currentColor"
            opacity="0.58"
          />
          <circle cx="13" cy="24" r="3" fill="#0d1119" />
          <circle cx="35" cy="24" r="3" fill="#0d1119" />
        </>
      ) : null}
      {group === "hair" ? (
        <>
          <path
            d={`M8 31 Q7 ${8 + shift} 24 7 Q41 ${8 + shift} 40 31 Q33 21 24 23 Q15 21 8 31Z`}
            fill="currentColor"
            opacity="0.68"
          />
          <path
            d="M13 30 Q24 43 35 30"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.28"
          />
        </>
      ) : null}
      {group === "clothing" ? (
        <path
          d={`M9 39 L${12 + shift} 14 L24 9 L${36 - shift} 14 L39 39 Q24 44 9 39Z`}
          fill="currentColor"
          opacity="0.54"
        />
      ) : null}
      {group === "shoes" ? (
        <>
          <path
            d={`M4 ${29 - shift} H21 V38 Q12 42 4 38Z`}
            fill="currentColor"
            opacity="0.58"
          />
          <path
            d={`M27 ${29 - shift} H44 V38 Q36 42 27 38Z`}
            fill="currentColor"
            opacity="0.58"
          />
        </>
      ) : null}
      {group === "accessories" ? (
        <>
          <circle
            cx="15"
            cy="23"
            r={8 + shift}
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <circle
            cx="33"
            cy="23"
            r={8 + shift}
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path d="M23 23 H25" stroke="currentColor" strokeWidth="2.5" />
        </>
      ) : null}
    </svg>
  );
}

function StyleOptions<T extends string>({
  label,
  options,
  value,
  onChange,
  group,
}: {
  label: string;
  options: readonly AvatarOption<T>[];
  value: T;
  onChange: (value: T) => void;
  group: CreatorCategory;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-white/42">
        {label}
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option, index) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cx(
                "relative flex min-h-24 flex-col items-center justify-center gap-2 rounded-[20px] border px-2 py-3 text-center text-xs font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-blue-300",
                selected
                  ? "border-blue-300/45 bg-blue-400/13 text-white shadow-[0_10px_35px_rgba(59,130,246,0.1)]"
                  : "border-white/8 bg-white/[0.028] text-white/52 hover:border-white/18 hover:bg-white/[0.05] hover:text-white/80",
              )}
            >
              <OptionPreview group={group} index={index} />
              <span>{option.label}</span>
              {selected ? (
                <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-blue-400 text-[10px] font-bold text-white">
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ColorOptions<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly AvatarOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-white/42">
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-label={`${label}: ${option.label}`}
              aria-pressed={selected}
              title={option.label}
              onClick={() => onChange(option.value)}
              className={cx(
                "relative flex size-12 items-center justify-center rounded-full border outline-none transition focus-visible:ring-2 focus-visible:ring-blue-300",
                selected
                  ? "scale-105 border-white/70 bg-white/10"
                  : "border-white/10 hover:scale-105 hover:border-white/30",
              )}
            >
              <OptionPreview group="body" index={0} color={option.value} />
              {selected ? (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-blue-400 text-[10px] font-bold text-white">
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function AvatarCreator({
  config,
  onChange,
  className,
  setupMode = false,
}: AvatarCreatorProps) {
  const [category, setCategory] = useState<CreatorCategory>("body");
  const [previousConfig, setPreviousConfig] = useState<AvatarConfig | null>(
    null,
  );

  function apply(next: AvatarConfig) {
    setPreviousConfig(config);
    onChange(next);
  }

  function setField<K extends keyof AvatarConfig>(
    field: K,
    value: AvatarConfig[K],
  ) {
    apply({ ...config, [field]: value });
  }

  return (
    <div
      className={cx(
        "grid gap-5 lg:grid-cols-[minmax(20rem,0.88fr)_minmax(28rem,1.12fr)]",
        className,
      )}
    >
      <section className="lg:sticky lg:top-6 lg:self-start">
        <div className="relative flex min-h-[31rem] items-end justify-center overflow-hidden rounded-[36px] border border-white/9 bg-gradient-to-br from-blue-500/10 via-white/[0.035] to-purple-500/8 px-6 pt-20">
          <div className="absolute left-6 top-6 z-10">
            <p className="eyebrow">Live player preview</p>
            <p className="mt-2 text-sm text-white/45">
              Every choice updates instantly.
            </p>
          </div>
          <div className="absolute bottom-12 size-72 rounded-full bg-blue-400/13 blur-3xl" />
          <AvatarRenderer
            config={config}
            size="large"
            showStage
            className={cx(
              "relative translate-y-3",
              !setupMode && "max-h-[32rem]",
            )}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => apply(randomAvatarConfig())}
          >
            Randomize
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => apply({ ...defaultAvatarConfig })}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={!previousConfig}
            onClick={() => {
              if (!previousConfig) return;
              const current = config;
              onChange(previousConfig);
              setPreviousConfig(current);
            }}
          >
            Undo
          </Button>
        </div>
      </section>

      <section className="min-w-0 rounded-[36px] border border-white/9 bg-[#0d1119]">
        <div className="overflow-x-auto border-b border-white/8 p-2 sm:p-3">
          <div
            role="tablist"
            aria-label="Avatar customization categories"
            className="flex min-w-max gap-1"
          >
            {categories.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={category === item.value}
                onClick={() => setCategory(item.value)}
                className={cx(
                  "rounded-full px-4 py-2.5 text-xs font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-blue-300",
                  category === item.value
                    ? "bg-white text-slate-950"
                    : "text-white/45 hover:bg-white/[0.055] hover:text-white/80",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div
          role="tabpanel"
          className="max-h-none space-y-8 p-5 sm:p-7 lg:max-h-[47rem] lg:overflow-y-auto"
        >
          {category === "body" ? (
            <>
              <StyleOptions
                label="Body preset"
                options={avatarOptions.bodyPresets}
                value={config.bodyPreset}
                onChange={(value) => setField("bodyPreset", value)}
                group="body"
              />
              <ColorOptions
                label="Skin tone"
                options={avatarOptions.skinTones}
                value={config.skinTone}
                onChange={(value) => setField("skinTone", value)}
              />
            </>
          ) : null}

          {category === "face" ? (
            <>
              <StyleOptions
                label="Face shape"
                options={avatarOptions.faceShapes}
                value={config.faceShape}
                onChange={(value) => setField("faceShape", value)}
                group="face"
              />
              <StyleOptions
                label="Ears"
                options={avatarOptions.earStyles}
                value={config.earStyle}
                onChange={(value) => setField("earStyle", value)}
                group="face"
              />
              <StyleOptions
                label="Eyebrows"
                options={avatarOptions.eyebrowStyles}
                value={config.eyebrowStyle}
                onChange={(value) => setField("eyebrowStyle", value)}
                group="face"
              />
              <ColorOptions
                label="Eyebrow color"
                options={avatarOptions.eyebrowColors}
                value={config.eyebrowColor}
                onChange={(value) => setField("eyebrowColor", value)}
              />
              <StyleOptions
                label="Nose"
                options={avatarOptions.noseStyles}
                value={config.noseStyle}
                onChange={(value) => setField("noseStyle", value)}
                group="face"
              />
              <StyleOptions
                label="Mouth"
                options={avatarOptions.mouthStyles}
                value={config.mouthStyle}
                onChange={(value) => setField("mouthStyle", value)}
                group="face"
              />
            </>
          ) : null}

          {category === "eyes" ? (
            <>
              <StyleOptions
                label="Eye shape"
                options={avatarOptions.eyeShapes}
                value={config.eyeShape}
                onChange={(value) => setField("eyeShape", value)}
                group="eyes"
              />
              <ColorOptions
                label="Eye color"
                options={avatarOptions.eyeColors}
                value={config.eyeColor}
                onChange={(value) => setField("eyeColor", value)}
              />
              <StyleOptions
                label="Glasses"
                options={avatarOptions.glassesStyles}
                value={config.glassesStyle}
                onChange={(value) => setField("glassesStyle", value)}
                group="accessories"
              />
            </>
          ) : null}

          {category === "hair" ? (
            <>
              <StyleOptions
                label="Hairstyle"
                options={avatarOptions.hairStyles}
                value={config.hairStyle}
                onChange={(value) => setField("hairStyle", value)}
                group="hair"
              />
              <ColorOptions
                label="Hair color"
                options={avatarOptions.hairColors}
                value={config.hairColor}
                onChange={(value) => setField("hairColor", value)}
              />
              <StyleOptions
                label="Facial hair"
                options={avatarOptions.facialHairStyles}
                value={config.facialHairStyle}
                onChange={(value) => setField("facialHairStyle", value)}
                group="hair"
              />
              <ColorOptions
                label="Facial hair color"
                options={avatarOptions.facialHairColors}
                value={config.facialHairColor}
                onChange={(value) => setField("facialHairColor", value)}
              />
            </>
          ) : null}

          {category === "clothing" ? (
            <>
              <StyleOptions
                label="Top"
                options={avatarOptions.topStyles}
                value={config.topStyle}
                onChange={(value) => setField("topStyle", value)}
                group="clothing"
              />
              <ColorOptions
                label="Top color"
                options={avatarOptions.topColors}
                value={config.topColor}
                onChange={(value) => setField("topColor", value)}
              />
              <StyleOptions
                label="Outerwear"
                options={avatarOptions.outerwearStyles}
                value={config.outerwearStyle}
                onChange={(value) => setField("outerwearStyle", value)}
                group="clothing"
              />
              <ColorOptions
                label="Outerwear color"
                options={avatarOptions.outerwearColors}
                value={config.outerwearColor}
                onChange={(value) => setField("outerwearColor", value)}
              />
              <StyleOptions
                label="Bottoms"
                options={avatarOptions.bottomStyles}
                value={config.bottomStyle}
                onChange={(value) => setField("bottomStyle", value)}
                group="clothing"
              />
              <ColorOptions
                label="Bottom color"
                options={avatarOptions.bottomColors}
                value={config.bottomColor}
                onChange={(value) => setField("bottomColor", value)}
              />
            </>
          ) : null}

          {category === "shoes" ? (
            <>
              <StyleOptions
                label="Shoe style"
                options={avatarOptions.shoeStyles}
                value={config.shoeStyle}
                onChange={(value) => setField("shoeStyle", value)}
                group="shoes"
              />
              <ColorOptions
                label="Shoe color"
                options={avatarOptions.shoeColors}
                value={config.shoeColor}
                onChange={(value) => setField("shoeColor", value)}
              />
            </>
          ) : null}

          {category === "accessories" ? (
            <>
              <StyleOptions
                label="Accessory"
                options={avatarOptions.accessoryStyles}
                value={config.accessoryStyle}
                onChange={(value) => setField("accessoryStyle", value)}
                group="accessories"
              />
              <StyleOptions
                label="Preview background"
                options={avatarOptions.backgroundPreferences}
                value={config.backgroundPreference}
                onChange={(value) => setField("backgroundPreference", value)}
                group="accessories"
              />
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
