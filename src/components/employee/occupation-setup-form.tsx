"use client";

import { useActionState } from "react";
import { saveOccupation, type SaveOccupationState } from "@/app/employee/actions";
import { Button } from "@/components/ui/button";
import { roleTemplateOptions } from "@/lib/skills";

const initialState: SaveOccupationState = { ok: false, message: "" };

export function OccupationSetupForm() {
  const [state, action, isPending] = useActionState(saveOccupation, initialState);

  return (
    <form action={action} className="rounded-[32px] border border-blue-400/20 bg-gradient-to-br from-blue-400/[0.09] via-[#111720] to-[#10141c] p-6 shadow-[0_24px_80px_rgba(70,105,255,0.1)] sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-[var(--color-blue)]">Personalize your skills</p>
          <h2 className="mt-2 text-2xl">What kind of work do you do?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            Choose the closest role. EXP will use it to organize your role skills; your existing journey and XP stay unchanged.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <label className="sr-only" htmlFor="role-focus">Role</label>
          <select
            id="role-focus"
            name="role_focus"
            defaultValue="GENERAL_EMPLOYEE"
            className="min-h-11 rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-sm text-[var(--color-ink)] outline-none focus:border-blue-400/50 lg:min-w-60"
          >
            {roleTemplateOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#111720]">
                {option.label}
              </option>
            ))}
          </select>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Build my skills"}
          </Button>
        </div>
      </div>
      {state.message ? (
        <p className={`mt-4 text-sm ${state.ok ? "text-[var(--color-green)]" : "text-[var(--color-red)]"}`} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
