"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  focusAreaOptions,
  healthFocusOptions,
  hobbyOptions,
  identityStages,
  motivationOptions,
  personalPriorityOptions,
  skillOptions,
  weeklyCommitmentOptions,
} from "@/lib/catalog";
import type { FocusArea, OnboardingData, PersonalPriority } from "@/lib/types";
import { cx } from "@/lib/utils";
import { useApp } from "@/providers/app-provider";

function ToggleTag({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "rounded-full border px-4 py-2 text-sm font-medium",
        active ? "border-[var(--color-blue)] bg-[var(--color-blue-soft)] text-[var(--color-blue)]" : "border-black/8 bg-white text-[var(--color-muted)]",
      )}
    >
      {children}
    </button>
  );
}

const defaultOnboarding: OnboardingData = {
  currentStage: "Professional",
  focusAreas: ["Career growth"],
  selectedSkills: ["Product Thinking", "Communication", "Leadership"],
  topSkills: ["Product Thinking", "Communication", "Leadership"],
  personalPriorities: ["Consistency", "Focus"],
  mainPersonalFocus: "Consistency",
  trackHealth: true,
  healthFocusArea: "General fitness",
  hobbies: ["Reading", "Tech"],
  primaryHobby: "Reading",
  motivationStyles: ["Visible progress"],
  weeklyCommitment: "3-5 hours",
};

