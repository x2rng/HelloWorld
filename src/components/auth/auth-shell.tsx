import Link from "next/link";
import { BadgePill } from "@/components/ui/badge-pill";
import { Card } from "@/components/ui/card";

export function AuthShell({
  eyebrow,
  title,
  description,
  footer,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-6 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="glass-panel flex flex-col justify-between rounded-[36px] px-6 py-7 sm:px-8 sm:py-8">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-ink)]">
              <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-white">E</span>
              EXP
            </Link>
            <div className="space-y-4">
              <p className="eyebrow">B2B onboarding foundation</p>
              <h1 className="max-w-[10ch] text-5xl leading-[0.92] sm:text-6xl">
                Build structured employee onboarding that people actually finish.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[var(--color-muted)] sm:text-lg">
                EXP gives teams a clean foundation for workspace-based onboarding, role-aware access, and gamified
                progression without carrying the old consumer prototype model forward.
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className="rounded-[30px] bg-white/75 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">Roles</p>
                  <h2 className="mt-2 text-2xl">Admin and employee</h2>
                </div>
                <BadgePill tone="blue">V1</BadgePill>
              </div>
              <div className="space-y-3">
                <div className="rounded-3xl border border-black/6 bg-white/65 px-4 py-3 text-sm text-[var(--color-muted)]">
                  Workspace-aware routing
                </div>
                <div className="rounded-3xl border border-black/6 bg-white/65 px-4 py-3 text-sm text-[var(--color-muted)]">
                  Real Supabase auth sessions
                </div>
                <div className="rounded-3xl border border-black/6 bg-white/65 px-4 py-3 text-sm text-[var(--color-muted)]">
                  Profile bootstrap on first sign-in
                </div>
              </div>
            </Card>

            <Card className="rounded-[30px] bg-white/75 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="eyebrow">Foundation</p>
                  <h2 className="mt-2 text-2xl">Schema-first and ready for onboarding tracks.</h2>
                </div>
                <BadgePill tone="amber">Current scope</BadgePill>
              </div>
              <div className="space-y-3">
                {[
                  "workspaces",
                  "profiles",
                  "invites",
                  "Supabase browser/server clients",
                  "Admin and employee route protection",
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-black/6 bg-white/65 px-4 py-3 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="flex items-center">
          <Card className="w-full rounded-[36px] bg-white/92 p-6 sm:p-8">
            <div className="mb-6">
              <p className="eyebrow">{eyebrow}</p>
              <h2 className="mt-3 text-4xl leading-tight">{title}</h2>
              <p className="mt-3 max-w-lg text-base leading-7 text-[var(--color-muted)]">{description}</p>
            </div>
            {children}
            <div className="mt-6 border-t soft-divider pt-5 text-sm text-[var(--color-muted)]">{footer}</div>
          </Card>
        </section>
      </div>
    </main>
  );
}
