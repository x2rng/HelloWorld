import Link from "next/link";
import { BadgePill } from "@/components/ui/badge-pill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getAuthenticatedAppContext } from "@/lib/exp-auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const context = await getAuthenticatedAppContext();

  if (context) {
    redirect(context.profile.role === "ADMIN" ? "/admin" : "/employee");
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="glass-panel rounded-[40px] px-6 py-8 sm:px-8 sm:py-10">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            <div className="space-y-6">
              <BadgePill tone="blue">EXP foundation</BadgePill>
              <div className="space-y-4">
                <h1 className="max-w-[11ch] text-5xl leading-[0.92] sm:text-7xl">
                  The B2B onboarding layer your workspace can safely build on.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
                  EXP now starts from a real authenticated workspace foundation: Supabase Auth, workspace-linked profiles,
                  role-aware routing, and the minimum schema needed to power admin and employee onboarding next.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register">
                  <Button size="lg">Create workspace</Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" size="lg">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="rounded-[36px] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,255,255,0.75))] p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="eyebrow">Current phase</p>
                  <h2 className="mt-2 text-3xl">Auth, roles, and workspace bootstrap.</h2>
                </div>
                <BadgePill tone="amber">V1 foundation</BadgePill>
              </div>
              <div className="mt-5 grid gap-3">
                {[
                  "Supabase browser and server clients",
                  "Cookie-backed auth session refresh",
                  "Workspace + profile + invites schema",
                  "ADMIN and EMPLOYEE route protection",
                ].map((item) => (
                  <div key={item} className="rounded-[24px] border border-black/6 bg-white/75 p-4 text-sm text-[var(--color-muted)]">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "Workspace-aware access",
              copy: "Each signed-in user now resolves into a workspace-linked profile with an explicit application role.",
            },
            {
              title: "Real auth foundation",
              copy: "Local storage is no longer the system of truth. Supabase sessions now anchor the app foundation.",
            },
            {
              title: "Ready for onboarding tracks",
              copy: "The next phase can add tracks, milestones, tasks, and assignments without rebuilding the shell again.",
            },
          ].map((item) => (
            <Card key={item.title} className="rounded-[32px] p-6">
              <p className="eyebrow">Why it works</p>
              <h2 className="mt-3 text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.copy}</p>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
