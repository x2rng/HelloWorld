"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  saveAvatarConfig,
  type SaveAvatarState,
} from "@/app/employee/avatar/actions";
import { ProceduralAvatarCreator } from "@/components/avatar-3d/procedural-avatar-creator";
import type { AvatarV4Config } from "@/components/avatar-3d/config/avatar-v4-types";
import { Button } from "@/components/ui/button";

const initialState: SaveAvatarState = {
  ok: false,
  message: "",
};

type AvatarEditorFormProps = {
  initialConfig: AvatarV4Config;
};

export function AvatarEditorForm({ initialConfig }: AvatarEditorFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveAvatarConfig,
    initialState,
  );
  const [config, setConfig] = useState<AvatarV4Config>(initialConfig);

  return (
    <form action={formAction} className="space-y-5">
      <input
        type="hidden"
        name="avatar_config"
        value={JSON.stringify(config)}
      />
      <ProceduralAvatarCreator config={config} onChange={setConfig} />

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