export function OnboardingFlow() {
  const router = useRouter();
  const { currentUser, saveOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingData>(currentUser?.onboarding ?? defaultOnboarding);
  const [error, setError] = useState("");
  const steps = useMemo(
    () => [
      "Identity snapshot",
      "Professional skills",
      "Personal growth",
      "Health and fitness",
      "Hobbies",
      "Motivation style",
      "Weekly commitment",
      "Summary",
    ],
    [],
  );

  function toggleLimited<T extends string>(items: T[], value: T, limit: number) {
    if (items.includes(value)) {
      return items.filter((item) => item !== value);
    }
    if (items.length >= limit) {
      return items;
    }
    return [...items, value];
  }

  function updateFocus(value: FocusArea) {
    setForm((previous) => ({
      ...previous,
      focusAreas: toggleLimited(previous.focusAreas, value, 2),
    }));
  }

  function updatePriority(value: PersonalPriority) {
    setForm((previous) => {
      const nextPriorities = toggleLimited(previous.personalPriorities, value, 4);
      const mainPersonalFocus = nextPriorities.includes(previous.mainPersonalFocus)
        ? previous.mainPersonalFocus
        : nextPriorities[0] ?? "Consistency";

      return {
        ...previous,
        personalPriorities: nextPriorities,
        mainPersonalFocus,
      };
    });
  }

  function validateCurrentStep() {
    if (step === 0 && form.focusAreas.length === 0) return "Choose at least one focus area.";
    if (step === 1 && form.selectedSkills.length < 3) return "Choose at least three skills for your profile.";
    if (step === 1 && form.topSkills.length !== 3) return "Select exactly three top skills.";
    if (step === 2 && form.personalPriorities.length === 0) return "Choose at least one personal growth area.";
    if (step === 2 && !form.personalPriorities.includes(form.mainPersonalFocus)) return "Choose one main personal focus.";
    if (step === 3 && form.trackHealth && !form.healthFocusArea) return "Choose a health direction.";
    if (step === 4 && (!form.primaryHobby || form.hobbies.length === 0)) return "Pick at least one hobby and a primary hobby.";
    if (step === 5 && form.motivationStyles.length === 0) return "Pick at least one motivation style.";
    if (step === 6 && !form.weeklyCommitment) return "Choose your weekly commitment.";
    return "";
  }

  function nextStep() {
    const nextError = validateCurrentStep();
    setError(nextError);
    if (nextError) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function submit() {
    saveOnboarding(form);
    router.push("/avatar");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[0.36fr_0.64fr]">
        <Card className="rounded-[32px] p-6">
          <p className="eyebrow">Onboarding</p>
          <h1 className="mt-3 text-3xl">Shape your growth profile.</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Short enough to finish. Rich enough to make the dashboard feel personal.
          </p>
          <div className="mt-6 space-y-3">
            {steps.map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl px-3 py-2">
                <span
                  className={cx(
                    "flex size-8 items-center justify-center rounded-full text-xs font-semibold",
                    index <= step ? "bg-[var(--color-ink)] text-white" : "bg-black/5 text-[var(--color-muted)]",
                  )}
                >
                  {index + 1}
                </span>
                <span className={cx("text-sm", index === step ? "font-semibold text-[var(--color-ink)]" : "text-[var(--color-muted)]")}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-[32px] p-6 sm:p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Step {step + 1}</p>
              <h2 className="mt-2 text-3xl">{steps[step]}</h2>
            </div>
            <BadgePill tone="blue">{Math.round(((step + 1) / steps.length) * 100)}% ready</BadgePill>
          </div>

          <div className="space-y-6">
            {step === 0 && (
              <>
                <div>
                  <label className="mb-3 block text-sm font-medium">What best describes you right now?</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {identityStages.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={cx(
                          "rounded-[22px] border px-4 py-4 text-left text-sm",
                          form.currentStage === option ? "border-[var(--color-blue)] bg-[var(--color-blue-soft)]" : "border-black/8 bg-white/70",
                        )}
                        onClick={() => setForm((previous) => ({ ...previous, currentStage: option }))}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium">What are you currently most focused on improving? Choose up to 2.</label>
                  <div className="flex flex-wrap gap-2">
                    {focusAreaOptions.map((option) => (
                      <ToggleTag key={option} active={form.focusAreas.includes(option)} onClick={() => updateFocus(option)}>
                        {option}
                      </ToggleTag>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="mb-3 block text-sm font-medium">Which skills should your profile reflect?</label>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((option) => (
                      <ToggleTag
                        key={option}
                        active={form.selectedSkills.includes(option)}
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            selectedSkills: previous.selectedSkills.includes(option)
                              ? previous.selectedSkills.filter((item) => item !== option)
                              : [...previous.selectedSkills, option],
                            topSkills: previous.topSkills.filter((item) => item !== option),
                          }))
                        }
                      >
                        {option}
                      </ToggleTag>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium">Which three skills do you want to improve first?</label>
                  <div className="flex flex-wrap gap-2">
                    {form.selectedSkills.map((option) => (
                      <ToggleTag
                        key={option}
                        active={form.topSkills.includes(option)}
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            topSkills: toggleLimited(previous.topSkills, option, 3),
                          }))
                        }
                      >
                        {option}
                      </ToggleTag>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="mb-3 block text-sm font-medium">Which personal growth areas matter most right now?</label>
                  <div className="flex flex-wrap gap-2">
                    {personalPriorityOptions.map((option) => (
                      <ToggleTag key={option} active={form.personalPriorities.includes(option)} onClick={() => updatePriority(option)}>
                        {option}
                      </ToggleTag>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium">Which one should be your main focus?</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {form.personalPriorities.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setForm((previous) => ({ ...previous, mainPersonalFocus: option }))}
                        className={cx(
                          "rounded-[22px] border px-4 py-4 text-left text-sm",
                          form.mainPersonalFocus === option ? "border-[var(--color-green)] bg-[var(--color-green-soft)]" : "border-black/8 bg-white/70",
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="flex gap-3">
                  {[
                    { label: "Yes", value: true },
                    { label: "Not now", value: false },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setForm((previous) => ({ ...previous, trackHealth: option.value }))}
                      className={cx(
                        "rounded-full border px-4 py-2 text-sm",
                        form.trackHealth === option.value ? "border-[var(--color-green)] bg-[var(--color-green-soft)] text-[var(--color-green)]" : "border-black/8 text-[var(--color-muted)]",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {form.trackHealth && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {healthFocusOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={cx(
                          "rounded-[22px] border px-4 py-4 text-left text-sm",
                          form.healthFocusArea === option ? "border-[var(--color-green)] bg-[var(--color-green-soft)]" : "border-black/8 bg-white/70",
                        )}
                        onClick={() => setForm((previous) => ({ ...previous, healthFocusArea: option }))}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {step === 4 && (
              <>
                <div>
                  <label className="mb-3 block text-sm font-medium">Which hobbies or interest categories describe you?</label>
                  <div className="flex flex-wrap gap-2">
                    {hobbyOptions.map((option) => (
                      <ToggleTag
                        key={option}
                        active={form.hobbies.includes(option)}
                        onClick={() =>
                          setForm((previous) => ({
                            ...previous,
                            hobbies: previous.hobbies.includes(option)
                              ? previous.hobbies.filter((item) => item !== option)
                              : [...previous.hobbies, option],
                            primaryHobby: previous.primaryHobby === option ? "" : previous.primaryHobby,
                          }))
                        }
                      >
                        {option}
                      </ToggleTag>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium">Which hobby do you want to level up first?</label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {form.hobbies.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={cx(
                          "rounded-[22px] border px-4 py-4 text-left text-sm",
                          form.primaryHobby === option ? "border-[var(--color-amber)] bg-[var(--color-amber-soft)]" : "border-black/8 bg-white/70",
                        )}
                        onClick={() => setForm((previous) => ({ ...previous, primaryHobby: option }))}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 5 && (
              <div>
                <label className="mb-3 block text-sm font-medium">What keeps you most motivated? Choose up to 2.</label>
                <div className="flex flex-wrap gap-2">
                  {motivationOptions.map((option) => (
                    <ToggleTag
                      key={option}
                      active={form.motivationStyles.includes(option)}
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          motivationStyles: toggleLimited(previous.motivationStyles, option, 2),
                        }))
                      }
                    >
                      {option}
                    </ToggleTag>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {weeklyCommitmentOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={cx(
                      "rounded-[22px] border px-4 py-4 text-left text-sm",
                      form.weeklyCommitment === option ? "border-[var(--color-blue)] bg-[var(--color-blue-soft)]" : "border-black/8 bg-white/70",
                    )}
                    onClick={() => setForm((previous) => ({ ...previous, weeklyCommitment: option }))}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {step === 7 && (
              <div className="grid gap-4">
                <Card className="rounded-[28px] bg-[var(--color-blue-soft)] p-5">
                  <p className="eyebrow">Primary focus</p>
                  <h3 className="mt-2 text-2xl">{form.focusAreas.join(" + ")}</h3>
                </Card>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="rounded-[28px] p-5">
                    <p className="eyebrow">Skills to improve first</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.topSkills.map((skill) => (
                        <BadgePill key={skill} tone="blue">
                          {skill}
                        </BadgePill>
                      ))}
                    </div>
                  </Card>
                  <Card className="rounded-[28px] p-5">
                    <p className="eyebrow">Main personal focus</p>
                    <h3 className="mt-2 text-2xl">{form.mainPersonalFocus}</h3>
                  </Card>
                  <Card className="rounded-[28px] p-5">
                    <p className="eyebrow">Top hobby</p>
                    <h3 className="mt-2 text-2xl">{form.primaryHobby}</h3>
                  </Card>
                  <Card className="rounded-[28px] p-5">
                    <p className="eyebrow">Motivation style</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.motivationStyles.map((style) => (
                        <BadgePill key={style} tone="amber">
                          {style}
                        </BadgePill>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-[var(--color-muted)]">Weekly commitment: {form.weeklyCommitment}</p>
                  </Card>
                </div>
              </div>
            )}

            {error ? <p className="text-sm text-[var(--color-red)]">{error}</p> : null}

            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}>
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button size="lg" onClick={nextStep}>
                  Continue
                </Button>
              ) : (
                <Button size="lg" onClick={submit}>
                  Create my avatar
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
