import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/exp-auth";
import { createTrack } from "@/app/admin/tracks/actions";

export const dynamic = "force-dynamic";

export default async function NewTrackPage() {
  await requireRole("ADMIN");

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">New onboarding track</p>
        <h2 className="mt-2 text-4xl">Create track</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
          Keep the first version simple: one title, one description, and the intended duration in days.
        </p>
      </div>

      <Card className="max-w-3xl rounded-[36px] p-6 sm:p-8">
        <form action={createTrack} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="track-title" className="text-sm font-medium">
              Track title
            </label>
            <input
              id="track-title"
              name="title"
              required
              className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
              placeholder="New hire onboarding"
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
              className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 outline-none"
              placeholder="A concise overview of what this journey helps employees complete."
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
              defaultValue={30}
              className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none sm:w-44"
            />
          </div>

          <div className="flex flex-wrap gap-3 border-t soft-divider pt-5">
            <Button type="submit">Create track</Button>
            <Link href="/admin/tracks">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
