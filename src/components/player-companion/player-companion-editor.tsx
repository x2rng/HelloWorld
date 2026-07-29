"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  companionBodyTypes,
  companionBottomStyles,
  companionColours,
  companionEyeColours,
  companionEyebrows,
  companionExpressions,
  companionEyeShapes,
  companionHairColours,
  companionHairStyles,
  companionShoeStyles,
  companionSkinTones,
  companionTopStyles,
} from "@/components/player-companion/config/player-companion-catalogue";
import { defaultPlayerCompanionConfig } from "@/components/player-companion/config/player-companion-defaults";
import type {
  CompanionOption,
  CompanionReactionState,
  PlayerCompanionConfig,
} from "@/components/player-companion/config/player-companion-types";
import { Button } from "@/components/ui/button";
import { cx } from "@/lib/utils";

const PlayerCompanionStudio = dynamic(
  () => import("@/components/player-companion/player-companion-studio"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[32rem] items-center justify-center rounded-[34px] border border-white/10 bg-[#0b0d16] sm:h-[38rem] lg:h-[44rem]">
        <div className="text-center">
          <div className="mx-auto size-11 animate-pulse rounded-full border border-indigo-200/20 bg-indigo-300/10" />
          <p className="mt-4 text-sm text-white/45">Waking your companion...</p>
        </div>
      </div>
    ),
  },
);

const categories = [
  { value: "character", label: "Character" },
  { value: "face", label: "Face" },
  { value: "hair", label: "Hair" },
  { value: "outfit", label: "Outfit" },
] as const;

type EditorCategory = (typeof categories)[number]["value"];

