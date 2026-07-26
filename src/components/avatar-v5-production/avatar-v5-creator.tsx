"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AvatarWebGLBoundary } from "@/components/avatar-3d/avatar-webgl-boundary";
import { ProceduralAvatarCreator } from "@/components/avatar-3d/procedural-avatar-creator";
import type { AvatarV4Config } from "@/components/avatar-3d/config/avatar-v4-types";
import {
  avatarV5BottomStyles,
  avatarV5ColourVariants,
  avatarV5EyeColours,
  avatarV5FacialHairStyles,
  avatarV5HairColours,
  avatarV5HairStyles,
  avatarV5ShoeStyles,
  avatarV5SkinTones,
  avatarV5TopStyles,
} from "@/components/avatar-v5-production/config/avatar-v5-catalogue";
import { defaultAvatarV5Config } from "@/components/avatar-v5-production/config/avatar-v5-defaults";
import { randomAvatarV5Config } from "@/components/avatar-v5-production/config/avatar-v5-parser";
import type {
  AvatarV5Config,
  AvatarV5Option,
} from "@/components/avatar-v5-production/config/avatar-v5-types";
import { Button } from "@/components/ui/button";
import { cx } from "@/lib/utils";

const AvatarV5Studio = dynamic(
  () => import("@/components/avatar-v5-production/avatar-v5-studio"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[34rem] items-center justify-center rounded-[32px] border border-white/10 bg-[#0b1018]">
        <div className="text-center">
          <div className="mx-auto size-10 animate-pulse rounded-full border border-blue-300/25 bg-blue-400/12" />
          <p className="mt-4 text-sm text-white/48">Preparing the V5 studio…</p>
        </div>
      </div>
    ),
  },
);

const categories = [
  { value: "skin", label: "Skin" },
  { value: "eyes", label: "Eyes" },
  { value: "hair", label: "Hair" },
  { value: "facial-hair", label: "Facial hair" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "shoes", label: "Shoes" },
  { value: "colours", label: "Colours" },
] as const;

type Category = (typeof categories)[number]["value"];

export type AvatarV5CreatorProps = {
  config: AvatarV5Config;
  onChange: (config: AvatarV5Config) => void;
  fallbackConfig: AvatarV4Config;
  onFallbackChange: (config: AvatarV4Config) => void;
  className?: string;
  setupMode?: boolean;
  onAvailabilityChange?: (available: boolean) => void;
};

