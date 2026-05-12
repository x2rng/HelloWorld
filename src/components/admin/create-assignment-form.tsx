"use client";

import { useActionState } from "react";
import {
  createAssignment,
  type CreateAssignmentState,
} from "@/app/admin/assignments/actions";
import { Button } from "@/components/ui/button";
import { cx } from "@/lib/utils";
import type { OnboardingTrackRecord, ProfileRecord } from "@/lib/exp-types";

const initialState: CreateAssignmentState = {
  ok: false,
  message: "",
};

type CreateAssignmentFormProps = {
  employees: ProfileRecord[];
  tracks: OnboardingTrackRecord[];
  defaultStartDate: string;
};

export function CreateAssignmentForm({
  employees,
  tracks,
  defaultStartDate,
}: CreateAssignmentFormProps) {
  const [state, formAction, isPending] = useActionState(
    createAssignment,
    initialState,
  );

  return (
    <form action={formAction} className="mt-5 space-y-5">
      <div className="space-y-2">
        <label htmlFor="assignment-employee" className="text-sm font-medium">
          Employee
        </label>
        <select
          id="assignment-employee"
          name="employee_id"
          required
          className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
        >
          <option value="">Select employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.full_name ?? employee.email}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="assignment-track" className="text-sm font-medium">
          Published track
        </label>
        <select
          id="assignment-track"
          name="track_id"
          required
          className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
        >
          <option value="">Select track</option>
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title} ({track.duration_days} days)
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="assignment-start-date" className="text-sm font-medium">
          Start date
        </label>
        <input
          id="assignment-start-date"
          name="start_date"
          type="date"
          defaultValue={defaultStartDate}
          className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
        />
        <p className="text-xs text-[var(--color-muted)]">
          Due date is calculated from the selected track duration.
        </p>
      </div>

      {state.message ? (
        <p
          className={cx(
            "rounded-2xl border px-4 py-3 text-sm leading-6",
            state.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800",
          )}
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create assignment"}
      </Button>
    </form>
  );
}
