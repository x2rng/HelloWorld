"use client";

import { useActionState, useMemo, useState } from "react";
import {
  completePlayerSetup,
  type CompletePlayerSetupState,
} from "@/app/employee/setup/actions";
import type { StoredAvatarConfig } from "@/components/avatar-3d/config/avatar-v4-parser";
import { CompanionCustomizer } from "@/components/avatar/companion-customizer";
import { PixelCompanion } from "@/components/avatar/pixel-companion";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { companionFamilyDefinitions } from "@/lib/avatar/companion-types";
import { getCompanionStage } from "@/lib/avatar/get-companion-stage";
import { createPixelCompanionFromStored } from "@/lib/avatar/normalize-companion-config";
import {
  growthPriorityOptions,
  playerInterestOptions,
} from "@/lib/player-setup";
import {
  getRoleFocusLabel,
  getRoleTemplateSkills,
  roleTemplateOptions,
  type RoleFocus,
} from "@/lib/skills";
import { cx } from "@/lib/utils";

const initialActionState: CompletePlayerSetupState = {
  ok: false,
  message: "",
};

const stepLabels = [
  "Welcome",
  "Identity",
  "Interests",
  "Priorities",
  "Player",
  "Summary",
] as const;

type PlayerSetupFlowProps = {
  employeeName: string;
  workspaceName: string;
  roleFocus: RoleFocus;
  assignedSkills: string[];
  hasCompanyAssignedIdentity: boolean;
  initialInterests: string[];
  initialGrowthPriorities: string[];
  initialAvatarConfig: StoredAvatarConfig;
  assignmentTitle: string | null;
  startingLevel: number;
  initialStep?: number;
  editing?: boolean;
};

function SelectionButton({
  label,
  selected,
  onClick,
  disabled,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "rounded-full border px-4 py-2.5 text-sm font-medium transition",
        selected
          ? "border-blue-300/35 bg-blue-400/14 text-blue-50 shadow-[0_8px_30px_rgba(59,130,246,0.1)]"
          : "border-white/9 bg-white/[0.035] text-white/62 hover:border-white/18 hover:text-white",
        disabled && "cursor-not-allowed opacity-45",
      )}
    >
      {label}
    </button>
  );
}

