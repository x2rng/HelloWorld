import { redirect } from "next/navigation";
import { acceptInvite } from "@/app/invite/[token]/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function InviteAcceptPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { token } = await params;
  const { name } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/invite/${token}`);
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center">
        <Card className="w-full rounded-[36px] p-8">
          <p className="eyebrow">Finish joining</p>
          <h1 className="mt-3 text-4xl">Complete workspace access.</h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            You are signed in as {user.email}. Confirm to attach this account to the invited workspace.
          </p>
          <form action={acceptInvite.bind(null, token)} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor="accept-full-name" className="text-sm font-medium">
                Full name
              </label>
              <input
                id="accept-full-name"
                name="full_name"
                defaultValue={name ?? (typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : "")}
                className="h-12 w-full rounded-2xl border border-black/8 bg-white px-4 outline-none"
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Join workspace
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
