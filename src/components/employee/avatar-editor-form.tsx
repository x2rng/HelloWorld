"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  saveAvatarConfig,
  type SaveAvatarState,
} from "@/app/employee/avatar/actions";
import {
  createAvatarV4FromStored,
  normalizeStoredAvatarConfig,
  type StoredAvatarConfig,
} from "@/components/avatar-3d/config/avatar-v4-parser";
import { AvatarV5Creator } from "@/components/avatar-v5-production/avatar-v5-creator";
import { createAvatarV5FromStored } from "@/components/avatar-v5-production/config/avatar-v5-parser";
import { Button } from "@/components/ui/button";

const initialState: SaveAvatarState = {
  ok: false,
  message: "",
};

type AvatarEditorFormProps = {
  initialStoredConfig: unknown;
};

export function AvatarEditorForm({
  initialStoredConfig,
}: AvatarEditorFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveAvatarConfig,
    initialState,
  );
  const [config, setConfig] = useState<StoredAvatarConfig>(() =>
    normalizeStoredAvatarConfig(initialStoredConfig),
  );
  const [v5Config, setV5Config] = useState(() =>
    createAvatarV5FromStored(initialStoredConfig),
  );
  const [fallbackConfig, setFallbackConfig] = useState(() =>
    createAvatarV4FromStored(initialStoredConfig),
  );

  function updateV5(next: typeof v5Config) {
    setV5Config(next);
    setConfig(next);
  }

  function updateFallback(next: typeof fallbackConfig) {
    setFallbackConfig(next);
    setConfig(next);
  }

  return (
    <form action={formAction} className="space-y-5">
      <input
        type="hidden"
        name="avatar_config"
        value={JSON.stringify(config)}
      />
      <AvatarV5Creator
        config={v5Config}
        onChange={updateV5}
        fallbackConfig={fallbackConfig}
        onFallbackChange={updateFallback}
      />

      {state.message ? (
        <p
          role="alert"
          className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
        >
          {state.message}
        </p>
      ) : null}

      <div className="sticky bottom-3 z-20 flex flex-col-reverse gap-3 rounded-[24px] border border-white/10 bg-[#0d1119]/95 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-end">
        <Link
          href="/employee/player"
          className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-white/55 transition hover:text-white"
        >
          Cancel
        </Link>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Saving player..." : "Save avatar"}
        </Button>
      </div>
    </form>
  );
}
