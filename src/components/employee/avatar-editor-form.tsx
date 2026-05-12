"use client";

import { useActionState, useState } from "react";
import {
  saveAvatarConfig,
  type SaveAvatarState,
} from "@/app/employee/avatar/actions";
import { FullBodyAvatar } from "@/components/employee/full-body-avatar";
import { Button } from "@/components/ui/button";
import { avatarOptions, type AvatarConfig } from "@/lib/avatar-config";
import { cx } from "@/lib/utils";

const initialState: SaveAvatarState = {
  ok: false,
  message: "",
};

type AvatarEditorFormProps = {
  initialConfig: AvatarConfig;
};

function ColorOptions({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: keyof AvatarConfig;
  options: ReadonlyArray<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cx(
              "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm",
              value === option.value ? "border-black bg-white" : "border-black/8 bg-white/60",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span
              className="h-5 w-5 rounded-full border border-black/10"
              style={{ backgroundColor: option.value }}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export function AvatarEditorForm({ initialConfig }: AvatarEditorFormProps) {
  const [state, formAction, isPending] = useActionState(saveAvatarConfig, initialState);
  const [config, setConfig] = useState<AvatarConfig>(initialConfig);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-[32px] border border-black/6 bg-white/70 p-6">
        <p className="eyebrow">Live preview</p>
        <div className="mt-5 flex justify-center rounded-[28px] bg-gradient-to-br from-zinc-50 to-zinc-200 py-8">
          <FullBodyAvatar config={config} />
        </div>
      </div>

      <form action={formAction} className="space-y-6 rounded-[32px] border border-black/6 bg-white/70 p-6">
        <ColorOptions
          label="Skin tone"
          name="skinTone"
          options={avatarOptions.skinTones}
          value={config.skinTone}
          onChange={(skinTone) => setConfig((current) => ({ ...current, skinTone }))}
        />

        <div>
          <p className="text-sm font-medium">Hair style</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {avatarOptions.hairStyles.map((option) => (
              <label
                key={option.value}
                className={cx(
                  "cursor-pointer rounded-full border px-3 py-2 text-sm",
                  config.hairStyle === option.value ? "border-black bg-white" : "border-black/8 bg-white/60",
                )}
              >
                <input
                  type="radio"
                  name="hairStyle"
                  value={option.value}
                  checked={config.hairStyle === option.value}
                  onChange={() => setConfig((current) => ({ ...current, hairStyle: option.value }))}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <ColorOptions
          label="Hair color"
          name="hairColor"
          options={avatarOptions.hairColors}
          value={config.hairColor}
          onChange={(hairColor) => setConfig((current) => ({ ...current, hairColor }))}
        />

        <ColorOptions
          label="Top color"
          name="topColor"
          options={avatarOptions.topColors}
          value={config.topColor}
          onChange={(topColor) => setConfig((current) => ({ ...current, topColor }))}
        />

        <ColorOptions
          label="Bottom color"
          name="bottomColor"
          options={avatarOptions.bottomColors}
          value={config.bottomColor}
          onChange={(bottomColor) => setConfig((current) => ({ ...current, bottomColor }))}
        />

        <label className="flex items-center justify-between rounded-2xl border border-black/8 bg-white/70 px-4 py-3 text-sm font-medium">
          Glasses
          <input
            type="checkbox"
            name="glasses"
            checked={config.glasses}
            onChange={(event) =>
              setConfig((current) => ({ ...current, glasses: event.target.checked }))
            }
            className="h-5 w-5"
          />
        </label>

        {state.message ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {state.message}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving..." : "Save avatar"}
        </Button>
      </form>
    </div>
  );
}
