import { Card } from "@/components/ui/card";
import { BadgePill } from "@/components/ui/badge-pill";
import { requireRole } from "@/lib/exp-auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { profile } = await requireRole("ADMIN");

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[36px] p-6 sm:p-8">
        <p className="eyebrow">Workspace</p>
        <h2 className="mt-2 text-4xl">{profile.workspace?.name ?? "Unnamed workspace"}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
          EXP is now using a real authenticated admin foundation. The next phase can safely add onboarding tracks,
          milestones, assignments, and invite management on top of this workspace record.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <BadgePill tone="blue">ADMIN</BadgePill>
          <BadgePill tone="green">Supabase Auth</BadgePill>
          <BadgePill tone="amber">Workspace bootstrapped</BadgePill>
        </div>
        <Link href="/admin/tracks" className="mt-6 inline-flex">
          <Button>Manage tracks</Button>
        </Link>
      </Card>

      <Card className="rounded-[36px] p-6 sm:p-8">
        <p className="eyebrow">Foundation status</p>
        <div className="mt-4 space-y-4 text-sm text-[var(--color-muted)]">
          <p>Real auth sessions are active.</p>
          <p>Profile bootstrap is creating the admin membership record on first access.</p>
          <p>Invite records exist at the schema layer and are ready for a future admin workflow.</p>
        </div>
      </Card>
    </div>
  );
}
