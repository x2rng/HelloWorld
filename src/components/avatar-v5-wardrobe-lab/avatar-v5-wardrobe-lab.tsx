"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { AvatarWebGLBoundary } from "@/components/avatar-3d/avatar-webgl-boundary";
import {
  avatarV5HairColours,
  avatarV5SkinTones,
} from "@/components/avatar-v5-production/config/avatar-v5-catalogue";
import reportData from "@/components/avatar-v5-wardrobe-lab/data/compatibility-report.json";
import type {
  WardrobeLabHairCandidate,
  WardrobeLabSelection,
  WardrobeLabStatus,
  WardrobeLabWardrobeCandidate,
} from "@/components/avatar-v5-wardrobe-lab/wardrobe-lab-types";
import { cx } from "@/lib/utils";

const WardrobeLabStudio = dynamic(
  () =>
    import(
      "@/components/avatar-v5-wardrobe-lab/wardrobe-lab-studio"
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[34rem] items-center justify-center rounded-[32px] border border-white/10 bg-[#0b1018] text-sm text-white/50 lg:h-[43rem]">
        Loading wardrobe laboratory…
      </div>
    ),
  },
);

const report = reportData as unknown as {
  advertisedUniversalHairstyles: number;
  freelyDistributedUniversalHairMeshes: number;
  freelyDistributedFacialHairMeshes: number;
  hair: WardrobeLabHairCandidate[];
  accessories: WardrobeLabHairCandidate[];
  wardrobe: WardrobeLabWardrobeCandidate[];
  findings: string[];
};

type CatalogueCategory = "hair" | "wardrobe" | "accessories";
type StatusFilter = WardrobeLabStatus | "all";

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved candidate" },
  { value: "needs-adjustment", label: "Needs adjustment" },
  { value: "rejected", label: "Rejected" },
  { value: "incompatible", label: "Incompatible" },
];

const statusStyles: Record<WardrobeLabStatus, string> = {
  approved: "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  "needs-adjustment":
    "border-amber-300/25 bg-amber-300/10 text-amber-100",
  rejected: "border-red-300/20 bg-red-300/8 text-red-100/80",
  incompatible: "border-violet-300/22 bg-violet-300/9 text-violet-100/85",
};

const eyeColours = [
  {
    id: "brown",
    label: "Brown",
    colour: "#6d431e",
    asset: "/avatar-v5-wardrobe-lab/eyes/eye-brown.png",
  },
  {
    id: "blue",
    label: "Blue",
    colour: "#487fa6",
    asset: "/avatar-v5-wardrobe-lab/eyes/eye-blue.png",
  },
  {
    id: "green",
    label: "Green",
    colour: "#56805d",
    asset: "/avatar-v5-wardrobe-lab/eyes/eye-green.png",
  },
  {
    id: "hazel",
    label: "Hazel",
    colour: "#8c743b",
    asset: "/avatar-v5-wardrobe-lab/eyes/eye-hazel.png",
  },
  {
    id: "grey",
    label: "Grey",
    colour: "#73828d",
    asset: "/avatar-v5-wardrobe-lab/eyes/eye-grey.png",
  },
];

const outfitPalettes = [
  {
    id: "original",
    label: "Original earth",
    colour: "#4b3022",
    asset: "/avatar-v5-production/outfits/T_Peasant_BaseColor.png",
  },
  {
    id: "alternate",
    label: "Alternate slate",
    colour: "#46505f",
    asset: "/avatar-v5-production/outfits/T_Peasant_2_BaseColor.png",
  },
];

function FailurePanel({ retry }: { retry: () => void }) {
  return (
    <div className="flex h-[34rem] flex-col items-center justify-center gap-4 rounded-[32px] border border-red-300/20 bg-red-400/[0.045] px-6 text-center lg:h-[43rem]">
      <div>
        <p className="font-semibold text-white">
          The candidate could not be rendered.
        </p>
        <p className="mt-2 max-w-md text-sm leading-6 text-white/55">
          Retry the isolated viewer. Production avatar routes are not involved.
        </p>
      </div>
      <button
        type="button"
        onClick={retry}
        className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-semibold text-white"
      >
        Retry viewer
      </button>
    </div>
  );
}

