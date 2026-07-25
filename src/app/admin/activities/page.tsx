import Link from "next/link";
import { ActivityReviewActions } from "@/components/admin/activity-review-actions";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { requireAdminWorkspaceSetup } from "@/lib/admin-workspace";
import type { GrowthActivityRecord } from "@/lib/exp-types";
import {
  activityCategoryOptions,
  activityProofTypeOptions,
  activityVisibilityOptions,
  type GrowthActivityStatus,
  optionLabel,
  safeProofUrl,
} from "@/lib/growth-activities";
import { createClient } from "@/lib/supabase/server";
import { cx } from "@/lib/utils";

type ReviewFilter = GrowthActivityStatus | "all";
type DisplayNameRow = { id: string; display_name: string };

const filters: Array<{ value: ReviewFilter; label: string }> = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

function normalizeFilter(value: unknown): ReviewFilter {
  return value === "approved" || value === "rejected" || value === "all"
    ? value
    : "pending";
}

function statusTone(status: GrowthActivityStatus) {
  if (status === "approved") return "green" as const;
  if (status === "rejected") return "red" as const;
  return "amber" as const;
}

function statusLabel(status: GrowthActivityStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusValue } = await searchParams;
  const activeFilter = normalizeFilter(statusValue);
  const { profile } = await requireAdminWorkspaceSetup();
  const supabase = await createClient();

  let activitiesQuery = supabase
    .from("growth_activities")
    .select(
      "id, workspace_id, employee_id, title, description, category, skill_name, proof_type, proof_url, visibility, status, suggested_xp, created_at",
    )
    .eq("workspace_id", profile.workspace_id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (activeFilter !== "all") {
    activitiesQuery = activitiesQuery.eq("status", activeFilter);
  }

  const [activitiesResult, pendingResult, approvedResult, rejectedResult, allResult] =
    await Promise.all([
      activitiesQuery.returns<GrowthActivityRecord[]>(),
      supabase
        .from("growth_activities")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", profile.workspace_id)
        .eq("status", "pending"),
      supabase
        .from("growth_activities")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", profile.workspace_id)
        .eq("status", "approved"),
      supabase
        .from("growth_activities")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", profile.workspace_id)
        .eq("status", "rejected"),
      supabase
        .from("growth_activities")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", profile.workspace_id),
    ]);

  if (
    activitiesResult.error ||
    pendingResult.error ||
    approvedResult.error ||
    rejectedResult.error ||
    allResult.error
  ) {
    throw new Error("Growth activities could not be loaded.");
  }

  const activities = activitiesResult.data;
  const employeeIds = [...new Set(activities.map((activity) => activity.employee_id))];
  const displayNameResult =
    employeeIds.length > 0
      ? await supabase.rpc("get_workspace_profile_display_names", {
          target_profile_ids: employeeIds,
        })
      : { data: [], error: null };
  if (displayNameResult.error) {
    throw new Error("Employee names could not be loaded.");
  }
  const displayNames = Array.isArray(displayNameResult.data)
    ? (displayNameResult.data as DisplayNameRow[])
    : [];
  const nameByEmployee = new Map(
    displayNames.map((row) => [row.id, row.display_name]),
  );
  const counts: Record<ReviewFilter, number> = {
    pending: pendingResult.count ?? 0,
    approved: approvedResult.count ?? 0,
    rejected: rejectedResult.count ?? 0,
    all: allResult.count ?? 0,
  };

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden rounded-[38px] p-7 sm:p-10">
        <div className="absolute -right-24 -top-28 size-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap gap-2">
            <BadgePill tone="green">Verification</BadgePill>
            <BadgePill tone="amber">{counts.pending} pending</BadgePill>
          </div>
          <h2 className="mt-5 max-w-3xl text-4xl leading-tight sm:text-6xl">
            Growth activity review
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
            Review submitted growth activities and their proof. Approved activities
            can be used for verified progression later; this review does not award XP.
          </p>
        </div>
      </Card>

      <Card className="rounded-[30px] p-3 sm:p-4">
        <div className="grid gap-2 sm:grid-cols-4">
          {filters.map((filter) => (
            <Link
              key={filter.value}
              href={`/admin/activities?status=${filter.value}`}
              className={cx(
                "flex items-center justify-between rounded-[20px] border px-4 py-3 text-sm transition",
                activeFilter === filter.value
                  ? "border-blue-400/25 bg-blue-400/[0.08] text-white"
                  : "border-white/8 bg-white/[0.025] text-[var(--color-muted)] hover:bg-white/[0.045] hover:text-white",
              )}
            >
              <span className="font-semibold">{filter.label}</span>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs">
                {counts[filter.value]}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      <section>
        <div className="flex items-end justify-between gap-4 px-1">
          <div>
            <p className="eyebrow">Review queue</p>
            <h3 className="mt-2 text-3xl">
              {filters.find((filter) => filter.value === activeFilter)?.label} activities
            </h3>
          </div>
          <BadgePill tone="blue">{activities.length}</BadgePill>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {activities.length === 0 ? (
            <Card className="rounded-[30px] p-7 xl:col-span-2">
              <p className="text-xl font-semibold">No activities in this view.</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Submitted activities will appear here when they match this status.
              </p>
            </Card>
          ) : (
            activities.map((activity) => {
              const proofUrl = safeProofUrl(activity.proof_url);

              return (
                <Card key={activity.id} className="rounded-[30px] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                        {nameByEmployee.get(activity.employee_id) ?? "Workspace employee"}
                      </p>
                      <h4 className="mt-3 text-2xl">{activity.title}</h4>
                    </div>
                    <BadgePill tone={statusTone(activity.status)}>
                      {statusLabel(activity.status)}
                    </BadgePill>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {activity.description}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        Skill focus
                      </p>
                      <p className="mt-1 text-sm font-medium">{activity.skill_name}</p>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                        Activity category
                      </p>
                      <p className="mt-1 text-sm font-medium">
                        {optionLabel(activityCategoryOptions, activity.category)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--color-muted)]">
                    <span>
                      Proof: {optionLabel(activityProofTypeOptions, activity.proof_type)}
                    </span>
                    <span>
                      Visibility:{" "}
                      {optionLabel(activityVisibilityOptions, activity.visibility)}
                    </span>
                    <span>
                      {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                        new Date(activity.created_at),
                      )}
                    </span>
                    {proofUrl ? (
                      <a
                        href={proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-[var(--color-blue)]"
                      >
                        Open proof
                      </a>
                    ) : null}
                  </div>

                  {activity.status === "pending" ? (
                    <ActivityReviewActions activityId={activity.id} />
                  ) : (
                    <p className="mt-5 border-t border-white/8 pt-4 text-xs text-[var(--color-muted)]">
                      This activity has been reviewed. Its status does not affect XP.
                    </p>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