export function PlayerSetupFlow({
  employeeName,
  workspaceName,
  roleFocus,
  assignedSkills,
  hasCompanyAssignedIdentity,
  initialInterests,
  initialGrowthPriorities,
  initialAvatarConfig,
  assignmentTitle,
  startingLevel,
  initialStep = 0,
  editing = false,
}: PlayerSetupFlowProps) {
  const [actionState, formAction, pending] = useActionState(
    completePlayerSetup,
    initialActionState,
  );
  const [step, setStep] = useState(initialStep);
  const [fallbackRole, setFallbackRole] = useState<RoleFocus>(roleFocus);
  const [interests, setInterests] = useState(initialInterests);
  const [priorities, setPriorities] = useState(initialGrowthPriorities);
  const [customInterest, setCustomInterest] = useState("");
  const [avatarConfig, setAvatarConfig] = useState(initialAvatarConfig);
  const [companionConfig, setCompanionConfig] = useState(() =>
    createPixelCompanionFromStored(initialAvatarConfig),
  );
  const companionStage = getCompanionStage(startingLevel);
  const selectedCompanionFamily =
    companionFamilyDefinitions.find(
      (family) => family.id === companionConfig.family,
    ) ?? companionFamilyDefinitions[0];
  const fallbackSkills = useMemo(
    () => getRoleTemplateSkills(fallbackRole),
    [fallbackRole],
  );
  const displayedRole = hasCompanyAssignedIdentity ? roleFocus : fallbackRole;
  const displayedSkills = hasCompanyAssignedIdentity
    ? assignedSkills
    : fallbackSkills;

  function toggleInterest(interest: string) {
    setInterests((current) =>
      current.some((item) => item.toLowerCase() === interest.toLowerCase())
        ? current.filter(
            (item) => item.toLowerCase() !== interest.toLowerCase(),
          )
        : [...current, interest].slice(0, 20),
    );
  }

  function addCustomInterest() {
    const normalized = customInterest.trim().replace(/\s+/g, " ").slice(0, 60);
    if (
      normalized &&
      !interests.some(
        (interest) => interest.toLowerCase() === normalized.toLowerCase(),
      )
    ) {
      setInterests((current) => [...current, normalized].slice(0, 20));
    }
    setCustomInterest("");
  }

  function togglePriority(priority: string) {
    setPriorities((current) =>
      current.includes(priority)
        ? current.filter((item) => item !== priority)
        : current.length < 5
          ? [...current, priority]
          : current,
    );
  }

  const canContinue =
    step !== 1 ||
    hasCompanyAssignedIdentity ||
    Boolean(fallbackRole && fallbackSkills.length);

  function continueSetup() {
    if (!canContinue) return;
    if (step === 4) {
      setAvatarConfig(companionConfig);
    }
    setStep((current) =>
      Math.min(stepLabels.length - 1, current + 1),
    );
  }

  return (
    <form action={formAction} className="min-h-screen bg-[#07090e] text-white">
      <input type="hidden" name="role_focus" value={fallbackRole} />
      <input type="hidden" name="interests" value={JSON.stringify(interests)} />
      <input
        type="hidden"
        name="growth_priorities"
        value={JSON.stringify(priorities)}
      />
      <input
        type="hidden"
        name="avatar_config"
        value={JSON.stringify(avatarConfig)}
      />

      <header className="border-b border-white/8 px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-slate-950">
              E
            </span>
            <div>
              <p className="text-sm font-semibold">EXP</p>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/35">
                {editing ? "Edit player" : "Player setup"}
              </p>
            </div>
          </div>
          <p className="text-xs font-medium text-white/42">
            {step + 1} of {stepLabels.length}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-8 pt-5 sm:px-8 sm:pt-8">
        <div className="grid grid-cols-6 gap-2" aria-label="Setup progress">
          {stepLabels.map((label, index) => (
            <div key={label}>
              <div
                className={cx(
                  "h-1 rounded-full transition",
                  index <= step ? "bg-blue-400" : "bg-white/9",
                )}
              />
              <p
                className={cx(
                  "mt-2 hidden text-[10px] uppercase tracking-[0.12em] sm:block",
                  index === step ? "text-white/70" : "text-white/25",
                )}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        <main className="mt-8 min-h-[34rem]">
          {step === 0 ? (
            <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#101621] via-[#0c1119] to-[#080a0f] p-7 sm:p-12 lg:p-16">
              <div className="absolute -right-20 -top-28 size-96 rounded-full bg-blue-500/14 blur-3xl" />
              <div className="absolute -bottom-32 left-20 size-80 rounded-full bg-purple-500/8 blur-3xl" />
              <div className="relative max-w-3xl">
                <BadgePill tone="blue">{workspaceName}</BadgePill>
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/42">
                  Welcome to EXP
                </p>
                <h1 className="mt-4 text-5xl leading-[0.96] sm:text-7xl">
                  Build your player through real progress.
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-8 text-white/58 sm:text-lg">
                  Complete company journeys, grow skills, share activities, and
                  evolve an identity that reflects the work you put in.
                </p>
              </div>
            </section>
          ) : null}

          {step === 1 ? (
            <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-[36px] border border-white/9 bg-white/[0.035] p-7 sm:p-9">
                <p className="eyebrow">Professional identity</p>
                <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">
                  Know what you are here to grow.
                </h1>
                <p className="mt-5 text-sm leading-7 text-white/52">
                  Your professional identity organizes role-specific development
                  without changing your personal growth choices.
                </p>
              </div>
              <div className="rounded-[36px] border border-white/9 bg-[#0d1119] p-7 sm:p-9">
                {hasCompanyAssignedIdentity ? (
                  <>
                    <BadgePill tone="purple">Assigned by your company</BadgePill>
                    <h2 className="mt-5 text-3xl">
                      {getRoleFocusLabel(roleFocus)}
                    </h2>
                    <p className="mt-2 text-sm text-white/45">
                      Your company-assigned role and skills are authoritative.
                    </p>
                  </>
                ) : (
                  <>
                    <BadgePill tone="amber">Complete missing information</BadgePill>
                    <label
                      htmlFor="setup-role"
                      className="mt-5 block text-sm font-medium"
                    >
                      Closest role
                    </label>
                    <select
                      id="setup-role"
                      value={fallbackRole}
                      onChange={(event) =>
                        setFallbackRole(event.target.value as RoleFocus)
                      }
                      className="mt-3 h-12 w-full rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-sm text-white outline-none focus:border-blue-400/50"
                    >
                      {roleTemplateOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-[#111720]"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-3 text-sm leading-6 text-white/42">
                      This fallback appears because no complete company assignment
                      was found.
                    </p>
                  </>
                )}
                <div className="mt-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/38">
                    Professional skills
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {displayedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-purple-300/12 bg-purple-400/[0.07] px-3 py-2 text-xs font-medium text-purple-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="rounded-[36px] border border-white/9 bg-[#0d1119] p-7 sm:p-10">
              <p className="eyebrow">Personal interests</p>
              <h1 className="mt-3 text-4xl sm:text-5xl">
                What matters outside the job?
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                Optional interests help EXP understand the kind of personal growth
                that feels relevant to you. They do not award XP.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {playerInterestOptions.map((interest) => (
                  <SelectionButton
                    key={interest}
                    label={interest}
                    selected={interests.includes(interest)}
                    onClick={() => toggleInterest(interest)}
                  />
                ))}
                {interests
                  .filter(
                    (interest) =>
                      !playerInterestOptions.includes(
                        interest as (typeof playerInterestOptions)[number],
                      ),
                  )
                  .map((interest) => (
                    <SelectionButton
                      key={interest}
                      label={interest}
                      selected
                      onClick={() => toggleInterest(interest)}
                    />
                  ))}
              </div>
              <div className="mt-7 flex max-w-lg gap-2">
                <input
                  value={customInterest}
                  onChange={(event) => setCustomInterest(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addCustomInterest();
                    }
                  }}
                  placeholder="Add a custom interest"
                  maxLength={60}
                  className="h-12 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.045] px-4 text-sm outline-none placeholder:text-white/25 focus:border-blue-400/50"
                />
                <Button type="button" variant="secondary" onClick={addCustomInterest}>
                  Add
                </Button>
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="rounded-[36px] border border-white/9 bg-[#0d1119] p-7 sm:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow">Growth priorities</p>
                  <h1 className="mt-3 text-4xl sm:text-5xl">
                    What do you want to strengthen?
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50">
                    Choose up to five. These personalize your Player without
                    replacing company-assigned skills.
                  </p>
                </div>
                <BadgePill tone={priorities.length === 5 ? "amber" : "blue"}>
                  {priorities.length} / 5 selected
                </BadgePill>
              </div>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {growthPriorityOptions.map((priority) => (
                  <SelectionButton
                    key={priority}
                    label={priority}
                    selected={priorities.includes(priority)}
                    disabled={
                      priorities.length >= 5 && !priorities.includes(priority)
                    }
                    onClick={() => togglePriority(priority)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === 4 ? (
            <section>
              <div className="mb-5">
                <p className="eyebrow">Player Companion</p>
                <h1 className="mt-2 text-4xl sm:text-5xl">Choose your companion</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/48">
                  Pick the companion that will grow with you throughout your
                  onboarding journey.
                </p>
              </div>
              <CompanionCustomizer
                config={companionConfig}
                onChange={setCompanionConfig}
                stage={companionStage.id}
                compactAction={{
                  label: "Continue",
                  onClick: continueSetup,
                  disabled: !canContinue,
                }}
              />
            </section>
          ) : null}

          {step === 5 ? (
            <section className="overflow-hidden rounded-[40px] border border-white/10 bg-[#0d1119]">
              <div className="grid lg:grid-cols-[0.75fr_1.25fr]">
                <div className="relative flex min-h-[30rem] items-end justify-center overflow-hidden border-b border-white/8 bg-white/[0.025] lg:border-b-0 lg:border-r">
                  <div className="absolute left-7 top-7">
                    <BadgePill tone="blue">Ready to enter</BadgePill>
                  </div>
                  <div className="absolute bottom-10 size-56 rounded-full bg-blue-500/16 blur-3xl" />
                  <PixelCompanion
                    config={companionConfig}
                    stage={companionStage.id}
                    size={300}
                    className="relative mb-10"
                  />
                </div>
                <div className="p-7 sm:p-10">
                  <p className="eyebrow">Player summary</p>
                  <h1 className="mt-3 text-4xl sm:text-6xl">{employeeName}</h1>
                  <p className="mt-3 text-lg text-white/52">{workspaceName}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <BadgePill tone="purple">
                      {getRoleFocusLabel(displayedRole)}
                    </BadgePill>
                    <BadgePill tone="green">
                      {selectedCompanionFamily.label} companion
                    </BadgePill>
                    <BadgePill tone="blue">Level {startingLevel}</BadgePill>
                    <BadgePill tone="cyan">{companionStage.label}</BadgePill>
                  </div>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                        Company skills
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/68">
                        {displayedSkills.slice(0, 6).join(" · ")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                        Starting journey
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/68">
                        {assignmentTitle ?? "Your company will assign this soon"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                        Interests
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/68">
                        {interests.length > 0
                          ? interests.join(" · ")
                          : "Skipped for now"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                        Growth priorities
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/68">
                        {priorities.length > 0
                          ? priorities.join(" · ")
                          : "Open to every growth area"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </main>

        {actionState.message ? (
          <p
            role="alert"
            className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
          >
            {actionState.message}
          </p>
        ) : null}

        <footer className="sticky bottom-3 z-30 mt-6 flex items-center justify-between gap-3 rounded-[24px] border border-white/9 bg-[#0d1119]/94 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl">
          <Button
            type="button"
            variant="ghost"
            disabled={step === 0 || pending}
            onClick={() => setStep((current) => Math.max(0, current - 1))}
          >
            Back
          </Button>
          {step < stepLabels.length - 1 ? (
            <Button
              type="button"
              size="lg"
              disabled={!canContinue}
              onClick={(event) => {
                event.preventDefault();
                continueSetup();
              }}
            >
              {step === 2 && interests.length === 0
                ? "Skip for now"
                : "Continue"}
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={pending}>
              {pending
                ? "Saving player..."
                : editing
                  ? "Save player"
                  : "Enter EXP"}
            </Button>
          )}
        </footer>
      </div>
    </form>
  );
}