function Swatches({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: Array<{ id: string; label: string; colour: string }>;
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            title={option.label}
            aria-label={`${label}: ${option.label}`}
            aria-pressed={selected === option.id}
            onClick={() => onSelect(option.id)}
            className={cx(
              "size-8 rounded-full border p-1 transition",
              selected === option.id
                ? "border-blue-300 bg-blue-300/12"
                : "border-white/12 hover:border-white/30",
            )}
          >
            <span
              className="block size-full rounded-full border border-black/20"
              style={{ backgroundColor: option.colour }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function AvatarV5WardrobeLab() {
  const [category, setCategory] = useState<CatalogueCategory>("hair");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState(report.hair[0].id);
  const [skinId, setSkinId] = useState("warm-bronze");
  const [hairColourId, setHairColourId] = useState("espresso");
  const [eyeId, setEyeId] = useState("brown");
  const [paletteId, setPaletteId] = useState("original");
  const [beardEnabled, setBeardEnabled] = useState(false);

  const allSelections = useMemo<WardrobeLabSelection[]>(
    () => [
      ...report.hair.map((candidate) => ({
        kind: "hair" as const,
        candidate,
      })),
      ...report.accessories.map((candidate) => ({
        kind: "accessory" as const,
        candidate,
      })),
      ...report.wardrobe.map((candidate) => ({
        kind: "wardrobe" as const,
        candidate,
      })),
    ],
    [],
  );
  const selected =
    allSelections.find((item) => item.candidate.id === selectedId) ??
    allSelections[0];
  const approvedHair = report.hair[0];
  const selectedSkin =
    avatarV5SkinTones.find((option) => option.value === skinId) ??
    avatarV5SkinTones[3];
  const selectedHairColour =
    avatarV5HairColours.find((option) => option.value === hairColourId) ??
    avatarV5HairColours[1];
  const selectedEye =
    eyeColours.find((option) => option.id === eyeId) ?? eyeColours[0];
  const selectedPalette =
    outfitPalettes.find((option) => option.id === paletteId) ??
    outfitPalettes[0];
  const beard = beardEnabled ? report.accessories[0] : undefined;

  const categoryCandidates =
    category === "hair"
      ? report.hair
      : category === "accessories"
        ? report.accessories
        : report.wardrobe;
  const filteredCandidates = categoryCandidates.filter(
    (candidate) =>
      statusFilter === "all" || candidate.status === statusFilter,
  );

  function selectCategory(next: CatalogueCategory) {
    setCategory(next);
    setStatusFilter("all");
    const first =
      next === "hair"
        ? report.hair[0]
        : next === "accessories"
          ? report.accessories[0]
          : report.wardrobe[0];
    setSelectedId(first.id);
  }

  return (
    <main className="min-h-screen bg-[#070a10] text-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-7 max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300/75">
            Isolated development route · no production writes
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Avatar V5 hair and wardrobe laboratory
          </h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-white/58 sm:text-base">
            Review official free CC0 candidates against the protected Avatar V5
            foundation. The page never reads or saves an employee avatar and
            does not change Player Setup, Avatar Editor, or Player presentation.
          </p>
        </header>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/9 bg-white/[0.025] p-4">
            <p className="text-2xl font-semibold">{report.hair.length}</p>
            <p className="mt-1 text-xs text-white/45">
              free hairstyle meshes audited
            </p>
          </div>
          <div className="rounded-2xl border border-white/9 bg-white/[0.025] p-4">
            <p className="text-2xl font-semibold">{report.wardrobe.length}</p>
            <p className="mt-1 text-xs text-white/45">
              complete modular characters inventoried
            </p>
          </div>
          <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
            <p className="text-sm font-semibold text-amber-100/85">
              Skeleton protection active
            </p>
            <p className="mt-1 text-xs leading-5 text-white/45">
              Legacy clothing is never mixed onto the approved V5 body.
            </p>
          </div>
        </div>

        <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_27rem]">
          <div className="min-w-0">
            <AvatarWebGLBoundary
              key={selected.candidate.id}
              fallback={(retry) => <FailurePanel retry={retry} />}
            >
              <WardrobeLabStudio
                selection={selected}
                approvedHair={approvedHair}
                beard={beard}
                appearance={{
                  skinColour: selectedSkin.colour,
                  hairColour: selectedHairColour.colour,
                  eyeAsset: selectedEye.asset,
                  outfitTexture: selectedPalette.asset,
                }}
              />
            </AvatarWebGLBoundary>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/9 bg-white/[0.025] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-white/90">
                    {selected.candidate.label}
                  </p>
                  <span
                    className={cx(
                      "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
                      statusStyles[selected.candidate.status],
                    )}
                  >
                    {selected.candidate.status.replace("-", " ")}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/52">
                  {selected.candidate.reason}
                </p>
              </div>

              <div className="rounded-2xl border border-white/9 bg-white/[0.025] p-4 text-xs leading-5 text-white/48">
                {selected.kind === "wardrobe" ? (
                  <>
                    <p>
                      Skeleton: {selected.candidate.skeleton.jointCount} joints
                      · {selected.candidate.skeleton.exactApprovedBoneMatches}/
                      {selected.candidate.skeleton.approvedBonesCompared} exact
                      approved bone-name matches
                    </p>
                    <p className="mt-1">
                      Mesh sections: {selected.candidate.meshNodes.join(", ")}
                    </p>
                    <p className="mt-1">
                      Optimized preview:{" "}
                      {(selected.candidate.outputBytes / 1024).toFixed(0)} KiB
                    </p>
                  </>
                ) : (
                  <>
                    <p>Source mesh: {selected.candidate.source}</p>
                    <p className="mt-1">
                      Binding: exact Universal head rig with lab-only transform
                      correction.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <aside className="min-w-0 space-y-4">
            <div className="rounded-3xl border border-white/9 bg-white/[0.025] p-4">
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {(
                  [
                    ["hair", "Hair"],
                    ["wardrobe", "Wardrobe"],
                    ["accessories", "Accessories"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={category === value}
                    onClick={() => selectCategory(value)}
                    className={cx(
                      "shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition",
                      category === value
                        ? "border-blue-300/35 bg-blue-300/12 text-white"
                        : "border-white/10 text-white/55 hover:text-white",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={statusFilter === option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={cx(
                      "shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition",
                      statusFilter === option.value
                        ? "border-white/30 bg-white/10 text-white"
                        : "border-white/8 text-white/42 hover:text-white/75",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="mt-2 max-h-80 space-y-2 overflow-y-auto pr-1">
                {filteredCandidates.map((candidate) => (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(candidate.id);
                      if (category === "accessories") {
                        setBeardEnabled(true);
                      }
                    }}
                    className={cx(
                      "w-full rounded-2xl border p-3 text-left transition",
                      selected.candidate.id === candidate.id
                        ? "border-blue-300/35 bg-blue-300/10"
                        : "border-white/8 bg-black/10 hover:border-white/16",
                    )}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-white/85">
                        {candidate.label}
                      </span>
                      <span
                        className={cx(
                          "size-2 shrink-0 rounded-full",
                          candidate.status === "approved"
                            ? "bg-emerald-300"
                            : candidate.status === "needs-adjustment"
                              ? "bg-amber-300"
                              : candidate.status === "incompatible"
                                ? "bg-violet-300"
                                : "bg-red-300/65",
                        )}
                      />
                    </span>
                    <span className="mt-1 line-clamp-2 block text-xs leading-5 text-white/42">
                      {candidate.reason}
                    </span>
                  </button>
                ))}
                {filteredCandidates.length === 0 ? (
                  <p className="py-8 text-center text-sm text-white/38">
                    No candidates in this classification.
                  </p>
                ) : null}
              </div>
            </div>

            <div
              className={cx(
                "space-y-4 rounded-3xl border border-white/9 bg-white/[0.025] p-4",
                selected.kind === "wardrobe" && "pointer-events-none opacity-40",
              )}
            >
              <Swatches
                label="Skin"
                selected={skinId}
                onSelect={setSkinId}
                options={avatarV5SkinTones.map((option) => ({
                  id: option.value,
                  label: option.label,
                  colour: option.colour,
                }))}
              />
              <Swatches
                label="Hair"
                selected={hairColourId}
                onSelect={setHairColourId}
                options={avatarV5HairColours.map((option) => ({
                  id: option.value,
                  label: option.label,
                  colour: option.colour,
                }))}
              />
              <Swatches
                label="Lab eye variants"
                selected={eyeId}
                onSelect={setEyeId}
                options={eyeColours}
              />
              <Swatches
                label="Approved outfit palette"
                selected={paletteId}
                onSelect={setPaletteId}
                options={outfitPalettes}
              />
              <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 px-3 py-2.5 text-xs text-white/65">
                Test beard candidate
                <input
                  type="checkbox"
                  checked={beardEnabled}
                  onChange={(event) => setBeardEnabled(event.target.checked)}
                  className="size-4 accent-blue-400"
                />
              </label>
            </div>

            <div className="rounded-3xl border border-white/9 bg-white/[0.025] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                Audit findings
              </p>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-white/48">
                {report.findings.map((finding) => (
                  <li key={finding}>• {finding}</li>
                ))}
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