function StyleOptions<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<AvatarV5Option<T>>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-xs font-semibold uppercase tracking-[0.15em] text-white/42">
        {label}
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {options.map((option, index) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cx(
                "relative min-h-28 rounded-[20px] border p-4 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-blue-300",
                selected
                  ? "border-blue-300/45 bg-blue-400/13 text-white"
                  : "border-white/8 bg-white/[0.028] text-white/58 hover:border-white/18 hover:text-white/84",
              )}
            >
              <span
                className={cx(
                  "mb-3 block h-10 rounded-xl border border-white/8",
                  index % 2 === 0
                    ? "bg-gradient-to-br from-white/16 to-white/[0.025]"
                    : "bg-gradient-to-br from-blue-300/15 to-purple-300/[0.04]",
                )}
              />
              <span className="block text-sm font-semibold">{option.label}</span>
              {option.description ? (
                <span className="mt-1.5 block text-[11px] leading-4 text-white/38">
                  {option.description}
                </span>
              ) : null}
              {selected ? (
                <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-blue-400 text-[10px] font-bold">
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

function Swatches<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ReadonlyArray<AvatarV5Option<T> & { colour: string }>;
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
          const selected = option.value === value;
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
                className="block size-full rounded-full shadow-[inset_-6px_-6px_12px_rgba(0,0,0,0.3),inset_5px_5px_10px_rgba(255,255,255,0.18)]"
                style={{ backgroundColor: option.colour }}
              />
              {selected ? (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-blue-400 text-[10px] font-bold">
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

function FallbackEditor({
  fallbackConfig,
  onFallbackChange,
  retry,
  setupMode,
}: Pick<
  AvatarV5CreatorProps,
  "fallbackConfig" | "onFallbackChange" | "setupMode"
> & { retry?: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[24px] border border-amber-300/18 bg-amber-300/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-amber-100">
            The imported 3D studio is unavailable on this device.
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-100/60">
            The reliable existing creator remains available, so setup is never
            blocked.
          </p>
        </div>
        {retry ? (
          <Button type="button" variant="secondary" onClick={retry}>
            Retry 3D
          </Button>
        ) : null}
      </div>
      <ProceduralAvatarCreator
        config={fallbackConfig}
        onChange={onFallbackChange}
        setupMode={setupMode}
      />
    </div>
  );
}

function CreatorContent({
  config,
  onChange,
  className,
  setupMode,
}: AvatarV5CreatorProps) {
  const [category, setCategory] = useState<Category>("skin");

  function setField<K extends keyof AvatarV5Config>(
    field: K,
    value: AvatarV5Config[K],
  ) {
    onChange({ ...config, [field]: value });
  }

  return (
    <div className={cx("grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_23rem]", className)}>
      <div className="min-w-0 xl:sticky xl:top-5 xl:self-start">
        <AvatarV5Studio
          config={config}
          className={setupMode ? "lg:h-[39rem]" : undefined}
        />
      </div>

      <aside className="min-w-0 rounded-[30px] border border-white/9 bg-[#0d1119] p-4 sm:p-5">
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={category === item.value}
              onClick={() => setCategory(item.value)}
              className={cx(
                "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition",
                category === item.value
                  ? "border-blue-300/35 bg-blue-400/13 text-blue-50"
                  : "border-white/8 bg-white/[0.025] text-white/45 hover:text-white/75",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-5 max-h-[31rem] space-y-7 overflow-y-auto pr-1">
          {category === "skin" ? (
            <Swatches
              label="Skin tone"
              options={avatarV5SkinTones}
              value={config.skinToneId}
              onChange={(value) => setField("skinToneId", value)}
            />
          ) : null}
          {category === "eyes" ? (
            <Swatches
              label="Eye colour"
              options={avatarV5EyeColours}
              value={config.eyeColourId}
              onChange={(value) => setField("eyeColourId", value)}
            />
          ) : null}
          {category === "hair" ? (
            <>
              <StyleOptions
                label="Hairstyle"
                options={avatarV5HairStyles}
                value={config.hairStyleId}
                onChange={(value) => setField("hairStyleId", value)}
              />
              <Swatches
                label="Hair colour"
                options={avatarV5HairColours}
                value={config.hairColourId}
                onChange={(value) => setField("hairColourId", value)}
              />
            </>
          ) : null}
          {category === "facial-hair" ? (
            <StyleOptions
              label="Facial hair"
              options={avatarV5FacialHairStyles}
              value={config.facialHairStyleId}
              onChange={(value) => setField("facialHairStyleId", value)}
            />
          ) : null}
          {category === "tops" ? (
            <StyleOptions
              label="Fitted top"
              options={avatarV5TopStyles}
              value={config.topStyleId}
              onChange={(value) => setField("topStyleId", value)}
            />
          ) : null}
          {category === "bottoms" ? (
            <StyleOptions
              label="Bottoms"
              options={avatarV5BottomStyles}
              value={config.bottomStyleId}
              onChange={(value) => setField("bottomStyleId", value)}
            />
          ) : null}
          {category === "shoes" ? (
            <StyleOptions
              label="Shoes"
              options={avatarV5ShoeStyles}
              value={config.shoeStyleId}
              onChange={(value) => setField("shoeStyleId", value)}
            />
          ) : null}
          {category === "colours" ? (
            <>
              <Swatches
                label="Top palette"
                options={avatarV5ColourVariants}
                value={config.topColourId}
                onChange={(value) => setField("topColourId", value)}
              />
              <Swatches
                label="Bottom palette"
                options={avatarV5ColourVariants}
                value={config.bottomColourId}
                onChange={(value) => setField("bottomColourId", value)}
              />
              <Swatches
                label="Shoe palette"
                options={avatarV5ColourVariants}
                value={config.shoeColourId}
                onChange={(value) => setField("shoeColourId", value)}
              />
              <p className="rounded-2xl border border-white/8 bg-white/[0.025] p-3 text-xs leading-5 text-white/38">
                These palettes use the artist-authored colour textures. Surface
                shading, normal detail, and roughness remain intact.
              </p>
            </>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/8 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onChange(randomAvatarV5Config())}
          >
            Randomize
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onChange({ ...defaultAvatarV5Config })}
          >
            Reset
          </Button>
        </div>
      </aside>
    </div>
  );
}

export function AvatarV5Creator(props: AvatarV5CreatorProps) {
  const { onAvailabilityChange } = props;

  useEffect(() => {
    onAvailabilityChange?.(true);
  }, [onAvailabilityChange]);

  return (
    <AvatarWebGLBoundary
      onFailure={() => onAvailabilityChange?.(false)}
      onRetry={() => onAvailabilityChange?.(true)}
      fallback={(retry) => (
        <FallbackEditor
          fallbackConfig={props.fallbackConfig}
          onFallbackChange={props.onFallbackChange}
          retry={retry}
          setupMode={props.setupMode}
        />
      )}
    >
      <CreatorContent {...props} />
    </AvatarWebGLBoundary>
  );
}
