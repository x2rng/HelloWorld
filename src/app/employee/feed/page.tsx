import Link from "next/link";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { RecognitionControls } from "@/components/employee/recognition-controls";
import { requireRole } from "@/lib/exp-auth";
import type { GrowthActivityRecord } from "@/lib/exp-types";
import {
  activityCategoryOptions,
  activityProofTypeOptions,
  activityVisibilityOptions,
  optionLabel,
  safeProofUrl,
} from "@/lib/growth-activities";
import { createClient } from "@/lib/supabase/server";
import { cx } from "@/lib/utils";

type FeedScope = "my" | "department" | "company";
type DisplayNameRow = { id: string; display_name: string };
type RecognitionRow = { activity_id: string; giver_id: string; points: number; created_at: string };

const feedTabs: Array<{ value: FeedScope; label: string; description: string }> = [
  { value: "my", label: "My Activity", description: "Everything you have logged, including private activities." },
  { value: "department", label: "Department", description: "Department-visible growth from people in this workspace." },
  { value: "company", label: "Company", description: "Company-visible growth shared across this workspace." },
];

function normalizeScope(value: unknown): FeedScope {
  return value === "department" || value === "company" ? value : "my";
}

export const dynamic = "force-dynamic";

export default async function EmployeeFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const { view } = await searchParams;
  const scope = normalizeScope(view);
  const { profile } = await requireRole("EMPLOYEE");
  const supabase = await createClient();
  let query = supabase
    .from("growth_activities")
    .select("id, workspace_id, employee_id, title, description, category, skill_name, proof_type, proof_url, visibility, status, suggested_xp, created_at")
    .eq("workspace_id", profile.workspace_id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (scope === "my") {
    query = query.eq("employee_id", profile.id);
  } else if (scope === "department") {
    // V1 fallback: employee department membership is not stored yet, so department
    // visibility is safely limited to department-visible records in this workspace.
    query = query.eq("visibility", "DEPARTMENT");
  } else {
    query = query.eq("visibility", "COMPANY");
  }

  const { data: activities, error } = await query.returns<GrowthActivityRecord[]>();
  if (error) throw new Error("The activity feed could not be loaded.");

  const employeeIds = [...new Set(activities.map((activity) => activity.employee_id))];
  const activityIds = activities.map((activity) => activity.id);
  const utcDayStart = new Date();
  utcDayStart.setUTCHours(0, 0, 0, 0);
  const [displayNameResult, recognitionResult, dailyRecognitionResult] = await Promise.all([
    employeeIds.length > 0
      ? supabase.rpc("get_workspace_profile_display_names", { target_profile_ids: employeeIds })
      : Promise.resolve({ data: [] }),
    activityIds.length > 0
      ? supabase.from("activity_recognitions").select("activity_id, giver_id, points, created_at").in("activity_id", activityIds).returns<RecognitionRow[]>()
      : Promise.resolve({ data: [] as RecognitionRow[], error: null }),
    supabase.from("activity_recognitions").select("activity_id, giver_id, points, created_at").eq("giver_id", profile.id).gte("created_at", utcDayStart.toISOString()).returns<RecognitionRow[]>(),
  ]);
  if (recognitionResult.error || dailyRecognitionResult.error) throw new Error("Recognition totals could not be loaded.");
  const displayNames = Array.isArray(displayNameResult.data)
    ? displayNameResult.data as DisplayNameRow[]
    : [];
  const nameByEmployee = new Map(displayNames.map((row) => [row.id, row.display_name]));
  const totalByActivity = new Map<string, number>();
  const givenByActivity = new Map<string, number>();
  for (const recognition of recognitionResult.data) {
    totalByActivity.set(recognition.activity_id, (totalByActivity.get(recognition.activity_id) ?? 0) + recognition.points);
    if (recognition.giver_id === profile.id) givenByActivity.set(recognition.activity_id, (givenByActivity.get(recognition.activity_id) ?? 0) + recognition.points);
  }
  const dailyUsed = dailyRecognitionResult.data.reduce((total, recognition) => total + recognition.points, 0);
  const dailyRemaining = Math.max(0, 100 - dailyUsed);
  const currentTab = feedTabs.find((tab) => tab.value === scope) ?? feedTabs[0];

  return (
    <div className="space-y-5">
      <Card className="relative overflow-hidden rounded-[38px] p-7 sm:p-10">
        <div className="absolute -right-20 -top-24 size-72 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div><div className="flex flex-wrap gap-2"><BadgePill tone="purple">Growth feed</BadgePill><BadgePill tone="cyan">{dailyRemaining} recognition points left today</BadgePill></div><h2 className="mt-5 max-w-3xl text-4xl leading-tight sm:text-6xl">See growth taking shape across your workplace.</h2><p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">A calm record of practice, learning, collaboration, and company contribution shared by your colleagues.</p></div>
          <Link href="/employee/activities" className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-slate-950 hover:-translate-y-0.5">Log growth activity</Link>
        </div>
      </Card>

      <Card className="rounded-[32px] p-4 sm:p-5">
        <div className="grid gap-2 md:grid-cols-3">
          {feedTabs.map((tab) => (
            <Link key={tab.value} href={`/employee/feed?view=${tab.value}`} className={cx("rounded-[22px] border p-4 transition", scope === tab.value ? "border-blue-400/25 bg-blue-400/[0.08]" : "border-white/8 bg-white/[0.025] hover:bg-white/[0.045]")}>
              <p className="text-sm font-semibold">{tab.label}</p><p className="mt-1 text-xs leading-5 text-[var(--color-muted)]">{tab.description}</p>
            </Link>
          ))}
        </div>
      </Card>

      <section>
        <div className="flex items-end justify-between gap-4 px-1"><div><p className="eyebrow">{currentTab.label}</p><h3 className="mt-2 text-3xl">{scope === "my" ? "Your growth record" : "Shared growth activities"}</h3></div><BadgePill tone="blue">{activities.length}</BadgePill></div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {activities.length === 0 ? (
            <Card className="rounded-[30px] p-7 lg:col-span-2"><p className="text-xl font-semibold">Nothing has been shared here yet.</p><p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">Activities will appear when they are logged with the visibility for this view.</p></Card>
          ) : activities.map((activity) => {
            const proofUrl = safeProofUrl(activity.proof_url);
            return (
              <Card key={activity.id} className="rounded-[30px] p-6">
                <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">Growth activity · {nameByEmployee.get(activity.employee_id) ?? (activity.employee_id === profile.id ? profile.full_name ?? profile.email : "Workspace teammate")}</p><h4 className="mt-3 text-2xl">{activity.title}</h4></div><BadgePill tone={activity.status === "approved" ? "green" : activity.status === "rejected" ? "red" : "amber"}>{activity.status}</BadgePill></div>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{activity.description}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Skill focus</p><p className="mt-1 text-sm font-medium">{activity.skill_name}</p></div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">Activity type</p><p className="mt-1 text-sm font-medium">{optionLabel(activityCategoryOptions, activity.category)}</p></div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--color-muted)]"><span>Proof: {optionLabel(activityProofTypeOptions, activity.proof_type)}</span><span>Visibility: {optionLabel(activityVisibilityOptions, activity.visibility)}</span><span>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(activity.created_at))}</span>{proofUrl ? <a href={proofUrl} target="_blank" rel="noreferrer" className="font-semibold text-[var(--color-blue)]">Proof attached ↗</a> : null}</div>
                <RecognitionControls activityId={activity.id} isOwnActivity={activity.employee_id === profile.id} initialTotal={totalByActivity.get(activity.id) ?? 0} initialRemaining={dailyRemaining} initialGiven={givenByActivity.get(activity.id) ?? 0} />
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