function OptionTiles<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<CompanionOption<T>>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
        {label}
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={cx(
                "min-h-20 rounded-[20px] border p-3 text-left transition",
                active
                  ? "border-indigo-300/50 bg-indigo-400/12 shadow-[inset_0_0_0_1px_rgba(165,180,252,0.12)]"
                  : "border-white/8 bg-white/[0.025] hover:border-white/16 hover:bg-white/[0.045]",
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold text-white/82">
                  {option.label}
                </span>
                {active ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-300 text-[10px] font-bold text-indigo-950">
                    ✓
                  </span>
                ) : null}
              </span>
              {option.description ? (
                <span className="mt-1.5 block text-[11px] leading-4 text-white/35">
                  {option.description}
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
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<CompanionOption<T>>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-label={`${label}: ${option.label}`}
            aria-pressed={value === option.value}
            title={option.label}
            onClick={() => onChange(option.value)}
            className={cx(
              "relative size-10 rounded-full border p-1 transition",
              value === option.value
                ? "scale-110 border-white/70 shadow-[0_0_0_3px_rgba(129,140,248,0.2)]"
                : "border-white/14 hover:scale-105 hover:border-white/35",
            )}
          >
            <span
              className="block size-full rounded-full border border-black/15"
              style={{ backgroundColor: option.colour }}
            />
            {value === option.value ? (
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                ✓
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function randomItem<T>(items: ReadonlyArray<T>) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomConfig(): PlayerCompanionConfig {
  return {
    version: 7,
    renderer: "player-companion",
    bodyTypeId: randomItem(companionBodyTypes).value,
    skinToneId: randomItem(companionSkinTones).value,
    eyeShapeId: randomItem(companionEyeShapes).value,
    eyeColourId: randomItem(companionEyeColours).value,
    eyebrowStyleId: randomItem(companionEyebrows).value,
    expressionId: randomItem(companionExpressions).value,
    hairStyleId: randomItem(companionHairStyles).value,
    hairColourId: randomItem(companionHairColours).value,
    topStyleId: randomItem(companionTopStyles).value,
    topColourId: randomItem(companionColours).value,
    bottomStyleId: randomItem(companionBottomStyles).value,
    bottomColourId: randomItem(companionColours).value,
    shoeStyleId: randomItem(companionShoeStyles).value,
    shoeColourId: randomItem(companionColours).value,
  };
}

export function PlayerCompanionEditor({
  config,
  onChange,
  reaction = "idle",
  footerNote = "Development proof only - no profile data is written.",
}: {
  config: PlayerCompanionConfig;
  onChange: (config: PlayerCompanionConfig) => void;
  reaction?: CompanionReactionState;
  footerNote?: string;
}) {
  const [category, setCategory] = useState<EditorCategory>("character");

  function setField<K extends keyof PlayerCompanionConfig>(
    field: K,
    value: PlayerCompanionConfig[K],
  ) {
    onChange({ ...config, [field]: value });
  }

  return (
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="min-w-0 xl:sticky xl:top-5 xl:self-start">
        <PlayerCompanionStudio config={config} reaction={reaction} />
      </div>

      <aside className="min-w-0 rounded-[32px] border border-white/9 bg-[#0c1019] p-4 sm:p-5">
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={category === item.value}
              onClick={() => setCategory(item.value)}
              className={cx(
                "shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition",
                category === item.value
                  ? "border-indigo-300/38 bg-indigo-400/13 text-indigo-50"
                  : "border-white/8 bg-white/[0.025] text-white/45 hover:text-white/75",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-5 max-h-[35rem] space-y-7 overflow-y-auto pr-1">
          {category === "character" ? (
            <>
              <OptionTiles
                label="Body type"
                value={config.bodyTypeId}
                options={companionBodyTypes}
                onChange={(value) => setField("bodyTypeId", value)}
              />
              <Swatches
                label="Skin tone"
                value={config.skinToneId}
                options={companionSkinTones}
                onChange={(value) => setField("skinToneId", value)}
              />
            </>
          ) : null}

          {category === "face" ? (
            <>
              <OptionTiles
                label="Eye shape"
                value={config.eyeShapeId}
                options={companionEyeShapes}
                onChange={(value) => setField("eyeShapeId", value)}
              />
              <Swatches
                label="Eye colour"
                value={config.eyeColourId}
                options={companionEyeColours}
                onChange={(value) => setField("eyeColourId", value)}
              />
              <OptionTiles
                label="Eyebrows"
                value={config.eyebrowStyleId}
                options={companionEyebrows}
                onChange={(value) => setField("eyebrowStyleId", value)}
              />
              <OptionTiles
                label="Expression"
                value={config.expressionId}
                options={companionExpressions}
                onChange={(value) => setField("expressionId", value)}
              />
            </>
          ) : null}

          {category === "hair" ? (
            <>
              <OptionTiles
                label="Hairstyle"
                value={config.hairStyleId}
                options={companionHairStyles}
                onChange={(value) => setField("hairStyleId", value)}
              />
              <Swatches
                label="Hair colour"
                value={config.hairColourId}
                options={companionHairColours}
                onChange={(value) => setField("hairColourId", value)}
              />
            </>
          ) : null}

          {category === "outfit" ? (
            <>
              <OptionTiles
                label="Top"
                value={config.topStyleId}
                options={companionTopStyles}
                onChange={(value) => setField("topStyleId", value)}
              />
              <Swatches
                label="Top colour"
                value={config.topColourId}
                options={companionColours}
                onChange={(value) => setField("topColourId", value)}
              />
              <OptionTiles
                label="Bottoms"
                value={config.bottomStyleId}
                options={companionBottomStyles}
                onChange={(value) => setField("bottomStyleId", value)}
              />
              <Swatches
                label="Bottom colour"
                value={config.bottomColourId}
                options={companionColours}
                onChange={(value) => setField("bottomColourId", value)}
              />
              <OptionTiles
                label="Shoes"
                value={config.shoeStyleId}
                options={companionShoeStyles}
                onChange={(value) => setField("shoeStyleId", value)}
              />
              <Swatches
                label="Shoe colour"
                value={config.shoeColourId}
                options={companionColours}
                onChange={(value) => setField("shoeColourId", value)}
              />
            </>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/8 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onChange(randomConfig())}
          >
            Randomize
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onChange({ ...defaultPlayerCompanionConfig })}
          >
            Reset
          </Button>
        </div>
        <p className="mt-3 text-center text-[10px] leading-4 text-white/28">
          {footerNote}
        </p>
      </aside>
    </div>
  );
}
