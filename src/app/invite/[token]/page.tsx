import Link from "next/link";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";
import { InviteAuthForm } from "@/components/auth/invite-auth-form";
import { createClient } from "@/lib/supabase/server";

type InviteDetails = {
  email: string;
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
  expires_at: string | null;
  workspace_name: string;
};

export const dynamic = "force-dynamic";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_invite_details", { invite_token: token })
    .maybeSingle<InviteDetails>();

  if (error || !data) {
    return (
      <main className="min-h-screen px-4 py-6 md:px-6">
        <Card className="mx-auto max-w-2xl rounded-[36px] p-8">
          <BadgePill tone="red">Invite unavailable</BadgePill>
          <h1 className="mt-4 text-4xl">This invite link is not valid.</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Ask your workspace admin to create a fresh invite link.
          </p>
        </Card>
      </main>
    );
  }

  const isExpired = data.expires_at ? new Date(data.expires_at) < new Date() : false;
  const canAccept = data.status === "PENDING" && !isExpired;

  return (
    <main className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <section className="glass-panel rounded-[36px] p-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
            <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-white">
              E
            </span>
            EXP
          </Link>
          <BadgePill tone={canAccept ? "blue" : "amber"} className="mt-8">
            {canAccept ? "Workspace invite" : data.status}
          </BadgePill>
          <h1 className="mt-4 max-w-xl text-5xl leading-tight">Join {data.workspace_name}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--color-muted)]">
            This invite is for {data.email}. Use that email to create or sign into your employee account.
          </p>
        </section>

        <Card className="rounded-[36px] bg-white/92 p-6 sm:p-8">
          {canAccept ? (
            <>
              <p className="eyebrow">Accept invite</p>
              <h2 className="mt-3 text-4xl">Create or connect your account.</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                After auth succeeds, EXP will attach your profile to this workspace as an employee.
              </p>
              <div className="mt-6">
                <InviteAuthForm token={token} email={data.email} />
              </div>
            </>
          ) : (
            <>
              <p className="eyebrow">Invite status</p>
              <h2 className="mt-3 text-4xl">This invite cannot be accepted.</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Current status: {isExpired ? "EXPIRED" : data.status}. Ask your workspace admin for a new link.
              </p>
            </>
          )}
        </Card>
      </div>
    </main>
  );
}
