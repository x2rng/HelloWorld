"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarRenderer } from "@/components/avatar/avatar-renderer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { avatarOptions } from "@/lib/catalog";
import { createStarterAvatar } from "@/lib/progression";
import type { AvatarConfig } from "@/lib/types";
import { useApp } from "@/providers/app-provider";

const avatarKeys = Object.keys(avatarOptions) as Array<keyof typeof avatarOptions>;

export function AvatarCustomizer() {
  const router = useRouter();
  const { currentUser, saveAvatar } = useApp();
  const [avatar, setAvatar] = useState<AvatarConfig>(() =>
    currentUser?.avatar ?? createStarterAvatar(currentUser?.account.fullName ?? "LevelUp You"),
  );

  function randomize() {
    const next: AvatarConfig = { ...avatar };
    for (const key of avatarKeys) {
      const options = avatarOptions[key];
      const choice = options[Math.floor(Math.random() * options.length)];
      next[key] = choice.value;
    }
    next.avatarName = avatar.avatarName;
    setAvatar(next);
  }

  function reset() {
    setAvatar(createStarterAvatar(currentUser?.account.fullName ?? "LevelUp You"));
  }

  function submit() {
    saveAvatar(avatar);
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <Card className="rounded-[36px] p-6 sm:p-8">
          <p className="eyebrow">Avatar studio</p>
          <h1 className="mt-3 text-4xl leading-tight">Give your progress a visible form.</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-[var(--color-muted)]">
            Start simple. Better-looking items unlock as you keep improving your real-life profile.
          </p>

          <div className="mt-8 flex flex-col items-center gap-6 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(63,108,255,0.12),_transparent_56%),linear-gradient(180deg,_rgba(255,255,255,0.88),_rgba(255,255,255,0.68))] p-8">
            <AvatarRenderer avatar={avatar} size={220} className="rounded-[32px] p-8" />
            <div className="space-y-1 text-center">
              <label htmlFor="avatar-name" className="text-sm text-[var(--color-muted)]">
                Avatar name
              </label>
              <input
                id="avatar-name"
                value={avatar.avatarName}
                onChange={(event) => setAvatar((previous) => ({ ...previous, avatarName: event.target.value }))}
                className="w-full rounded-full border border-black/8 bg-white px-4 py-3 text-center text-lg outline-none"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={randomize}>
                Randomize
              </Button>
              <Button variant="ghost" onClick={reset}>
                Reset
              </Button>
              <Button variant="primary" onClick={submit}>
                Continue to dashboard
              </Button>
            </div>
          </div>
        </Card>

        <Card className="rounded-[36px] p-6 sm:p-8">
          <div className="mb-6">
            <p className="eyebrow">Customize</p>
            <h2 className="mt-3 text-3xl">Pixel, quiet, and personal.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {avatarKeys.map((key) => (
              <div key={key} className="rounded-[26px] border border-black/6 bg-white/75 p-4">
                <label className="mb-3 block text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions[key].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setAvatar((previous) => ({ ...previous, [key]: option.value }))}
                      className={`rounded-full border px-3 py-2 text-sm ${
                        avatar[key] === option.value
                          ? "border-[var(--color-blue)] bg-[var(--color-blue-soft)] text-[var(--color-blue)]"
                          : "border-black/8 bg-white text-[var(--color-muted)]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[28px] border border-dashed border-black/10 bg-black/[0.02] p-5">
            <p className="eyebrow">Future unlocks</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {["Level 2 structured jacket", "Level 3 silver frames", "Level 5 headband accent"].map((item) => (
                <div key={item} className="rounded-[22px] border border-black/6 bg-white/70 px-4 py-3 text-sm text-[var(--color-muted)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
