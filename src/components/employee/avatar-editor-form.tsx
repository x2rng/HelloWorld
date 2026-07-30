"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  saveAvatarConfig,
  type SaveAvatarState,
} from "@/app/employee/avatar/actions";
import { CompanionCustomizer } from "@/components/avatar/companion-customizer";
import { Button } from "@/components/ui/button";
import type { CompanionStage } from "@/lib/avatar/companion-types";
import { createPixelCompanionFromStored } from "@/lib/avatar/normalize-companion-config";

const initialState: SaveAvatarState = {
  ok: false,
  message: "",
};

type AvatarEditorFormProps = {
  initialStoredConfig: unknown;
  companionStage: CompanionStage;
};

export function AvatarEditorForm({
  initialStoredConfig,
  companionStage,
}: AvatarEditorFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveAvatarConfig,
    initialState,
  );
  const [config, setConfig] = useState(() =>
    createPixelCompanionFromStored(initialStoredConfig),
  );

  return (
    <form action={formAction} className="space-y-5">
      <input
        type="hidden"
        name="avatar_config"
        value={JSON.stringify(config)}
      />
      <CompanionCustomizer
        config={config}
        onChange={setConfig}
        stage={companionStage}
      />

      {state.message ? (
        <p
          role={state.ok ? "status" : "alert"}
          className={
            state.ok
              ? "rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
              : "rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
          }
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
        <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-white/32 sm:mr-auto sm:block">
          4&nbsp;&nbsp;Save companion
        </span>
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending ? "Saving companion..." : "Save companion"}
        </Button>
      </div>
    </form>
  );
}
