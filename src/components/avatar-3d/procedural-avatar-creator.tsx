"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AvatarCreator as AvatarV3Creator } from "@/components/avatar-v3/avatar-creator";
import { AvatarWebGLBoundary } from "@/components/avatar-3d/avatar-webgl-boundary";
import { avatarV4Catalogue } from "@/components/avatar-3d/config/avatar-v4-catalogue";
import { defaultAvatarV4Config } from "@/components/avatar-3d/config/avatar-v4-defaults";
import {
  avatarV4ToV3,
  randomAvatarV4Config,
  upgradeAvatarV3ToV4,
} from "@/components/avatar-3d/config/avatar-v4-parser";
import type {
  AccessoryId,
  AvatarOption,
  AvatarV4Config,
  TopStyleId,
} from "@/components/avatar-3d/config/avatar-v4-types";
import { Button } from "@/components/ui/button";
import { cx } from "@/lib/utils";

const AvatarStudio = dynamic(() => import("@/components/avatar-3d/avatar-studio"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[34rem] items-center justify-center rounded-[32px] border border-white/10 bg-[#0a0e15]">
      <div className="text-center">
        <div className="mx-auto size-10 animate-pulse rounded-full border border-blue-300/25 bg-blue-400/12" />
        <p className="mt-4 text-sm text-white/48">Preparing the 3D studio…</p>
      </div>
    </div>
  ),
});

const categories = [
  { value: "face", label: "Face" },
  { value: "hair", label: "Hair" },
  { value: "tops", label: "Tops" },
  { value: "outerwear", label: "Outerwear" },
  { value: "bottoms", label: "Bottoms" },
  { value: "shoes", label: "Shoes" },
  { value: "accessories", label: "Accessories" },
  { value: "colours", label: "Colours" },
] as const;

type CreatorCategory = (typeof categories)[number]["value"];

type ProceduralAvatarCreatorProps = {
  config: AvatarV4Config;
  onChange: (config: AvatarV4Config) => void;
  className?: string;
  setupMode?: boolean;
};

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
        canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    return false;
  }
}

