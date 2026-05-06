"use client";

import { useActionState } from "react";
import { inviteEmployee, type InviteEmployeeState } from "@/app/admin/employees/actions";
import { Button } from "@/components/ui/button";

const initialState: InviteEmployeeState = {
  ok: false,
  message: "",
};

export function InviteEmployeeForm() {
  const [state, formAction, pending] = useActionState(inviteEmployee, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="invite-email" className="text-sm font-medium">
          Employee email
        </label>
        <input
          id="invite-email"
          name="email"
          type="email"
          required
          className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
          placeholder="employee@company.com"
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating invite..." : "Create invite link"}
      </Button>

      {state.message ? (
        <div
          className={
            state.ok
              ? "rounded-2xl border border-[var(--color-green)]/20 bg-[var(--color-green-soft)] p-4 text-sm text-[var(--color-green)]"
              : "rounded-2xl border border-[var(--color-red)]/20 bg-[var(--color-red-soft)] p-4 text-sm text-[var(--color-red)]"
          }
        >
          <p>{state.message}</p>
          {state.inviteLink ? (
            <input
              readOnly
              value={state.inviteLink}
              className="mt-3 h-11 w-full rounded-xl border border-black/8 bg-white px-3 text-[var(--color-ink)] outline-none"
              onFocus={(event) => event.currentTarget.select()}
            />
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
