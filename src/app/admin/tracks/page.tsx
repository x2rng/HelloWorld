import Link from "next/link";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/exp-auth";
import type { OnboardingTrackRecord } from "@/lib/exp-types";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminTracksPage() {
  const { profile } = await requireRole("ADMIN");
  const supabase = await createClient();
  const { data: tracks, error } = await supabase
    .from("onboarding_tracks")
    .select("id, workspace_id, title, description, duration_days, created_by, created_at, updated_at")
    .eq("workspace_id", profile.workspace_id)
    .order("created_at", { ascending: false })
    .returns<OnboardingTrackRecord[]>();

  if (error) {
    throw new Error(`Failed to load onboarding tracks: ${error.message}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Onboarding tracks</p>
          <h2 className="mt-2 text-4xl">Tracks</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Build the track structure employees will later be assigned to. This phase stores tracks, milestones, and
            tasks only.
          </p>
        </div>
        <Link href="/admin/tracks/new">
          <Button size="lg">New track</Button>
        </Link>
      </div>

      {tracks.length === 0 ? (
        <Card className="rounded-[36px] p-8">
          <BadgePill tone="amber">No tracks yet</BadgePill>
          <h3 className="mt-4 text-3xl">Create the first 30-day journey.</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            Start with a single onboarding track, then add ordered milestones and tasks inside it.
          </p>
          <Link href="/admin/tracks/new" className="mt-6 inline-flex">
            <Button>Create track</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {tracks.map((track) => (
            <Link key={track.id} href={`/admin/tracks/${track.id}`}>
              <Card className="h-full rounded-[28px] p-6 transition hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl">{track.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                      {track.description ?? "No description yet."}
                    </p>
                  </div>
                  <BadgePill tone="blue">{track.duration_days} days</BadgePill>
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Edit structure
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