function OptionGlyph({
  group,
  index,
}: {
  group: CreatorCategory;
  index: number;
}) {
  const tilt = (index % 3) - 1;
  return (
    <span className="relative flex h-12 w-14 items-center justify-center overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-white/8 to-white/[0.015]">
      {group === "face" || group === "hair" ? (
        <>
          <span
            className="absolute size-8 rounded-[48%_48%_44%_44%] bg-amber-200/40"
            style={{ transform: `scaleX(${0.86 + (index % 4) * 0.07})` }}
          />
          {group === "hair" ? (
            <span
              className="absolute top-1.5 h-5 w-9 rounded-t-full bg-white/55"
              style={{ transform: `rotate(${tilt * 6}deg)` }}
            />
          ) : null}
        </>
      ) : null}
      {group === "tops" || group === "outerwear" ? (
        <span
          className="h-9 rounded-[42%_42%_18%_18%] bg-white/48"
          style={{ width: `${30 + (index % 4) * 4}px` }}
        />
      ) : null}
      {group === "bottoms" ? (
        <span
          className="h-9 w-7 rounded-t-lg border-x-[7px] border-white/45"
          style={{ transform: `skewX(${tilt * 2}deg)` }}
        />
      ) : null}
      {group === "shoes" ? (
        <span
          className="h-4 w-10 rounded-[55%_70%_30%_35%] bg-white/50"
          style={{ transform: `scaleX(${0.9 + index * 0.04})` }}
        />
      ) : null}
      {group === "accessories" ? (
        <span className="size-8 rounded-full border-2 border-white/48" />
      ) : null}
    </span>
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
  options: ReadonlyArray<AvatarOption<T>>;
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
              <OptionGlyph group={group} index={index} />
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

function ColourOptions({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
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
              title={option.label}
              aria-label={`${label}: ${option.label}`}
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cx(
                "relative size-12 rounded-full border p-1 outline-none transition focus-visible:ring-2 focus-visible:ring-blue-300",
                selected
                  ? "scale-105 border-white/75 bg-white/10"
                  : "border-white/12 hover:scale-105 hover:border-white/35",
              )}
            >
              <span
                className="block size-full rounded-full shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.24),inset_5px_5px_10px_rgba(255,255,255,0.2)]"
                style={{ backgroundColor: option.value }}
              />
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

function V3FallbackEditor({
  config,
  onChange,
  retry,
  setupMode,
}: ProceduralAvatarCreatorProps & { retry?: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[24px] border border-amber-300/18 bg-amber-300/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-amber-100">
            The 3D studio is unavailable on this device.
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-100/60">
            You can still complete your player with the reliable 2D creator.
          </p>
        </div>
        {retry ? (
          <Button type="button" variant="secondary" onClick={retry}>
            Retry 3D
          </Button>
        ) : null}
      </div>
      <AvatarV3Creator
        config={avatarV4ToV3(config)}
        onChange={(next) => onChange(upgradeAvatarV3ToV4(next))}
        setupMode={setupMode}
      />
    </div>
  );
}

function CreatorContent({
  config,
  onChange,
  className,
}: ProceduralAvatarCreatorProps) {
  const [category, setCategory] = useState<CreatorCategory>("face");
  const [previousConfig, setPreviousConfig] =
    useState<AvatarV4Config | null>(null);

  function apply(next: AvatarV4Config) {
    setPreviousConfig(config);
    onChange(next);
  }

  function setField<K extends keyof AvatarV4Config>(
    field: K,
    value: AvatarV4Config[K],
  ) {
    const next = { ...config, [field]: value };
    if (
      field === "topStyleId" &&
      (value === "blazer" || value === "bomber-jacket")
    ) {
      next.outerwearStyleId = "none";
    }
    apply(next);
  }

  function toggleAccessory(accessory: AccessoryId) {
    const current = config.accessoryIds;
    const exists = current.includes(accessory);
    let next = exists
      ? current.filter((item) => item !== accessory)
      : [...current, accessory];
    if (accessory === "cap" || accessory === "beanie") {
      next = next.filter(
        (item) =>
          item === accessory || (item !== "cap" && item !== "beanie"),
      );
    }
    apply({ ...config, accessoryIds: next.slice(0, 4) });
  }

  return (
    <div
      className={cx(
        "grid gap-5 lg:grid-cols-[minmax(20rem,1fr)_minmax(27rem,0.95fr)]",
        className,
      )}
    >
      <section className="min-w-0 lg:sticky lg:top-6 lg:self-start">
        <AvatarStudio
          config={config}
          fallback={
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-white/50">
              WebGL could not start. Use the 2D fallback controls.
            </div>
          }
        />
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => apply(randomAvatarV4Config())}
          >
            Randomise
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              apply({ ...defaultAvatarV4Config, accessoryIds: [] })
            }
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

      <section className="min-w-0 rounded-[32px] border border-white/9 bg-[#0d1119]">
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
          className="space-y-8 p-5 sm:p-7 lg:max-h-[43rem] lg:overflow-y-auto"
        >
          {category === "face" ? (
            <>
              <StyleOptions
                label="Face"
                options={avatarV4Catalogue.facePresets}
                value={config.facePresetId}
                onChange={(value) => setField("facePresetId", value)}
                group="face"
              />
              <StyleOptions
                label="Jaw and cheeks"
                options={avatarV4Catalogue.jawPresets}
                value={config.jawPresetId}
                onChange={(value) => setField("jawPresetId", value)}
                group="face"
              />
              <StyleOptions
                label="Eyes"
                options={avatarV4Catalogue.eyeShapes}
                value={config.eyeShapeId}
                onChange={(value) => setField("eyeShapeId", value)}
                group="face"
              />
              <StyleOptions
                label="Eyebrows"
                options={avatarV4Catalogue.eyebrowStyles}
                value={config.eyebrowStyleId}
                onChange={(value) => setField("eyebrowStyleId", value)}
                group="face"
              />
              <StyleOptions
                label="Nose"
                options={avatarV4Catalogue.nosePresets}
                value={config.nosePresetId}
                onChange={(value) => setField("nosePresetId", value)}
                group="face"
              />
              <StyleOptions
                label="Mouth"
                options={avatarV4Catalogue.mouthPresets}
                value={config.mouthPresetId}
                onChange={(value) => setField("mouthPresetId", value)}
                group="face"
              />
              <StyleOptions
                label="Ears"
                options={avatarV4Catalogue.earPresets}
                value={config.earPresetId}
                onChange={(value) => setField("earPresetId", value)}
                group="face"
              />
              <StyleOptions
                label="Expression"
                options={avatarV4Catalogue.expressions}
                value={config.expressionId}
                onChange={(value) => setField("expressionId", value)}
                group="face"
              />
            </>
          ) : null}

          {category === "hair" ? (
            <>
              <StyleOptions
                label="Hairstyle"
                options={avatarV4Catalogue.hairStyles}
                value={config.hairStyleId}
                onChange={(value) => setField("hairStyleId", value)}
                group="hair"
              />
              <StyleOptions
                label="Facial hair"
                options={avatarV4Catalogue.facialHairStyles}
                value={config.facialHairStyleId}
                onChange={(value) => setField("facialHairStyleId", value)}
                group="hair"
              />
            </>
          ) : null}

          {category === "tops" ? (
            <StyleOptions<TopStyleId>
              label="Top"
              options={avatarV4Catalogue.topStyles}
              value={config.topStyleId}
              onChange={(value) => setField("topStyleId", value)}
              group="tops"
            />
          ) : null}

          {category === "outerwear" ? (
            <>
              <StyleOptions
                label="Outerwear"
                options={avatarV4Catalogue.outerwearStyles}
                value={config.outerwearStyleId}
                onChange={(value) => setField("outerwearStyleId", value)}
                group="outerwear"
              />
              {(config.topStyleId === "blazer" ||
                config.topStyleId === "bomber-jacket") && (
                <p className="rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3 text-xs leading-5 text-white/48">
                  This top already includes a structured outer layer, so extra
                  outerwear is hidden to keep the fit clean.
                </p>
              )}
            </>
          ) : null}

          {category === "bottoms" ? (
            <StyleOptions
              label="Bottoms"
              options={avatarV4Catalogue.bottomStyles}
              value={config.bottomStyleId}
              onChange={(value) => setField("bottomStyleId", value)}
              group="bottoms"
            />
          ) : null}

          {category === "shoes" ? (
            <StyleOptions
              label="Shoes"
              options={avatarV4Catalogue.shoeStyles}
              value={config.shoeStyleId}
              onChange={(value) => setField("shoeStyleId", value)}
              group="shoes"
            />
          ) : null}

          {category === "accessories" ? (
            <>
              <StyleOptions
                label="Glasses"
                options={avatarV4Catalogue.glassesStyles}
                value={config.glassesStyleId}
                onChange={(value) => setField("glassesStyleId", value)}
                group="accessories"
              />
              <fieldset>
                <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-white/42">
                  Accessories
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {avatarV4Catalogue.accessories.map((option, index) => {
                    const selected = config.accessoryIds.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleAccessory(option.value)}
                        className={cx(
                          "relative flex min-h-24 flex-col items-center justify-center gap-2 rounded-[20px] border px-2 py-3 text-xs font-medium transition",
                          selected
                            ? "border-blue-300/45 bg-blue-400/13 text-white"
                            : "border-white/8 bg-white/[0.028] text-white/52 hover:border-white/18",
                        )}
                      >
                        <OptionGlyph group="accessories" index={index} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            </>
          ) : null}

          {category === "colours" ? (
            <>
              <ColourOptions
                label="Skin tone"
                options={avatarV4Catalogue.skinTones}
                value={config.skinTone}
                onChange={(value) => setField("skinTone", value)}
              />
              <ColourOptions
                label="Eye colour"
                options={avatarV4Catalogue.eyeColours}
                value={config.eyeColour}
                onChange={(value) => setField("eyeColour", value)}
              />
              <ColourOptions
                label="Hair colour"
                options={avatarV4Catalogue.hairColours}
                value={config.hairColour}
                onChange={(value) => {
                  apply({
                    ...config,
                    hairColour: value,
                    facialHairColour: value,
                  });
                }}
              />
              <ColourOptions
                label="Top colour"
                options={avatarV4Catalogue.clothingColours}
                value={config.topColour}
                onChange={(value) => setField("topColour", value)}
              />
              <ColourOptions
                label="Outerwear colour"
                options={avatarV4Catalogue.clothingColours}
                value={config.outerwearColour}
                onChange={(value) => setField("outerwearColour", value)}
              />
              <ColourOptions
                label="Bottom colour"
                options={avatarV4Catalogue.bottomColours}
                value={config.bottomColour}
                onChange={(value) => setField("bottomColour", value)}
              />
              <ColourOptions
                label="Shoe colour"
                options={avatarV4Catalogue.shoeColours}
                value={config.shoeColour}
                onChange={(value) => setField("shoeColour", value)}
              />
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export function ProceduralAvatarCreator(props: ProceduralAvatarCreatorProps) {
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() =>
      setWebglAvailable(canUseWebGL()),
    );
    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (webglAvailable === false) return <V3FallbackEditor {...props} />;
  if (webglAvailable === null) {
    return (
      <div className="flex min-h-[28rem] items-center justify-center rounded-[32px] border border-white/9 bg-[#0d1119]">
        <p className="text-sm text-white/45">Checking 3D support…</p>
      </div>
    );
  }

  return (
    <AvatarWebGLBoundary
      fallback={(retry) => (
        <V3FallbackEditor {...props} retry={retry} />
      )}
    >
      <CreatorContent {...props} />
    </AvatarWebGLBoundary>
  );
}
