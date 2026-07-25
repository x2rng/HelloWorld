"use client";

import { useActionState } from "react";
import { giveActivityRecognition, type GiveRecognitionState } from "@/app/employee/feed/actions";

const initialState: GiveRecognitionState = { ok: false, message: "" };
const pointOptions = [1, 5, 10] as const;

export function RecognitionControls({ activityId, isOwnActivity, initialTotal, initialRemaining, initialGiven }: { activityId: string; isOwnActivity: boolean; initialTotal: number; initialRemaining: number; initialGiven: number }) {
  const [state, action, pending] = useActionState(giveActivityRecognition.bind(null, activityId), initialState);
  const total = state.activityTotal ?? initialTotal;
  const remaining = state.dailyRemaining ?? initialRemaining;
  const given = state.activityGiven ?? initialGiven;

  return (
    <div className="mt-5 rounded-[22px] border border-purple-400/12 bg-purple-400/[0.045] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-200">Recognition received</p><p className="mt-1 text-2xl font-semibold">{total} <span className="text-sm font-normal text-[var(--color-muted)]">points</span></p></div>
        <p className="text-xs text-[var(--color-muted)]">{remaining} recognition points left today</p>
      </div>
      {isOwnActivity ? (
        <p className="mt-3 text-xs text-[var(--color-muted)]">This is your activity. Teammates can recognize shared progress.</p>
      ) : (
        <form action={action} className="mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium text-white/70">Recognize this progress</span>
            {pointOptions.map((points) => (
              <button key={points} type="submit" name="points" value={points} disabled={pending || points > remaining || given + points > 10} className="h-9 rounded-full border border-purple-300/15 bg-purple-300/[0.07] px-3 text-xs font-semibold text-purple-100 transition hover:bg-purple-300/[0.12] disabled:pointer-events-none disabled:opacity-35">+{points}</button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-[var(--color-muted)]">You have given {given} of 10 available points to this activity.</p>
        </form>
      )}
      {state.message ? <p className={`mt-3 text-xs font-medium ${state.ok ? "text-[var(--color-green)]" : "text-[var(--color-red)]"}`} role="status">{state.message}</p> : null}
    </div>
  );
}
