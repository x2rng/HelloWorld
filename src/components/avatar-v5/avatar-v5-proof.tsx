"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AvatarWebGLBoundary } from "@/components/avatar-3d/avatar-webgl-boundary";
import { defaultAvatarV4Config } from "@/components/avatar-3d/config/avatar-v4-defaults";
import { ProceduralAvatarPresentation } from "@/components/avatar-3d/procedural-avatar-presentation";
import { cx } from "@/lib/utils";

const AvatarV5Studio = dynamic(
  () => import("@/components/avatar-v5/avatar-v5-studio"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[34rem] items-center justify-center rounded-[32px] border border-white/10 bg-[#0b1018] text-sm text-white/50 lg:h-[43rem]">
        Loading imported avatar assets…
      </div>
    ),
  },
);

type ComparisonMode = "v5" | "v4";

function FailurePanel({ retry }: { retry: () => void }) {
  return (
    <div className="flex h-[34rem] flex-col items-center justify-center gap-4 rounded-[32px] border border-red-300/20 bg-red-400/[0.045] px-6 text-center lg:h-[43rem]">
      <div>
        <p className="text-base font-semibold text-white">
          The imported avatar could not be rendered.
        </p>
        <p className="mt-2 max-w-md text-sm leading-6 text-white/55">
          WebGL or one of the local glTF assets failed to load. The existing
          employee avatar experience has not been affected.
        </p>
      </div>
      <button
        type="button"
        onClick={retry}
        className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/12"
      >
        Retry viewer
      </button>
    </div>
  );
}

const comparisonTabs: Array<{
  value: ComparisonMode;
  label: string;
  eyebrow: string;
}> = [
  {
    value: "v5",
    label: "V5 imported asset candidate",
    eyebrow: "Asset-based proof",
  },
  {
    value: "v4",
    label: "V4 current procedural avatar",
    eyebrow: "Current baseline",
  },
];

export function AvatarV5Proof() {
  const [mode, setMode] = useState<ComparisonMode>("v5");

  return (
    <main className="min-h-screen bg-[#070a10] text-white">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-7 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300/75">
            Isolated development route
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            EXP Avatar V5 visual proof
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58 sm:text-base">
            Compare the current procedural V4 avatar with a cohesive imported
            CC0 character candidate. This route does not read or write employee
            avatar configuration.
          </p>
        </header>

        <div className="mb-5 grid gap-2 sm:grid-cols-2">
          {comparisonTabs.map((tab) => {
            const selected = mode === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setMode(tab.value)}
                className={cx(
                  "rounded-2xl border px-4 py-3 text-left transition",
                  selected
                    ? "border-blue-300/35 bg-blue-300/10"
                    : "border-white/9 bg-white/[0.025] hover:border-white/16 hover:bg-white/[0.045]",
                )}
              >
                <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/42">
                  {tab.eyebrow}
                </span>
                <span className="mt-1 block text-sm font-semibold text-white/88">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="min-w-0">
            {mode === "v5" ? (
              <AvatarWebGLBoundary
                fallback={(retry) => <FailurePanel retry={retry} />}
              >
                <AvatarV5Studio />
              </AvatarWebGLBoundary>
            ) : (
              <ProceduralAvatarPresentation
                config={defaultAvatarV4Config}
                className="h-[34rem] lg:h-[43rem]"
              />
            )}
          </div>

          <aside className="min-w-0 space-y-4">
            <div className="rounded-3xl border border-white/9 bg-white/[0.025] p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Candidate
              </p>
              <h2 className="mt-2 text-lg font-semibold">
                Quaternius Universal Base Character
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-white/38">Asset source</dt>
                  <dd className="mt-1 leading-6 text-white/72">
                    Universal Base Characters with the compatible Modular
                    Character Outfits — Fantasy Standard pack
                  </dd>
                </div>
                <div>
                  <dt className="text-white/38">Licence</dt>
                  <dd className="mt-1 text-white/72">
                    CC0 1.0 Universal
                  </dd>
                </div>
                <div>
                  <dt className="text-white/38">Imported geometry</dt>
                  <dd className="mt-1 text-white/72">
                    Approximately 31,534 triangles
                  </dd>
                </div>
                <div>
                  <dt className="text-white/38">Animation</dt>
                  <dd className="mt-1 text-white/72">
                    Compatible CC0 Idle_Loop from the Universal Animation
                    Library
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-amber-200/14 bg-amber-100/[0.035] p-5">
              <p className="text-sm font-semibold text-amber-100/85">
                Honest limitation
              </p>
              <p className="mt-2 text-sm leading-6 text-white/53">
                The peasant wardrobe proves fitted modular compatibility, but
                its fantasy styling is not suitable as EXP production clothing.
                It should be replaced by purpose-built workplace garments if
                the base character passes visual review.
              </p>
            </div>

            <div className="rounded-3xl border border-white/9 bg-white/[0.025] p-5 text-sm leading-6 text-white/53">
              Drag or swipe to rotate. Pinch or scroll to zoom. Use the camera
              controls below the studio for fixed front, side, and rear views.
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
