import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  createMilestone,
  createTask,
  updateTrack,
} from "@/app/admin/tracks/actions";
import { requireRole } from "@/lib/exp-auth";
import type {
  MilestoneRecord,
  OnboardingTrackRecord,
  TaskRecord,
} from "@/lib/exp-types";
import { createClient } from "@/lib/supabase/server";

type TrackBuilderRecord = OnboardingTrackRecord & {
  milestones: Array<MilestoneRecord & { tasks: TaskRecord[] }>;
};

export const dynamic = "force-dynamic";

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const { trackId } = await params;
  const { profile } = await requireRole("ADMIN");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("onboarding_tracks")
    .select(
      "id, workspace_id, title, description, duration_days, created_by, created_at, updated_at, milestones(id, track_id, title, description, position, created_at, updated_at, tasks(id, milestone_id, title, description, position, created_at, updated_at))",
    )
    .eq("id", trackId)
    .eq("workspace_id", profile.workspace_id)
    .maybeSingle<TrackBuilderRecord>();

  if (error) {
    throw new Error(`Failed to load onboarding track: ${error.message}`);
  }

  if (!data) {
    notFound();
  }

  const track = {
    ...data,
    milestones: [...(data.milestones ?? [])]
      .map((milestone) => ({
        ...milestone,
        tasks: [...(milestone.tasks ?? [])].sort(
          (first, second) => first.position - second.position,
        ),
      }))
      .sort((first, second) => first.position - second.position),
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/admin/tracks" className="text-sm font-medium text-[var(--color-blue)]">
            Back to tracks
          </Link>
          <h2 className="mt-3 text-4xl">{track.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Edit the core track details, then add ordered milestones and tasks. Assignments and completion logic come
            later.
          </p>
        </div>
        <BadgePill tone="blue">{track.duration_days} days</BadgePill>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[36px] p-6 sm:p-8">
          <p className="eyebrow">Track details</p>
          <form action={updateTrack.bind(null, track.id)} className="mt-5 space-y-5">
            <div className="space-y-2">
              <label htmlFor="track-title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="track-title"
                name="title"
                required
                defaultValue={track.title}
                className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="track-description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="track-description"
                name="description"
                rows={4}
                defaultValue={track.description ?? ""}
                className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="track-duration" className="text-sm font-medium">
                Duration in days
              </label>
              <input
                id="track-duration"
                name="duration_days"
                type="number"
                min={1}
                max={365}
                defaultValue={track.duration_days}
                className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none sm:w-44"
              />
            </div>
            <Button type="submit">Save track</Button>
          </form>
        </Card>

        <Card className="rounded-[36px] p-6 sm:p-8">
          <p className="eyebrow">Add milestone</p>
          <form action={createMilestone.bind(null, track.id)} className="mt-5 grid gap-4 sm:grid-cols-[1fr_120px]">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="milestone-title" className="text-sm font-medium">
                Milestone title
              </label>
              <input
                id="milestone-title"
                name="title"
                required
                className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="milestone-description" className="text-sm font-medium">
                Description
              </label>
              <input
                id="milestone-description"
                name="description"
                className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="milestone-position" className="text-sm font-medium">
                Order
              </label>
              <input
                id="milestone-position"
                name="position"
                type="number"
                min={1}
                defaultValue={track.milestones.length + 1}
                className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
              />
            </div>
            <Button type="submit" className="sm:col-span-2">
              Add milestone
            </Button>
          </form>
        </Card>
      </div>

      <section className="space-y-4">
        <div>
          <p className="eyebrow">Structure</p>
          <h3 className="mt-2 text-3xl">Milestones and tasks</h3>
        </div>

        {track.milestones.length === 0 ? (
          <Card className="rounded-[32px] p-6">
            <p className="text-sm text-[var(--color-muted)]">
              No milestones yet. Add the first milestone to begin shaping this onboarding track.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {track.milestones.map((milestone) => (
              <Card key={milestone.id} className="rounded-[32px] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <BadgePill tone="neutral">Order {milestone.position}</BadgePill>
                    <h4 className="mt-3 text-2xl">{milestone.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                      {milestone.description ?? "No milestone description."}
                    </p>
                  </div>
                  <BadgePill tone="blue">{milestone.tasks.length} tasks</BadgePill>
                </div>

                <div className="mt-5 space-y-2">
                  {milestone.tasks.length === 0 ? (
                    <p className="rounded-2xl border border-black/6 bg-white/60 px-4 py-3 text-sm text-[var(--color-muted)]">
                      No tasks inside this milestone yet.
                    </p>
                  ) : (
                    milestone.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="grid gap-2 rounded-2xl border border-black/6 bg-white/70 px-4 py-3 text-sm sm:grid-cols-[80px_1fr]"
                      >
                        <span className="font-medium text-[var(--color-muted)]">#{task.position}</span>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          {task.description ? (
                            <p className="mt-1 text-[var(--color-muted)]">{task.description}</p>
                          ) : null}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form
                  action={createTask.bind(null, track.id, milestone.id)}
                  className="mt-5 grid gap-4 border-t soft-divider pt-5 sm:grid-cols-[1fr_120px]"
                >
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor={`task-title-${milestone.id}`} className="text-sm font-medium">
                      Task title
                    </label>
                    <input
                      id={`task-title-${milestone.id}`}
                      name="title"
                      required
                      className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`task-description-${milestone.id}`} className="text-sm font-medium">
                      Description
                    </label>
                    <input
                      id={`task-description-${milestone.id}`}
                      name="description"
                      className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`task-position-${milestone.id}`} className="text-sm font-medium">
                      Order
                    </label>
                    <input
                      id={`task-position-${milestone.id}`}
                      name="position"
                      type="number"
                      min={1}
                      defaultValue={milestone.tasks.length + 1}
                      className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
                    />
                  </div>
                  <Button type="submit" variant="secondary" className="sm:col-span-2">
                    Add task
                  </Button>
                </form>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
