"use client";

import { useActionState } from "react";
import {
  reviewGrowthActivity,
  type ReviewActivityState,
} from "@/app/admin/activities/actions";

const initialState: ReviewActivityState = {
  ok: false,
  message: "",
};

export function ActivityReviewActions({ activityId }: { activityId: string }) {
  const [state, action, pending] = useActionState(
    reviewGrowthActivity.bind(null, activityId),
    initialState,
  );

  return (
    <form action={action} className="mt-5 border-t border-white/8 pt-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          name="status"
          value="approved"
          disabled={pending}
          className="inline-flex h-10 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-400/15 disabled:pointer-events-none disabled:opacity-45"
        >
          {pending ? "Saving..." : "Approve activity"}
        </button>
        <button
          type="submit"
          name="status"
          value="rejected"
          disabled={pending}
          className="inline-flex h-10 items-center justify-center rounded-full border border-red-300/20 bg-red-400/[0.08] px-4 text-sm font-semibold text-red-200 transition hover:-translate-y-0.5 hover:bg-red-400/[0.13] disabled:pointer-events-none disabled:opacity-45"
        >
          Reject activity
        </button>
      </div>
      {state.message ? (
        <p
          className={`mt-3 text-xs font-medium ${
            state.ok ? "text-[var(--color-green)]" : "text-[var(--color-red)]"
          }`}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
